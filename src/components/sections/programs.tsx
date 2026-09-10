import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { StaggerGroup, StaggerItem } from '@/components/ui/reveal'
import { programs } from '@/lib/programs'

export function Programs() {
  return (
    <section className="section">
      <Container>
        <SectionHeader
          eyebrow="Our Programs"
          title="Circular Resilience Programs"
          description="Four pillars driving Bitcoin adoption from the ground up in Kibera's informal economy."
        />

        {/* CometCard #2 — Programs grid */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {programs.map((program) => (
            <StaggerItem key={program.slug}>
              <Link href={`/programs/${program.slug}`} className="block h-full">
                <CardSpotlight className="h-full p-7 transition-transform duration-300 hover:-translate-y-1">
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
            </StaggerItem>
          ))}
        </StaggerGroup>

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
