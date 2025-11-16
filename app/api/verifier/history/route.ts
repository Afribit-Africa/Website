import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDbPool } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
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

    // Fetch verification history for this verifier
    const [rows] = await pool.execute(
      `SELECT
        id,
        business_name as businessName,
        address,
        verification_status as verificationStatus,
        verified_at_location as verifiedAt,
        verifier_distance_meters as distance
      FROM merchant_submissions
      WHERE verified_by_verifier_email = ?
        AND verification_status IN ('verified', 'not_verified')
      ORDER BY verified_at_location DESC`,
      [session.user.email]
    );

    const history = (rows as any[]).map(row => ({
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
