import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

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
    return handleAPIError(error, 'Admin Merchants');
  }
}
