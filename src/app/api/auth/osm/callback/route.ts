import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import {
  createPoshAndPolishOsmNode,
  exchangeOsmCodeForAccessToken,
  getOsmConfig,
  getOsmRedirectUri,
  verifySignedState,
} from '@/lib/osm/merchant-onboarding'

export const runtime = 'nodejs'

const NONCE_COOKIE = 'afribit_osm_oauth_nonce'

function htmlResponse(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function page(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root { color-scheme: dark; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #070807; color: #f4f5f0; }
      body { min-height: 100vh; display: grid; place-items: center; margin: 0; padding: 24px; }
      main { width: min(720px, 100%); border: 1px solid rgba(255,255,255,.12); border-radius: 8px; background: #111510; padding: 28px; box-shadow: 0 24px 80px rgba(0,0,0,.45); }
      h1 { margin: 0 0 12px; font-size: clamp(28px, 5vw, 44px); line-height: 1; }
      p { color: rgba(244,245,240,.78); line-height: 1.7; }
      a { color: #f7931a; }
      code { display: block; overflow-wrap: anywhere; border: 1px solid rgba(255,255,255,.12); border-radius: 6px; padding: 12px; background: rgba(0,0,0,.32); color: #fff; }
      .links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px; }
      .links a { border: 1px solid rgba(247,147,26,.4); border-radius: 6px; padding: 10px 12px; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const error = url.searchParams.get('error')
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const config = getOsmConfig()

  if (error) {
    return htmlResponse(
      page(
        'OpenStreetMap authorization failed',
        `<h1>OpenStreetMap authorization failed</h1><p>${escapeHtml(error)}</p>`,
      ),
      400,
    )
  }

  if (!code || !state) {
    return htmlResponse(
      page(
        'OpenStreetMap callback missing data',
        '<h1>Missing authorization data</h1><p>The OpenStreetMap callback did not include both a code and state.</p>',
      ),
      400,
    )
  }

  if (!config) {
    return htmlResponse(
      page(
        'OpenStreetMap code received',
        `<h1>OpenStreetMap code received</h1><p>The production server received the authorization code, but OSM onboarding environment variables are not configured there yet. Keep this code private and use it quickly; OAuth codes expire and can only be used once.</p><code>${escapeHtml(code)}</code><p>Redirect URI used by the app:</p><code>${escapeHtml(getOsmRedirectUri())}</code>`,
      ),
    )
  }

  const payload = verifySignedState(state, config.stateSecret)
  const cookieStore = await cookies()
  const nonce = cookieStore.get(NONCE_COOKIE)?.value

  if (!payload || !nonce || payload.nonce !== nonce) {
    return htmlResponse(
      page(
        'OpenStreetMap state check failed',
        '<h1>State check failed</h1><p>The authorization response could not be verified. Please restart the onboarding flow.</p>',
      ),
      400,
    )
  }

  try {
    const accessToken = await exchangeOsmCodeForAccessToken(code, config)
    const result = await createPoshAndPolishOsmNode(accessToken)
    const response = htmlResponse(
      page(
        'Posh and Polish added to OpenStreetMap',
        `<h1>Posh and Polish is on OpenStreetMap</h1><p>The merchant node was created and the changeset was closed. BTC Map usually picks up OSM edits after its next sync.</p><div class="links"><a href="${result.osmUrl}">Open OSM node ${result.nodeId}</a><a href="${result.btcmapUrl}">Check BTC Map listing</a><a href="https://btcmap.org/community/afribit-kibera">Afribit BTC Map community</a></div><p>Changeset: <a href="https://www.openstreetmap.org/changeset/${result.changesetId}">${result.changesetId}</a></p>`,
      ),
    )
    response.cookies.delete(NONCE_COOKIE)
    return response
  } catch (createError) {
    console.error('[osm-onboarding]', createError)
    return htmlResponse(
      page(
        'OpenStreetMap publishing failed',
        '<h1>OpenStreetMap publishing failed</h1><p>The authorization succeeded, but the OSM edit could not be completed. Check server logs for the API response.</p>',
      ),
      500,
    )
  }
}
