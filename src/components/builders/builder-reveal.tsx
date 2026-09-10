'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate } from 'animejs'
import { useReducedMotion } from 'framer-motion'

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
}) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const element = root.current
    if (!element || reduced !== false) return
    let animation: ReturnType<typeof animate> | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        animation = animate(element, {
          opacity: [0, 1],
          y: [20, 0],
          duration: 650,
          delay: delay * 1000,
          ease: 'out(3)',
        })
        observer.disconnect()
      },
      { threshold: amount },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      animation?.revert()
    }
  }, [amount, delay, reduced])

  // Keep server markup visible and identical for both motion preferences.
  return (
    <div className={className} ref={root}>
      {children}
    </div>
  )
}
