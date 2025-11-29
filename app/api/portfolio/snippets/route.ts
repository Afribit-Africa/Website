import { validatePortfolioKey, getPortfolioCorsHeaders, handleCorsPreflightRequest } from '@/lib/portfolio/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/portfolio/rate-limit';
import { getSnippetsForFeature, getAllFeatures } from '@/lib/portfolio/snippets';

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
  const feature = searchParams.get('feature');
  const format = searchParams.get('format') || 'all';

  if (!feature) {
    return Response.json(
      {
        success: false,
        error: 'Missing required parameter: feature',
        availableFeatures: getAllFeatures(),
      },
      {
        status: 400,
        headers: getPortfolioCorsHeaders(),
      }
    );
  }

  const snippets = getSnippetsForFeature(feature);

  if (!snippets) {
    return Response.json(
      {
        success: false,
        error: `Feature '${feature}' not found`,
        availableFeatures: getAllFeatures(),
      },
      {
        status: 404,
        headers: getPortfolioCorsHeaders(),
      }
    );
  }

  // Filter by format if specified
  const filteredSnippets = format === 'all'
    ? snippets
    : snippets.filter(s => s.language === format);

  return Response.json(
    {
      success: true,
      feature,
      snippets: filteredSnippets,
      count: filteredSnippets.length,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        ...getPortfolioCorsHeaders(),
        ...getRateLimitHeaders(req),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800', // Cache for 24 hours
      },
    }
  );
}
