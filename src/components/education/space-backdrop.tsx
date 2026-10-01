'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { bitcoinLesson } from '@/lib/education'
import type { GlobeRuntime } from './globe-runtime'

export function SpaceBackdrop({ moving, interactive = false }: { moving: boolean; interactive?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const runtime = useRef<GlobeRuntime | null>(null)

  useEffect(() => {
    const container = root.current
    if (!container) return
    let cancelled = false
    void import('./globe-runtime').then(({ createGlobe }) => {
      if (cancelled) return
      runtime.current = createGlobe(container)
      // Use current props after the asynchronous scene chunk loads.
      runtime.current?.update(container.dataset.moving === 'true', container.dataset.interactive === 'true')
    }).catch(() => { container.dataset.globe = 'fallback' })
    return () => { cancelled = true; runtime.current?.dispose(); runtime.current = null }
  }, [])

  useEffect(() => { runtime.current?.update(moving, interactive) }, [moving, interactive])

  return <div className="studio-space-backdrop" ref={root} data-moving={moving} data-interactive={interactive} data-globe="loading">
    <Image src={bitcoinLesson.artwork} alt="" fill sizes="100vw" priority />
  </div>
}
