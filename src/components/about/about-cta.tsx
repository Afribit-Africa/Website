import Link from 'next/link'
import { Bitcoin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export function AboutCTA() {
  return (
    <section className="section">
      <Container>
        <div className="section-panel rounded-3xl px-8 py-16 sm:py-20 text-center max-w-4xl mx-auto">
          <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-4">
            Join the Movement
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Be Part of Africa&apos;s{' '}
            <span className="text-bitcoin">Bitcoin Revolution</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed text-center text-balance">
            Fund the movement. Join the community. Every action puts sound money
            into more hands across Kibera.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl">
              <Link href="/donate">
                Fuel BCE ₿
                <Bitcoin className="size-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href="https://www.afribit.africa/fedi" target="_blank" rel="noopener noreferrer">
                Join Community
                <Users className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
