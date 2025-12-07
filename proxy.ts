import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { logger } from './lib/logger';
import { getApiRateLimiter, isRedisAvailable, getRateLimitInfo } from './lib/upstash-redis';

// Fallback in-memory rate limiter for when Redis is not available
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute

// In-memory rate limiter (fallback)
function inMemoryRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old entries periodically (only for in-memory fallback)
if (!isRedisAvailable()) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, RATE_LIMIT_WINDOW);
}

// Unified rate limit function with Redis + fallback
async function rateLimit(identifier: string): Promise<boolean> {
  // Try Redis first
  if (isRedisAvailable()) {
    try {
      const limiter = getApiRateLimiter();
      const result = await getRateLimitInfo(limiter, identifier);
      return result.success;
    } catch (error) {
      logger.warn('Redis rate limit failed, falling back to in-memory:', error);
      return inMemoryRateLimit(identifier);
    }
  }

  // Fallback to in-memory
  return inMemoryRateLimit(identifier);
}

export async function middleware(request: NextRequest) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect verifiers trying to access admin pages to verifier dashboard
    if (token.role === 'verifier' && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/verifier/dashboard', request.url));
    }
  }

  // Protect verifier routes
  if (request.nextUrl.pathname.startsWith('/verifier')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Ensure only verifiers can access verifier pages
    if (token.role !== 'verifier' && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Apply rate limiting to API routes and donation page
  if (request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/donate')) {

    const allowed = await rateLimit(ip);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
  }

  // Security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // XSS Protection
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy (allow geolocation for specific pages where location is needed)
  const pathname = request.nextUrl.pathname;
  const allowGeolocation = pathname.startsWith('/verifier') ||
                          pathname.startsWith('/merchants') ||
                          pathname.startsWith('/register') ||
                          pathname.startsWith('/admin');

  // Use modern Permissions-Policy syntax
  response.headers.set(
    'Permissions-Policy',
    allowGeolocation
      ? 'camera=(), microphone=(), geolocation=*'
      : 'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
