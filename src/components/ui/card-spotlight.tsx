'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number
  color?: string
}

export function CardSpotlight({
  children,
  radius = 350,
  color = 'rgba(247,147,26,0.08)',
  className,
  ...props
}: CardSpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(1)
  }
  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }
  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => setOpacity(0)

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/8 bg-bg-surface',
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${color}, transparent 80%)`,
        }}
      />
      {/* subtle comet streak */}
      <div
        className="pointer-events-none absolute -top-px left-1/2 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-bitcoin/40 to-transparent"
        aria-hidden
      />
      {children}
    </div>
  )
}
