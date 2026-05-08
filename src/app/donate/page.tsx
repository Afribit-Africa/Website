import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight, BadgeCheck, Bitcoin, HandCoins, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { DonateExperience } from '@/components/donations/donate-experience'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { generateMetadata } from '@/lib/metadata'
import { donationFaqs, donationTiers } from '@/lib/donation-tiers'
import { getStoreStats } from '@/lib/btcpay'

const CROWDFUND_URL =
  'https://pay.afribit.africa/apps/2xYtsTMHMqYv6qozQ8j9zjP66FiR/crowdfund'

export const metadata: Metadata = generateMetadata({
  title: 'Donate',
  description:
    'Fuel the Bitcoin revolution in Kibera. Support merchant growth, education, cleanups, upcycling, and community resilience through Afribit’s Bitcoin-native donation flow.',
  path: '/donate',
  keywords: [
    'donate Afribit',
    'Bitcoin donation Kibera',
    'support Bitcoin circular economy',
    'Afribit fundraiser',
    'donate to Kibera programs',
  ],
})

const GOAL = 100_000

const whyDonate = [
  {
    title: 'Keep value circulating locally',
    description:
      'Your gift helps sats move through real livelihoods in Kibera, from neighborhood trade and rider incomes to cleanup crews and women-led production.',
    icon: Bitcoin,
  },
  {
    title: 'Fund practical adoption',
    description:
      'You are funding the tools, training, equipment, and hands-on support that turn first-time users into repeat participants in a working circular economy.',
    icon: HandCoins,
  },
  {
    title: 'Support verifiable infrastructure',
    description:
      'Your contribution moves through a Bitcoin-native payment flow and supports work that can be followed through public ecosystem references and visible community outcomes.',
    icon: ShieldCheck,
  },
]

async function getDonationStats() {
  const stats = await getStoreStats()

  if (!stats) {
    return {
      totalRaised: 2820.2,
      totalDonations: 77,
      currency: 'USD',
    }
  }

  return stats
}

export default async function DonatePage() {
  const stats = await getDonationStats()
  const percent = Math.min((stats.totalRaised / GOAL) * 100, 100)

  return (
    <>
      <section className="section-hero relative overflow-hidden bg-bg-base">
        <div className="absolute inset-0 bg-grid-lines opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_28rem),radial-gradient(circle_at_right_center,rgba(0,107,66,0.16),transparent_26rem)]" aria-hidden />
        <Container className="relative z-10">
          <div className="grid gap-10 pb-10 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-5">
                Donate
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                Fuel the <span className="text-bitcoin">Bitcoin Revolution</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Your contribution powers financial freedom, environmental stewardship, and community resilience in Kibera.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-2xl font-display font-bold text-foreground">
                    ${stats.totalRaised.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Raised so far</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-2xl font-display font-bold text-foreground">{stats.totalDonations}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Contributors</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-2xl font-display font-bold text-foreground">{percent.toFixed(1)}%</p>
                  <p className="mt-2 text-sm text-muted-foreground">Of $100,000 goal</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <a href="#choose-impact">
                    Choose your impact
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <a href={CROWDFUND_URL} target="_blank" rel="noreferrer">
                    Visit Afribit Crowdfund
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#141615] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-[1.45rem]">
                <Image
                  src="/Images/Person scanning to pay in bitcoin2.jpg"
                  alt="Afribit supporter making a Bitcoin payment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/12 bg-black/35 p-5 backdrop-blur-md">
                  <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-bitcoin to-[#ffb05f]"
                      style={{ width: `${Math.max(percent, 1)}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/95">
                    Live campaign momentum
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    Every contribution strengthens merchant growth, training, waste incentives, and community resilience already taking root across Kibera.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-bg-surface/50 bg-grid-lines">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
              Why donate
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Give to a working circular economy, not a detached campaign promise.
            </h2>
            <p className="mt-4 text-muted-foreground leading-8">
              Afribit’s donation flow is tied to concrete work already happening in Kibera: onboarding merchants, equipping women-led enterprise, rewarding cleanup crews, and opening new financial paths for riders and families.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {whyDonate.map((item) => (
              <CardSpotlight key={item.title} className="h-full p-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-bitcoin/10">
                  <item.icon className="size-5 text-bitcoin" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </CardSpotlight>
            ))}
          </div>
        </Container>
      </section>

      <section id="choose-impact" className="section bg-bg-base">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
              Choose your impact
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Select a tier that resonates with you or contribute a custom amount.
            </h2>
            <p className="mt-4 text-muted-foreground leading-8">
              The live site frames this as a donor card grid, not a pricing table. Each option reflects a different way to strengthen Afribit’s Bitcoin-native work on the ground.
            </p>
          </div>

          <DonateExperience tiers={donationTiers} />
        </Container>
      </section>

      <section className="section bg-bg-surface/50 bg-grid-lines">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
                Trust and transparency
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                Give with confidence and follow the work beyond the checkout screen.
              </h2>
              <p className="mt-4 text-muted-foreground leading-8">
                Afribit uses a Bitcoin-native checkout flow so more of your support goes directly toward the work. Around that payment flow, you can follow community proof, partner references, and the public ecosystem that surrounds this mission in Kibera.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 text-bitcoin">
                    <BadgeCheck className="size-5" />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">Bitcoin-native payment</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Your donation goes through BTCPay Server, giving you a direct Bitcoin payment path without relying on a conventional payment processor.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 text-panafrican-green">
                    <ShieldCheck className="size-5" />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">Community accountability</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    BTC Map, Geyser, Bitcoin Confederation, and visible local program work offer real-world context for the ecosystem your contribution is helping to strengthen.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[#121513] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                Quick references
              </p>
              <div className="mt-5 grid gap-3 text-sm text-muted-foreground">
                <a className="rounded-xl border border-white/8 px-4 py-3 transition-colors hover:border-bitcoin/40 hover:text-foreground" href={CROWDFUND_URL} target="_blank" rel="noreferrer">Afribit Crowdfund</a>
                <a className="rounded-xl border border-white/8 px-4 py-3 hover:border-bitcoin/40 hover:text-foreground transition-colors" href="https://btcmap.org/community/afribit-kibera" target="_blank" rel="noreferrer">BTC Map Community</a>
                <a className="rounded-xl border border-white/8 px-4 py-3 hover:border-bitcoin/40 hover:text-foreground transition-colors" href="https://staging.geyser.fund/project/afribitkibera" target="_blank" rel="noreferrer">Geyser Fund</a>
                <a className="rounded-xl border border-white/8 px-4 py-3 hover:border-bitcoin/40 hover:text-foreground transition-colors" href="https://bitcoinconfederation.org/hub/afribit-kibera/" target="_blank" rel="noreferrer">Bitcoin Confederation</a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-bg-base">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
                Support and answers
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                Common donor questions, answered clearly.
              </h2>
              <p className="mt-4 text-muted-foreground leading-8">
                These answers are here to help you choose how to give, understand what your support can power, and know what to expect before you head to checkout.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-bg-surface/70 px-6 py-3">
              <Accordion type="single" collapsible>
                {donationFaqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}