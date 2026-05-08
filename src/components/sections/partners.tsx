import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/container'
import { Marquee } from '@/components/ui/marquee'

const PARTNERS = [
  { name: 'FBCE Global', logo: '/Partner logos/fbceglobal_logo.jpg' },
  { name: 'Geyser', logo: '/Partner logos/Geyser.png' },
  { name: 'Rottweil', logo: '/Partner logos/Rottweil.jpg' },
  { name: 'Bitcoin Conference', logo: '/Partner logos/Bitcoin-confed.jpg' },
  { name: 'Crack The Orange', logo: '/Partner logos/_Crack-The-Orange-LOGO.png' },
]

function PartnerCard({ name, logo }: { name: string; logo: string }) {
  return (
    <figure
      className={cn(
        'relative flex h-32 w-44 cursor-pointer items-center justify-center rounded-2xl border p-6',
        'border-white/[.08] bg-white/[.04] hover:bg-white/[.09]',
        'transition-all duration-300 shrink-0',
      )}
    >
      <Image
        src={logo}
        alt={name}
        width={130}
        height={52}
        className="max-h-11 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
      />
    </figure>
  )
}

// Each column gets a different slice — stagger start positions for visual variety
const col1 = [...PARTNERS, ...PARTNERS].slice(0, 5)
const col2 = [...PARTNERS, ...PARTNERS].slice(1, 6)
const col3 = [...PARTNERS, ...PARTNERS].slice(2, 7)
const col4 = [...PARTNERS, ...PARTNERS].slice(3, 8)

export function Partners() {
  return (
    <section className="py-20 border-y border-white/8 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — CTA text */}
          <div className="flex flex-col gap-6">
            <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold">
              Trusted partners &amp; supporters
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Backed by organisations who believe in a{' '}
              <span className="text-gradient-brand">Bitcoin future for Africa</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              From global Bitcoin foundations to grassroots organisations, our partners bring
              funding, training, and infrastructure that makes the Kibera circular economy possible.
            </p>

            <ul className="flex flex-col gap-3 mt-1">
              {[
                'Direct funding & grant support',
                'Technical infrastructure & tools',
                'Curriculum design & training resources',
                'Community events & media exposure',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-bitcoin shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground/60">
              Interested in partnering?{' '}
              <a href="mailto:connect@afribit.africa" className="text-bitcoin hover:underline">
                Reach out to us
              </a>
            </p>
          </div>

          {/* Right — 3D marquee */}
          <div className="relative h-[480px] overflow-hidden [perspective:600px]">
            <div
              className="flex flex-row items-center gap-4 h-full"
              style={{
                transform:
                  'translateX(-8px) translateY(0px) translateZ(-40px) rotateX(12deg) rotateY(-5deg) rotateZ(10deg)',
              }}
            >
              <Marquee pauseOnHover vertical repeat={6} className="[--duration:20s] [--gap:0.75rem]">
                {col1.map((p) => <PartnerCard key={p.name + '1'} {...p} />)}
              </Marquee>
              <Marquee reverse pauseOnHover vertical repeat={6} className="[--duration:25s] [--gap:0.75rem]">
                {col2.map((p) => <PartnerCard key={p.name + '2'} {...p} />)}
              </Marquee>
              <Marquee pauseOnHover vertical repeat={6} className="[--duration:22s] [--gap:0.75rem]">
                {col3.map((p) => <PartnerCard key={p.name + '3'} {...p} />)}
              </Marquee>
              <Marquee reverse pauseOnHover vertical repeat={6} className="[--duration:27s] [--gap:0.75rem]">
                {col4.map((p) => <PartnerCard key={p.name + '4'} {...p} />)}
              </Marquee>
            </div>

            {/* Edge fades */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--bg-base)] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[var(--bg-base)] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[var(--bg-base)] to-transparent" />
          </div>

        </div>
      </Container>
    </section>
  )
}
