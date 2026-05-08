import { Container } from '@/components/layout/container'
import { Zap, Users, Bike, Store } from 'lucide-react'

const STATS = [
  { icon: Zap, value: '6,000+', label: 'Bitcoin Transactions', desc: 'Lightning-fast payments in Kibera' },
  { icon: Users, value: '600+', label: 'People Trained', desc: 'Community members Bitcoin-literate' },
  { icon: Bike, value: '40+', label: 'Boda-Boda Riders', desc: 'Accepting Bitcoin for rides' },
  { icon: Store, value: '40+', label: 'Active Merchants', desc: 'Shops accepting Bitcoin payments' },
]

export function ImpactStats() {
  return (
    <section className="py-20 bg-dot-grid glow-bitcoin">
      <Container>
        <div className="mb-12 text-center">
          <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">By the numbers</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Impact at a Glance
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real numbers from on-the-ground activity in Kibera&apos;s growing Bitcoin economy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/8 bg-bg-surface p-6 flex flex-col gap-3 hover:border-bitcoin/20 transition-colors"
            >
              <div className="size-10 rounded-xl bg-bitcoin/10 flex items-center justify-center">
                <s.icon className="size-5 text-bitcoin" />
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm font-medium text-foreground/80 mt-0.5">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
