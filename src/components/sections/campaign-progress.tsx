import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DonationStats {
  totalRaised: number
  totalDonations: number
  currency: string
}

const GOAL = 100_000

async function getStats(): Promise<DonationStats> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/donations/stats`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('failed')
    const json = await res.json()
    // API returns { success, data: { totalRaised, totalDonations, currency } }
    const d = json.data ?? json
    return {
      totalRaised: Number(d.totalRaised) || 2820.2,
      totalDonations: Number(d.totalDonations) || 77,
      currency: d.currency ?? 'USD',
    }
  } catch {
    return { totalRaised: 2820.2, totalDonations: 77, currency: 'USD' }
  }
}

export async function CampaignProgress() {
  const stats = await getStats()
  const percent = Math.min((stats.totalRaised / GOAL) * 100, 100)
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(stats.totalRaised)
  const goalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(GOAL)

  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* CometCard #1 — Campaign Progress */}
          <CardSpotlight className="p-8 sm:p-10" color="rgba(247,147,26,0.10)">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <Badge variant="default" className="mb-3">
                  Live Campaign
                </Badge>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Bitcoin Circular Economy Fund
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Every satoshi fuels merchants, training, and infrastructure in Kibera.
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-3xl sm:text-4xl font-bold text-bitcoin">
                  {formatted}
                </div>
                <div className="text-xs text-muted-foreground">
                  raised of {goalFormatted} goal
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-2 w-full rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-bitcoin to-bitcoin-dark transition-all duration-1000"
                  style={{ width: `${Math.max(percent, 1)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{percent.toFixed(1)}% funded</span>
                <span>{stats.totalDonations} contributors</span>
              </div>
            </div>

            {/* CTA */}
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/donate">
                Contribute Now
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardSpotlight>
        </div>
      </Container>
    </section>
  )
}
