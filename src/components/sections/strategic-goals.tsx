import Link from 'next/link'
import { Target, TrendingUp, Globe2, Users, Leaf, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const GOALS = [
  {
    icon: Target,
    tag: 'Social justice',
    title: 'Challenge inequitable systems',
    desc: 'We help shift access, power, and financial opportunity toward merchants, workers, and families too often excluded from formal systems.',
  },
  {
    icon: TrendingUp,
    tag: 'Resource strategy',
    title: 'Mobilize every resource',
    desc: 'Afribit turns time, talent, treasure, and trusted networks into coordinated action that moves faster and further than money alone.',
  },
  {
    icon: Users,
    tag: 'Unrestricted giving',
    title: 'Increase flexible support',
    desc: 'We champion giving that is unrestricted enough to meet urgent needs, strengthen local leadership, and keep momentum alive across programs.',
  },
  {
    icon: Leaf,
    tag: 'Root causes',
    title: 'Address causes, not just symptoms',
    desc: 'Our work does more than relieve immediate pressure. It builds skills, systems, and relationships that reduce exclusion over time.',
  },
  {
    icon: Globe2,
    tag: 'Collective outcomes',
    title: 'Achieve more together',
    desc: 'When communities, donors, builders, and partners move together, the outcomes grow and the work carries the joy of shared progress.',
  },
]

export function StrategicGoals() {
  return (
    <section className="section-lg pb-0 bg-grid-lines bg-bg-surface/50">
      <Container>
        <div className="section-intro">
          <Badge variant="default" className="mb-4">
            Strategic action
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How we move urgent change forward
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            We focus on justice, unrestricted support, root-cause solutions, and collective action that can unlock greater outcomes than any one actor can reach alone.
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
                  {g.tag}
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
              Back This Strategy
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
