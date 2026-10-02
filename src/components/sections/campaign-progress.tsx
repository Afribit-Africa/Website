import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { scaleIn } from '@/lib/motion'

export function CampaignProgress() {
  return (
    <section className="section">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Reveal variants={scaleIn}>
            <CardSpotlight className="p-8 sm:p-10" color="rgba(247,147,26,0.10)">
              <div className="mb-8">
                <div>
                  <Badge variant="default" className="mb-3">
                    Support community work
                  </Badge>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    Support Bitcoin in Kibera
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2">
                    Your support helps Afribit&apos;s work in Bitcoin education, merchant onboarding,
                    waste incentives, women&apos;s upcycling, and rider compliance.
                  </p>
                </div>
              </div>

              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/donate">
                  Donate with Lightning
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardSpotlight>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
