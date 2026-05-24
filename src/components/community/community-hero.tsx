import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Users, MessageCircle } from 'lucide-react'

export function CommunityHero() {
  return (
    <section className="section-hero glow-bitcoin text-center">
      <Container>
        <div className="content-shell">
          <div className="inline-flex items-center gap-2 rounded-full border border-bitcoin/30 bg-bitcoin/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-bitcoin">
            <Users className="size-3.5" aria-hidden="true" />
            Community Hub
          </div>

          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            Kibera&apos;s{' '}
            <span className="text-gradient-brand">Bitcoin Community</span>
          </h1>

          <p className="content-copy-narrow text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Join thousands learning, earning, and spending Bitcoin in Kibera. The community lives
            on Fedi — censorship-resistant, Lightning-enabled, and community-controlled.
          </p>

          <div className="content-actions">
            <Button asChild size="lg">
              <Link href="#join-on-fedi">
                Join on Fedi
                <Users className="size-4 ml-2" aria-hidden="true" />
              </Link>
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
