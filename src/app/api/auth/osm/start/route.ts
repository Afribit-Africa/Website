import { randomBytes } from 'node:crypto'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  buildOsmAuthorizeUrl,
  createSignedState,
  getOsmConfig,
  poshAndPolishMerchant,
  verifyOnboardingAccessToken,
} from '@/lib/osm/merchant-onboarding'

export const runtime = 'nodejs'

const NONCE_COOKIE = 'afribit_osm_oauth_nonce'

export async function GET(request: NextRequest) {
  const config = getOsmConfig()

  if (!config) {
    return NextResponse.json(
      {
        success: false,
        error:
          'OpenStreetMap onboarding is not configured. Set OSM_CLIENT_ID, OSM_CLIENT_SECRET, OSM_REDIRECT_URI, OSM_ONBOARDING_ENABLED=true, OSM_ONBOARDING_STATE_SECRET, and OSM_ONBOARDING_ACCESS_TOKEN.',
      },
      { status: 503 },
    )
  }

  if (
    !verifyOnboardingAccessToken(
      request.nextUrl.searchParams.get('token'),
      config.onboardingAccessToken,
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'OpenStreetMap onboarding is locked.',
      },
      { status: 401 },
    )
  }

  const nonce = randomBytes(24).toString('base64url')
  const state = createSignedState(
    {
      merchant: poshAndPolishMerchant.id,
      nonce,
    },
    config.stateSecret,
  )
  const redirectTo = buildOsmAuthorizeUrl(config, state)
  const response = NextResponse.redirect(redirectTo)

  response.cookies.set(NONCE_COOKIE, nonce, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: '/api/auth/osm',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
