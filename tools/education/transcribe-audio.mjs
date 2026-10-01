import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parse } = require('dotenv');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const docsDirectory = path.join(root, 'docs/education');
const { duration, chunks } = JSON.parse(await readFile(path.join(docsDirectory, 'audio-chunks.json'), 'utf8'));
const { waveform } = JSON.parse(await readFile(path.join(docsDirectory, 'waveform.json'), 'utf8'));
const env = parse(await readFile(path.join(root, '.env.local'), 'utf8'));
const key = process.env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY;
if (!key) throw new Error('OPENROUTER_API_KEY is missing.');
const model = process.env.EDUCATION_TRANSCRIPTION_MODEL || 'openai/whisper-1';
const rawDirectory = path.join(docsDirectory, 'transcription', model.split('/').at(-1));
const onlyFirst = process.argv.includes('--first');
await mkdir(rawDirectory, { recursive: true });

for (const chunk of onlyFirst ? chunks.slice(0, 1) : chunks) {
  const destination = path.join(rawDirectory, `chunk-${String(chunk.index).padStart(3, '0')}.json`);
  try {
    await access(destination);
    const cached = JSON.parse(await readFile(destination, 'utf8'));
    if (cached.model === model && cached.response.segments?.length) {
      console.log(JSON.stringify({ status: 'cached', chunk: chunk.index }));
      continue;
    }
  } catch { /* No reusable successful transcription exists yet. */ }
  const audio = await readFile(path.join(root, chunk.file));
  console.log(JSON.stringify({ status: 'transcribing', model, chunk: chunk.index, start: chunk.start, end: chunk.end }));
  const response = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://afribit.africa', 'X-Title': 'Afribit Education Captions' },
    body: JSON.stringify({ model, input_audio: { data: audio.toString('base64'), format: 'mp3' }, language: 'en', temperature: 0, response_format: 'verbose_json', timestamp_granularities: ['word', 'segment'] }),
    signal: AbortSignal.timeout(70000),
  });
  const result = await response.json();
  if (!response.ok || result.error) {
    const message = String(result.error?.message || 'Transcription request failed').replaceAll(key, '[redacted]');
    throw new Error(`OpenRouter ${response.status}: ${message}`);
  }
  await writeFile(destination, `${JSON.stringify({ provider: 'OpenRouter', model, chunk, generatedAt: new Date().toISOString(), generationId: response.headers.get('x-generation-id'), response: result }, null, 2)}\n`);
  if (!Array.isArray(result.segments) || !result.segments.length) {
    throw new Error('Provider returned no segment timestamps. Raw response preserved; do not invent caption timing.');
  }
  console.log(JSON.stringify({ status: 'done', chunk: chunk.index, segments: result.segments.length, words: result.words?.length ?? 0, costUsd: result.usage?.cost ?? null, excerpt: result.text?.slice(0, 250) }));
}
if (onlyFirst) process.exit(0);

const segments = [];
const requests = [];
function captionsFromWords(words) {
  const captions = [];
  let group = [];
  const flush = () => {
    if (!group.length) return;
    const start = group[0].start;
    const end = Math.max(...group.map((word) => word.end));
    const text = group.map((word) => word.word.trim()).join(' ');
    if (end > start && text) captions.push({ start, end, text });
    group = [];
  };
  for (const word of words) {
    if (!Number.isFinite(word.start) || !Number.isFinite(word.end) || typeof word.word !== 'string') throw new Error('Invalid provider word timestamp.');
    const combinedText = [...group, word].map((entry) => entry.word.trim()).join(' ');
    if (group.length && (combinedText.length > 145 || word.end - group[0].start > 7)) flush();
    group.push(word);
    const text = group.map((entry) => entry.word.trim()).join(' ');
    if (/[.!?]$/.test(word.word.trim()) && (text.length >= 45 || word.end - group[0].start >= 2.5)) flush();
  }
  flush();
  return captions;
}
for (const chunk of chunks) {
  const raw = JSON.parse(await readFile(path.join(rawDirectory, `chunk-${String(chunk.index).padStart(3, '0')}.json`), 'utf8'));
  requests.push({ model: raw.model, generationId: raw.generationId, chunk: chunk.index, costUsd: raw.response.usage?.cost ?? null });
  const captionSegments = raw.response.words?.length ? captionsFromWords(raw.response.words) : raw.response.segments;
  for (const segment of captionSegments) {
    const start = Number((chunk.start + segment.start).toFixed(3));
    const end = Number(Math.min(duration, chunk.end, chunk.start + segment.end).toFixed(3));
    const text = String(segment.text || '').trim();
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < chunk.start || end <= start || !text) {
      throw new Error(`Invalid provider segment in chunk ${chunk.index}`);
    }
    if (segments.length && start < segments.at(-1).end - 0.02) {
      const previous = segments.at(-1);
      previous.end = Math.max(previous.end, end);
      previous.text = `${previous.text} ${text}`;
      continue;
    }
    segments.push({ start, end, text });
  }
}
let chapters = [];
try {
  chapters = JSON.parse(await readFile(path.join(docsDirectory, 'chapters.json'), 'utf8'));
} catch { /* Chapters are added only after transcript review. */ }
for (const chapter of chapters) {
  if (!segments.some((segment) => Math.abs(segment.start - chapter.start) < 0.001)) throw new Error('Chapter must start at an actual segment boundary.');
}
const transcript = { duration, segments, chapters, waveform };
await writeFile(path.join(root, 'public/education/bitcoin-101-transcript.json'), `${JSON.stringify(transcript)}\n`);

function timestamp(seconds) {
  const milliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor(milliseconds / 60000) % 60;
  const wholeSeconds = Math.floor(milliseconds / 1000) % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(wholeSeconds).padStart(2, '0')}.${String(milliseconds % 1000).padStart(3, '0')}`;
}
const cues = segments.map((segment, index) => `${index + 1}\n${timestamp(segment.start)} --> ${timestamp(segment.end)}\n${segment.text.replaceAll('-->', '--&gt;').replaceAll('\n', ' ')}\n`);
await writeFile(path.join(root, 'public/education/bitcoin-101.vtt'), `WEBVTT\n\n${cues.join('\n')}`);
await writeFile(path.join(docsDirectory, 'transcript-readable.txt'), segments.map((segment) => `[${timestamp(segment.start)}] ${segment.text}`).join('\n') + '\n');
const knownCost = requests.reduce((sum, request) => sum + (request.costUsd || 0), 0);
await writeFile(path.join(docsDirectory, 'transcription-provenance.json'), `${JSON.stringify({ provider: 'OpenRouter', endpoint: 'https://openrouter.ai/api/v1/audio/transcriptions', timestampSource: 'actual provider verbose_json word timestamps grouped into captions, plus source chunk offsets; segment timestamps used only if words unavailable', reviewed: 'machine-generated, editorial topic review only; not manually verbatim-verified', requests, knownCostUsd: knownCost, segments: segments.length, duration, chapters: chapters.length }, null, 2)}\n`);
console.log(JSON.stringify({ status: 'complete', duration, segments: segments.length, chapters: chapters.length, knownCostUsd: knownCost }));
