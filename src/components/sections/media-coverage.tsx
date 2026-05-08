import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Play } from 'lucide-react'

const VIDEOS = [
  {
    id: 'rPVoaYFiIDg',
    outlet: 'BBC News',
    title: 'In Kibera, roadside vegetable stands are accepting an unconventional form of payment',
  },
  {
    id: 'RBUj98JhpWY',
    outlet: 'AP News',
    title: 'Bitcoin adoption in Africa\'s largest informal settlement',
  },
  {
    id: '0Ov1vgy8Gag',
    outlet: 'ABC News',
    title: 'Could cryptocurrency help Africa\'s biggest slum?',
  },
  {
    id: 'l4mUySspn1E',
    outlet: 'Firstpost',
    title: 'Bitcoin circular economy transforming lives in Kibera',
  },
  {
    id: 'oqREM62cAqk',
    outlet: 'Associated Press',
    title: 'Financial inclusion through Bitcoin in Kenya',
  },
  {
    id: 'LRSQSkiil0M',
    outlet: 'Joe Nakamoto',
    title: 'I spent a day using Bitcoin as money in Africa',
  },
]

export function MediaCoverage() {
  return (
    <section className="py-20 bg-bg-surface/50">
      <Container>
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            Media
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Watch Our Story
          </h2>
          <p className="text-muted-foreground">
            Follow the movement on the ground in Kibera.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIDEOS.map((v, i) => (
            <a
              key={i}
              href={`https://youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden border border-white/8 bg-bg-surface hover:border-bitcoin/20 transition-colors"
            >
              <div className="relative aspect-video bg-bg-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:bg-bitcoin/80 transition-colors">
                    <Play className="size-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                {'outlet' in v && (
                  <p className="text-[10px] font-semibold text-bitcoin/80 uppercase tracking-widest mb-1">{v.outlet}</p>
                )}
                <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                  {v.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
