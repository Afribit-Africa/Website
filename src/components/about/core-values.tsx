import { Container } from '@/components/layout/container'
import { Shield, Users, Leaf, Globe } from 'lucide-react'

const VALUES = [
  {
    icon: Shield,
    iconClass: 'text-bitcoin',
    bgClass: 'bg-bitcoin/10',
    title: 'Financial Sovereignty',
    desc: 'Every person has the right to hold and transact in sound money. No banks, no borders, no bureaucracy standing in the way.',
  },
  {
    icon: Users,
    iconClass: 'text-panafrican-green',
    bgClass: 'bg-panafrican-green/10',
    title: 'Community First',
    desc: 'Every decision is made with the Kibera community at the centre. No extractive models. No gambling. No exploitation.',
  },
  {
    icon: Leaf,
    iconClass: 'text-panafrican-gold',
    bgClass: 'bg-panafrican-gold/10',
    title: 'Sustainability',
    desc: 'From waste-to-Bitcoin programmes to merchant-led circular economies, we build systems designed to sustain themselves long-term.',
  },
  {
    icon: Globe,
    iconClass: 'text-panafrican-red',
    bgClass: 'bg-panafrican-red/10',
    title: 'Radical Inclusivity',
    desc: 'We actively bring women, youth, and the most marginalised into the Bitcoin economy. Financial freedom means nobody is left behind.',
  },
]

export function CoreValues() {
  return (
    <section className="section bg-dot-grid glow-green">
      <Container>
        <div className="section-intro">
          <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">Principles</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-0">
            What We Stand For
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/8 bg-bg-surface p-6 flex gap-5 hover:border-white/15 transition-colors"
            >
              <div className={`size-10 rounded-xl ${v.bgClass} flex items-center justify-center shrink-0 mt-0.5`}>
                <v.icon className={`size-5 ${v.iconClass}`} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
