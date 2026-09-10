import { Container } from '@/components/layout/container'
import { Skeleton } from '@/components/ui/skeleton'

export default function MerchantsLoading() {
  return (
    <section className="section bg-bg-base">
      <Container>
        <div className="mb-10 max-w-3xl space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-full max-w-xl" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/8 bg-bg-surface/90">
              <Skeleton className="h-56 w-full rounded-none" />
              <div className="space-y-4 p-5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
