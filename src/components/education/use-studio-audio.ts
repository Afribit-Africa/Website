'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { bitcoinLesson } from '@/lib/education'

const PROGRESS_KEY = 'afribit:bitcoin-101:progress'

export function useStudioAudio(initialDuration: number) {
  const audio = useRef<HTMLAudioElement>(null)
  const context = useRef<AudioContext | null>(null)
  const source = useRef<MediaElementAudioSourceNode | null>(null)
  const lastSaved = useRef(0)
  const progressLoaded = useRef(false)
  const pendingSeek = useRef<number | null>(null)
  const audibleVolume = useRef(1)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(initialDuration)
  const [volume, setVolumeState] = useState(1)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeedState] = useState(1)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState('')

  const persist = useCallback(() => {
    if (!audio.current || !progressLoaded.current) return
    try { localStorage.setItem(PROGRESS_KEY, String(audio.current.currentTime)) } catch { /* Storage may be unavailable in private browsing. */ }
  }, [])

  const seek = useCallback((next: number) => {
    const element = audio.current
    if (!element) return
    const total = Number.isFinite(element.duration) ? element.duration : initialDuration
    const target = Math.max(0, Math.min(next, total))
    setTime(target)
    if (element.readyState < 1) {
      pendingSeek.current = target
      return
    }
    element.currentTime = target
    pendingSeek.current = null
    persist()
  }, [initialDuration, persist])

  const play = useCallback(async () => {
    const element = audio.current
    if (!element) return
    setError('')
    try {
      if (element.error) element.load()
      // Create Web Audio only inside a user gesture, preserving mobile playback.
      if (!context.current && typeof AudioContext !== 'undefined') {
        try {
          const nextContext = new AudioContext()
          context.current = nextContext
          source.current = nextContext.createMediaElementSource(element)
          const nextAnalyser = nextContext.createAnalyser()
          nextAnalyser.fftSize = 128
          nextAnalyser.smoothingTimeConstant = 0.85
          source.current.connect(nextAnalyser)
          nextAnalyser.connect(nextContext.destination)
          setAnalyser(nextAnalyser)
        } catch {
          // Audio playback remains available if this browser has no analyser.
        }
      }
      if (context.current?.state === 'suspended') await context.current.resume()
      await element.play()
    } catch {
      setWaiting(false)
      setError('Playback could not start. Please try again.')
    }
  }, [])

  const toggle = useCallback(() => {
    if (!audio.current) return
    if (audio.current.paused) void play()
    else audio.current.pause()
  }, [play])

  const setSpeed = useCallback((next: number) => {
    if (audio.current) audio.current.playbackRate = next
    setSpeedState(next)
  }, [])

  const setVolume = useCallback((next: number) => {
    if (!audio.current) return
    audio.current.volume = next
    audio.current.muted = next === 0
    if (next > 0) audibleVolume.current = next
    setVolumeState(next)
    setMuted(next === 0)
  }, [])

  const toggleMute = useCallback(() => {
    if (!audio.current) return
    audio.current.muted = !audio.current.muted
    if (!audio.current.muted && audio.current.volume === 0) {
      audio.current.volume = audibleVolume.current
      setVolumeState(audibleVolume.current)
    }
    setMuted(audio.current.muted)
  }, [])

  const onMetadata = useCallback(() => {
    const element = audio.current
    if (!element) return
    if (Number.isFinite(element.duration)) setDuration(element.duration)
    if (pendingSeek.current !== null) {
      element.currentTime = Math.min(pendingSeek.current, Number.isFinite(element.duration) ? element.duration : initialDuration)
      pendingSeek.current = null
    } else {
      try {
        const saved = Number(localStorage.getItem(PROGRESS_KEY))
        if (saved > 0 && saved < element.duration - 2) element.currentTime = saved
      } catch { /* Keep the default starting point when storage is unavailable. */ }
    }
    setTime(element.currentTime)
    progressLoaded.current = true
    persist()
  }, [initialDuration, persist])

  const onTimeUpdate = useCallback(() => {
    if (!audio.current) return
    if (pendingSeek.current !== null && audio.current.readyState < 1) return
    setTime(audio.current.currentTime)
    if (Math.abs(audio.current.currentTime - lastSaved.current) > 5) {
      lastSaved.current = audio.current.currentTime
      persist()
    }
  }, [persist])

  const onAudioError = useCallback(() => {
    setWaiting(false)
    setPlaying(false)
    setError('The audio could not load. Check your connection and try again.')
  }, [])

  useEffect(() => {
    const element = audio.current
    // Preloaded audio can finish fetching metadata before React hydrates.
    const metadataTimer = window.setTimeout(() => {
      if (element?.error) { onAudioError(); return }
      if (!progressLoaded.current && element && element.readyState >= 1) onMetadata()
    }, 0)
    window.addEventListener('pagehide', persist)
    return () => {
      window.clearTimeout(metadataTimer)
      window.removeEventListener('pagehide', persist)
      element?.pause()
      persist()
      void context.current?.close()
      context.current = null
      source.current = null
    }
  }, [onAudioError, onMetadata, persist])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: bitcoinLesson.title,
      artist: 'Afribit Studio',
      album: 'Bitcoin fundamentals',
      artwork: [{ src: bitcoinLesson.artwork, sizes: '1600x900', type: 'image/webp' }],
    })
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => { void play() }],
      ['pause', () => audio.current?.pause()],
      ['seekbackward', (details) => seek((audio.current?.currentTime || 0) - (details.seekOffset || 15))],
      ['seekforward', (details) => seek((audio.current?.currentTime || 0) + (details.seekOffset || 15))],
      ['seekto', (details) => { if (details.seekTime !== undefined) seek(details.seekTime) }],
    ]
    for (const [action, handler] of handlers) {
      try { navigator.mediaSession.setActionHandler(action, handler) } catch { /* Some browsers support only a subset of media actions. */ }
    }
    return () => {
      for (const [action] of handlers) {
        try { navigator.mediaSession.setActionHandler(action, null) } catch { /* Unsupported action. */ }
      }
      navigator.mediaSession.metadata = null
    }
  }, [play, seek])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
    try {
      navigator.mediaSession.setPositionState({ duration, playbackRate: speed, position: Math.min(time, duration) })
    } catch { /* Position-state support varies across browsers. */ }
  }, [playing, duration, speed, time])

  return {
    audioRef: audio, analyser, playing, time, duration, volume, muted, speed, waiting, error,
    seek, play, toggle, setSpeed, setVolume, toggleMute,
    audioEvents: {
      onLoadedMetadata: onMetadata,
      onTimeUpdate,
      onPlay: () => { setPlaying(true); setWaiting(false) },
      onPause: () => { setPlaying(false); persist() },
      onEnded: () => { setPlaying(false); persist() },
      onWaiting: () => setWaiting(true),
      onPlaying: () => setWaiting(false),
      onCanPlay: () => setWaiting(false),
      onError: onAudioError,
    },
  }
}
