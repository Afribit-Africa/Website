import { MessageSquare, Shield, Zap, Globe } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { FediInviteCard } from '@/components/community/fedi-invite-card'
import { FEDI_INVITES } from '@/lib/fedi-invites'

const FEATURES = [
  { icon: Shield, title: 'Censorship-Resistant', desc: 'No one can block your messages or transactions' },
  { icon: Zap, title: 'Lightning Integrated', desc: 'Send sats directly in community chat' },
  { icon: MessageSquare, title: 'Private & Local', desc: 'Community-controlled, not corporate servers' },
  { icon: Globe, title: 'Offline-Capable', desc: 'Works even with limited connectivity' },
]

export function CommunityFedi() {
  return (
    <section id="join-on-fedi" className="section scroll-mt-32 bg-noise">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">
              Primary Platform
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Join Afribit on Fedi in Two Steps
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Fedi is where Afribit&apos;s community messaging and Bitcoin activity come together.
              Join Afribit&apos;s federation first, then enter the community space to connect, learn,
              and transact with other members.
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

            <p className="rounded-2xl border border-bitcoin/15 bg-bitcoin/6 px-4 py-3 text-sm leading-7 text-muted-foreground">
              Scan either QR code with the Fedi app, or copy the full code below if you are joining from the same device.
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
