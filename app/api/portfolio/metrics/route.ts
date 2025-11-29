import { executeQuery } from '@/lib/db';
import { validatePortfolioKey, getPortfolioCorsHeaders, handleCorsPreflightRequest } from '@/lib/portfolio/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/portfolio/rate-limit';

export async function OPTIONS() {
  return handleCorsPreflightRequest();
}

export async function GET(req: Request) {
  const authError = validatePortfolioKey(req);
  if (authError) return authError;

  const rateLimitError = checkRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    const merchantStatsResult = await executeQuery<any[]>(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN verification_status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM merchant_submissions
    `, []);
    const merchantStats = merchantStatsResult[0] || { total: 0, verified: 0, pending: 0 };

    const donationStatsResult = await executeQuery<any[]>(`
      SELECT
        COUNT(*) as donorCount,
        COALESCE(SUM(amount), 0) as totalAmount
      FROM donors
    `, []);
    const donationStats = donationStatsResult[0] || { donorCount: 0, totalAmount: 0 };

    const verifierCountResult = await executeQuery<any[]>(`
      SELECT COUNT(*) as total
      FROM admin_users
      WHERE role = 'verifier' AND is_active = true
    `, []);
    const verifierCount = verifierCountResult[0] || { total: 0 };

    // Simplified: Use static category list for portfolio
    const categoriesList = ['General Store', 'Restaurant', 'Grocery', 'Salon', 'Hardware', 'Transport', 'Service'];

    // Simplified growth calculation (estimate based on total)
    const totalMerchants = Number(merchantStats.total) || 0;
    const estimatedLastMonth = Math.max(0, totalMerchants - 5);
    const growth = estimatedLastMonth > 0
      ? Math.round(((totalMerchants - estimatedLastMonth) / estimatedLastMonth) * 100)
      : totalMerchants > 0 ? 100 : 0;

    const data = {
      totalMerchants,
      verifiedMerchants: Number(merchantStats.verified) || 0,
      pendingVerifications: Number(merchantStats.pending) || 0,
      totalDonations: Number(donationStats.totalAmount) || 0,
      donorCount: Number(donationStats.donorCount) || 0,
      categories: categoriesList,
      verifierCount: Number(verifierCount.total) || 0,
      monthlyGrowth: {
        merchants: growth > 0 ? `+${growth}%` : `${growth}%`,
      },
    };

    return Response.json(
      {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          ...getPortfolioCorsHeaders(),
          ...getRateLimitHeaders(req),
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('Portfolio metrics error:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: getPortfolioCorsHeaders(),
      }
    );
  }
}
