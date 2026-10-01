'use client'

import { useEffect, useRef } from 'react'
import { readingPosition, segmentAt, type ReadingCue } from '@/lib/education'

interface SyncedReadingProps {
  cues: ReadingCue[]
  time: number
  following: boolean
  reducedMotion: boolean
  onBrowse: () => void
  onSeek: (time: number) => void
}

function centerLine(element: HTMLElement, line: HTMLElement, reducedMotion: boolean) {
  const bounds = line.getBoundingClientRect()
  const viewport = element.getBoundingClientRect()
  element.scrollTo({ top: element.scrollTop + bounds.top - viewport.top - (viewport.height - bounds.height) / 2,
    behavior: reducedMotion ? 'instant' : 'smooth' })
}

export function SyncedReading({ cues, time, following, reducedMotion, onBrowse, onSeek }: SyncedReadingProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const index = readingPosition(cues, time)
  const speaking = segmentAt(cues, time)

  useEffect(() => {
    const element = scroller.current
    if (!element || !following) return
    const center = () => {
      const line = element.querySelector<HTMLElement>(`[data-cue="${index}"]`)
      if (!line) return
      centerLine(element, line, reducedMotion)
    }
    const frame = requestAnimationFrame(center)
    const resize = new ResizeObserver(center)
    resize.observe(element)
    const line = element.querySelector<HTMLElement>(`[data-cue="${index}"]`)
    if (line) resize.observe(line)
    return () => { cancelAnimationFrame(frame); resize.disconnect() }
  }, [index, following, reducedMotion])

  return <div className="studio-lyrics" ref={scroller} aria-label="Synchronized reading" tabIndex={0}
    onWheel={onBrowse} onTouchMove={onBrowse} onKeyDown={(event) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) onBrowse()
    }} data-following={following}>
    <div className="studio-lyric-lines">
      {cues.map((cue, cueIndex) => <button key={`${cue.start}-${cueIndex}`} type="button" data-cue={cueIndex}
        className={`studio-lyric-line ${cueIndex === index ? 'is-current' : ''} ${cueIndex < index ? 'is-past' : ''}`}
        aria-current={cueIndex === speaking ? 'true' : undefined}
        onClick={(event) => {
          // Land inside the phrase to avoid browser sample rounding before its boundary.
          onSeek(cue.start + Math.min(0.02, (cue.end - cue.start) / 2))
          if (scroller.current) centerLine(scroller.current, event.currentTarget, reducedMotion)
        }}><span>{cue.text}</span></button>)}
    </div>
  </div>
}
