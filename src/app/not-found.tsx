import Link from 'next/link'
import { Compass, Home, MapPin } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'

export default function NotFound() {
  return (
    <section className="section-hero relative overflow-hidden bg-bg-base">
      <div className="absolute inset-0 bg-grid-lines opacity-30" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,147,26,0.16),transparent_24rem),radial-gradient(circle_at_bottom_right,rgba(0,135,81,0.12),transparent_22rem)]"
        aria-hidden
      />
      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-5">
            404 · Page not found
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-tight text-foreground sm:text-6xl md:text-7xl">
            This page is out of reach, but the Afribit network is not.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            The page you tried to open is not available. You can head back to the homepage, explore the merchant directory, or jump straight into the programs building Bitcoin commerce in Kibera.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="size-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/merchants">
                <MapPin className="size-4" />
                Browse merchants
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/programs">
                <Compass className="size-4" />
                Explore programs
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <CardSpotlight className="p-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">Merchant directory</p>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground">See where Bitcoin is already in use.</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Explore Afribit’s local merchant network and open live BTC Map listings where they are available.
              </p>
            </CardSpotlight>
            <CardSpotlight className="p-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">Programs</p>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground">Follow the work behind the network.</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Merchant growth, upcycling, waste incentives, and rider support all feed the circular economy story.
              </p>
            </CardSpotlight>
            <CardSpotlight className="p-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">Support</p>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground">Want a direct route instead?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Visit the donate page to support the Bitcoin circular economy building across Kibera.
              </p>
            </CardSpotlight>
          </div>
        </div>
      </Container>
    </section>
  )
}
