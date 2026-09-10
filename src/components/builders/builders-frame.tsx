'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function BuildersFrame({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const header = document.querySelector('body > header')
    if (!header) return
    const observer = new ResizeObserver(() => {
      root.current?.style.setProperty(
        '--builder-header-height',
        `${header.getBoundingClientRect().height}px`,
      )
    })
    observer.observe(header)
    return () => observer.disconnect()
  }, [])
  return (
    <div className="builders-space" ref={root}>
      {children}
    </div>
  )
}
