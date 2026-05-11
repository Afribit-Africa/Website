'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { Container } from '@/components/layout/container'

export function AboutVideo() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="section-tight">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold mb-3">Watch</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Hear Our Story in Our Own Words
            </h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-bg-surface aspect-video">
            {!playing ? (
              <>
                <Image
                  src="/Images/Hero section video background fallback.png"
                  alt="Play Afribit Explanation Video"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 896px, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <button
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Play Afribit explanation video"
                >
                  <div className="size-16 sm:size-20 rounded-full bg-bitcoin flex items-center justify-center shadow-[0_0_40px_rgba(247,147,26,0.4)] group-hover:scale-105 transition-transform duration-300">
                    <Play className="size-6 sm:size-8 fill-bg-base text-bg-base ml-1" />
                  </div>
                </button>
              </>
            ) : (
              <video
                src="/Videos/Afribit Explanation.mp4"
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
