'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'

const DEADLINE = new Date('2026-05-12T18:00:00+03:00')
const CROWDFUND_URL = 'https://pay.afribit.africa/apps/2xYtsTMHMqYv6qozQ8j9zjP66FiR/crowdfund'
const STORAGE_KEY = 'maintenance-banner-dismissed'

export function MaintenanceBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (Date.now() >= DEADLINE.getTime()) return
    if (sessionStorage.getItem(STORAGE_KEY)) return
    setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div
      role="banner"
      className="relative z-50 flex items-center gap-3 bg-bitcoin/10 border-b border-bitcoin/20 px-4 py-2.5 text-sm"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-bitcoin animate-pulse" aria-hidden="true" />
      <p className="flex-1 text-foreground/90 leading-snug">
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
