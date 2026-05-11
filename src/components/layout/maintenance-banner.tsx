'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'

const DEADLINE = new Date('2026-05-12T18:00:00+03:00')
const CROWDFUND_URL = 'https://pay.afribit.africa/apps/2xYtsTMHMqYv6qozQ8j9zjP66FiR/crowdfund'
const STORAGE_KEY = 'maintenance-banner-dismissed'

export function MaintenanceBanner() {
  const [visible, setVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const setHeight = (height: number) => {
      root.style.setProperty('--maintenance-banner-height', `${height}px`)
    }

    if (!visible || !bannerRef.current) {
      setHeight(0)
      return () => setHeight(0)
    }

    const element = bannerRef.current
    const updateHeight = () => setHeight(element.getBoundingClientRect().height)

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)
    window.addEventListener('resize', updateHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateHeight)
      setHeight(0)
    }
  }, [visible])

  useEffect(() => {
    if (Date.now() >= DEADLINE.getTime()) return
    if (sessionStorage.getItem(STORAGE_KEY)) return
    setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div
      ref={bannerRef}
      role="banner"
      className="fixed inset-x-0 top-0 z-[60] flex flex-wrap items-start gap-3 border-b border-bitcoin/20 bg-bg-base/95 px-4 py-2.5 text-sm backdrop-blur-md sm:flex-nowrap sm:items-center"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-bitcoin animate-pulse" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-foreground/90 leading-snug">
        <span className="font-semibold text-bitcoin">Site update in progress</span>
        {' — '}UI changes rolling out through{' '}
        <time dateTime="2026-05-12T18:00:00+03:00">Sunday 12 May, 18:00 EAT</time>.
        {' '}While the donation page is being updated,{' '}
        <a
          href={CROWDFUND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-bitcoin underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          donate directly here
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
        .
      </p>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem(STORAGE_KEY, '1')
          setVisible(false)
        }}
        aria-label="Dismiss notice"
        className="shrink-0 rounded-md p-1 text-foreground/60 hover:text-foreground hover:bg-white/8 transition-colors"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
