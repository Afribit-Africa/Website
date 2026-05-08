import type { NextRequest } from 'next/server'
import { RateLimiterMemory } from 'rate-limiter-flexible'

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const defaultPoints = parsePositiveInteger(process.env.RATE_LIMIT_MAX, 100)
const defaultWindowMs = parsePositiveInteger(process.env.RATE_LIMIT_WINDOW_MS, 900000)

export function createRateLimiter(keyPrefix: string, points = defaultPoints, windowMs = defaultWindowMs) {
  return new RateLimiterMemory({
    keyPrefix,
    points,
    duration: Math.max(1, Math.ceil(windowMs / 1000)),
  })
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}