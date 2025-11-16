import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDbPool } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { logger } from '@/lib/logger';
import { sendMerchantVerificationRejectionEmail } from '@/lib/resend-email';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const pool = getDbPool();

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

    // Handle photo uploads
    const photoUrls: string[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'verifications', submissionId);

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      logger.error('Error creating upload directory:', error);
    }

    // Process uploaded photos
    for (let i = 0; i < 5; i++) {
      const photo = formData.get(`photo_${i}`) as File | null;
      if (photo) {
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}_${i}.${photo.name.split('.').pop()}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);
        photoUrls.push(`/uploads/verifications/${submissionId}/${filename}`);
      }
    }

    // Get verifier user info
    const [verifierRows] = await pool.execute(
      'SELECT id FROM admin_users WHERE email = ? AND role = ?',
      [session.user.email, 'verifier']
    );

    const verifier = (verifierRows as any[])[0];
    if (!verifier) {
      return NextResponse.json(
        { success: false, message: 'Verifier account not found' },
        { status: 403 }
      );
    }

    // Update submission with verification data
    await pool.execute(
      `UPDATE merchant_submissions
      SET
        verification_status = ?,
        verifier_id = ?,
        verified_by_verifier_email = ?,
        verifier_notes = ?,
        verifier_location_lat = ?,
        verifier_location_lng = ?,
        verifier_distance_meters = ?,
        verified_at_location = NOW(),
        verification_photos = ?,
        business_name_matches = ?,
        business_exists = ?,
        payment_methods_verified = ?,
        business_operating = ?
      WHERE id = ?`,
      [
        verificationResult, // 'verified' or 'not_verified'
        verifier.id,
        session.user.email,
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
      const [merchantRows] = await pool.execute(
        'SELECT contact_email, business_name FROM merchant_submissions WHERE id = ?',
        [submissionId]
      );

      const merchant = (merchantRows as any[])[0];
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
