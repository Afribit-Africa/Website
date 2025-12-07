import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { logger } from '@/lib/logger';
import { calculateDistance } from '@/lib/utils/distance';
import { requireVerifier } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await requireVerifier();

    const pool = getDbPool();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseInt(searchParams.get('radius') || '5000'); // Default 5km

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, message: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Fetch pending submissions
    const [rows] = await pool.execute(
      `SELECT
        id,
        business_name as businessName,
        address,
        latitude,
        longitude,
        payment_onchain as paymentOnchain,
        payment_lightning as paymentLightning,
        payment_lightning_contactless as paymentLightningContactless,
        submitted_at as submittedAt,
        verification_status as verificationStatus
      FROM merchant_submissions
      WHERE verification_status = 'pending_verification'
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
      ORDER BY submitted_at DESC`,
      []
    );

    const submissions = rows as any[];

    // Calculate distances and filter by radius
    const submissionsWithDistance = submissions
      .map((submission) => {
        const distance = Math.round(calculateDistance(
          lat,
          lng,
          submission.latitude,
          submission.longitude
        ) * 1000); // Convert km to meters

        // Build payment methods array from boolean columns
        const paymentMethods = [];
        if (submission.paymentOnchain) paymentMethods.push('onchain');
        if (submission.paymentLightning) paymentMethods.push('lightning');
        if (submission.paymentLightningContactless) paymentMethods.push('lightning_contactless');

        return {
          id: submission.id,
          businessName: submission.businessName,
          location: submission.address, // Use address as location
          latitude: submission.latitude,
          longitude: submission.longitude,
          submittedAt: submission.submittedAt,
          verificationStatus: submission.verificationStatus,
          distance,
          paymentMethods,
        };
      })
      .filter((submission) => submission.distance <= radius)
      .sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)

    return NextResponse.json({
      success: true,
      submissions: submissionsWithDistance,
      count: submissionsWithDistance.length,
    });
  } catch (error) {
    logger.error('Error fetching nearby submissions:', error);
    logger.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
