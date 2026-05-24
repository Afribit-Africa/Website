import Link from 'next/link'
import { Bitcoin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export function AboutCTA() {
  return (
    <section className="section">
      <Container>
        <div className="section-panel mx-auto max-w-5xl rounded-3xl px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="content-shell content-shell-wide max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bitcoin">
              Join the Movement
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-6xl">
              Be Part of Africa&apos;s{' '}
              <span className="text-bitcoin">Bitcoin Revolution</span>
            </h2>
            <p className="content-copy-narrow text-balance text-lg leading-8 text-muted-foreground sm:text-xl">
              Fund the movement. Join the community. Every action puts sound money
              into more hands across Kibera.
            </p>
            <div className="content-actions">
              <Button asChild size="xl">
                <Link href="/donate">
                  Fuel BCE ₿
                  <Bitcoin className="size-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/community">
                  Join Community
                  <Users className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
