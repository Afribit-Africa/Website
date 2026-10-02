'use client'

import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
function subscribe(listener: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
function snapshot() { return window.matchMedia(query).matches }
function serverSnapshot() { return true }

// A static first render keeps server HTML and hydration identical. Motion is
// enhanced only after hydration when the visitor's preference is known.
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
