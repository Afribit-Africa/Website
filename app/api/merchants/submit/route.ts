import { NextRequest, NextResponse } from 'next/server';
import { generateEditToken } from '@/lib/utils/token-generator';
import { executeQuery } from '@/lib/db';
import { sendMerchantSubmissionConfirmation } from '@/lib/resend-email';
import crypto from 'crypto';
import { logger } from '@/lib/logger';
import { sendAdminNotificationEmail } from '@/lib/resend-email';
import { sanitizeText, sanitizeEmail, sanitizeUrl, sanitizePhone, sanitizeHtml } from '@/lib/sanitization';
import { getMerchantSubmissionRateLimiter, getRateLimitInfo } from '@/lib/upstash-redis';

// Configure route segment
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
    const limiter = getMerchantSubmissionRateLimiter();

    if (limiter) {
      const result = await getRateLimitInfo(limiter, `merchant:${ip}`);

      if (!result.success) {
        const resetDate = new Date(result.reset);
        logger.warn(`Merchant submission rate limit exceeded for IP: ${ip}`);

        return NextResponse.json(
          {
            error: 'Too many submissions. Please try again later.',
            details: `You can submit again after ${resetDate.toLocaleTimeString()}`,
            resetAt: result.reset,
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.reset.toString(),
            }
          }
        );
      }
    }

    const body = await request.json();

    // Sanitize all text inputs immediately
    const sanitizedData = {
      businessName: sanitizeText(body.businessName || ''),
      categoryKey: sanitizeText(body.categoryKey || ''),
      categoryValue: sanitizeText(body.categoryValue || ''),
      description: body.description ? sanitizeHtml(body.description) : null,
      address: body.address ? sanitizeText(body.address) : null,
      phone: body.phone ? sanitizePhone(body.phone) : null,
      website: body.website ? sanitizeUrl(body.website) : null,
      openingHours: body.openingHours ? sanitizeText(body.openingHours) : null,
      socialTwitter: body.socialTwitter ? sanitizeUrl(body.socialTwitter) : null,
      socialFacebook: body.socialFacebook ? sanitizeUrl(body.socialFacebook) : null,
      socialInstagram: body.socialInstagram ? sanitizeUrl(body.socialInstagram) : null,
      contactName: sanitizeText(body.contactName || ''),
      contactEmail: sanitizeEmail(body.contactEmail || ''),
      contactRelationship: body.contactRelationship ? sanitizeText(body.contactRelationship) : null,
      lightningAddress: body.lightningAddress ? sanitizeEmail(body.lightningAddress) : null,
      latitude: parseFloat(body.latitude) || 0,
      longitude: parseFloat(body.longitude) || 0,
      paymentOnchain: Boolean(body.paymentOnchain),
      paymentLightning: Boolean(body.paymentLightning),
      paymentLightningContactless: Boolean(body.paymentLightningContactless),
      evidenceUrls: body.evidenceUrls || [],
    };

    // Validate required fields
    const requiredFields = [
      'businessName',
      'categoryKey',
      'categoryValue',
      'latitude',
      'longitude',
      'contactName',
      'contactEmail',
    ];

    for (const field of requiredFields) {
      if (!sanitizedData[field as keyof typeof sanitizedData]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate at least one payment method is selected
    if (!sanitizedData.paymentOnchain && !sanitizedData.paymentLightning && !sanitizedData.paymentLightningContactless) {
      return NextResponse.json(
        { success: false, error: 'At least one Bitcoin payment method must be selected' },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (
      sanitizedData.latitude < -90 || sanitizedData.latitude > 90 ||
      sanitizedData.longitude < -180 || sanitizedData.longitude > 180
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Generate unique IDs
    const submissionId = crypto.randomUUID();
    const editToken = generateEditToken();

    // Convert evidence URLs to JSON string if provided
    const evidenceUrlsJson = sanitizedData.evidenceUrls && sanitizedData.evidenceUrls.length > 0
      ? JSON.stringify(sanitizedData.evidenceUrls)
      : null;

    // Insert into database
    await executeQuery(
      `INSERT INTO merchant_submissions (
        id, business_name, category_key, category_value, description,
        latitude, longitude, address,
        phone, website, opening_hours,
        social_twitter, social_facebook, social_instagram,
        payment_onchain, payment_lightning, payment_lightning_contactless,
        lightning_address,
        contact_name, contact_email, contact_relationship,
        evidence_urls, edit_token, status, is_early_adopter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', false)`,
      [
        submissionId,
        sanitizedData.businessName,
        sanitizedData.categoryKey,
        sanitizedData.categoryValue,
        sanitizedData.description,
        sanitizedData.latitude,
        sanitizedData.longitude,
        sanitizedData.address,
        sanitizedData.phone,
        sanitizedData.website,
        sanitizedData.openingHours,
        sanitizedData.socialTwitter,
        sanitizedData.socialFacebook,
        sanitizedData.socialInstagram,
        sanitizedData.paymentOnchain,
        sanitizedData.paymentLightning,
        sanitizedData.paymentLightningContactless,
        sanitizedData.lightningAddress,
        sanitizedData.contactName,
        sanitizedData.contactEmail,
        sanitizedData.contactRelationship,
        evidenceUrlsJson,
        editToken,
      ]
    );

    // Send confirmation email to merchant with edit link
    try {
      await sendMerchantSubmissionConfirmation(
        sanitizedData.contactEmail,
        sanitizedData.businessName,
        submissionId,
        editToken
      );
      logger.info('✅ Confirmation email sent successfully');
    } catch (emailError) {
      logger.error('Failed to send confirmation email:', emailError);
      // Don't fail the submission if email fails
    }

    // Send notification to admin
    try {
      await sendAdminNotificationEmail({
        submissionId,
        businessName: sanitizedData.businessName,
        category: sanitizedData.categoryValue,
        contactEmail: sanitizedData.contactEmail,
        location: sanitizedData.address || `${sanitizedData.latitude}, ${sanitizedData.longitude}`,
      });
    } catch (adminEmailError) {
      logger.error('Failed to send admin notification:', adminEmailError);
      // Don't fail the submission if admin email fails
    }

    return NextResponse.json({
      success: true,
      submissionId: submissionId,
      editToken: editToken,
      message: 'Submission received successfully! Check your email for the edit link.',
    });

  } catch (error) {
    logger.error('Error submitting merchant:', error);

    // Log detailed error information for debugging
    if (error instanceof Error) {
      logger.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    // Handle duplicate location error (MySQL specific)
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const dbError = error as { code: string; message: string };
      if (dbError.code === 'ER_DUP_ENTRY' && dbError.message.includes('unique_location')) {
        return NextResponse.json(
          { success: false, error: 'A merchant already exists at this location' },
          { status: 400 }
        );
      }

      // Return database-specific errors in development
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { success: false, error: `Database error: ${dbError.message}`, code: dbError.code },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'development'
          ? `Internal server error: ${error instanceof Error ? error.message : String(error)}`
          : 'Internal server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Rate limiting helper
async function checkRateLimit(email: string): Promise<boolean> {
  try {
    // Check if email has submitted more than 3 times in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const submissions = await executeQuery<any[]>(
      'SELECT COUNT(*) as count FROM merchant_submissions WHERE contact_email = ? AND submitted_at > ?',
      [email, oneDayAgo]
    );

    const count = submissions[0]?.count || 0;
    logger.debug(`Rate limit check for ${email}: ${count} submissions in last 24h`);

    return count < 3;
  } catch (error) {
    logger.error('Rate limit check error:', error);
    return true; // Allow on error to avoid blocking legitimate users
  }
}
