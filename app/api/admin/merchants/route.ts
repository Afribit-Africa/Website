import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch published merchants
    const merchants = await executeQuery<any[]>(
      `SELECT
        id,
        business_name as businessName,
        category_value as categoryValue,
        address,
        latitude,
        longitude,
        payment_onchain as paymentOnchain,
        payment_lightning as paymentLightning,
        submitted_at as submittedAt,
        published_at as publishedAt,
        is_early_adopter as isEarlyAdopter,
        adopter_number as adopterNumber
      FROM merchant_submissions
      WHERE status = 'published'
      ORDER BY published_at DESC`
    );

    const formattedMerchants = merchants.map(m => ({
      ...m,
      paymentOnchain: Boolean(m.paymentOnchain),
      paymentLightning: Boolean(m.paymentLightning),
      isEarlyAdopter: Boolean(m.isEarlyAdopter),
    }));

    return NextResponse.json({
      success: true,
      merchants: formattedMerchants,
    });
  } catch (error) {
    logger.error('Merchants API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
