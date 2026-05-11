import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Users, MessageCircle } from 'lucide-react'

export function CommunityCTA() {
  return (
    <section className="section">
      <Container>
        <div className="section-panel rounded-3xl px-8 py-16 sm:py-20 text-center max-w-4xl mx-auto">
          <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-4">
            Join the Movement
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Be Part of{' '}
            <span className="text-gradient-brand">Bitcoin Kibera</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed text-center">
            Every member strengthens the circular economy. Show up, learn, spend Bitcoin, and
            help your neighbours do the same.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <a
                href="https://www.afribit.africa/fedi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Users className="size-4 mr-2" aria-hidden="true" />
                Join on Fedi
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
