import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { logger } from '@/lib/logger';
import { sendMerchantVerificationRejectionEmail } from '@/lib/resend-email';
import { requireVerifier } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireVerifier();

    // Parse form data
    const formData = await request.formData();

    const submissionId = formData.get('submissionId') as string;
    const businessExists = formData.get('businessExists') === 'true';
    const businessNameMatches = formData.get('businessNameMatches') === 'true';
    const correctedName = formData.get('correctedName') as string;
    const businessOperating = formData.get('businessOperating') as string;
    const paymentMethodsVerified = JSON.parse(formData.get('paymentMethodsVerified') as string || '[]');
    const verifierNotes = formData.get('verifierNotes') as string;
    const verificationResult = formData.get('verificationResult') as string;
    const verifierLatitude = parseFloat(formData.get('verifierLatitude') as string);
    const verifierLongitude = parseFloat(formData.get('verifierLongitude') as string);
    const distance = parseInt(formData.get('distance') as string);

    // Handle photo uploads - store as base64 in database for serverless compatibility
    const photoUrls: string[] = [];

    // For serverless environments, we'll store photos differently
    // Option 1: Use external storage like Cloudinary, S3, or Vercel Blob
    // Option 2: Store as base64 in database (not recommended for large files)
    // For now, we'll skip local file storage and note that photos need external storage

    // Process uploaded photos - get file info for logging
    for (let i = 0; i < 5; i++) {
      const photo = formData.get(`photo_${i}`) as File | null;
      if (photo) {
        // For now, just note the photo was received
        // In production, upload to Vercel Blob, Cloudinary, or S3
        logger.info(`Photo ${i} received: ${photo.name}, size: ${photo.size}`);
        photoUrls.push(`photo_${i}_${Date.now()}`);
      }
    }

    // Get verifier user info
    const verifierRows = await executeQuery<any[]>(
      'SELECT id FROM admin_users WHERE email = $1 AND role = $2',
      [user.email, 'verifier']
    );

    const verifier = verifierRows[0];
    if (!verifier) {
      return NextResponse.json(
        { success: false, message: 'Verifier account not found' },
        { status: 403 }
      );
    }

    // Update submission with verification data
    await executeQuery(
      `UPDATE merchant_submissions
      SET
        verification_status = $1,
        verifier_id = $2,
        verified_by_verifier_email = $3,
        verifier_notes = $4,
        verifier_location_lat = $5,
        verifier_location_lng = $6,
        verifier_distance_meters = $7,
        verified_at_location = NOW(),
        verification_photos = $8,
        business_name_matches = $9,
        business_exists = $10,
        payment_methods_verified = $11,
        business_operating = $12
      WHERE id = $13`,
      [
        verificationResult,
        verifier.id,
        user.email,
        verifierNotes,
        verifierLatitude,
        verifierLongitude,
        distance,
        JSON.stringify(photoUrls),
        businessNameMatches,
        businessExists,
        JSON.stringify(paymentMethodsVerified),
        businessOperating,
        submissionId,
      ]
    );

    // If not verified, send rejection email to merchant
    if (verificationResult === 'not_verified') {
      // Fetch merchant email
      const merchantRows = await executeQuery<any[]>(
        'SELECT contact_email, business_name FROM merchant_submissions WHERE id = $1',
        [submissionId]
      );

      const merchant = merchantRows[0];
      if (merchant?.contact_email) {
        try {
          await sendMerchantVerificationRejectionEmail({
            email: merchant.contact_email,
            businessName: merchant.business_name,
            reason: verifierNotes || 'The business could not be verified at this time.',
          });
          logger.info('Verification rejection email sent to:', merchant.contact_email);
        } catch (emailError) {
          logger.error('Failed to send rejection email:', emailError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Verification submitted successfully',
      verificationResult,
    });
  } catch (error) {
    logger.error('Error submitting verification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
