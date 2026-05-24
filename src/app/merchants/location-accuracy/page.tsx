import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, LocateFixed, MapPinned, ShieldCheck, Smartphone } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { generateMetadata } from '@/lib/metadata'

const TECHNICAL_FACTORS = [
  {
    icon: Smartphone,
    title: 'Phone hardware varies widely',
    description:
      'Many registrations happened on everyday Android phones whose GPS chips can drift by several meters, especially when signal quality is weak.',
  },
  {
    icon: MapPinned,
    title: 'Businesses sit very close together',
    description:
      'In Kibera markets and trading lanes, one inaccurate coordinate can shift a public pin from the correct stall to the next doorway or across the lane.',
  },
  {
    icon: LocateFixed,
    title: 'Location conditions are difficult',
    description:
      'Indoor counters, metal roofing, narrow passages, and dense building patterns can all reduce GPS reliability even when the merchant data itself is correct.',
  },
]

const ARTICLE_SECTIONS = [
  {
    title: 'How the first merchant locations were collected',
    paragraphs: [
      'Afribit opened merchant onboarding through its registration flow so business owners could submit their details quickly and begin participating in the Bitcoin circular economy without waiting for every listing to be captured only through a separate field-device workflow.',
      'That flow was designed to support stronger location capture, offline drafts, and status updates, and it gave Afribit a faster way to bring real businesses into the directory. After submission, validators still reviewed the merchant details before the business was published into public references and mapping surfaces.',
    ],
  },
  {
    title: 'Why a real business can still have an imperfect pin',
    paragraphs: [
      'A public map point depends on the quality of the device capturing it. In practice, lower-end phones can report broad error ranges, especially when the merchant is indoors, under roofing, or surrounded by dense structures that interrupt satellite visibility.',
      'Kibera also has tightly packed businesses. When several shops, kiosks, or stalls operate within a few meters of each other, even a modest GPS error can place the public point on the wrong doorway while the business itself remains genuine and verified.',
    ],
  },
  {
    title: 'Why the listings are still trustworthy',
    paragraphs: [
      'Afribit did not rely on raw GPS alone to decide whether a business was real. Merchant details, neighborhood context, and human review all mattered before a listing was confirmed and represented publicly.',
      'That means a pin may still need refinement, but the merchant identity, the Bitcoin acceptance claim, and the underlying business relationship are not based on coordinates alone.',
    ],
  },
  {
    title: 'How map accuracy is being improved',
    paragraphs: [
      'Afribit is improving location quality by revisiting coordinates, using better collection practices, and prioritizing neighborhood-first discovery so people can still find businesses even before every exact point is recaptured.',
      'As stronger coordinates are confirmed, Afribit can keep refining the OpenStreetMap and BTC Map references tied to those merchants. The result is a directory that stays useful today while becoming more precise over time.',
    ],
  },
  {
    title: 'How to use the merchant map right now',
    paragraphs: [
      'Treat the current map as a trusted discovery tool, especially at neighborhood level. Merchant profiles, category filters, and local context remain useful even when a specific public point still needs a tighter recapture.',
      'If you are visiting a merchant, use the neighborhood label, the business name, and nearby context together. That is the best way to navigate while Afribit continues improving coordinate accuracy across the directory.',
    ],
  },
]

export const metadata: Metadata = generateMetadata({
  title: 'Merchant Location Accuracy',
  description:
    'Learn why some Afribit BTC Map merchant pins may still be imprecise, how merchants were verified, and how location accuracy is being improved across the directory.',
  path: '/merchants/location-accuracy',
  type: 'article',
  keywords: [
    'BTC Map accuracy',
    'Afribit merchant map',
    'Kibera merchant GPS',
    'Bitcoin merchant directory Kibera',
    'merchant location accuracy',
  ],
})

export default function MerchantLocationAccuracyPage() {
  return (
    <>
      <section className="section-hero relative overflow-hidden bg-bg-base">
        <div className="absolute inset-0 bg-grid-lines opacity-35" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_28rem),radial-gradient(circle_at_right_center,rgba(0,107,66,0.16),transparent_26rem)]" aria-hidden />
        <Container className="relative z-10">
          <div className="grid gap-10 pb-10 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-5">
                Merchant Map Note
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                Why some merchant GPS points still need <span className="text-bitcoin">refinement</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Afribit&apos;s merchant directory is built from real business onboarding in Kibera. Some public map points can still be imprecise, not because the businesses are unverified, but because collecting strong coordinates in dense trading areas is technically difficult.
              </p>
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/95">
                  What visitors should know now
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  The businesses in Afribit&apos;s directory are authentic. What may still change is the exact public pin for some merchants as location quality is recaptured and updated.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <Link href="/merchants">
                    Browse merchants
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link href="/register">
                    Register your business
                  </Link>
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
                    Verified business, evolving coordinates
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    Afribit&apos;s location work is focused on keeping merchant discovery useful today while steadily improving exact point accuracy for tomorrow.
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
            {TECHNICAL_FACTORS.map((factor) => (
              <div key={factor.title} className="rounded-[1.75rem] border border-white/8 bg-[#121513] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-bitcoin/10">
                  <factor.icon className="size-5 text-bitcoin" aria-hidden="true" />
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-foreground">{factor.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-bg-base">
        <Container>
          <article className="mx-auto max-w-4xl rounded-[2rem] border border-white/8 bg-[#101311] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10">
            <div className="border-b border-white/8 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin">
                A clear explanation
              </p>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Afribit chose to grow the directory through real merchant onboarding instead of waiting for a perfect mapping pass before businesses could be seen. That decision made visibility and participation possible earlier, but it also meant some public coordinates depended on the quality of the devices available in the field.
              </p>
            </div>

            <div className="mt-8 space-y-8">
              {ARTICLE_SECTIONS.map((section) => (
                <section key={section.title} className="border-b border-white/8 pb-8 last:border-b-0 last:pb-0">
                  <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{section.title}</h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </Container>
      </section>

      <section className="section bg-bg-surface/50 bg-grid-lines">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bitcoin">
                Trust the directory, read the location carefully
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                Merchant authenticity and map precision are related, but they are not the same thing.
              </h2>
              <p className="mt-4 text-muted-foreground leading-8">
                Afribit uses merchant onboarding, human review, and neighborhood context to make the directory useful now, while continued field recapture improves exact location quality over time.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[#121513] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-panafrican-green/10">
                  <ShieldCheck className="size-5 text-panafrican-green" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Need the broader merchant view?</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Explore the live directory to browse by neighborhood, business type, and payment style, or bring your own business into the network through Afribit&apos;s registration flow.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/merchants">
                    Merchant directory
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">
                    Start registration
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}