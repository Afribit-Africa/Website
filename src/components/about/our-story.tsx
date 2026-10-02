import Image from 'next/image'
import { Container } from '@/components/layout/container'

export function OurStory() {
  return (
    <section className="section">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/8">
            <Image
              src="/Images/Kibera Aerial view.jpg"
              alt="Aerial view of Kibera"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-bg-base/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-muted-foreground">
                Kibera, Nairobi, Kenya.
              </span>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-4">How It Started</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
              A Simple Idea,{' '}
              <span className="text-gradient-brand">Rooted in Community</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Afribit started as a Bitcoin training programme for university students in
                Nairobi. It grew into something the founders didn&apos;t fully plan: a grassroots
                movement to end financial exclusion in Kibera using Bitcoin as the tool.
              </p>
              <p>
                Afribit works with Kibera residents and local businesses to make Bitcoin
                practical through education, wallet setup, and everyday payments.
              </p>
              <p>
                Today Afribit supports merchant onboarding, waste-to-Bitcoin incentives,
                and Bitcoin education for youth and women in Kibera.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
