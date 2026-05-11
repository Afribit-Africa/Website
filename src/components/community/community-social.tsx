import { Container } from '@/components/layout/container'
import { Twitter, Instagram, Youtube, MessageCircle, ExternalLink } from 'lucide-react'

const CHANNELS = [
  {
    icon: MessageCircle,
    title: 'Telegram',
    handle: '@afribit_africa',
    desc: 'Our most active community group. Updates, discussions, and announcements.',
    link: 'https://t.me/afribit_africa',
    color: 'text-bitcoin',
    bg: 'bg-bitcoin/8',
    border: 'border-bitcoin/20',
  },
  {
    icon: Twitter,
    title: 'X (Twitter)',
    handle: '@afribitkibera',
    desc: 'Follow for real-time updates from the ground in Kibera.',
    link: 'https://x.com/afribitkibera',
    color: 'text-foreground',
    bg: 'bg-white/5',
    border: 'border-white/10',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    handle: '+254 746 385 499',
    desc: 'Message us directly for questions, partnerships, or to connect.',
    link: 'https://wa.me/254746385499',
    color: 'text-panafrican-green',
    bg: 'bg-panafrican-green/8',
    border: 'border-panafrican-green/20',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    handle: '@afribit_africa',
    desc: 'Photos and stories from community training sessions and events.',
    link: 'https://www.instagram.com/afribit_africa/',
    color: 'text-panafrican-red',
    bg: 'bg-panafrican-red/8',
    border: 'border-panafrican-red/20',
  },
  {
    icon: Youtube,
    title: 'YouTube',
    handle: '@AfribitAfrica',
    desc: 'Watch Bitcoin education videos, community stories, and event recordings.',
    link: 'https://www.youtube.com/@AfribitAfrica',
    color: 'text-bitcoin',
    bg: 'bg-bitcoin/8',
    border: 'border-bitcoin/20',
  },
  {
    icon: ExternalLink,
    title: 'Medium',
    handle: '@afribitkibera',
    desc: 'Long-form articles on Bitcoin adoption, community impact, and our work.',
    link: 'https://medium.com/@afribitkibera',
    color: 'text-muted-foreground',
    bg: 'bg-white/5',
    border: 'border-white/10',
  },
]

export function CommunitySocial() {
  return (
    <section className="section bg-bg-surface/30">
      <Container>
        <div className="section-intro">
          <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">
            Find Us Online
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Follow the Movement
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Connect with Afribit across every platform. We share progress, stories, and
            education from Kibera daily.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANNELS.map((c) => (
            <a
              key={c.title}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group rounded-2xl border ${c.border} ${c.bg} p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-bg-surface flex items-center justify-center">
                  <c.icon className={`size-5 ${c.color}`} aria-hidden="true" />
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </div>
              <div>
                <div className="font-display font-semibold text-foreground mb-0.5">{c.title}</div>
                <div className={`text-xs font-medium mb-2 ${c.color}`}>{c.handle}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
