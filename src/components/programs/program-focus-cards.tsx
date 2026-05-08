import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ProgramContent } from '@/lib/programs'
import { CometCard } from '@/components/ui/comet-card'

interface ProgramFocusCardsProps {
  programs: ProgramContent[]
}

export function ProgramFocusCards({ programs }: ProgramFocusCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {programs.map((program) => (
        <CometCard key={program.slug} className="min-h-[360px]">
          <Link href={`/programs/${program.slug}`} className="group relative block h-full w-full">
            <Image
              src={program.imageSrc}
              alt={program.imageAlt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,147,26,0.22),transparent_18rem)] opacity-80" />

            <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                  {program.statusLabel}
                </span>
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${program.iconBackgroundClassName} backdrop-blur-sm`}>
                  <program.icon className={`size-5 ${program.iconClassName}`} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                  {program.impactValue}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-white md:text-[2rem]">
                  {program.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
                  {program.summary}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-bitcoin transition-transform duration-300 group-hover:translate-x-1">
                  Explore program
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </div>
          </Link>
        </CometCard>
      ))}
    </div>
  )
}