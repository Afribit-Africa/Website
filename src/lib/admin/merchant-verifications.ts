import 'server-only'

import type {
  MerchantBitcoinStatus,
  MerchantOpenStatus,
  MerchantStatus,
  MerchantVerificationMethod,
  Prisma,
} from '@prisma/client'
import { isVerificationFresh } from '@/lib/merchant-verification'

export const DEFAULT_VERIFICATION_FRESHNESS_DAYS = 365

export type MerchantVerificationQueueRecord = {
  id: string
  slug: string
  name: string
  category: string
  status: MerchantStatus
  openStatus: MerchantOpenStatus
  bitcoinStatus: MerchantBitcoinStatus
  lastVerifiedAt: Date | null
  lastSurveyedAt: Date | null
  lastVerificationMethod: MerchantVerificationMethod | null
  lastVerifiedByName: string | null
  openingHours: string | null
  osmNodeId: string | null
  osmUrl: string | null
  verificationNotes: string | null
}

export type MerchantSnapshotUpdateInput = {
  checkedAt: Date
  surveyDate: Date | null
  verificationMethod: MerchantVerificationMethod
  checkedByUserId: string | null
  checkedByName: string | null
  openStatus: MerchantOpenStatus
  bitcoinStatus: MerchantBitcoinStatus
  paymentLightningEnabled: boolean | null
  paymentOnchainEnabled: boolean | null
  paymentLightningContactlessEnabled: boolean | null
  openingHours: string | null
  notes: string | null
  osmNodeId: string | null
  osmUrl: string | null
  osmChangesetId: string | null
  sourceRef: string | null
}

export function isMerchantVerificationFresh(
  merchant: Pick<MerchantVerificationQueueRecord, 'lastVerifiedAt' | 'lastSurveyedAt'>,
  freshnessDays = DEFAULT_VERIFICATION_FRESHNESS_DAYS
): boolean {
  const referenceDate = merchant.lastSurveyedAt ?? merchant.lastVerifiedAt
  return referenceDate ? isVerificationFresh(referenceDate, freshnessDays) : false
}

export function collectVerificationIssues(
  merchant: MerchantVerificationQueueRecord,
  freshnessDays = DEFAULT_VERIFICATION_FRESHNESS_DAYS
): string[] {
  const issues: string[] = []

  if (!merchant.lastVerifiedAt) {
    issues.push('missing_verification')
  } else if (!isMerchantVerificationFresh(merchant, freshnessDays)) {
    issues.push('stale_verification')
  }

  if (!merchant.osmNodeId) {
    issues.push('missing_osm_node')
  }

  if (
    merchant.openStatus === 'CLOSED' ||
    merchant.openStatus === 'MOVED' ||
    merchant.openStatus === 'TEMPORARILY_CLOSED'
  ) {
    issues.push('merchant_not_open')
  }

  if (merchant.bitcoinStatus === 'DOES_NOT_ACCEPT') {
    issues.push('bitcoin_disabled')
  }

  if (merchant.status !== 'ACTIVE') {
    issues.push(`merchant_${merchant.status.toLowerCase()}`)
  }

  return issues
}

export function buildMerchantSnapshotUpdate(
  input: MerchantSnapshotUpdateInput
): Prisma.MerchantUpdateInput {
  const merchantUpdate: Prisma.MerchantUpdateInput = {
    openStatus: input.openStatus,
    bitcoinStatus: input.bitcoinStatus,
    paymentLightningEnabled: input.paymentLightningEnabled,
    paymentOnchainEnabled: input.paymentOnchainEnabled,
    paymentLightningContactlessEnabled: input.paymentLightningContactlessEnabled,
    openingHours: input.openingHours,
    lastVerifiedAt: input.checkedAt,
    lastSurveyedAt: input.surveyDate,
    lastVerificationMethod: input.verificationMethod,
    lastVerifiedByName: input.checkedByName,
    verificationNotes: input.notes,
    osmNodeId: input.osmNodeId,
    osmUrl: input.osmUrl,
    osmChangesetId: input.osmChangesetId,
    osmSourceRef: input.sourceRef,
  }

  if (input.checkedByUserId) {
    merchantUpdate.lastVerifiedBy = {
      connect: { id: input.checkedByUserId },
    }
  }

  if (input.bitcoinStatus === 'ACCEPTS') {
    merchantUpdate.acceptsBitcoin = true
  } else if (input.bitcoinStatus === 'DOES_NOT_ACCEPT') {
    merchantUpdate.acceptsBitcoin = false
  }

  return merchantUpdate
}