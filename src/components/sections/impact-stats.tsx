import { Container } from '@/components/layout/container'
import { Zap, Users, Bike, Store } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { StaggerGroup, StaggerItem } from '@/components/ui/reveal'

const ACTIVITIES = [
  { icon: Zap, label: 'Everyday payments', desc: 'Wallet setup and Lightning payment education.' },
  { icon: Users, label: 'Community learning', desc: 'Bitcoin education for residents and local businesses.' },
  { icon: Bike, label: 'Rider support', desc: 'Savings education and guidance on licensing and insurance.' },
  { icon: Store, label: 'Merchant onboarding', desc: 'Practical support for businesses accepting Bitcoin.' },
]

export function ImpactStats() {
  return (
    <section className="section bg-dot-grid glow-bitcoin">
      <Container>
        <SectionHeader
          eyebrow="Community activities"
          title="Bitcoin in Everyday Life"
          description="Afribit supports practical Bitcoin learning, local trade, and rider compliance in Kibera."
        />

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACTIVITIES.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-2xl border border-white/8 bg-bg-surface p-6 flex flex-col gap-3 hover:border-bitcoin/20 transition-colors h-full">
                <div className="size-10 rounded-xl bg-bitcoin/10 flex items-center justify-center">
                  <s.icon className="size-5 text-bitcoin" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{s.label}</h3>
                  <p className="text-sm leading-6 text-muted-foreground mt-2">{s.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
