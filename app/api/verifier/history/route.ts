import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';
import { requireVerifier } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

export async function GET(request: NextRequest) {
  try {
    const user = await requireVerifier();

    // Fetch verification history for this verifier
    const rows = await executeQuery<any[]>(
      `SELECT
        id,
        business_name as "businessName",
        address,
        verification_status as "verificationStatus",
        verified_at_location as "verifiedAt",
        verifier_distance_meters as distance
      FROM merchant_submissions
      WHERE verified_by_verifier_email = $1
        AND verification_status IN ('verified', 'not_verified')
      ORDER BY verified_at_location DESC`,
      [user.email]
    );

    const history = rows.map(row => ({
      ...row,
      location: row.address, // Map address to location for frontend
    }));

    return NextResponse.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    logger.error('Error fetching verification history:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
