export type MerchantOpenStatus =
  | 'UNKNOWN'
  | 'OPEN'
  | 'CLOSED'
  | 'MOVED'
  | 'TEMPORARILY_CLOSED'

export type MerchantBitcoinStatus = 'UNKNOWN' | 'ACCEPTS' | 'DOES_NOT_ACCEPT'

export type MerchantVerificationMethod =
  | 'ONSITE_SURVEY'
  | 'PHONE'
  | 'EMAIL'
  | 'WEBSITE'
  | 'SOCIAL_MEDIA'
  | 'COMMUNITY_REPORT'
  | 'OSM_SYNC'
  | 'CSV_IMPORT'
  | 'OTHER'

export type OSMNodeTags = Record<string, string>

export interface OSMNodeElement {
  id: number
  version: number
  changeset: number
  timestamp: string
  user?: string
  tags?: OSMNodeTags
}

export interface MerchantVerificationRecord {
  merchantId: string
  checkedAt: Date
  surveyDate: Date | null
  verificationMethod: MerchantVerificationMethod
  checkedByName: string | null
  openStatus: MerchantOpenStatus
  bitcoinStatus: MerchantBitcoinStatus
  paymentLightningEnabled: boolean | null
  paymentOnchainEnabled: boolean | null
  paymentLightningContactlessEnabled: boolean | null
  correctName: boolean | null
  correctPhone: boolean | null
  correctAddress: boolean | null
  correctCategory: boolean | null
  openingHours: string | null
  notes: string
  osmNodeId: string
  osmUrl: string
  osmChangesetId: string
  osmVersion: number
  osmTimestamp: Date
  rawOSMTags: OSMNodeTags
  sourceRef: string | null
}

export interface MerchantSnapshotRecord {
  osmNodeId: string
  osmUrl: string
  osmChangesetId: string
  osmSourceRef: string | null
  openStatus: MerchantOpenStatus
  bitcoinStatus: MerchantBitcoinStatus
  paymentLightningEnabled: boolean | null
  paymentOnchainEnabled: boolean | null
  paymentLightningContactlessEnabled: boolean | null
  openingHours: string | null
  lastVerifiedAt: Date
  lastSurveyedAt: Date | null
  lastVerificationMethod: MerchantVerificationMethod
  lastVerifiedByName: string | null
  verificationNotes: string
  acceptsBitcoin: boolean | null
}

const YES_VALUES = new Set(['yes', 'true', '1'])
const NO_VALUES = new Set(['no', 'false', '0'])

function normalizeTagValue(value: string | undefined): string | null {
  if (!value) {
    return null
  }

  return value.trim().toLowerCase()
}

export function parseBooleanTag(value: string | undefined): boolean | null {
  const normalized = normalizeTagValue(value)

  if (!normalized) {
    return null
  }

  if (YES_VALUES.has(normalized)) {
    return true
  }

  if (NO_VALUES.has(normalized)) {
    return false
  }

  return null
}

export function parseISODate(value: string | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null
  }

  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function firstNonNullDate(...values: Array<string | undefined>): Date | null {
  for (const value of values) {
    const parsed = parseISODate(value)
    if (parsed) {
      return parsed
    }
  }

  return null
}

function hasClosedLifecycleTag(tags: OSMNodeTags): boolean {
  if (normalizeTagValue(tags.opening_hours) === 'closed') {
    return true
  }

  if (normalizeTagValue(tags.shop) === 'vacant' || normalizeTagValue(tags.amenity) === 'vacant') {
    return true
  }

  return Object.keys(tags).some((key) => {
    const normalized = key.toLowerCase()
    return (
      normalized.startsWith('disused:') ||
      normalized.startsWith('abandoned:') ||
      normalized.startsWith('was:') ||
      normalized.startsWith('demolished:')
    )
  })
}

export function inferBitcoinStatus(tags: OSMNodeTags): MerchantBitcoinStatus {
  const currencyXbt = parseBooleanTag(tags['currency:XBT'])
  const lightning = parseBooleanTag(tags['payment:lightning'])
  const onchain = parseBooleanTag(tags['payment:onchain'])

  if (currencyXbt === true || lightning === true || onchain === true) {
    return 'ACCEPTS'
  }

  if (currencyXbt === false) {
    return 'DOES_NOT_ACCEPT'
  }

  return 'UNKNOWN'
}

export function inferOpenStatus(tags: OSMNodeTags): MerchantOpenStatus {
  if (hasClosedLifecycleTag(tags)) {
    return 'CLOSED'
  }

  const hasVerificationSignal = Boolean(
    tags['afribit:verified'] === 'yes' ||
      tags['survey:date'] ||
      tags['check_date:currency:XBT'] ||
      tags.check_date ||
      tags.opening_hours
  )

  return hasVerificationSignal && inferBitcoinStatus(tags) === 'ACCEPTS' ? 'OPEN' : 'UNKNOWN'
}

export function inferVerificationMethod(tags: OSMNodeTags): MerchantVerificationMethod {
  if (parseISODate(tags['survey:date']) || normalizeTagValue(tags.source) === 'survey') {
    return 'ONSITE_SURVEY'
  }

  return 'OSM_SYNC'
}

export function extractSourceRef(tags: OSMNodeTags): string | null {
  if (tags['source:ref']) {
    return tags['source:ref']
  }

  if (tags['afribit:merchant_id']) {
    return `afribit:${tags['afribit:merchant_id']}`
  }

  return null
}

export function isVerificationFresh(date: Date, maxAgeDays = 365): boolean {
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000
  return Date.now() - date.getTime() <= maxAgeMs
}

export function buildVerificationFromOsmNode(
  node: OSMNodeElement,
  merchantId: string,
  merchantName: string
): MerchantVerificationRecord {
  const tags = node.tags ?? {}
  const checkedAt = new Date(node.timestamp)
  const surveyDate = firstNonNullDate(tags['survey:date'], tags['check_date:currency:XBT'], tags.check_date)
  const verificationMethod = inferVerificationMethod(tags)
  const sourceRef = extractSourceRef(tags)
  const notes = `Synced from OSM node ${node.id} for ${merchantName} (version ${node.version}, changeset ${node.changeset}).`

  return {
    merchantId,
    checkedAt,
    surveyDate,
    verificationMethod,
    checkedByName: node.user ?? null,
    openStatus: inferOpenStatus(tags),
    bitcoinStatus: inferBitcoinStatus(tags),
    paymentLightningEnabled: parseBooleanTag(tags['payment:lightning']),
    paymentOnchainEnabled: parseBooleanTag(tags['payment:onchain']),
    paymentLightningContactlessEnabled: parseBooleanTag(tags['payment:lightning_contactless']),
    correctName: null,
    correctPhone: null,
    correctAddress: null,
    correctCategory: null,
    openingHours: tags.opening_hours ?? null,
    notes,
    osmNodeId: String(node.id),
    osmUrl: `https://www.openstreetmap.org/node/${node.id}`,
    osmChangesetId: String(node.changeset),
    osmVersion: node.version,
    osmTimestamp: checkedAt,
    rawOSMTags: tags,
    sourceRef,
  }
}

export function buildMerchantSnapshot(record: MerchantVerificationRecord): MerchantSnapshotRecord {
  return {
    osmNodeId: record.osmNodeId,
    osmUrl: record.osmUrl,
    osmChangesetId: record.osmChangesetId,
    osmSourceRef: record.sourceRef,
    openStatus: record.openStatus,
    bitcoinStatus: record.bitcoinStatus,
    paymentLightningEnabled: record.paymentLightningEnabled,
    paymentOnchainEnabled: record.paymentOnchainEnabled,
    paymentLightningContactlessEnabled: record.paymentLightningContactlessEnabled,
    openingHours: record.openingHours,
    lastVerifiedAt: record.checkedAt,
    lastSurveyedAt: record.surveyDate,
    lastVerificationMethod: record.verificationMethod,
    lastVerifiedByName: record.checkedByName,
    verificationNotes: record.notes,
    acceptsBitcoin:
      record.bitcoinStatus === 'ACCEPTS'
        ? true
        : record.bitcoinStatus === 'DOES_NOT_ACCEPT'
          ? false
          : null,
  }
}