import { MessageSquare, Shield, Zap, Globe } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { FediInviteCard } from '@/components/community/fedi-invite-card'
import { FEDI_INVITES } from '@/lib/fedi-invites'

const FEATURES = [
  { icon: Shield, title: 'Censorship-Resistant', desc: 'No one can block your messages or transactions' },
  { icon: Zap, title: 'Lightning Integrated', desc: 'Send sats directly in community chat' },
  { icon: MessageSquare, title: 'Private & Local', desc: 'Community-controlled, not corporate servers' },
  { icon: Globe, title: 'Offline-Capable', desc: 'Works even with limited connectivity' },
]

export function FediSection() {
  return (
    <section className="section bg-noise">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4">
              Community Hub
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Join Afribit on Fedi in Two Steps
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Start by joining Afribit&apos;s federation, then enter the community space to connect,
              learn, and transact with other members on Fedi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-bitcoin/10 flex items-center justify-center shrink-0">
                    <f.icon className="size-4 text-bitcoin" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{f.title}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="rounded-2xl border border-bitcoin/15 bg-bitcoin/6 px-4 py-3 text-sm leading-7 text-muted-foreground">
              Use the QR codes to join with another device, or copy the invite codes below to paste them into Fedi on the same device.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              {FEDI_INVITES.map((invite) => (
                <FediInviteCard key={invite.id} invite={invite} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
