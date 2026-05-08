import Image from 'next/image'
import { Container } from '@/components/layout/container'

const PEOPLE = [
  {
    image: '/Images/Mama mboga groceries accepting bitcoin.jpg',
    name: 'Mama Mboga',
    role: 'Market Vendor',
    quote: 'Bitcoin helps me save without losing value to inflation.',
  },
  {
    image: '/Images/Motorbike bitcoin onboarding.jpg',
    name: 'Boda-Boda Rider',
    role: 'Transport Entrepreneur',
    quote: 'My customers pay instantly — no cash, no change problems.',
  },
  {
    image: '/Images/person Scanning to pay in bitcoin.jpg',
    name: 'Community Member',
    role: 'Bitcoin Adopter',
    quote: 'I learned to scan a Lightning invoice in one afternoon.',
  },
  {
    image: '/Images/People cleaning drainage.jpg',
    name: 'Waste Program',
    role: 'Circular Economy',
    quote: 'Clean the community, earn Bitcoin — it is real change.',
  },
]

export function RealPeople() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-12 text-center">
          <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">Community</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Real People, Real Progress
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Behind every transaction is a Kibera resident building a better future through Bitcoin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PEOPLE.map((p) => (
            <div
              key={p.name}
              className="group relative rounded-2xl overflow-hidden border border-white/8 aspect-[3/4] bg-bg-surface"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/20 to-transparent" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs text-bitcoin font-medium mb-1 uppercase tracking-widest">
                  {p.role}
                </div>
                <p className="text-sm text-foreground/90 leading-snug italic">
                  &ldquo;{p.quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
