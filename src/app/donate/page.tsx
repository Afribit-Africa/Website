import type { Metadata } from 'next'
import { AlertCircle, Bitcoin } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { DonateExperience } from '@/components/donations/donate-experience'
import { Badge } from '@/components/ui/badge'
import { generateMetadata } from '@/lib/metadata'
import { DONATION_LIGHTNING_ADDRESS } from '@/lib/donation-policy'

export const metadata: Metadata = generateMetadata({
  title: 'Donate',
  description:
    `Afribit's BTCPay Server donation checkout is under maintenance. Donate temporarily by scanning or copying ${DONATION_LIGHTNING_ADDRESS}.`,
  path: '/donate',
  keywords: [
    'donate Afribit',
    'Bitcoin donation Kibera',
    'Lightning donation Afribit',
    'Afribit Africa donation',
  ],
})

export default function DonatePage() {
  return (
    <section className="section-hero relative flex min-h-[100svh] items-center overflow-hidden bg-bg-base py-16">
      <div className="absolute inset-0 bg-grid-lines opacity-40" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_28rem),radial-gradient(circle_at_right_center,rgba(0,107,66,0.14),transparent_26rem)]"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Badge variant="secondary" className="mb-5">
            Donate
          </Badge>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-bitcoin/25 bg-bitcoin/12 text-bitcoin">
            <Bitcoin className="size-8" />
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Support Afribit with Lightning
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Our BTCPay Server is under maintenance while we move donations onto Afribit-owned infrastructure. This temporary page is intentionally simple: scan the QR code or copy the Lightning address to donate any amount.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-5xl rounded-[1.5rem] border border-bitcoin/25 bg-bitcoin/10 p-4 text-sm leading-7 text-foreground/86 sm:p-5">
          <div className="flex gap-3">
            <AlertCircle className="mt-1 size-5 shrink-0 text-bitcoin" />
            <p>
              Thank you for your patience while we upgrade our donation checkout. Your support still reaches Afribit&apos;s community work; scan or copy the address below to give any amount.
            </p>
          </div>
        </div>

        <DonateExperience />
      </Container>
    </section>
  )
}
