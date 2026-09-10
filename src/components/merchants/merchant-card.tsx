import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import type { MerchantProfile } from '@/types'

interface MerchantCardProps {
  merchant: MerchantProfile
  className?: string
}

/**
 * Canonical merchant directory card — used by `MerchantDirectoryClient`'s
 * list view. Extracted so the markup has one source of truth (see
 * `docs/design/design-improvement-plan.md` §4.3.4) and can be reused by a
 * future skeleton/loading state or other merchant listings.
 */
export function MerchantCard({ merchant, className }: MerchantCardProps) {
  return (
    <CardSpotlight className={`h-full overflow-hidden border-white/8 bg-bg-surface/90 p-0 ${className ?? ''}`}>
      <div className="relative h-56 overflow-hidden">
        <Image
          src={merchant.image || '/Images/Mama mboga groceries accepting bitcoin.jpg'}
          alt={merchant.name}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
          <Badge variant={merchant.featured ? 'default' : 'secondary'}>
            {merchant.featured ? 'Featured' : merchant.category}
          </Badge>
          {merchant.acceptsBitcoin ? <Badge variant="green">Accepts Bitcoin</Badge> : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
            {merchant.neighborhood || merchant.locationLabel || 'Kibera'}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">{merchant.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm leading-7 text-muted-foreground">{merchant.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {merchant.paymentMethods.slice(0, 3).map((method) => (
            <span
              key={method}
              className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/75"
            >
              {method}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/45">Location</p>
            <p className="mt-1 text-sm text-foreground/85">
              {[merchant.neighborhood, merchant.city].filter(Boolean).join(', ') ||
                merchant.country ||
                'Kibera, Nairobi'}
            </p>
          </div>
          <Button asChild variant="outline" className="border-white/10 bg-black/20">
            <Link href={`/merchants/${merchant.slug}`}>
              View profile
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </CardSpotlight>
  )
}
