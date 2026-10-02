'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { bitcoinLesson } from '@/lib/education'
import { createStudioBackground, type BackgroundRuntime } from './background-runtime'

export function StudioBackdrop({ moving, sceneOffset }: { moving: boolean; sceneOffset: number }) {
  const root = useRef<HTMLDivElement>(null)
  const runtime = useRef<BackgroundRuntime | null>(null)
  useEffect(() => {
    const container = root.current
    if (!container) return
    runtime.current = createStudioBackground(container)
    runtime.current?.update(container.dataset.moving === 'true', Number(container.dataset.offset))
    return () => { runtime.current?.dispose(); runtime.current = null }
  }, [])
  useEffect(() => { runtime.current?.update(moving, sceneOffset) }, [moving, sceneOffset])
  return <div className="studio-animated-backdrop" ref={root} data-moving={moving} data-offset={sceneOffset} data-background="loading" aria-hidden="true">
    <Image src={bitcoinLesson.artwork} alt="" fill sizes="100vw" priority />
    <canvas />
  </div>
}
