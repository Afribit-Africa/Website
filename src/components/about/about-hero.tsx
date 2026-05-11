import { Container } from '@/components/layout/container'

export function AboutHero() {
  return (
    <section className="section-hero relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-bitcoin/7 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-panafrican-green/6 rounded-full blur-[100px]" />
      </div>

      <Container>
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-bitcoin/10 border border-bitcoin/20 mb-7">
            <span className="size-1.5 rounded-full bg-bitcoin animate-pulse" />
            <span className="text-sm font-medium text-bitcoin">Our Story</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.08]">
            Built in Kibera.{' '}
            <span className="text-bitcoin relative inline-block">
              Powered by Bitcoin.
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-bitcoin/30 rounded-full" />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed text-balance">
            Afribit is a grassroots organisation in Kibera, East Africa&apos;s largest informal
            settlement. We build real financial access through Bitcoin education, merchant
            networks, and the Lightning Network.
          </p>
        </div>
      </Container>
    </section>
  )
}
