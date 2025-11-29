import { executeQuery } from '@/lib/db';
import { validatePortfolioKey, getPortfolioCorsHeaders, handleCorsPreflightRequest } from '@/lib/portfolio/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/portfolio/rate-limit';

export async function OPTIONS() {
  return handleCorsPreflightRequest();
}

export async function GET(req: Request) {
  // Check authentication
  const authError = validatePortfolioKey(req);
  if (authError) return authError;

  // Check rate limit
  const rateLimitError = checkRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'merchants';
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20); // Max 20 items

  try {
    let data: any[] = [];
    let meta: any = {
      isDemo: true,
      note: 'This is sanitized sample data for portfolio demonstration purposes',
    };

    switch (type) {
      case 'merchants':
        // Fetch real but sanitized merchant data
        data = await executeQuery(`
          SELECT
            id,
            business_name as name,
            category,
            location,
            latitude,
            longitude,
            payment_methods as paymentMethods,
            verification_status as verificationStatus,
            description,
            created_at as createdAt
          FROM merchant_submissions
          WHERE verification_status = 'verified'
          ORDER BY created_at DESC
          LIMIT ?
        `, [limit]) as any[];

        // Parse JSON fields and sanitize
        data = data.map(merchant => ({
          id: `demo-${merchant.id}`,
          name: merchant.name,
          category: merchant.category,
          location: merchant.location,
          coordinates: {
            lat: parseFloat(merchant.latitude),
            lng: parseFloat(merchant.longitude),
          },
          paymentMethods: typeof merchant.paymentMethods === 'string'
            ? JSON.parse(merchant.paymentMethods)
            : merchant.paymentMethods,
          verificationStatus: merchant.verificationStatus,
          description: merchant.description || 'Bitcoin-accepting business in Kibera',
        }));
        break;

      case 'donations':
        // Fetch sanitized donation stats (no personal info)
        data = await executeQuery(`
          SELECT
            amount,
            DATE_FORMAT(created_at, '%Y-%m-%d') as date,
            'anonymous' as donor
          FROM donors
          WHERE show_on_website = true
          ORDER BY created_at DESC
          LIMIT ?
        `, [limit]) as any[];

        data = data.map((donation, index) => ({
          id: `demo-donation-${index + 1}`,
          amount: parseFloat(donation.amount),
          date: donation.date,
          donor: 'Anonymous Supporter',
        }));
        break;

      case 'verifications':
        // Fetch verification stats (no verifier personal info)
        data = await executeQuery(`
          SELECT
            merchant_submission_id as merchantId,
            verification_result as result,
            DATE_FORMAT(verified_at, '%Y-%m-%d') as date,
            'Field Verifier' as verifier
          FROM verifications
          ORDER BY verified_at DESC
          LIMIT ?
        `, [limit]) as any[];

        data = data.map((verification, index) => ({
          id: `demo-verification-${index + 1}`,
          merchantId: `demo-${verification.merchantId}`,
          result: verification.result,
          date: verification.date,
          verifier: 'Field Verifier',
        }));
        break;

      default:
        return Response.json(
          {
            success: false,
            error: `Invalid type: ${type}`,
            availableTypes: ['merchants', 'donations', 'verifications'],
          },
          {
            status: 400,
            headers: getPortfolioCorsHeaders(),
          }
        );
    }

    return Response.json(
      {
        success: true,
        type,
        data,
        meta,
        count: data.length,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          ...getPortfolioCorsHeaders(),
          ...getRateLimitHeaders(req),
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200', // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error('Portfolio demo-data error:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch demo data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: getPortfolioCorsHeaders(),
      }
    );
  }
}
