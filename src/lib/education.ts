export interface TranscriptSegment {
  start: number
  end: number
  text: string
}

export interface EducationChapter {
  start: number
  title: string
  summary: string
}

export interface EducationMedia {
  duration: number
  segments: TranscriptSegment[]
  chapters: EducationChapter[]
  waveform: number[]
}

export const bitcoinLesson = {
  id: 'bitcoin-podcast-101',
  title: 'Bitcoin Podcast 101',
  subtitle: 'How Bitcoin replaces banks with math',
  description:
    'Begin with the big questions. What is money, who do we trust, and how can a network let us exchange value without a bank in the middle?',
  audio: '/education/bitcoin-101.mp3',
  captions: '/education/bitcoin-101.vtt',
  artwork: '/education/globe-cover.webp',
  globeTexture: '/education/earth-surface.webp',
  imageryCredit: 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/',
  href: '/studio/bitcoin-podcast-101',
  language: 'English',
} as const

export interface ReadingCue extends TranscriptSegment {
  segmentIndex: number
}

export function createReadingCues(segments: TranscriptSegment[]): ReadingCue[] {
  return segments.flatMap((segment, segmentIndex) => {
    const words = segment.text.trim().split(/\s+/)
    const groups: string[][] = []
    let group: string[] = []
    for (const word of words) {
      group.push(word)
      if (group.length >= 14 || (group.length >= 6 && /[.!?]["')]*$/.test(word))) {
        groups.push(group)
        group = []
      }
    }
    if (group.length) groups.push(group)
    let offset = 0
    // Short reading phrases use proportional timing within each real ASR utterance,
    // not claimed word-level alignment. The original transcript remains unchanged.
    return groups.map((phrase) => {
      const start = segment.start + (segment.end - segment.start) * offset / words.length
      offset += phrase.length
      return { start, end: segment.start + (segment.end - segment.start) * offset / words.length,
        text: phrase.join(' '), segmentIndex }
    })
  })
}

export function readingPosition(cues: ReadingCue[], time: number) {
  let lower = 0
  let upper = cues.length - 1
  while (lower <= upper) {
    const middle = (lower + upper) >>> 1
    if (cues[middle].start <= time) lower = middle + 1
    else upper = middle - 1
  }
  return Math.max(0, upper)
}

export const learningConcepts = [
  {
    id: 'bitcoin',
    title: 'Money, person to person',
    label: 'Bitcoin',
    body: 'Bitcoin is digital money that people can send directly to each other. An open network checks the rules, instead of a bank keeping everyone\'s balance.',
    source: 'https://bitcoin.org/en/how-it-works',
  },
  {
    id: 'ledger',
    title: 'A record we can verify',
    label: 'The ledger',
    body: 'Transactions are recorded in blocks linked to earlier blocks. Independent nodes check this shared history against the same rules. A block is a record of transactions, not a container of coins.',
    source: 'https://bitcoin.org/en/how-it-works',
  },
  {
    id: 'network',
    title: 'Many computers. Shared rules.',
    label: 'The network',
    body: 'Bitcoin nodes check transactions and blocks for themselves. They share valid information with their peers. There is no single computer that owns or controls the whole record.',
    source: 'https://bitcoin.org/en/full-node',
  },
  {
    id: 'keys',
    title: 'Your keys authorize spending',
    label: 'Ownership',
    body: 'A wallet manages the keys used to authorize transactions. Your bitcoin is recorded on the shared ledger. Keep private keys and recovery words private, and make a secure backup.',
    source: 'https://bitcoin.org/en/secure-your-wallet',
  },
] as const

export function formatAudioTime(seconds: number) {
  const whole = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

export function segmentAt(segments: TranscriptSegment[], time: number) {
  let lower = 0
  let upper = segments.length - 1
  while (lower <= upper) {
    const middle = (lower + upper) >>> 1
    const segment = segments[middle]
    if (time < segment.start) upper = middle - 1
    else if (time >= segment.end) lower = middle + 1
    else return middle
  }
  return -1
}

export function chapterAt(chapters: EducationChapter[], time: number) {
  let index = 0
  for (let i = 0; i < chapters.length; i++) {
    if (chapters[i].start <= time) index = i
    else break
  }
  return index
}

export function chapterScene(title: string) {
  if (/\b(mining|work|energy)\b/i.test(title)) return 'mining'
  if (/key|wallet|ownership|privacy/i.test(title)) return 'keys'
  if (/ledger|block|transaction|payment|math/i.test(title)) return 'ledger'
  if (/network|peer|node|everyone|consensus/i.test(title)) return 'network'
  return 'money'
}
