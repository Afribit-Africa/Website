import { NextRequest, NextResponse } from 'next/server'
import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'
import { MerchantBitcoinStatus, MerchantOpenStatus, MerchantVerificationMethod } from '@prisma/client'
import { getAuthSession, isAdminRole } from '@/lib/auth'
import {
  buildMerchantSnapshotUpdate,
  collectVerificationIssues,
  isMerchantVerificationFresh,
} from '@/lib/admin/merchant-verifications'
import { prisma } from '@/lib/prisma'
import { createRateLimiter, getClientIp } from '@/lib/rate-limit'

const paramsSchema = z.object({
  merchantId: z.string().uuid('Merchant ID must be a valid UUID'),
})

const verificationCheckSchema = z.object({
  checkedAt: z.coerce.date().optional(),
  surveyDate: z.coerce.date().nullable().optional(),
  verificationMethod: z.nativeEnum(MerchantVerificationMethod),
  openStatus: z.nativeEnum(MerchantOpenStatus),
  bitcoinStatus: z.nativeEnum(MerchantBitcoinStatus),
  paymentLightningEnabled: z.boolean().nullable().optional(),
  paymentOnchainEnabled: z.boolean().nullable().optional(),
  paymentLightningContactlessEnabled: z.boolean().nullable().optional(),
  correctName: z.boolean().nullable().optional(),
  correctPhone: z.boolean().nullable().optional(),
  correctAddress: z.boolean().nullable().optional(),
  correctCategory: z.boolean().nullable().optional(),
  openingHours: z.string().trim().max(255).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  osmNodeId: z.string().trim().max(64).nullable().optional(),
  osmUrl: z.string().trim().url().max(2048).nullable().optional(),
  osmChangesetId: z.string().trim().max(64).nullable().optional(),
  osmVersion: z.number().int().positive().nullable().optional(),
  osmTimestamp: z.coerce.date().nullable().optional(),
  sourceRef: z.string().trim().max(255).nullable().optional(),
})

const adminVerificationWriteLimiter = createRateLimiter('admin-verification-write')

function formatVerificationMethodLabel(method: MerchantVerificationMethod): string {
  return method.toLowerCase().replace(/_/g, ' ')
}

async function requireAdminSession() {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    }
  }

  if (!isAdminRole(session.user.role)) {
    return {
      session: null,
      response: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { session, response: null }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ merchantId: string }> }
) {
  try {
    const auth = await requireAdminSession()
    if (auth.response) {
      return auth.response
    }

    const { merchantId } = paramsSchema.parse(await params)

    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        status: true,
        openStatus: true,
        bitcoinStatus: true,
        paymentLightningEnabled: true,
        paymentOnchainEnabled: true,
        paymentLightningContactlessEnabled: true,
        openingHours: true,
        osmNodeId: true,
        osmUrl: true,
        osmChangesetId: true,
        osmSourceRef: true,
        lastVerifiedAt: true,
        lastSurveyedAt: true,
        lastVerificationMethod: true,
        lastVerifiedByName: true,
        verificationNotes: true,
        verificationChecks: {
          orderBy: { checkedAt: 'desc' },
          take: 25,
          select: {
            id: true,
            checkedAt: true,
            surveyDate: true,
            verificationMethod: true,
            checkedByName: true,
            openStatus: true,
            bitcoinStatus: true,
            paymentLightningEnabled: true,
            paymentOnchainEnabled: true,
            paymentLightningContactlessEnabled: true,
            correctName: true,
            correctPhone: true,
            correctAddress: true,
            correctCategory: true,
            openingHours: true,
            notes: true,
            osmNodeId: true,
            osmUrl: true,
            osmChangesetId: true,
            osmVersion: true,
            osmTimestamp: true,
            sourceRef: true,
          },
        },
      },
    })

    if (!merchant) {
      return NextResponse.json(
        { success: false, error: 'Merchant not found' },
        { status: 404 }
      )
    }

    const issues = collectVerificationIssues(merchant)
    const fresh = isMerchantVerificationFresh(merchant)

    return NextResponse.json({
      success: true,
      data: {
        merchant: {
          ...merchant,
          issues,
          fresh,
        },
        checks: merchant.verificationChecks,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[admin-merchant-verification-history] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ merchantId: string }> }
) {
  try {
    const auth = await requireAdminSession()
    if (auth.response || !auth.session) {
      return auth.response
    }

    try {
      await adminVerificationWriteLimiter.consume(`${auth.session.user.id}:${getClientIp(request)}`)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Too many verification updates' },
        { status: 429 }
      )
    }

    const { merchantId } = paramsSchema.parse(await params)
    const rawBody = await request.json()
    const data = verificationCheckSchema.parse(rawBody)
    const checkedAt = data.checkedAt ?? new Date()

    if (data.surveyDate && data.surveyDate.getTime() > checkedAt.getTime()) {
      return NextResponse.json(
        { success: false, error: 'Survey date cannot be after checkedAt' },
        { status: 400 }
      )
    }

    const checkedByName = auth.session.user.name?.trim() || auth.session.user.email || 'Afribit Admin'
    const sanitizedNotes = data.notes
      ? sanitizeHtml(data.notes, { allowedTags: [], allowedAttributes: {} }).trim()
      : null
    const noteSummary =
      sanitizedNotes ||
      `Manual ${formatVerificationMethodLabel(data.verificationMethod)} verification recorded by ${checkedByName}.`

    const result = await prisma.$transaction(async (transaction) => {
      const merchant = await transaction.merchant.findUnique({
        where: { id: merchantId },
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          status: true,
          paymentLightningEnabled: true,
          paymentOnchainEnabled: true,
          paymentLightningContactlessEnabled: true,
          openingHours: true,
          osmNodeId: true,
          osmUrl: true,
          osmChangesetId: true,
          osmSourceRef: true,
          lastVerifiedAt: true,
          lastSurveyedAt: true,
          lastVerificationMethod: true,
          lastVerifiedByName: true,
          openStatus: true,
          bitcoinStatus: true,
          verificationNotes: true,
        },
      })

      if (!merchant) {
        return null
      }

      const snapshotInput = {
        checkedAt,
        surveyDate: data.surveyDate ?? null,
        verificationMethod: data.verificationMethod,
        checkedByUserId: auth.session.user.id,
        checkedByName,
        openStatus: data.openStatus,
        bitcoinStatus: data.bitcoinStatus,
        paymentLightningEnabled:
          data.paymentLightningEnabled !== undefined
            ? data.paymentLightningEnabled
            : merchant.paymentLightningEnabled,
        paymentOnchainEnabled:
          data.paymentOnchainEnabled !== undefined
            ? data.paymentOnchainEnabled
            : merchant.paymentOnchainEnabled,
        paymentLightningContactlessEnabled:
          data.paymentLightningContactlessEnabled !== undefined
            ? data.paymentLightningContactlessEnabled
            : merchant.paymentLightningContactlessEnabled,
        openingHours: data.openingHours !== undefined ? data.openingHours : merchant.openingHours,
        notes: noteSummary,
        osmNodeId: data.osmNodeId !== undefined ? data.osmNodeId : merchant.osmNodeId,
        osmUrl: data.osmUrl !== undefined ? data.osmUrl : merchant.osmUrl,
        osmChangesetId:
          data.osmChangesetId !== undefined ? data.osmChangesetId : merchant.osmChangesetId,
        sourceRef: data.sourceRef !== undefined ? data.sourceRef : merchant.osmSourceRef,
      }

      const check = await transaction.merchantVerificationCheck.create({
        data: {
          merchantId,
          checkedAt,
          surveyDate: data.surveyDate ?? null,
          verificationMethod: data.verificationMethod,
          checkedByUserId: auth.session.user.id,
          checkedByName,
          openStatus: data.openStatus,
          bitcoinStatus: data.bitcoinStatus,
          paymentLightningEnabled: snapshotInput.paymentLightningEnabled,
          paymentOnchainEnabled: snapshotInput.paymentOnchainEnabled,
          paymentLightningContactlessEnabled: snapshotInput.paymentLightningContactlessEnabled,
          correctName: data.correctName ?? null,
          correctPhone: data.correctPhone ?? null,
          correctAddress: data.correctAddress ?? null,
          correctCategory: data.correctCategory ?? null,
          openingHours: snapshotInput.openingHours,
          notes: noteSummary,
          osmNodeId: snapshotInput.osmNodeId,
          osmUrl: snapshotInput.osmUrl,
          osmChangesetId: snapshotInput.osmChangesetId,
          osmVersion: data.osmVersion ?? null,
          osmTimestamp: data.osmTimestamp ?? null,
          sourceRef: snapshotInput.sourceRef,
        },
        select: {
          id: true,
          checkedAt: true,
          surveyDate: true,
          verificationMethod: true,
          checkedByName: true,
          openStatus: true,
          bitcoinStatus: true,
          paymentLightningEnabled: true,
          paymentOnchainEnabled: true,
          paymentLightningContactlessEnabled: true,
          correctName: true,
          correctPhone: true,
          correctAddress: true,
          correctCategory: true,
          openingHours: true,
          notes: true,
          osmNodeId: true,
          osmUrl: true,
          osmChangesetId: true,
          osmVersion: true,
          osmTimestamp: true,
          sourceRef: true,
        },
      })

      const updatedMerchant = await transaction.merchant.update({
        where: { id: merchantId },
        data: buildMerchantSnapshotUpdate(snapshotInput),
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          status: true,
          openStatus: true,
          bitcoinStatus: true,
          paymentLightningEnabled: true,
          paymentOnchainEnabled: true,
          paymentLightningContactlessEnabled: true,
          openingHours: true,
          osmNodeId: true,
          osmUrl: true,
          osmChangesetId: true,
          osmSourceRef: true,
          lastVerifiedAt: true,
          lastSurveyedAt: true,
          lastVerificationMethod: true,
          lastVerifiedByName: true,
          verificationNotes: true,
        },
      })

      return {
        check,
        merchant: updatedMerchant,
      }
    })

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Merchant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          merchant: {
            ...result.merchant,
            issues: collectVerificationIssues(result.merchant),
            fresh: isMerchantVerificationFresh(result.merchant),
          },
          check: result.check,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[admin-merchant-verification-create] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}