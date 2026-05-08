import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { CheckCircle2 } from 'lucide-react'

const CHALLENGES = [
  'Limited access to traditional banking',
  'Currency inflation eroding savings',
  'Cash-only economy limiting growth',
  'Financial exclusion of informal workers',
]

const APPROACH = [
  'Lightning Network for instant micro-payments',
  'Peer-to-peer Bitcoin training programs',
  'Circular merchant network in Kibera',
  'Waste-to-Bitcoin incentive programs',
]

export function WhyKibera() {
  return (
    <section className="py-24 bg-bg-surface/50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/8">
            <Image
              src="/Images/Kibera Aerial view.jpg"
              alt="Aerial view of Kibera"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-bg-base/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-muted-foreground">
                Kibera, Nairobi — Africa&apos;s largest urban informal settlement
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="pt-2">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5">
              Why Start in Kibera?
            </h2>
            <p className="text-muted-foreground mb-14 leading-relaxed text-base">
              Kibera is home to over 250,000 people — many unbanked, many running informal
              businesses with no access to digital finance. Bitcoin changes that.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-5 border-b border-white/8 pb-3">
                  The Challenge
                </h3>
                <ul className="space-y-4">
                  {CHALLENGES.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="size-2 rounded-full bg-panafrican-red mt-1.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-5 border-b border-white/8 pb-3">
                  Our Approach
                </h3>
                <ul className="space-y-4">
                  {APPROACH.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                      <CheckCircle2 className="size-4 text-panafrican-green mt-0.5 shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
