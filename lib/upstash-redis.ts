import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { logger } from './logger';

/**
 * Upstash Redis Client Configuration
 * Provides production-ready rate limiting with Redis backend
 */

// Initialize Redis client (only if credentials are provided)
let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      logger.info('Upstash Redis client initialized');
    } catch (error) {
      logger.error('Failed to initialize Redis client:', error);
      return null;
    }
  }
  return redis;
}

/**
 * Rate limiter for general API requests
 * 100 requests per 15 minutes per IP
 */
export function getApiRateLimiter(): Ratelimit | null {
  const client = getRedisClient();
  if (!client) return null;

  return new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(100, '15 m'),
    analytics: true,
    prefix: 'ratelimit:api',
  });
}

/**
 * Rate limiter for merchant submissions
 * 3 submissions per hour per IP
 */
export function getMerchantSubmissionRateLimiter(): Ratelimit | null {
  const client = getRedisClient();
  if (!client) return null;

  return new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:merchant',
  });
}

/**
 * Rate limiter for contact form submissions
 * 5 submissions per hour per IP
 */
export function getContactFormRateLimiter(): Ratelimit | null {
  const client = getRedisClient();
  if (!client) return null;

  return new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
    prefix: 'ratelimit:contact',
  });
}

/**
 * Rate limiter for donation creation
 * 10 donations per hour per IP
 */
export function getDonationRateLimiter(): Ratelimit | null {
  const client = getRedisClient();
  if (!client) return null;

  return new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
    prefix: 'ratelimit:donation',
  });
}

/**
 * Rate limiter for verifier applications
 * 1 application per day per IP
 */
export function getVerifierApplicationRateLimiter(): Ratelimit | null {
  const client = getRedisClient();
  if (!client) return null;

  return new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(1, '24 h'),
    analytics: true,
    prefix: 'ratelimit:verifier',
  });
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return getRedisClient() !== null;
}

/**
 * Get rate limit info for a specific identifier
 */
export async function getRateLimitInfo(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  if (!limiter) {
    // Return permissive response if Redis not available
    return {
      success: true,
      limit: 100,
      remaining: 100,
      reset: Date.now() + 900000, // 15 minutes
    };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    logger.error('Rate limit check failed:', error);
    // Fail open - allow request if Redis is down
    return {
      success: true,
      limit: 100,
      remaining: 100,
      reset: Date.now() + 900000,
    };
  }
}

/**
 * Clear rate limit for a specific identifier (admin use)
 */
export async function clearRateLimit(prefix: string, identifier: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(`${prefix}:${identifier}`);
    logger.info(`Cleared rate limit for ${prefix}:${identifier}`);
    return true;
  } catch (error) {
    logger.error('Failed to clear rate limit:', error);
    return false;
  }
}

/**
 * Get rate limit statistics (admin use)
 */
export async function getRateLimitStats(prefix: string): Promise<{
  totalKeys: number;
  keys: string[];
} | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const keys = await client.keys(`${prefix}:*`);
    return {
      totalKeys: keys.length,
      keys: keys.slice(0, 100), // Limit to first 100 keys
    };
  } catch (error) {
    logger.error('Failed to get rate limit stats:', error);
    return null;
  }
}
