import { Container } from '@/components/layout/container'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <section className="section-hero">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">Legal</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">{title}</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
            <div className="mt-6 h-px bg-border-soft" />
          </div>

          <div className="prose-legal">
            {children}
          </div>
        </div>
      </Container>
    </section>
  )
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="text-base text-muted-foreground leading-relaxed">{children}</p>
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-muted-foreground">
          <span className="size-1.5 rounded-full bg-bitcoin mt-2 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
