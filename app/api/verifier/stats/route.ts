import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';
import { requireVerifier } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

export async function GET(request: NextRequest) {
  try {
    const user = await requireVerifier();

    // Get verifier stats
    const statsRows = await executeQuery<any[]>(
      `SELECT
        COUNT(*) as "totalVerifications",
        SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END) as "verifiedCount",
        SUM(CASE WHEN verification_status = 'not_verified' THEN 1 ELSE 0 END) as "notVerifiedCount",
        (SELECT COUNT(*) FROM merchant_submissions WHERE verification_status = 'pending_verification') as "pendingCount"
      FROM merchant_submissions
      WHERE verified_by_verifier_email = $1`,
      [user.email]
    );

    const stats = statsRows[0];

    return NextResponse.json({
      success: true,
      stats: {
        totalVerifications: parseInt(stats.totalVerifications) || 0,
        verifiedCount: parseInt(stats.verifiedCount) || 0,
        notVerifiedCount: parseInt(stats.notVerifiedCount) || 0,
        pendingCount: parseInt(stats.pendingCount) || 0,
      },
    });
  } catch (error) {
    logger.error('Error fetching verifier stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
