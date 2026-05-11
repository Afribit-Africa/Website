import Image from 'next/image'
import { MessageSquare, Shield, Zap, Globe } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

const FEATURES = [
  { icon: Shield, title: 'Censorship-Resistant', desc: 'No one can block your messages or transactions' },
  { icon: Zap, title: 'Lightning Integrated', desc: 'Send sats directly in community chat' },
  { icon: MessageSquare, title: 'Private & Local', desc: 'Community-controlled, not corporate servers' },
  { icon: Globe, title: 'Offline-Capable', desc: 'Works even with limited connectivity' },
]

export function CommunityFedi() {
  return (
    <section className="section bg-noise">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">
              Primary Platform
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Join on Fedi — Our Community Hub
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Fedi is a federated, censorship-resistant platform that combines secure messaging
              with Lightning Network payments. No phone number required. Your keys, your community.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-bitcoin/10 flex items-center justify-center shrink-0">
                    <f.icon className="size-4 text-bitcoin" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{f.title}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild size="lg">
              <a
                href="https://www.afribit.africa/fedi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Community on Fedi
              </a>
            </Button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="rounded-2xl border border-white/8 bg-bg-surface p-8 flex flex-col items-center gap-4 max-w-xs w-full">
              <div className="text-sm font-medium text-muted-foreground">Scan to join</div>
              <div className="rounded-xl overflow-hidden bg-white p-3">
                <Image
                  src="/Images/Afribit lightning QR code.png"
                  alt="Scan to join Afribit community on Fedi"
                  width={180}
                  height={180}
                  className="block"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Scan with the Fedi app to join the Kibera Bitcoin community
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
