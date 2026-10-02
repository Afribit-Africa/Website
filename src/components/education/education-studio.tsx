'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { animate } from 'animejs'
import {
  ArrowUpRight, AudioLines, Bitcoin, BookOpen, Bookmark, Captions,
  Check, ChevronRight, Download, Headphones, KeyRound, Layers3, ListMusic,
  LoaderCircle, Maximize2, Minimize2, Network, Pause, Play,
  Search, Shuffle, SkipBack, SkipForward, Trash2, Volume2, VolumeX, Waves, X,
} from 'lucide-react'
import { bitcoinLesson, chapterAt, createReadingCues, formatAudioTime, learningConcepts, segmentAt, type EducationMedia } from '@/lib/education'
import { useStudioAudio } from './use-studio-audio'
import { StudioBackdrop } from './studio-backdrop'
import { StudioHeader } from './studio-shell'
import { StudioCredits } from './studio-credits'
import { SyncedReading } from './synced-reading'

const BOOKMARK_KEY = 'afribit:bitcoin-101:bookmarks'
const conceptIcons = [Bitcoin, Layers3, Network, KeyRound]
const noopSubscribe = () => () => {}
const getServerMotion = () => false
const getMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

interface SavedMoment { id: string; time: number; text: string }
function loadBookmarks(): SavedMoment[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item): item is SavedMoment => typeof item === 'object' && item !== null &&
      typeof item.id === 'string' && typeof item.time === 'number' && Number.isFinite(item.time) &&
      item.time >= 0 && typeof item.text === 'string').slice(0, 100)
  } catch { return [] }
}

function IconButton({ label, children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button type="button" aria-label={label} title={label} className={`studio-icon-button ${className}`} {...props}>{children}</button>
}

export function EducationStudio({ media }: { media: EducationMedia }) {
  const { audioRef, ...player } = useStudioAudio(media.duration)
  const root = useRef<HTMLDivElement>(null)
  const transcriptRoot = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<string>('listen')
  const [captions, setCaptions] = useState(true)
  const [motion, setMotion] = useState(true)
  const [focused, setFocused] = useState(false)
  const [sceneOffset, setSceneOffset] = useState(0)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [following, setFollowing] = useState(true)
  const [saved, setSaved] = useState<SavedMoment[]>([])
  const [note, setNote] = useState('')
  const [notice, setNotice] = useState('')
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion, getServerMotion)
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const activeChapter = chapterAt(media.chapters, player.time)
  const chapter = media.chapters[activeChapter]
  const activeSegment = segmentAt(media.segments, player.time)
  const sentence = media.segments[activeSegment]?.text
  const concept = learningConcepts.find((item) => item.id === selectedConcept)
  const progress = (player.time / player.duration) * 100
  const motionEnabled = motion && !reducedMotion
  const cues = useMemo(() => createReadingCues(media.segments), [media.segments])

  useEffect(() => {
    if (reducedMotion || !root.current) return
    const entrance = animate(root.current.querySelectorAll('[data-studio-enter]'), {
      opacity: [0, 1], translateY: [8, 0], duration: 650, delay: (_: unknown, i: number = 0) => i * 65, ease: 'outQuad',
    })
    return () => { entrance.revert() }
  }, [reducedMotion])

  useEffect(() => {
    const timer = window.setTimeout(() => setSaved(loadBookmarks()), 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 2500)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!transcriptOpen || !following || activeSegment < 0) return
    const frame = requestAnimationFrame(() => {
      const element = transcriptRoot.current
      const line = element?.querySelector<HTMLElement>(`[data-segment="${activeSegment}"]`)
      if (element && line && !query) element.scrollTo({ top: line.offsetTop - element.clientHeight / 3,
        behavior: reducedMotion ? 'instant' : 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [activeSegment, transcriptOpen, following, query, reducedMotion])

  const saveMoments = (next: SavedMoment[]) => {
    setSaved(next)
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next)) } catch { setNotice('This browser could not save your bookmark.') }
  }

  const addBookmark = () => {
    const text = note.trim() || sentence || chapter?.title || bitcoinLesson.title
    const next = [{ id: crypto.randomUUID(), time: player.time, text }, ...saved].slice(0, 100)
    saveMoments(next)
    setNote('')
    setNotice('Bookmark saved')
  }

  const selectChapter = (start: number) => {
    player.seek(start)
    setFollowing(true)
    setSelectedConcept(null)
    setLibraryOpen(false)
  }

  const renderLibrary = () => (
    <div className="studio-library-content">
      <div className="studio-library-heading"><Headphones size={17} /><span>THE LISTENING ROOM</span></div>
      <div className="studio-episode">
        <div className="studio-cover">
          <Image src={bitcoinLesson.artwork} alt="Soft light beams across the dark listening room" fill sizes="(max-width: 767px) 280px, 216px" />
          <span><AudioLines size={16} /> AUDIOBOOK</span>
        </div>
        <div className="studio-episode-meta"><span>CHAPTER 01</span><span>{formatAudioTime(media.duration)}</span></div>
        <h2>Bitcoin Podcast 101</h2>
        <p>How Bitcoin replaces banks with math</p>
        <div className="studio-language"><span />{bitcoinLesson.language}<span className="studio-language-divider">/</span>Beginner</div>
      </div>
      <div className="studio-chapter-heading"><span>IN THIS EPISODE</span><span>{String(media.chapters.length).padStart(2, '0')}</span></div>
      <ol className="studio-chapters">
        {media.chapters.map((item, index) => (
          <li key={item.start}>
            <button type="button" className={index === activeChapter ? 'is-current' : ''} onClick={() => selectChapter(item.start)} aria-current={index === activeChapter ? 'true' : undefined} aria-label={`Seek to ${item.title}, ${formatAudioTime(item.start)}`}>
              <span className="studio-chapter-number">{index < activeChapter ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
              <span className="studio-chapter-name">{item.title}<small>{formatAudioTime(item.start)}</small></span>
              {index === activeChapter && <AudioLines size={15} />}
            </button>
          </li>
        ))}
      </ol>
      <div className="studio-library-bottom">
        <div className="studio-session-progress"><span>Your listening journey</span><strong>{Math.round(progress)}%</strong></div>
        <progress aria-label="Lesson progress" max={100} value={progress} />
        <Link href="/community">Learn with the community<ArrowUpRight size={15} /></Link>
      </div>
    </div>
  )

  return (
    <div className={`education-studio ${focused ? 'is-focused' : ''}`} ref={root} data-hydrated={hydrated}>
      <a className="studio-skip-link" href="#studio-player">Skip to audio player</a>
      <StudioHeader />

      <Tabs.Root value={mode} onValueChange={setMode} className="studio-layout">
        <aside className="studio-sidebar" aria-label="Lesson chapters">{renderLibrary()}</aside>
        <div className="studio-workspace">
          <div className="studio-workspace-nav">
            <Dialog.Root open={libraryOpen} onOpenChange={setLibraryOpen}>
              <Dialog.Trigger asChild><IconButton label="Open episode chapters" className="studio-library-toggle"><ListMusic size={19} /></IconButton></Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="studio-drawer-overlay" />
                <Dialog.Content className="studio-drawer">
                  <Dialog.Title className="sr-only">Episode chapters</Dialog.Title>
                  <Dialog.Description className="sr-only">Bitcoin Podcast 101 chapter navigation</Dialog.Description>
                  <Dialog.Close asChild><IconButton label="Close episode chapters" className="studio-drawer-close"><X size={19} /></IconButton></Dialog.Close>
                  {renderLibrary()}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <div className="studio-view-navigation">
              <Tabs.List className="studio-tabs" aria-label="Learning views">
                <Tabs.Trigger value="listen"><Headphones size={15} /><span>Listen</span></Tabs.Trigger>
                <Tabs.Trigger value="saved"><Bookmark size={15} /><span>Saved</span>{saved.length > 0 && <small>{saved.length}</small>}</Tabs.Trigger>
              </Tabs.List>
              <a className="studio-read-link" href={bitcoinLesson.credits.content.href} target="_blank" rel="noopener noreferrer" aria-label="Read on Btrust Pathways (opens in a new tab)" title="Read on Btrust Pathways"><BookOpen size={15} /><span>Read</span><ArrowUpRight size={12} /></a>
            </div>
            <span className="studio-nav-note">A little curiosity goes a long way.</span>
          </div>

          <div className="studio-lesson-heading" data-studio-enter>
            <div className="studio-eyebrow"><span>CHAPTER 01</span><span className="studio-dot" />BITCOIN FUNDAMENTALS</div>
            <h1>Bitcoin Podcast 101<span className="studio-h1-dot">.</span></h1>
            <p>{bitcoinLesson.subtitle}</p>
          </div>

          <Tabs.Content value="listen" className="studio-listen-panel">
            <div className="studio-world-stage studio-reading-stage" data-studio-enter>
              <StudioBackdrop moving={motionEnabled} sceneOffset={sceneOffset} />
              <div className="studio-scene-label"><span className="studio-live-dot" /><span>{String(activeChapter + 1).padStart(2, '0')}<span className="studio-label-divider">/</span>{chapter?.title || 'Bitcoin fundamentals'}</span></div>
              <div className="studio-world-tools">
                <IconButton label="Change scenery" onClick={() => setSceneOffset((value) => (value + 1) % 3)}><Shuffle size={17} /></IconButton>
                <IconButton label="Search transcript" onClick={() => setTranscriptOpen(true)}><Search size={16} /></IconButton>
                <IconButton label={motionEnabled ? 'Pause visual motion' : 'Resume visual motion'} aria-pressed={motionEnabled} disabled={reducedMotion} onClick={() => setMotion(!motion)}><Waves size={17} /></IconButton>
                <IconButton label={focused ? 'Exit focus mode' : 'Enter focus mode'} onClick={() => setFocused(!focused)}><>{focused ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</></IconButton>
              </div>
              {captions && <SyncedReading cues={cues} time={player.time} following={following} reducedMotion={reducedMotion}
                onBrowse={() => setFollowing(false)} onSeek={(time) => { player.seek(time); setFollowing(true) }} />}
              <div className="studio-reading-bottom">
                {captions && <button type="button" className="studio-follow" aria-pressed={following} onClick={() => setFollowing(!following)}><AudioLines size={15} />{following ? 'Following narration' : 'Follow narration'}</button>}
                <span className="studio-scenery-dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
            </div>
            <div className="studio-reading-caption"><BookOpen size={13} /><span>Bitcoin Podcast 101 / English</span><span>Automatic transcription</span></div>
            <div className="studio-concept-strip" aria-label="Explore Bitcoin concepts">
              <span className="studio-concept-strip-label">A CLOSER LOOK</span>
              <div className="studio-concept-buttons">
                {learningConcepts.map((item, index) => {
                  const Icon = conceptIcons[index]
                  return <button type="button" key={item.id} aria-pressed={selectedConcept === item.id} onClick={() => setSelectedConcept(selectedConcept === item.id ? null : item.id)}><Icon size={15} /><span>{item.label}</span></button>
                })}
              </div>
            </div>
            {concept && <div className="studio-concept-detail" role="region" aria-label={concept.title}>
              <div><h2>{concept.title}</h2><p>{concept.body}</p><a href={concept.source} target="_blank" rel="noopener noreferrer">Bitcoin.org<ArrowUpRight size={13} /></a></div>
              <IconButton label="Close concept" onClick={() => setSelectedConcept(null)}><X size={17} /></IconButton>
            </div>}
          </Tabs.Content>

          <Dialog.Root open={transcriptOpen} onOpenChange={setTranscriptOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="studio-drawer-overlay" />
              <Dialog.Content className="studio-transcript-dialog">
                <div className="studio-reading-heading"><div><Dialog.Title>Transcript</Dialog.Title><Dialog.Description>Bitcoin Podcast 101</Dialog.Description></div><Dialog.Close asChild><IconButton label="Close transcript"><X size={19} /></IconButton></Dialog.Close></div>
                <label className="studio-search"><Search size={17} /><input type="search" placeholder="Find a word or idea" aria-label="Search transcript" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <IconButton label="Clear transcript search" onClick={() => setQuery('')}><X size={15} /></IconButton>}</label>
                <div className="studio-transcript" ref={transcriptRoot} onWheel={() => setFollowing(false)} onTouchMove={() => setFollowing(false)}>
                  {media.segments.map((segment, index) => ({ segment, index })).filter(({ segment }) => segment.text.toLowerCase().includes(query.toLowerCase())).map(({ segment, index }) => <div key={`${segment.start}-${index}`} data-segment={index} className={`studio-transcript-line ${activeSegment === index ? 'is-speaking' : ''}`}><button type="button" onClick={() => { player.seek(segment.start); setFollowing(true); setCaptions(true); setTranscriptOpen(false); setMode('listen') }} aria-label={`Seek to ${formatAudioTime(segment.start)}`}><Play size={10} />{formatAudioTime(segment.start)}</button><p>{segment.text}</p></div>)}
                  {query && !media.segments.some((item) => item.text.toLowerCase().includes(query.toLowerCase())) && <p className="studio-empty">No matches for &ldquo;{query}&rdquo;.</p>}
                </div>
                <div className="studio-transcript-footer"><span>English / Automatic transcription</span><Link href={bitcoinLesson.captions} download prefetch={false}><Download size={14} />Captions</Link></div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Tabs.Content value="saved" className="studio-saved-panel">
            <div className="studio-reading-heading"><div><span className="studio-eyebrow">YOUR JOURNEY</span><h2>Ideas worth keeping.</h2></div><span className="studio-count">{saved.length} {saved.length === 1 ? 'bookmark' : 'bookmarks'}</span></div>
            <form className="studio-note-form" onSubmit={(event) => { event.preventDefault(); addBookmark() }}>
              <label htmlFor="studio-note">A thought at {formatAudioTime(player.time)}</label>
              <textarea id="studio-note" value={note} maxLength={1000} rows={3} onChange={(event) => setNote(event.target.value)} placeholder="What stayed with you?" />
              <button type="submit"><Bookmark size={15} />Save moment</button>
            </form>
            <div className="studio-bookmarks">
              {saved.map((item) => <div className="studio-bookmark" key={item.id}><button type="button" onClick={() => { player.seek(item.time); setMode('listen') }}><span><Play size={12} />{formatAudioTime(item.time)}</span><p>{item.text}</p></button><IconButton label={`Delete bookmark at ${formatAudioTime(item.time)}`} onClick={() => saveMoments(saved.filter((moment) => moment.id !== item.id))}><Trash2 size={16} /></IconButton></div>)}
              {hydrated && saved.length === 0 && <div className="studio-empty"><Bookmark size={24} /><p>No saved moments yet.</p></div>}
            </div>
          </Tabs.Content>

          <section className="studio-player" id="studio-player" aria-label="Audio player" data-studio-enter>
            <audio ref={audioRef} src={bitcoinLesson.audio} preload="metadata" {...player.audioEvents}>
              <track kind="captions" src={bitcoinLesson.captions} srcLang="en" label="English" />
            </audio>
            <div className="studio-player-top"><span><AudioLines size={14} />{chapter?.title || 'Bitcoin Podcast 101'}</span><span>{formatAudioTime(player.time)}<span className="studio-label-divider">/</span>{formatAudioTime(player.duration)}</span></div>
            <div className="studio-waveform" style={{ '--studio-progress': `${progress}%` } as CSSProperties}>
              <div className="studio-waveform-bars" aria-hidden="true">{Array.from({ length: 150 }, (_, index) => {
                const peak = media.waveform[Math.floor(index * media.waveform.length / 150)] || 0
                return <span key={index} className={index / 150 <= progress / 100 ? 'is-played' : ''} style={{ height: `${Math.max(8, peak * 100)}%` }} />
              })}</div>
              <input type="range" min={0} max={player.duration} step={0.1} value={player.time} onChange={(event) => player.seek(Number(event.target.value))} aria-label="Seek audio" aria-valuetext={`${formatAudioTime(player.time)} of ${formatAudioTime(player.duration)}`} />
              <span className="studio-playhead" aria-hidden="true" />
            </div>
            <div className="studio-player-controls">
              <div className="studio-volume"><IconButton label={player.muted ? 'Unmute audio' : 'Mute audio'} onClick={player.toggleMute}>{player.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</IconButton><input type="range" min={0} max={1} step={0.05} value={player.muted ? 0 : player.volume} onChange={(event) => player.setVolume(Number(event.target.value))} aria-label="Audio volume" /></div>
              <div className="studio-transport">
                <IconButton label="Rewind 15 seconds" onClick={() => player.seek(player.time - 15)}><SkipBack size={19} /><small>15</small></IconButton>
                <IconButton label={player.playing ? 'Pause audio' : 'Play audio'} onClick={player.toggle} className="studio-play-button">{player.waiting ? <LoaderCircle size={23} className="studio-spinner" /> : player.playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}</IconButton>
                <IconButton label="Forward 15 seconds" onClick={() => player.seek(player.time + 15)}><SkipForward size={19} /><small>15</small></IconButton>
              </div>
              <div className="studio-player-options">
                <label className="studio-speed"><span className="sr-only">Playback speed</span><select aria-label="Playback speed" value={player.speed} onChange={(event) => player.setSpeed(Number(event.target.value))}>{[0.75, 1, 1.25, 1.5, 2].map((rate) => <option key={rate} value={rate}>{rate}x</option>)}</select></label>
                <IconButton label="Save bookmark" onClick={addBookmark}><Bookmark size={18} /></IconButton>
                {mode === 'listen' && <IconButton label={captions ? 'Hide read-along' : 'Show read-along'} aria-pressed={captions} onClick={() => setCaptions(!captions)}><Captions size={20} /></IconButton>}
                <Link href={bitcoinLesson.audio} className="studio-icon-button studio-download" aria-label="Download audiobook" title="Download audiobook" download prefetch={false}><Download size={18} /></Link>
              </div>
            </div>
            <div className="studio-player-message" role="status">{player.error || notice}</div>
          </section>
          <StudioCredits />
          <div className="studio-bottom-line"><span>MADE FOR CURIOUS MINDS.</span><Link href="/community">Rooted in Kibera. Open to everyone.<ChevronRight size={13} /></Link></div>
        </div>
      </Tabs.Root>
    </div>
  )
}
