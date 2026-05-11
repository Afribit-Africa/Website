import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Users, MessageCircle } from 'lucide-react'

export function CommunityHero() {
  return (
    <section className="section-hero glow-bitcoin text-center">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-bitcoin/30 bg-bitcoin/8 text-bitcoin text-xs font-semibold uppercase tracking-widest mb-6">
            <Users className="size-3.5" aria-hidden="true" />
            Community Hub
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Kibera&apos;s{' '}
            <span className="text-gradient-brand">Bitcoin Community</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands learning, earning, and spending Bitcoin in Kibera. The community lives
            on Fedi — censorship-resistant, Lightning-enabled, and community-controlled.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <a
                href="https://www.afribit.africa/fedi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join on Fedi
                <Users className="size-4 ml-2" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href="https://t.me/afribit_africa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4 mr-2" aria-hidden="true" />
                Join Telegram
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
