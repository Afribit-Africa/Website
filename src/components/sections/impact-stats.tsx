import { Container } from '@/components/layout/container'
import { Zap, Users, Bike, Store } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { StaggerGroup, StaggerItem } from '@/components/ui/reveal'
import { NumberTicker } from '@/components/ui/number-ticker'

const STATS = [
  { icon: Zap, value: 6000, suffix: '+', label: 'Bitcoin Transactions', desc: 'Lightning-fast payments in Kibera' },
  { icon: Users, value: 600, suffix: '+', label: 'People Trained', desc: 'Community members Bitcoin-literate' },
  { icon: Bike, value: 40, suffix: '+', label: 'Boda-Boda Riders', desc: 'Accepting Bitcoin for rides' },
  { icon: Store, value: 40, suffix: '+', label: 'Active Merchants', desc: 'Shops accepting Bitcoin payments' },
]

export function ImpactStats() {
  return (
    <section className="section bg-dot-grid glow-bitcoin">
      <Container>
        <SectionHeader
          eyebrow="By the numbers"
          title="Impact at a Glance"
          description="Real numbers from on-the-ground activity in Kibera's growing Bitcoin economy."
        />

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-2xl border border-white/8 bg-bg-surface p-6 flex flex-col gap-3 hover:border-bitcoin/20 transition-colors h-full">
                <div className="size-10 rounded-xl bg-bitcoin/10 flex items-center justify-center">
                  <s.icon className="size-5 text-bitcoin" />
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-foreground">
                    <NumberTicker value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-sm font-medium text-foreground/80 mt-0.5">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
