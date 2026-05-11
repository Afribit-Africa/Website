import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Users, MessageCircle } from 'lucide-react'

export function CommunityCTA() {
  return (
    <section className="section">
      <Container>
        <div className="section-panel mx-auto max-w-4xl rounded-3xl px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="content-shell">
            <p className="text-xs font-semibold uppercase tracking-widest text-bitcoin">
            Join the Movement
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Be Part of{' '}
              <span className="text-gradient-brand">Bitcoin Kibera</span>
            </h2>
            <p className="content-copy-narrow text-lg leading-relaxed text-muted-foreground">
              Every member strengthens the circular economy. Show up, learn, spend Bitcoin, and
              help your neighbours do the same.
            </p>

            <div className="content-actions">
              <Button asChild size="lg">
                <a
                  href="https://www.afribit.africa/fedi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Users className="mr-2 size-4" aria-hidden="true" />
                  Join on Fedi
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://t.me/afribit_africa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" aria-hidden="true" />
                  Join Telegram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
