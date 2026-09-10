'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, createScope, stagger } from 'animejs'
import { useReducedMotion } from 'framer-motion'

export function BuildersMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced !== false || !root.current) return
    const scope = createScope({ root }).add(() => {
      animate('[data-builder-enter]', {
        opacity: [0, 1],
        y: [28, 0],
        duration: 850,
        delay: stagger(100),
        ease: 'out(4)',
      })
    })
    const element = root.current
    const grid = element.querySelector<HTMLElement>('[data-builder-grid]')
    let movement: ReturnType<typeof animate> | undefined
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !grid) return
      const rect = element.getBoundingClientRect()
      movement?.cancel()
      movement = animate(grid, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.018,
        y: (event.clientY - rect.top - rect.height / 2) * 0.018,
        duration: 650,
        ease: 'out(3)',
      })
    }
    const reset = () => {
      if (!grid) return
      movement?.cancel()
      movement = animate(grid, { x: 0, y: 0, duration: 650, ease: 'out(3)' })
    }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', reset)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', reset)
      movement?.revert()
      scope.revert()
    }
  }, [reduced])

  return (
    <div ref={root} className="builders-hero-motion">
      {children}
    </div>
  )
}
