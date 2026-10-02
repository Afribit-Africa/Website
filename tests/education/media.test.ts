import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { bitcoinLesson, chapterAt, chapterScene, createReadingCues, readingPosition, formatAudioTime, segmentAt, type EducationMedia } from '../../src/lib/education'

const media: EducationMedia = JSON.parse(readFileSync(new URL('../../public/education/bitcoin-101-transcript.json', import.meta.url), 'utf8'))

test('lesson credits identify the content source separately from AI audio generation', () => {
  assert.equal(bitcoinLesson.credits.content.name, 'Btrust Pathway')
  assert.equal(bitcoinLesson.credits.content.href, 'https://pathways.btrust.tech/')
  assert.equal(bitcoinLesson.credits.audio.name, 'Gemini')
  assert.equal(new URL(bitcoinLesson.credits.audio.href).hostname, 'gemini.google')
})

test('prepared media has ordered real captions, chapter boundaries, and waveform peaks', () => {
  assert.ok(media.duration > 1400 && media.duration < 1410)
  assert.ok(media.segments.length > 100)
  let previousEnd = 0
  for (const segment of media.segments) {
    assert.ok(segment.start >= previousEnd - 0.02, 'captions overlap or are out of order')
    assert.ok(segment.end > segment.start && segment.end <= media.duration)
    assert.ok(segment.text.trim().length > 0)
    previousEnd = segment.end
  }
  assert.ok(media.chapters.length >= 4)
  assert.equal(media.chapters[0].start, 0)
  for (const [index, chapter] of media.chapters.entries()) {
    assert.ok(media.segments.some((segment) => Math.abs(segment.start - chapter.start) < 0.001))
    if (index > 0) assert.ok(chapter.start > media.chapters[index - 1].start)
  }
  assert.equal(media.waveform.length, 1200)
  assert.ok(media.waveform.every((peak) => Number.isFinite(peak) && peak >= 0 && peak <= 1))
  assert.ok(new Set(media.waveform).size > 100)
})

test('caption lookup does not invent narration across silence or adjacent boundaries', () => {
  const segments = [{ start: 0, end: 2, text: 'First' }, { start: 3, end: 4, text: 'Second' }]
  assert.equal(segmentAt(segments, 0), 0)
  assert.equal(segmentAt(segments, 1.999), 0)
  assert.equal(segmentAt(segments, 2), -1)
  assert.equal(segmentAt(segments, 3), 1)
  assert.equal(segmentAt(segments, 4), -1)
  assert.equal(segmentAt([], 0), -1)
})

test('chapter selection advances at the actual boundary and stays stable afterward', () => {
  const chapters = [{ start: 0, title: 'First', summary: '' }, { start: 120, title: 'Second', summary: '' }]
  assert.equal(chapterAt(chapters, 119.9), 0)
  assert.equal(chapterAt(chapters, 120), 1)
  assert.equal(chapterAt(chapters, 900), 1)
  assert.equal(formatAudioTime(1405.4), '23:25')
  assert.equal(formatAudioTime(Number.NaN), '0:00')
  assert.equal(chapterScene('A network for everyone'), 'network')
  assert.equal(chapterScene('Satoshi and consensus'), 'network')
  assert.equal(chapterScene('Mining and proof of work'), 'mining')
  assert.equal(chapterScene('Sending a Bitcoin payment'), 'ledger')
})

test('reading phrases preserve every spoken token and stay inside real utterance boundaries', () => {
  const cues = createReadingCues(media.segments)
  assert.ok(cues.length > media.segments.length)
  assert.equal(cues.map((cue) => cue.text).join(' ').replace(/\s+/g, ' '), media.segments.map((segment) => segment.text).join(' ').replace(/\s+/g, ' '))
  for (const cue of cues) {
    const original = media.segments[cue.segmentIndex]
    assert.ok(cue.start >= original.start && cue.end <= original.end + 1e-9)
    assert.ok(cue.end > cue.start)
    assert.ok(cue.text.split(/\s+/).length <= 14)
  }
})

test('reading position follows seeking, boundaries and silent gaps without fabricating speech', () => {
  const cues = createReadingCues([{ start: 0, end: 2, text: 'First utterance.' }, { start: 3, end: 4, text: 'Second utterance.' }])
  assert.equal(readingPosition(cues, 0), 0)
  assert.equal(readingPosition(cues, 2.5), 0)
  assert.equal(segmentAt(cues, 2.5), -1)
  assert.equal(readingPosition(cues, 3), 1)
  assert.equal(readingPosition(cues, 0.5), 0)
})
