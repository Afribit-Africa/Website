import Image from 'next/image'
import { MessageSquare, Shield, Zap, Globe } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

const FEATURES = [
  { icon: Shield, title: 'Censorship-Resistant', desc: 'No one can block your messages or transactions' },
  { icon: Zap, title: 'Lightning Integrated', desc: 'Send sats directly in community chat' },
  { icon: MessageSquare, title: 'Private & Local', desc: 'Community-controlled, not corporate servers' },
  { icon: Globe, title: 'Offline-Capable', desc: 'Works even with limited connectivity' },
]

const JOIN_STEPS = [
  {
    title: '1. Join Afribit Federation',
    description:
      'Start here to connect your Fedi app to Afribit\'s federation and unlock the wallet and messaging environment.',
    href: 'fed11qgqyj3mfwfhksw309ucrxe35vgcryvesxf3nyepsv3jnyepsvgcnxdpjv5urjcfkv4nrydmxxvervef3xcmxxce5x5ergwfnxcukzetr8qen2vnpvsmr2vrzqyqjplegdfhg4qq8f0zeuvjxn8e49sa3tnep7w08dca79wecgjkyszrufgwesp',
    imageSrc: '/Images/Fedi/federation qr code.jpeg',
    imageAlt: 'Scan to join the Afribit Fedi Federation',
    buttonLabel: 'Open Federation Link',
  },
  {
    title: '2. Join Fedi Community',
    description:
      'Then join the Afribit community space to follow updates, connect with members, and participate in the circular economy.',
    href: 'fedi:community210v3xzat5dphhyhmsw43xketeygazydfkx5mnjepk8yersv34xyurvcmpxvexxwf4x9jxvetzxajkyd3hxsmxge3nxucrjvf4893rzcfkve3njcnxx93nwwt9v33xydtzxgezytpzvdhk6mt4de5hg72lw46kjezldpjhsg36yfjkydmyvvmxywpnvdjx2wpcxyerwepsxgckvwp3xs6x2c3cxycrzvf3vgekge3hxu6xxc33xs6kvvtz8qckvdf58y6xxefev5enzet9ygkzyer9vde8jur5d9hkuhmtv4ujyw3z24cxz52g89jxg33t2dzn2wr4datrja3cd3h8q7n3xschsejhgye923nvve582mpcwg6hx0fz05zvac43',
    imageSrc: '/Images/Fedi/fedi community qr code.jpeg',
    imageAlt: 'Scan to join the Afribit Fedi Community',
    buttonLabel: 'Open Community Link',
  },
]

export function CommunityFedi() {
  return (
    <section id="join-on-fedi" className="section bg-noise">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">
              Primary Platform
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Join Afribit on Fedi in Two Steps
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Fedi is where Afribit&apos;s community messaging and Bitcoin activity come together.
              Join Afribit&apos;s federation first, then enter the community space to connect, learn,
              and transact with other members.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-bitcoin/10 flex items-center justify-center shrink-0">
                    <f.icon className="size-4 text-bitcoin" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{f.title}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {JOIN_STEPS.map((step, index) => (
                <Button key={step.title} asChild size="lg" variant={index === 0 ? 'default' : 'outline'}>
                  <a href={step.href}>{step.buttonLabel}</a>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              {JOIN_STEPS.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/8 bg-bg-surface p-6 flex flex-col items-center gap-4"
                >
                  <div className="text-sm font-medium text-foreground text-center">{step.title}</div>
                  <div className="rounded-xl overflow-hidden bg-white p-3">
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      width={180}
                      height={180}
                      className="block"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    {step.description}
                  </p>
                  <a
                    href={step.href}
                    className="text-xs font-medium text-bitcoin hover:text-bitcoin-300 transition-colors"
                  >
                    {step.buttonLabel}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
