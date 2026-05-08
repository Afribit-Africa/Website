import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Store,
  Zap,
} from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { generateMetadata as buildMetadata } from '@/lib/metadata'
import {
  getMerchantBySlug,
  listMerchantSlugs,
  listRelatedMerchants,
} from '@/lib/content/merchants'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return 'Verification date not available'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function locationText(parts: Array<string | null | undefined>) {
  const value = parts.filter(Boolean).join(', ')
  return value || 'Kibera, Nairobi, Kenya'
}

export async function generateStaticParams() {
  const slugs = await listMerchantSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const merchant = await getMerchantBySlug(slug)

  if (!merchant) {
    return buildMetadata({
      title: 'Merchant Not Found',
      description: 'This merchant profile could not be found in the Afribit directory.',
      path: `/merchants/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: merchant.name,
    description: merchant.summary,
    path: `/merchants/${merchant.slug}`,
    image: merchant.image || '/Images/Hero section video background fallback.png',
    keywords: [
      'Afribit merchant',
      'Bitcoin merchant Kibera',
      merchant.name,
      merchant.category,
    ],
  })
}

export default async function MerchantDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [merchant, relatedMerchants] = await Promise.all([
    getMerchantBySlug(slug),
    listRelatedMerchants(slug, 3),
  ])

  if (!merchant) {
    notFound()
  }

  const primaryLocation = merchant.locationLabel || locationText([
    merchant.neighborhood,
    merchant.city,
    merchant.country,
  ])
  const verificationLine = merchant.lastVerifiedByName
    ? `Last verified by ${merchant.lastVerifiedByName} on ${formatDate(merchant.lastVerifiedAt)}`
    : `Last verified on ${formatDate(merchant.lastVerifiedAt)}`

  return (
    <>
      <section className="section-hero relative overflow-hidden bg-bg-base">
        <div className="absolute inset-0 bg-grid-lines opacity-35" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(247,147,26,0.18),transparent_24rem),radial-gradient(circle_at_right_center,rgba(0,135,81,0.16),transparent_24rem)]"
          aria-hidden
        />
        <Container className="relative z-10">
          <div className="mb-6 pt-8">
            <Link
              href="/merchants"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to merchants
            </Link>
          </div>

          <div className="grid gap-8 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <Badge variant="secondary">Merchant Profile</Badge>
                <Badge variant={merchant.featured ? 'default' : 'outline'}>
                  {merchant.featured ? 'Featured merchant' : merchant.category}
                </Badge>
                {merchant.acceptsBitcoin ? <Badge variant="green">Accepts Bitcoin</Badge> : null}
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                {merchant.name}
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
                {merchant.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {merchant.paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-foreground/80"
                  >
                    {method}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Category</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{merchant.category}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Location</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{primaryLocation}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Verification</p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    {merchant.btcmapUrl ? 'Listed on BTC Map' : 'Afribit directory profile'}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {merchant.btcmapUrl ? (
                  <Button asChild size="lg">
                    <a href={merchant.btcmapUrl} target="_blank" rel="noreferrer">
                      View on BTC Map
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                ) : null}
                {merchant.osmLink ? (
                  <Button asChild variant="outline" size="lg">
                    <a href={merchant.osmLink} target="_blank" rel="noreferrer">
                      OpenStreetMap listing
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                ) : null}
                {!merchant.btcmapUrl && !merchant.osmLink ? (
                  <Button asChild variant="outline" size="lg">
                    <a href="https://btcmap.org/community/afribit-kibera" target="_blank" rel="noreferrer">
                      Afribit on BTC Map
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] p-3">
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.35rem]">
                <Image
                  src={merchant.image || '/Images/Hero section video background fallback.png'}
                  alt={merchant.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/12 bg-black/35 p-4 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                    Local Bitcoin commerce
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    {merchant.description || merchant.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-bg-base">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <CardSpotlight className="h-full p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-bitcoin/10 text-bitcoin">
                  <Store className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">About this merchant</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-foreground">What they offer</h2>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                {merchant.description || merchant.summary}
              </p>
              {merchant.services.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {merchant.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-foreground/80"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              ) : null}
            </CardSpotlight>

            <CardSpotlight className="h-full p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-panafrican-green/10 text-panafrican-green">
                  <Zap className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Payment details</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-foreground">Spend sats with confidence</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Bitcoin status</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {merchant.acceptsBitcoin ? 'Accepts Bitcoin payments' : 'Bitcoin acceptance not confirmed'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Lightning</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {merchant.paymentLightningEnabled || merchant.paymentMethods.some((method) => method.toLowerCase().includes('lightning'))
                      ? 'Lightning-friendly'
                      : 'Check payment methods before visiting'}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {merchant.paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-xs font-medium text-white/75"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </CardSpotlight>
          </div>
        </Container>
      </section>

      <section className="section bg-bg-surface/50 bg-grid-lines">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <CardSpotlight className="h-full p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-400">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Location</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-foreground">Where to find them</h2>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{primaryLocation}</p>
              {merchant.address ? (
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{merchant.address}</p>
              ) : null}

              <div className="mt-6 grid gap-3">
                {merchant.phone ? (
                  <a href={`tel:${merchant.phone}`} className="inline-flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-foreground transition-colors hover:border-bitcoin/40">
                    <Phone className="size-4 text-bitcoin" />
                    {merchant.phone}
                  </a>
                ) : null}
                {merchant.email ? (
                  <a href={`mailto:${merchant.email}`} className="inline-flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-foreground transition-colors hover:border-bitcoin/40">
                    <Mail className="size-4 text-bitcoin" />
                    {merchant.email}
                  </a>
                ) : null}
                {merchant.btcmapUrl ? (
                  <a href={merchant.btcmapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-foreground transition-colors hover:border-bitcoin/40">
                    <MapPin className="size-4 text-bitcoin" />
                    Open the BTC Map listing
                  </a>
                ) : null}
              </div>
            </CardSpotlight>

            <CardSpotlight className="h-full p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">Verification and directory context</p>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground">Why this profile is here</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Afribit’s merchant pages help customers, donors, and partners see where Bitcoin is already in use inside Kibera’s local economy.
              </p>
              <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm font-semibold text-foreground">{verificationLine}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {merchant.verificationNotes || 'This profile is part of the Afribit merchant directory and linked to public ecosystem discovery surfaces where available.'}
                </p>
              </div>
            </CardSpotlight>
          </div>
        </Container>
      </section>

      <section className="section bg-bg-base">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">Nearby discovery</p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Explore more Bitcoin merchants in the network.
            </h2>
            <p className="mt-4 text-muted-foreground leading-8">
              Keep exploring Kibera’s merchant network to see how Bitcoin commerce is taking shape across different sectors and neighborhoods.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedMerchants.map((candidate) => (
              <CardSpotlight key={candidate.slug} className="h-full overflow-hidden p-0">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={candidate.image || '/Images/Hero section video background fallback.png'}
                    alt={candidate.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                      {candidate.neighborhood || candidate.locationLabel || 'Kibera'}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white">{candidate.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-7 text-muted-foreground">{candidate.summary}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-sm text-foreground/80">{candidate.category}</p>
                    <Button asChild variant="outline" className="border-white/10 bg-black/20">
                      <Link href={`/merchants/${candidate.slug}`}>
                        View profile
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}