import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  HandCoins,
  Network,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { Container } from '@/components/layout/container'
import { generateMetadata } from '@/lib/metadata'
import { generalDonateHref, programs } from '@/lib/programs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { ProgramFocusCards } from '@/components/programs/program-focus-cards'

export const metadata: Metadata = generateMetadata({
  title: 'Programs',
  description:
    'Explore Afribit programs building a Bitcoin circular economy in Kibera through merchant onboarding, upcycling, waste incentives, and transport adoption.',
  path: '/programs',
  keywords: [
    'Kibera Bitcoin programs',
    'Afribit programs',
    'Bitcoin circular economy',
    'Lightning merchant onboarding',
    'community Bitcoin adoption Nairobi',
  ],
})

const operatingModel = [
  {
    icon: Wallet,
    title: 'Start With Utility',
    description:
      'Each program begins with a real local use case: transport, waste collection, market trade, or women-led production.',
  },
  {
    icon: Network,
    title: 'Create Circular Flow',
    description:
      'We connect households, merchants, and workers so Bitcoin is earned, spent, and reused inside the same neighborhood economy.',
  },
  {
    icon: ShieldCheck,
    title: 'Support Repeated Use',
    description:
      'Afribit stays close to the field with wallet support, training, and business onboarding so first use becomes repeat behavior.',
  },
]

export default function ProgramsPage() {
  return (
    <>
      <section className="section-hero relative overflow-hidden bg-bg-base">
        <div className="absolute inset-0 bg-grid-lines opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.14),transparent_28rem),radial-gradient(circle_at_right_center,rgba(0,135,81,0.12),transparent_24rem)]" aria-hidden />
        <Container className="relative z-10">
          <div className="max-w-3xl py-8 md:py-14">
            <Badge variant="secondary" className="mb-5">
              Programs
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
              Programs That Turn Bitcoin Into Daily Economic Infrastructure
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Afribit builds practical Bitcoin loops inside Kibera by backing merchants, women-led enterprise,
              environmental cleanup, and everyday transport with tools people can actually use.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <a href={generalDonateHref} target="_blank" rel="noreferrer">
                  Support the programs
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="#program-grid">Browse active programs</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section id="program-grid" className="section bg-bg-base">
        <Container>
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
              Active programs
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Four entry points into a circular Bitcoin economy
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Each program solves a local problem first, then uses Bitcoin to make value move faster,
              stay local longer, and reach more people with less friction.
            </p>
          </div>

          <ProgramFocusCards programs={programs} />

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-4">
            {programs.map((program) => (
              <CardSpotlight key={`${program.slug}-summary`} className="h-full p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                    {program.shortTitle}
                  </p>
                  <Badge variant="green">{program.statusLabel}</Badge>
                </div>
                <p className="mt-4 text-2xl font-display font-bold text-foreground">{program.impactValue}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{program.impactLabel}</p>
              </CardSpotlight>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-bg-surface/60 bg-grid-lines">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
                How the model works
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                Afribit programs are designed to make Bitcoin useful before they make it visible.
              </h2>
              <p className="mt-4 text-muted-foreground leading-8">
                The work is not abstract adoption theatre. Each program is a field-tested operating model for
                moving sats through real livelihoods, so people can earn, save, and spend with less dependence
                on expensive intermediaries.
              </p>
            </div>

            <div className="grid gap-5">
              {operatingModel.map((item) => (
                <CardSpotlight key={item.title} className="p-6 md:p-7">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-bitcoin/10">
                      <item.icon className="size-5 text-bitcoin" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardSpotlight>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-bg-base">
        <Container>
          <div className="rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(247,147,26,0.1),transparent_34rem)] px-6 py-8 sm:px-8 md:px-10 md:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
                  Support the next loop
                </p>
                <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                  Back the systems that let communities keep value in motion.
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground leading-8">
                  Funding helps Afribit expand wallet onboarding, deepen merchant support, coordinate field teams,
                  and reinforce the daily use cases that turn first transactions into durable local infrastructure.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 text-bitcoin">
                    <HandCoins className="size-5" />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">Funding priorities</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Merchant activation, recurring field support, training sessions, and neighborhood-level coordination.
                  </p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
                  <div className="relative h-40">
                    <Image
                      src="/Images/People collecting garbage.jpg"
                      alt="Afribit program work in Kibera"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 30vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                      <Sparkles className="size-5 text-panafrican-green" />
                      <span className="text-sm font-semibold uppercase tracking-[0.18em]">Grounded in real livelihoods</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-7 text-muted-foreground">
                      Afribit builds programs around work people already do: trade, transport, cleanup, production, and neighborhood trust.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={generalDonateHref} target="_blank" rel="noreferrer">
                  Donate to Afribit
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Talk to the team</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}