/**
 * Portfolio API Authentication Middleware
 * Validates API keys for secure access to portfolio endpoints
 */

export function validatePortfolioKey(req: Request): Response | null {
  const apiKey = req.headers.get('X-API-Key');
  const validKey = process.env.PORTFOLIO_API_KEY;

  if (!validKey) {
    console.error('PORTFOLIO_API_KEY not configured in environment');
    return Response.json(
      {
        success: false,
        error: 'Portfolio API not configured'
      },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== validKey) {
    return Response.json(
      {
        success: false,
        error: 'Invalid or missing API key',
        message: 'Please provide a valid X-API-Key header'
      },
      { status: 401 }
    );
  }

  return null; // Valid
}

/**
 * Get CORS headers for portfolio API responses
 */
export function getPortfolioCorsHeaders() {
  const allowedOrigin = process.env.PORTFOLIO_ALLOWED_ORIGIN || 'https://novyrix.com';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'X-API-Key, Content-Type',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflightRequest() {
  return new Response(null, {
    status: 204,
    headers: getPortfolioCorsHeaders(),
  });
}
