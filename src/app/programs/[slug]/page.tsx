import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ExternalLink, Quote } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { generateMetadata as buildMetadata } from '@/lib/metadata'
import { getProgramBySlug, programs } from '@/lib/programs'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const program = getProgramBySlug(slug)

  if (!program) {
    return buildMetadata({
      title: 'Program Not Found',
      description: 'This Afribit program could not be found.',
      path: `/programs/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: program.title,
    description: program.summary,
    path: `/programs/${program.slug}`,
    image: program.imageSrc,
    keywords: [
      'Afribit program',
      'Kibera Bitcoin circular economy',
      program.title,
      program.shortTitle,
    ],
  })
}

function SectionGrid({
  items,
  variant,
}: {
  items: { title: string; description?: string; value?: string }[]
  variant: 'cards' | 'steps' | 'metrics' | 'tags'
}) {
  if (variant === 'tags') {
    return (
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-foreground"
          >
            {item.title}
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'steps') {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-bitcoin/10 text-sm font-semibold text-bitcoin">
              {index + 1}
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <CardSpotlight key={item.title} className="h-full p-6">
          {item.value ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">{item.value}</p>
          ) : null}
          <h3 className="mt-3 font-display text-xl font-bold text-foreground">{item.title}</h3>
          {item.description ? (
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
          ) : null}
        </CardSpotlight>
      ))}
    </div>
  )
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params
  const program = getProgramBySlug(slug)

  if (!program) {
    notFound()
  }

  return (
    <>
      <section className="section-hero relative overflow-hidden bg-bg-base">
        <div className="absolute inset-0 bg-grid-lines opacity-35" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(247,147,26,0.18),transparent_25rem),radial-gradient(circle_at_right_top,rgba(0,135,81,0.12),transparent_24rem)]" aria-hidden />
        <Container className="relative z-10">
          <div className="mb-6 pt-8">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to programs
            </Link>
          </div>

          <div className="grid gap-8 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-5">
                {program.statusLabel}
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                {program.heroTitle}
              </h1>
              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                {program.heroDescription}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {program.heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <p className="text-2xl font-display font-bold text-foreground">{metric.value}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href={program.donationHref} target="_blank" rel="noreferrer">
                    {program.donationLabel}
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  {program.secondaryCtaHref.startsWith('http') ? (
                    <a href={program.secondaryCtaHref} target="_blank" rel="noreferrer">
                      {program.secondaryCtaLabel}
                    </a>
                  ) : (
                    <Link href={program.secondaryCtaHref}>{program.secondaryCtaLabel}</Link>
                  )}
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] p-3">
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.35rem]">
                <Image
                  src={program.imageSrc}
                  alt={program.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/12 bg-black/35 p-4 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                    Circular resilience in practice
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    {program.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-bg-base">
        <Container>
          <div className="rounded-[2rem] border border-white/8 bg-bg-surface/70 px-6 py-8 md:px-8">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-bitcoin/10 text-bitcoin">
                <Quote className="size-5" />
              </div>
              <div>
                <p className="text-base leading-8 text-foreground/90">“{program.quote.text}”</p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                  {program.quote.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{program.quote.role}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {program.sections.map((section, index) => (
        <section
          key={section.id}
          className={index % 2 === 0 ? 'section bg-bg-surface/50 bg-grid-lines' : 'section bg-bg-base'}
        >
          <Container>
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
                {section.eyebrow}
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {section.title}
              </h2>
              {section.intro ? (
                <p className="mt-4 text-muted-foreground leading-8">{section.intro}</p>
              ) : null}
            </div>

            <SectionGrid items={section.items} variant={section.variant} />
          </Container>
        </section>
      ))}

      <section className="section bg-bg-base">
        <Container>
          <div className="rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(247,147,26,0.12),transparent_30rem)] px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
                  Support this work
                </p>
                <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {program.supportTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground leading-8">
                  {program.supportDescription}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Why this matters
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Afribit programs work because they connect real livelihoods to repeatable Bitcoin use. Funding helps keep training, tools, and field execution close to the community.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={program.donationHref} target="_blank" rel="noreferrer">
                  {program.donationLabel}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/programs">
                  Explore all programs
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}