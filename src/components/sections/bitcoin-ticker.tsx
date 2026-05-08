import { Globe, Shield, Lock, Eye, Network, Ban, Crown, Users, Code2, Zap } from 'lucide-react'
import { Marquee } from '@/components/ui/marquee'

const ITEMS = [
  { label: 'Permissionless', icon: Lock },
  { label: 'Immutable', icon: Shield },
  { label: 'Borderless', icon: Globe },
  { label: 'Secure', icon: Zap },
  { label: 'Transparent', icon: Eye },
  { label: 'Decentralized', icon: Network },
  { label: 'Censorship-Resistant', icon: Ban },
  { label: 'Sovereign', icon: Crown },
  { label: 'Inclusive', icon: Users },
  { label: 'Open-Source', icon: Code2 },
]

export function BitcoinTicker() {
  return (
    <div className="relative border-y border-white/8 bg-bg-surface overflow-hidden py-3">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-surface to-transparent z-10 pointer-events-none" />

      <Marquee className="[--duration:40s] [--gap:0px] py-0" repeat={3}>
        {ITEMS.map(({ label, icon: Icon }) => (
          <span key={label} className="inline-flex items-center gap-2.5 mx-8 whitespace-nowrap">
            <Icon className="size-3.5 text-bitcoin shrink-0" />
            <span className="text-sm font-medium text-muted-foreground tracking-wide">{label}</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
