import { Container } from '@/components/layout/container'
import { Target, Eye } from 'lucide-react'

export function MissionVision() {
  return (
    <section className="section bg-bg-surface/30">
      <Container>
        <div className="section-intro">
          <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">What Drives Us</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-0">
            Mission &amp; Vision
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Mission */}
          <div className="rounded-2xl border border-bitcoin/20 bg-bg-elevated p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-bitcoin rounded-l-2xl" />
            <div className="size-12 rounded-xl bg-bitcoin/10 flex items-center justify-center mb-5">
              <Target className="size-6 text-bitcoin" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To challenge inequitable systems by using Bitcoin, learning, and local coordination
              to move power, opportunity, and decision-making closer to Kibera communities.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-2xl border border-panafrican-green/20 bg-bg-elevated p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-panafrican-green rounded-l-2xl" />
            <div className="size-12 rounded-xl bg-panafrican-green/10 flex items-center justify-center mb-5">
              <Eye className="size-6 text-panafrican-green" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              A future where communities have the unrestricted support, trusted networks, and
              collective joy needed to address root causes and build just local economies on their
              own terms.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
