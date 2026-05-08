import 'server-only'

import { Prisma, MerchantStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { MerchantProfile } from '@/types'

export interface MerchantFilters {
  search?: string
  category?: string
  neighborhood?: string
  paymentMethod?: string
  featuredOnly?: boolean
}

type MerchantRecord = Prisma.MerchantGetPayload<{
  include: {
    program: {
      select: {
        slug: true
      }
    }
  }
}>

type MerchantSupplementalRecord = {
  slug: string
  osmUrl: string | null
  btcmapUrl: string | null
  openStatus: string | null
  bitcoinStatus: string | null
  paymentLightningEnabled: boolean | null
  paymentOnchainEnabled: boolean | null
  paymentLightningContactlessEnabled: boolean | null
  openingHours: string | null
  lastVerifiedAt: Date | null
  lastVerifiedByName: string | null
  verificationNotes: string | null
}

function parseTextArray(value: string | null | undefined): string[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    }
  } catch {
    // fall back to delimiter parsing below
  }

  return value
    .split(/,|\n|;/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function fallbackMerchantImage(category: string) {
  const normalized = category.toLowerCase()

  if (normalized.includes('transport') || normalized.includes('boda')) {
    return '/Images/Motorbike bitcoin onboarding.jpg'
  }

  if (normalized.includes('waste') || normalized.includes('clean')) {
    return '/Images/Waste Collection.jpg'
  }

  if (normalized.includes('grocery') || normalized.includes('food') || normalized.includes('retail')) {
    return '/Images/Mama mboga groceries accepting bitcoin.jpg'
  }

  return '/Images/Person scanning to pay in bitcoin2.jpg'
}

function deriveBtcmapUrl(osmUrl: string | null, btcmapUrl: string | null) {
  if (btcmapUrl) {
    return btcmapUrl
  }

  if (!osmUrl) {
    return null
  }

  const match = osmUrl.match(/node\/(\d+)/)
  return match ? `https://btcmap.org/merchant/node:${match[1]}` : null
}

async function getMerchantSupplementalMap(slugs: string[]) {
  if (slugs.length === 0) {
    return new Map<string, MerchantSupplementalRecord>()
  }

  const rows = await prisma.$queryRaw<MerchantSupplementalRecord[]>(Prisma.sql`
    select
      "slug",
      "osmUrl",
      "btcmapUrl",
      "openStatus",
      "bitcoinStatus",
      "paymentLightningEnabled",
      "paymentOnchainEnabled",
      "paymentLightningContactlessEnabled",
      "openingHours",
      "lastVerifiedAt",
      "lastVerifiedByName",
      "verificationNotes"
    from merchants
    where "slug" in (${Prisma.join(slugs)})
  `)

  return new Map(rows.map((row) => [row.slug, row]))
}

function toMerchantProfile(
  merchant: MerchantRecord,
  supplemental?: MerchantSupplementalRecord
): MerchantProfile {
  return {
    id: merchant.id,
    slug: merchant.slug,
    name: merchant.name,
    category: merchant.category,
    summary: merchant.summary,
    description: merchant.description,
    locationLabel: merchant.locationLabel,
    neighborhood: merchant.neighborhood,
    city: merchant.city,
    country: merchant.country,
    latitude: merchant.latitude ? Number(merchant.latitude) : null,
    longitude: merchant.longitude ? Number(merchant.longitude) : null,
    address: merchant.address,
    phone: merchant.phone,
    email: merchant.email,
    image: merchant.primaryImage || fallbackMerchantImage(merchant.category),
    videoUrl: merchant.videoUrl || undefined,
    youtubeId: merchant.youtubeId || undefined,
    acceptsBitcoin: merchant.acceptsBitcoin,
    services: parseTextArray(merchant.services),
    paymentMethods: parseTextArray(merchant.paymentMethods),
    featured: merchant.featured,
    programSlug: merchant.program?.slug || null,
    btcpayUrl: merchant.btcpayUrl,
    osmLink: supplemental?.osmUrl || null,
    btcmapUrl: deriveBtcmapUrl(supplemental?.osmUrl || null, supplemental?.btcmapUrl || null),
    openStatus: supplemental?.openStatus || null,
    bitcoinStatus: supplemental?.bitcoinStatus || null,
    paymentLightningEnabled: supplemental?.paymentLightningEnabled ?? null,
    paymentOnchainEnabled: supplemental?.paymentOnchainEnabled ?? null,
    paymentLightningContactlessEnabled: supplemental?.paymentLightningContactlessEnabled ?? null,
    openingHours: supplemental?.openingHours ?? null,
    lastVerifiedAt: supplemental?.lastVerifiedAt ?? null,
    lastVerifiedByName: supplemental?.lastVerifiedByName ?? null,
    verificationNotes: supplemental?.verificationNotes ?? null,
  }
}

export async function listMerchants(filters: MerchantFilters = {}): Promise<MerchantProfile[]> {
  try {
    const merchants = await prisma.merchant.findMany({
      where: {
        status: MerchantStatus.ACTIVE,
        featured: filters.featuredOnly || undefined,
        category: filters.category || undefined,
        neighborhood: filters.neighborhood || undefined,
        OR: filters.search
          ? [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { summary: { contains: filters.search, mode: 'insensitive' } },
              { category: { contains: filters.search, mode: 'insensitive' } },
              { neighborhood: { contains: filters.search, mode: 'insensitive' } },
              { city: { contains: filters.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        program: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    })

    const supplementalMap = await getMerchantSupplementalMap(merchants.map((merchant) => merchant.slug))
    const profiles = merchants.map((merchant) => toMerchantProfile(merchant, supplementalMap.get(merchant.slug)))

    if (!filters.paymentMethod) {
      return profiles
    }

    const needle = filters.paymentMethod.toLowerCase()
    return profiles.filter((merchant) =>
      merchant.paymentMethods.some((method) => method.toLowerCase().includes(needle))
    )
  } catch (error) {
    console.error('Failed to load merchants:', error)
    return []
  }
}

export async function listFeaturedMerchants(): Promise<MerchantProfile[]> {
  return listMerchants({ featuredOnly: true })
}

export async function getMerchantBySlug(slug: string): Promise<MerchantProfile | undefined> {
  try {
    const merchant = await prisma.merchant.findFirst({
      where: {
        slug,
        status: MerchantStatus.ACTIVE,
      },
      include: {
        program: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!merchant) {
      return undefined
    }

    const supplementalMap = await getMerchantSupplementalMap([merchant.slug])
    return toMerchantProfile(merchant, supplementalMap.get(merchant.slug))
  } catch (error) {
    console.error(`Failed to load merchant ${slug}:`, error)
    return undefined
  }
}

export async function listRelatedMerchants(slug: string, limit = 3): Promise<MerchantProfile[]> {
  const [merchant, merchants] = await Promise.all([getMerchantBySlug(slug), listMerchants()])

  if (!merchant) {
    return merchants.slice(0, limit)
  }

  return merchants
    .filter((candidate) => candidate.slug !== slug)
    .sort((left, right) => {
      const leftScore =
        Number(left.category === merchant.category) +
        Number(left.neighborhood === merchant.neighborhood) +
        Number(Boolean(left.btcmapUrl))
      const rightScore =
        Number(right.category === merchant.category) +
        Number(right.neighborhood === merchant.neighborhood) +
        Number(Boolean(right.btcmapUrl))

      return rightScore - leftScore
    })
    .slice(0, limit)
}

export async function listMerchantSlugs(): Promise<string[]> {
  const merchants = await listMerchants()
  return merchants.map((merchant) => merchant.slug)
}

export async function getMerchantDirectoryStats() {
  try {
    const merchants = await listMerchants()

    const neighborhoods = new Set(merchants.map((merchant) => merchant.neighborhood).filter(Boolean))
    const lightningEnabled = merchants.filter((merchant) =>
      merchant.paymentMethods.some((method) => method.toLowerCase().includes('lightning'))
    ).length

    return {
      totalMerchants: merchants.length,
      featuredMerchants: merchants.filter((merchant) => merchant.featured).length,
      neighborhoodsCovered: neighborhoods.size,
      lightningEnabled,
    }
  } catch {
    return {
      totalMerchants: 0,
      featuredMerchants: 0,
      neighborhoodsCovered: 0,
      lightningEnabled: 0,
    }
  }
}