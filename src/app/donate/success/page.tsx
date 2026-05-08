import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Donation Submitted',
  description: 'Thank you for supporting Afribit. Your donation invoice has been submitted through BTCPay checkout.',
  path: '/donate/success',
  noIndex: true,
})

export default function DonateSuccessPage() {
  return (
    <section className="section-hero flex min-h-[100svh] items-center bg-bg-base">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-bg-surface/80 p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.24)] md:p-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-bitcoin/12 text-bitcoin">
            <CheckCircle2 className="size-7" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Thank you for backing Afribit.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            If your BTCPay checkout completed successfully, your contribution is now part of the work powering merchants, training, cleanup crews, and community resilience in Kibera.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            If you shared an email address, Afribit can use it for follow-up or recognition updates. You can also return to the donate page to support another tier.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/donate">
                Back to donate
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/programs">Explore the programs</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}