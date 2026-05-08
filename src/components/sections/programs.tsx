import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Badge } from '@/components/ui/badge'
import { programs } from '@/lib/programs'

export function Programs() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            Our Programs
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Circular Resilience Programs
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four pillars driving Bitcoin adoption from the ground up in Kibera&apos;s informal economy.
          </p>
        </div>

        {/* CometCard #2 — Programs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {programs.map((program) => (
            <Link key={program.slug} href={`/programs/${program.slug}`} className="block">
              <CardSpotlight className="p-7 transition-transform duration-300 hover:-translate-y-1">
              <div className={`size-11 rounded-xl ${program.iconBackgroundClassName} flex items-center justify-center mb-4`}>
                <program.icon className={`size-5 ${program.iconClassName}`} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{program.title}</h3>
                <Badge variant="green" className="text-[10px] py-0">
                  {program.statusLabel}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{program.description}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-bitcoin">
                Explore program
                <ArrowRight className="size-4" />
              </div>
              </CardSpotlight>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm text-bitcoin hover:text-bitcoin/80 transition-colors font-medium"
          >
            View all programs
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
