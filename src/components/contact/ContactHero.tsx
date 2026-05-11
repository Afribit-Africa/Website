import Link from 'next/link'
import { ArrowRight, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export function ContactHero() {
  return (
    <section className="section-hero relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-bitcoin/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-panafrican-green/6 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <Container>
        <div className="content-shell content-shell-wide max-w-4xl">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-bitcoin/10 border border-bitcoin/20">
              <span className="size-2 rounded-full bg-bitcoin animate-pulse" />
              <span className="text-sm font-medium text-bitcoin">Get In Touch</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl sm:leading-[1.08] lg:text-5xl xl:text-6xl">
            Connect With{' '}
            <span className="text-bitcoin relative inline-block">
              Afribit Africa
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-bitcoin/30 rounded-full" />
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="content-copy-narrow text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            Have questions about our Bitcoin initiatives, partnerships, or programs? 
            Reach out to our team—we&apos;re here to help empower African communities through financial freedom.
          </p>

          {/* CTA Buttons */}
          <div className="content-actions">
            <Button asChild size="lg" className="w-full sm:w-auto min-h-[44px] px-6 py-3">
              <a href="#contact-form">
                Send a Message
                <Send className="size-4 ml-2" aria-hidden="true" />
              </a>
            </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto min-h-[44px] px-6 py-3">
                <Link href="https://www.afribit.africa/about" target="_blank" rel="noreferrer">
                Learn About Us
                <ArrowRight className="size-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}