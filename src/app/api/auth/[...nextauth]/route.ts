import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createRateLimiter, getClientIp } from '@/lib/rate-limit'

const authHandler = NextAuth(authOptions)
const authLimiter = createRateLimiter('auth')

export const GET = authHandler

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const { nextauth } = await context.params
  const action = nextauth[0]

  if (action === 'signin' || action === 'callback') {
    try {
      await authLimiter.consume(`${getClientIp(request)}:${action}`)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Too many authentication attempts' },
        { status: 429 }
      )
    }
  }

  return authHandler(request, context)
}