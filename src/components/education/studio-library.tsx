'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Tabs from '@radix-ui/react-tabs'
import { ArrowUpRight, AudioLines, BookOpen, Headphones, Library, Play, Video } from 'lucide-react'
import { bitcoinLesson, formatAudioTime } from '@/lib/education'
import { StudioHeader } from './studio-shell'
import { StudioCredits } from './studio-credits'

const formats = [
  { id: 'audio', name: 'Audiobooks', icon: Headphones, count: 1 },
  { id: 'video', name: 'Videos', icon: Video, count: 0 },
  { id: 'books', name: 'Books', icon: Library, count: 0 },
]

export function StudioLibrary({ duration, chapters }: { duration: number; chapters: number }) {
  const [format, setFormat] = useState('audio')
  const [query, setQuery] = useState('')
  const available = format === 'audio'
  const matches = `${bitcoinLesson.title} ${bitcoinLesson.subtitle} Bitcoin fundamentals`.toLowerCase().includes(query.toLowerCase())
  return <div className="education-studio studio-catalog">
    <StudioHeader library />
    <div className="studio-catalog-inner">
      <div className="studio-catalog-heading"><div><div className="studio-eyebrow"><span>LEARN. QUESTION. EXPLORE.</span></div><h1>Afribit Studio<span>.</span></h1><p>A little curiosity goes a long way.</p></div><span className="studio-library-mark"><AudioLines size={40} strokeWidth={1} /></span></div>
      <Tabs.Root value={format} onValueChange={setFormat}>
        <div className="studio-catalog-toolbar">
          <div className="studio-format-navigation">
            <Tabs.List className="studio-format-tabs" aria-label="Media formats">{formats.map((item) => <Tabs.Trigger value={item.id} key={item.id}><item.icon size={17} /><span>{item.name}</span><small>{item.count}</small></Tabs.Trigger>)}</Tabs.List>
            <a className="studio-read-link" href={bitcoinLesson.credits.content.href} target="_blank" rel="noopener noreferrer" aria-label="Read on Btrust Pathways (opens in a new tab)" title="Read on Btrust Pathways"><BookOpen size={17} /><span>Read</span><ArrowUpRight size={12} /></a>
          </div>
          <label className="studio-catalog-search"><span className="sr-only">Search library</span><input type="search" aria-label="Search library" placeholder="Find a title" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </div>
        {formats.map((item) => <Tabs.Content key={item.id} value={item.id} className="studio-collection">
          <div className="studio-collection-heading"><h2>{available ? 'Bitcoin fundamentals' : item.name}</h2><span>{available && matches ? '01 TITLE' : '0 TITLES'}</span></div>
          {available && matches ? <Link href={bitcoinLesson.href} className="studio-title-tile">
            <Image src={bitcoinLesson.artwork} alt="Luminous mint, silver and amber beams across a dark listening room" fill sizes="(max-width: 767px) 100vw, 1180px" priority />
            <div className="studio-title-tile-copy"><span className="studio-title-type"><item.icon size={15} />AUDIOBOOK<span>CHAPTER 01</span></span><h3>Bitcoin<br />Podcast 101<span>.</span></h3><p>{bitcoinLesson.subtitle}</p><div className="studio-title-meta"><span>{formatAudioTime(duration)}</span><span>{chapters} chapters</span><span>English</span></div><span className="studio-title-action"><Play size={18} fill="currentColor" />Enter the listening room<ArrowUpRight size={17} /></span></div>
          </Link> : <div className="studio-catalog-empty"><item.icon size={35} strokeWidth={1} /><h3>{available ? 'No matching titles.' : `No ${item.name.toLowerCase()} in this collection.`}</h3>{available ? <button type="button" onClick={() => setQuery('')}>Clear search</button> : <button type="button" onClick={() => setFormat('audio')}><Headphones size={16} />Explore audiobooks</button>}</div>}
        </Tabs.Content>)}
      </Tabs.Root>
      <StudioCredits />
      <div className="studio-catalog-footer"><span>ROOTED IN KIBERA. OPEN TO EVERYONE.</span><Link href="/community">Learn with the community<ArrowUpRight size={15} /></Link></div>
    </div>
  </div>
}
