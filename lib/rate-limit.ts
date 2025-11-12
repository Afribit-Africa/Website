// Simple in-memory rate limiter for Vercel serverless
// For production, consider using Upstash Redis or Vercel KV

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the window
}

export class RateLimitError extends Error {
  constructor(public retryAfter: number) {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
  }
}

export async function rateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<void> {
  // Get identifier (IP or user agent as fallback)
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';
  
  const identifier = `${ip}-${request.url}`;
  const now = Date.now();

  // Get or create rate limit entry
  if (!store[identifier] || store[identifier].resetTime < now) {
    store[identifier] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return;
  }

  // Increment count
  store[identifier].count++;

  // Check if limit exceeded
  if (store[identifier].count > config.maxRequests) {
    const retryAfter = Math.ceil((store[identifier].resetTime - now) / 1000);
    throw new RateLimitError(retryAfter);
  }
}

// Preset configurations
export const rateLimitConfigs = {
  strict: { interval: 60 * 1000, maxRequests: 5 }, // 5 per minute
  moderate: { interval: 60 * 1000, maxRequests: 10 }, // 10 per minute
  lenient: { interval: 60 * 1000, maxRequests: 30 }, // 30 per minute
  api: { interval: 60 * 1000, maxRequests: 20 }, // 20 per minute
} as const;
