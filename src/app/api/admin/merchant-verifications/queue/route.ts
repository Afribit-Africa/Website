import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthSession, isAdminRole } from '@/lib/auth'
import {
  DEFAULT_VERIFICATION_FRESHNESS_DAYS,
  collectVerificationIssues,
  isMerchantVerificationFresh,
} from '@/lib/admin/merchant-verifications'
import { prisma } from '@/lib/prisma'

const querySchema = z.object({
  freshWithinDays: z.coerce.number().int().min(1).max(730).optional(),
  includeResolved: z.enum(['true', 'false']).optional(),
})

function issuePriority(issues: string[]): number {
  if (issues.includes('missing_verification')) {
    return 4
  }

  if (issues.includes('stale_verification')) {
    return 3
  }

  if (issues.includes('merchant_not_open') || issues.includes('bitcoin_disabled')) {
    return 2
  }

  return issues.length > 0 ? 1 : 0
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdminRole(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const query = querySchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    const freshWithinDays = query.freshWithinDays ?? DEFAULT_VERIFICATION_FRESHNESS_DAYS
    const includeResolved = query.includeResolved === 'true'

    const merchants = await prisma.merchant.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'DRAFT', 'INACTIVE'],
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        status: true,
        openStatus: true,
        bitcoinStatus: true,
        lastVerifiedAt: true,
        lastSurveyedAt: true,
        lastVerificationMethod: true,
        lastVerifiedByName: true,
        openingHours: true,
        osmNodeId: true,
        osmUrl: true,
        verificationNotes: true,
        verificationChecks: {
          orderBy: { checkedAt: 'desc' },
          take: 1,
          select: {
            id: true,
            checkedAt: true,
            surveyDate: true,
            verificationMethod: true,
            checkedByName: true,
            openStatus: true,
            bitcoinStatus: true,
            notes: true,
          },
        },
      },
    })

    const items = merchants
      .map((merchant) => {
        const issues = collectVerificationIssues(merchant, freshWithinDays)
        const fresh = isMerchantVerificationFresh(merchant, freshWithinDays)

        return {
          ...merchant,
          fresh,
          issues,
          latestCheck: merchant.verificationChecks[0] ?? null,
        }
      })
      .filter((merchant) => includeResolved || merchant.issues.length > 0)
      .sort((left, right) => {
        const priorityDelta = issuePriority(right.issues) - issuePriority(left.issues)

        if (priorityDelta !== 0) {
          return priorityDelta
        }

        return left.name.localeCompare(right.name)
      })

    const summary = {
      totalMerchants: merchants.length,
      queueCount: items.length,
      staleCount: merchants.filter((merchant) =>
        collectVerificationIssues(merchant, freshWithinDays).includes('stale_verification')
      ).length,
      missingVerificationCount: merchants.filter((merchant) => !merchant.lastVerifiedAt).length,
      missingOsmNodeCount: merchants.filter((merchant) => !merchant.osmNodeId).length,
      closedCount: merchants.filter((merchant) =>
        collectVerificationIssues(merchant, freshWithinDays).includes('merchant_not_open')
      ).length,
      bitcoinDisabledCount: merchants.filter((merchant) => merchant.bitcoinStatus === 'DOES_NOT_ACCEPT').length,
    }

    return NextResponse.json({
      success: true,
      data: {
        items,
        summary,
        freshWithinDays,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[admin-merchant-verifications-queue] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}