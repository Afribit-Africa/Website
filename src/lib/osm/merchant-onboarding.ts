import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'

const OSM_WEB_BASE = 'https://www.openstreetmap.org'
const OSM_API_BASE = 'https://api.openstreetmap.org'
const BTCMAP_BASE = 'https://btcmap.org'

export const poshAndPolishMerchant = {
  id: 'posh-and-polish',
  name: 'Posh and Polish',
  lat: -1.3121547,
  lon: 36.7751516,
  tags: {
    name: 'Posh and Polish',
    shop: 'beauty',
    beauty: 'nails',
    'currency:XBT': 'yes',
    'payment:lightning': 'yes',
    'payment:lightning:operator': 'blink',
    'check_date:currency:XBT': '2026-09-10',
    'survey:date': '2026-09-10',
    opening_hours: '09:00-17:00',
    source: 'survey',
  },
} as const

type MerchantId = typeof poshAndPolishMerchant.id

type OsmConfig = {
  clientId: string
  clientSecret: string
  redirectUri: string
  stateSecret: string
  onboardingAccessToken: string
}

type OAuthTokenResponse = {
  access_token?: unknown
  token_type?: unknown
  scope?: unknown
}

type SignedStatePayload = {
  merchant: MerchantId
  nonce: string
  exp: number
}

export type OsmCreateMerchantResult = {
  changesetId: string
  nodeId: string
  osmUrl: string
  btcmapUrl: string
}

export function getOsmConfig(): OsmConfig | null {
  if (process.env.OSM_ONBOARDING_ENABLED !== 'true') {
    return null
  }

  const clientId = process.env.OSM_CLIENT_ID
  const clientSecret = process.env.OSM_CLIENT_SECRET
  const redirectUri = process.env.OSM_REDIRECT_URI
  const stateSecret = process.env.OSM_ONBOARDING_STATE_SECRET
  const onboardingAccessToken = process.env.OSM_ONBOARDING_ACCESS_TOKEN

  if (!clientId || !clientSecret || !redirectUri || !stateSecret || !onboardingAccessToken) {
    return null
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    stateSecret,
    onboardingAccessToken,
  }
}

export function verifyOnboardingAccessToken(providedToken: string | null, expectedToken: string) {
  if (!providedToken) {
    return false
  }

  const providedBuffer = Buffer.from(providedToken)
  const expectedBuffer = Buffer.from(expectedToken)

  if (providedBuffer.length !== expectedBuffer.length) {
    return false
  }

  return timingSafeEqual(providedBuffer, expectedBuffer)
}

export function getOsmRedirectUri() {
  return process.env.OSM_REDIRECT_URI ?? 'https://afribit.africa/api/auth/osm/callback'
}

function toBase64Url(value: Buffer | string) {
  return Buffer.from(value).toString('base64url')
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function signStatePayload(payload: string, stateSecret: string) {
  return createHmac('sha256', stateSecret).update(payload).digest('base64url')
}

export function createSignedState(
  payload: Omit<SignedStatePayload, 'exp'>,
  stateSecret: string,
  ttlMs = 10 * 60 * 1000,
) {
  const statePayload: SignedStatePayload = {
    ...payload,
    exp: Date.now() + ttlMs,
  }
  const encodedPayload = toBase64Url(JSON.stringify(statePayload))
  const signature = signStatePayload(encodedPayload, stateSecret)
  return `${encodedPayload}.${signature}`
}

export function verifySignedState(state: string, stateSecret: string): SignedStatePayload | null {
  const [encodedPayload, signature] = state.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = signStatePayload(encodedPayload, stateSecret)
  const signatureBuffer = Buffer.from(signature, 'base64url')
  const expectedBuffer = Buffer.from(expectedSignature, 'base64url')

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  let payload: SignedStatePayload

  try {
    payload = JSON.parse(fromBase64Url(encodedPayload)) as SignedStatePayload
  } catch {
    return null
  }

  if (
    payload.merchant !== poshAndPolishMerchant.id ||
    typeof payload.nonce !== 'string' ||
    typeof payload.exp !== 'number' ||
    payload.exp < Date.now()
  ) {
    return null
  }

  return payload
}

export function buildOsmAuthorizeUrl(
  config: Pick<OsmConfig, 'clientId' | 'redirectUri'>,
  state: string,
) {
  const url = new URL('/oauth2/authorize', OSM_WEB_BASE)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', config.redirectUri)
  url.searchParams.set('scope', 'write_api')
  url.searchParams.set('state', state)
  return url
}

export async function exchangeOsmCodeForAccessToken(code: string, config: OsmConfig) {
  const response = await fetch(`${OSM_WEB_BASE}/oauth2/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'AfribitAfrica-OSM-Onboarding/1.0 (+https://afribit.africa)',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
    }),
  })

  if (!response.ok) {
    throw new Error(`OSM token exchange failed with ${response.status}`)
  }

  const data = (await response.json()) as OAuthTokenResponse

  if (typeof data.access_token !== 'string' || data.token_type !== 'Bearer') {
    throw new Error('OSM token exchange returned an unexpected payload')
  }

  return data.access_token
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

async function putOsmXml(path: string, accessToken: string, body: string) {
  const response = await fetch(`${OSM_API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/xml; charset=utf-8',
      'User-Agent': 'AfribitAfrica-OSM-Onboarding/1.0 (+https://afribit.africa)',
    },
    body,
  })

  const text = await response.text()

  if (!response.ok) {
    throw new Error(`OSM API request failed with ${response.status}: ${text.slice(0, 240)}`)
  }

  return text
}

async function postOsmXml(path: string, accessToken: string, body: string) {
  const response = await fetch(`${OSM_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/xml; charset=utf-8',
      'User-Agent': 'AfribitAfrica-OSM-Onboarding/1.0 (+https://afribit.africa)',
    },
    body,
  })

  const text = await response.text()

  if (!response.ok) {
    throw new Error(`OSM API request failed with ${response.status}: ${text.slice(0, 240)}`)
  }

  return text
}

async function createChangeset(accessToken: string) {
  const changesetXml = `<osm><changeset><tag k="created_by" v="Afribit Africa merchant onboarding"/><tag k="comment" v="Add Posh and Polish bitcoin merchant #btcmap"/><tag k="source" v="Confirmed with business owner / Afribit merchant onboarding survey"/></changeset></osm>`
  const changesetId = (
    await putOsmXml('/api/0.6/changeset/create', accessToken, changesetXml)
  ).trim()

  if (!/^\d+$/.test(changesetId)) {
    throw new Error('OSM returned an invalid changeset id')
  }

  return changesetId
}

async function closeChangeset(accessToken: string, changesetId: string) {
  await putOsmXml(`/api/0.6/changeset/${changesetId}/close`, accessToken, '')
}

function buildCreateNodeXml(changesetId: string) {
  const tagsXml = Object.entries(poshAndPolishMerchant.tags)
    .map(([key, value]) => `<tag k="${escapeXml(key)}" v="${escapeXml(value)}"/>`)
    .join('')

  return `<osmChange version="0.6" generator="Afribit Africa merchant onboarding"><create><node id="-1" changeset="${escapeXml(changesetId)}" lat="${poshAndPolishMerchant.lat}" lon="${poshAndPolishMerchant.lon}">${tagsXml}</node></create></osmChange>`
}

function extractCreatedNodeId(diffResultXml: string) {
  const match = diffResultXml.match(/<node\b[^>]*\bold_id="-1"[^>]*\bnew_id="(\d+)"/)
  return match?.[1] ?? null
}

export async function createPoshAndPolishOsmNode(
  accessToken: string,
): Promise<OsmCreateMerchantResult> {
  const changesetId = await createChangeset(accessToken)

  try {
    const diffResult = await postOsmXml(
      `/api/0.6/changeset/${changesetId}/upload`,
      accessToken,
      buildCreateNodeXml(changesetId),
    )
    const nodeId = extractCreatedNodeId(diffResult)

    if (!nodeId) {
      throw new Error('OSM did not return a created node id')
    }

    await closeChangeset(accessToken, changesetId)

    return {
      changesetId,
      nodeId,
      osmUrl: `${OSM_WEB_BASE}/node/${nodeId}`,
      btcmapUrl: `${BTCMAP_BASE}/merchant/node:${nodeId}`,
    }
  } catch (error) {
    await closeChangeset(accessToken, changesetId).catch(() => undefined)
    throw error
  }
}
