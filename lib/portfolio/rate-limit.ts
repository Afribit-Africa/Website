/**
 * Simple in-memory rate limiter for Portfolio API
 * Limits requests per IP address
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000);

/**
 * Check if request is rate limited
 * @param req Request object
 * @param maxRequests Maximum requests per window (default: 100)
 * @param windowMs Window size in milliseconds (default: 15 minutes)
 * @returns Response if rate limited, null if allowed
 */
export function checkRateLimit(
  req: Request,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000
): Response | null {
  // Get IP from headers (Vercel forwards this)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             req.headers.get('x-real-ip') ||
             'unknown';

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return null;
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return Response.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        },
      }
    );
  }

  // Increment counter
  entry.count++;

  return null;
}

/**
 * Get rate limit headers for successful requests
 */
export function getRateLimitHeaders(
  req: Request,
  maxRequests: number = 100
): Record<string, string> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             req.headers.get('x-real-ip') ||
             'unknown';

  const entry = rateLimitMap.get(ip);

  if (!entry) {
    return {
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': maxRequests.toString(),
    };
  }

  return {
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': Math.max(0, maxRequests - entry.count).toString(),
    'X-RateLimit-Reset': entry.resetTime.toString(),
  };
}
