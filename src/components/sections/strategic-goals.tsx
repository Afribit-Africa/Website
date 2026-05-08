import Link from 'next/link'
import { Target, TrendingUp, Globe2, Users, Leaf, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const GOALS = [
  {
    icon: Target,
    year: '2026',
    title: 'Reach 200 Active Merchants',
    desc: 'Onboard 200 Kibera businesses with Lightning POS and 6-month retention support.',
  },
  {
    icon: TrendingUp,
    year: '2026',
    title: '$100K Campaign Goal',
    desc: 'Raise $100,000 to fund full-year operations across all four programs.',
  },
  {
    icon: Users,
    year: '2026',
    title: 'Train 500 Community Members',
    desc: 'Deliver Bitcoin literacy training to 500 residents in Swahili and Sheng.',
  },
  {
    icon: Leaf,
    year: '2026',
    title: 'Expand Waste Program Citywide',
    desc: 'Scale the waste-to-Bitcoin program beyond Kibera to three additional Nairobi districts.',
  },
  {
    icon: Globe2,
    year: '2026',
    title: 'Replicate in 2 New Cities',
    desc: 'Document and open-source the Afribit playbook for replication in Lagos and Kampala.',
  },
]

export function StrategicGoals() {
  return (
    <section className="pt-20 pb-0 bg-grid-lines bg-bg-surface/50">
      <Container>
        <div className="mb-12 text-center">
          <Badge variant="default" className="mb-4">
            2026 Roadmap
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Strategic Goals
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Where we are going — and how every donation gets us closer.
          </p>
        </div>

        {/* CometCard #3 — Strategic Goals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {GOALS.map((g, i) => (
            <CardSpotlight key={g.title} className={`p-6 ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="size-10 rounded-xl bg-bitcoin/10 flex items-center justify-center">
                  <g.icon className="size-5 text-bitcoin" />
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {g.year}
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{g.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
            </CardSpotlight>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/donate">
              Help Us Hit These Goals
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
