import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, Landmark, Zap } from 'lucide-react'
import { MerchantDirectoryClient } from '@/components/merchants/merchant-directory-client'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { listMerchants, getMerchantDirectoryStats } from '@/lib/content/merchants'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Merchants',
  description:
    'Discover Bitcoin-accepting businesses in Kibera, explore neighborhood merchant profiles, and support a circular economy growing through real local trade.',
  path: '/merchants',
  keywords: [
    'Kibera merchants',
    'Bitcoin merchant directory',
    'Afribit merchants',
    'Lightning payments Nairobi',
    'Bitcoin businesses Kibera',
  ],
})

export default async function MerchantsPage() {
  const [merchants, stats] = await Promise.all([listMerchants(), getMerchantDirectoryStats()])

  return (
    <>
      <section className="section-hero relative overflow-hidden bg-bg-base">
        <div className="absolute inset-0 bg-grid-lines opacity-35" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_28rem),radial-gradient(circle_at_right_center,rgba(0,107,66,0.16),transparent_26rem)]" aria-hidden />
        <Container className="relative z-10">
          <div className="grid gap-10 pb-10 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-5">
                Merchant Directory
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                Find the businesses helping Bitcoin move through <span className="text-bitcoin">daily life in Kibera</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Explore the shops, traders, riders, and local enterprises accepting Bitcoin in Kibera. Each listing helps visitors, community members, and supporters see how circular trade is growing on the ground.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-2xl font-display font-bold text-foreground">{stats.totalMerchants}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Active merchants</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-2xl font-display font-bold text-foreground">{stats.neighborhoodsCovered}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Neighborhood clusters</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-2xl font-display font-bold text-foreground">{stats.lightningEnabled}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Lightning-friendly listings</p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <a href="#merchant-directory">
                    Browse merchants
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <a href="https://www.afribit.africa/register" target="_blank" rel="noreferrer">
                    Register your business
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#141615] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-[1.45rem]">
                <Image
                  src="/Images/Mama mboga groceries accepting bitcoin2.jpg"
                  alt="Merchant in Kibera accepting Bitcoin payments"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/12 bg-black/35 p-5 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/95">
                    Bitcoin merchant visibility
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    The directory helps customers discover local businesses, gives donors visible proof of adoption, and gives merchants a stronger place inside the circular economy story.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-bg-surface/50 bg-grid-lines">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            <CardSpotlight className="h-full p-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-bitcoin/10">
                <Building2 className="size-5 text-bitcoin" />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-foreground">Built for real discovery</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                This page is designed to help people quickly find active Bitcoin-accepting businesses, not scroll through abstract impact claims.
              </p>
            </CardSpotlight>
            <CardSpotlight className="h-full p-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-panafrican-green/10">
                <Landmark className="size-5 text-panafrican-green" />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-foreground">Grounded in place</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Neighborhood labels, location context, and human-readable discovery come first, so the directory stays useful even while public pin policy is being finalized.
              </p>
            </CardSpotlight>
            <CardSpotlight className="h-full p-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-400/10">
                <Zap className="size-5 text-sky-400" />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-foreground">Quiet, fast controls</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Search, category, neighborhood, and payment filters help visitors narrow the list without fighting a heavy interface.
              </p>
            </CardSpotlight>
          </div>
        </Container>
      </section>

      <section id="merchant-directory" className="section bg-bg-base">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
              Search and filters
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Discover businesses by neighborhood, category, or payment style.
            </h2>
            <p className="mt-4 text-muted-foreground leading-8">
              Whether you are looking for a nearby merchant, checking how adoption is spreading, or exploring where sats can already be spent, the directory gives you a clear starting point.
            </p>
          </div>

          <MerchantDirectoryClient merchants={merchants} />
        </Container>
      </section>

      <section className="section bg-bg-surface/50 bg-grid-lines">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
                About this directory
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                A public window into Bitcoin trade already happening in Kibera.
              </h2>
              <p className="mt-4 text-muted-foreground leading-8">
                Afribit’s merchant directory exists to make discovery easier for customers, make adoption more visible for partners and donors, and give participating businesses a stronger digital presence in the wider Bitcoin ecosystem.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[#121513] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                Join the directory
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                If your business accepts Bitcoin or is ready to begin, Afribit can help with onboarding, visibility, and inclusion in the public merchant directory.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="https://www.afribit.africa/register" target="_blank" rel="noreferrer">
                    Register your business
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://btcmap.org/community/afribit-kibera" target="_blank" rel="noreferrer">
                    View on BTC Map
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}