import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    // Get status filter from query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';

    // Build query
    let query = `
      SELECT
        id,
        business_name as businessName,
        category_value as categoryValue,
        description,
        latitude,
        longitude,
        address,
        phone,
        website,
        payment_onchain as paymentOnchain,
        payment_lightning as paymentLightning,
        payment_lightning_contactless as paymentLightningContactless,
        contact_name as contactName,
        contact_email as contactEmail,
        status,
        submitted_at as submittedAt,
        is_early_adopter as isEarlyAdopter,
        adopter_number as adopterNumber
      FROM merchant_submissions
    `;

    const params: string[] = [];

    if (status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY submitted_at DESC';

    const submissions = await executeQuery<any[]>(query, params);

    // Convert boolean fields
    const formattedSubmissions = submissions.map(sub => ({
      ...sub,
      paymentOnchain: Boolean(sub.paymentOnchain),
      paymentLightning: Boolean(sub.paymentLightning),
      paymentLightningContactless: Boolean(sub.paymentLightningContactless),
      isEarlyAdopter: Boolean(sub.isEarlyAdopter),
    }));

    return NextResponse.json({
      success: true,
      submissions: formattedSubmissions,
    });
  } catch (error) {
    return handleAPIError(error, 'Admin Submissions');
  }
}
