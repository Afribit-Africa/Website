import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const { z } = require('zod');
const { parse } = require('dotenv');
const sharp = require('sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const runtime = createRequire(path.join(root, 'scripts/education/runtime/package.json'));
const ffprobe = process.env.FFPROBE_PATH || runtime('ffprobe-static').path;
const mediaDirectory = path.join(root, 'public/education');
const docsDirectory = path.join(root, 'docs/education');
const transcriptBytes = await readFile(path.join(mediaDirectory, 'bitcoin-101-transcript.json'));
const transcript = z.strictObject({
  duration: z.number().positive(),
  segments: z.array(z.strictObject({ start: z.number().nonnegative(), end: z.number().positive(), text: z.string().min(1) })).min(1),
  chapters: z.array(z.strictObject({ start: z.number().nonnegative(), title: z.string().min(1), summary: z.string().min(1) })).min(1),
  waveform: z.array(z.number().min(0).max(1)).length(1200),
}).parse(JSON.parse(transcriptBytes.toString('utf8')));
for (let index = 0; index < transcript.segments.length; index++) {
  const segment = transcript.segments[index];
  if (segment.end <= segment.start || segment.end > transcript.duration + 0.001) throw new Error(`Invalid caption bounds at ${index}`);
  if (index && segment.start < transcript.segments[index - 1].end - 0.02) throw new Error(`Overlapping captions at ${index}`);
}
for (let index = 0; index < transcript.chapters.length; index++) {
  const chapter = transcript.chapters[index];
  if (!transcript.segments.some((segment) => segment.start === chapter.start)) throw new Error(`Chapter ${index} has no real caption boundary`);
  if (index && chapter.start <= transcript.chapters[index - 1].start) throw new Error('Chapters are not in order');
}
const before = JSON.parse(await readFile(path.join(docsDirectory, 'transcript-before-punctuation.json'), 'utf8'));
function tokens(text) {
  return (text.match(/[\p{L}\p{N}]+(?:['\u2019][\p{L}\p{N}]+)*/gu) || []).map((word) => word.toLowerCase().replaceAll('\u2019', "'"));
}
if (before.segments.length !== transcript.segments.length) throw new Error('Punctuation changed the caption count');
for (let index = 0; index < before.segments.length; index++) {
  if (before.segments[index].start !== transcript.segments[index].start || before.segments[index].end !== transcript.segments[index].end) throw new Error(`Punctuation changed caption timing at ${index}`);
  if (JSON.stringify(tokens(before.segments[index].text)) !== JSON.stringify(tokens(transcript.segments[index].text))) throw new Error(`Punctuation changed spoken words at ${index}`);
}
if (before.duration !== transcript.duration || JSON.stringify(before.waveform) !== JSON.stringify(transcript.waveform)) throw new Error('Punctuation changed duration or waveform');
const vtt = await readFile(path.join(mediaDirectory, 'bitcoin-101.vtt'), 'utf8');
const cues = vtt.trim().split(/\r?\n\r?\n/);
if (cues[0] !== 'WEBVTT' || cues.length - 1 !== transcript.segments.length) throw new Error('VTT header or cue count does not match JSON');
for (let index = 1; index < cues.length; index++) {
  const lines = cues[index].split(/\r?\n/);
  if (Number(lines[0]) !== index || !/^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/.test(lines[1])) throw new Error(`Invalid VTT cue ${index}`);
  if (lines.slice(2).join('\n') !== transcript.segments[index - 1].text.replaceAll('-->', '--&gt;').replaceAll('\n', ' ')) throw new Error(`VTT wording mismatch at cue ${index}`);
}
const audioPath = path.join(mediaDirectory, 'bitcoin-101.mp3');
const probe = spawnSync(ffprobe, ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', audioPath], { encoding: 'utf8' });
if (probe.status !== 0) throw new Error(probe.stderr);
const audio = JSON.parse(probe.stdout);
if (audio.streams[0].codec_name !== 'mp3' || audio.streams[0].channels !== 1 || audio.streams[0].bit_rate !== '64000') throw new Error('MP3 encoding does not match the browser media contract');
if (Math.abs(Number(audio.format.duration) - transcript.duration) > 0.06) throw new Error('Audio and transcript durations disagree');
const provenance = JSON.parse(await readFile(path.join(docsDirectory, 'audio-provenance.json'), 'utf8'));
const originalHash = createHash('sha256').update(await readFile(path.join(root, provenance.original.path))).digest('hex');
if (originalHash !== provenance.original.sha256) throw new Error('Original audio was altered');
const audioHash = createHash('sha256').update(await readFile(audioPath)).digest('hex');
if (audioHash !== provenance.browserAudio.sha256) throw new Error('Encoded audio no longer matches its provenance');
const scenic = await sharp(path.join(mediaDirectory, 'bitcoin-network.webp')).metadata();
const concept = await sharp(path.join(docsDirectory, 'bitcoin-studio-concept.webp')).metadata();
if (scenic.format !== 'webp' || scenic.width < 1600 || scenic.height < 800) throw new Error('Scenic asset does not meet the resolution contract');
const globe = await sharp(path.join(mediaDirectory, 'earth-surface.webp')).metadata();
const cover = await sharp(path.join(mediaDirectory, 'globe-cover.webp')).metadata();
const studioCover = await sharp(path.join(mediaDirectory, 'studio-cover.webp')).metadata();
if (studioCover.format !== 'webp' || studioCover.width !== 1600 || studioCover.height !== 900) throw new Error('Studio cover does not match the background contract');
const backgroundProvenance = JSON.parse(await readFile(path.join(docsDirectory, 'studio-background-provenance.json'), 'utf8'));
if (createHash('sha256').update(await readFile(path.join(root, backgroundProvenance.artifact.path))).digest('hex') !== backgroundProvenance.artifact.sha256) throw new Error('Studio cover no longer matches provenance');
if (globe.width !== 2048 || globe.height !== 1024 || cover.width !== 1600 || cover.height !== 900) throw new Error('Globe texture/cover dimensions do not match contract');
const globeProvenance = JSON.parse(await readFile(path.join(docsDirectory, 'globe-provenance.json'), 'utf8'));
for (const artifact of globeProvenance.artifacts) {
  const bytes = await readFile(path.join(root, artifact.path));
  if (createHash('sha256').update(bytes).digest('hex') !== artifact.sha256) throw new Error('Globe asset no longer matches provenance');
}

async function filesUnder(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const destination = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(destination));
    else result.push(destination);
  }
  return result;
}
const textFiles = [...await filesUnder(docsDirectory), ...await filesUnder(path.join(root, 'tools/education')), ...await filesUnder(mediaDirectory)].filter((file) => /\.(json|md|mjs|txt|vtt)$/.test(file));
const env = parse(await readFile(path.join(root, '.env.local'), 'utf8'));
for (const file of textFiles) if (env.OPENROUTER_API_KEY && (await readFile(file, 'utf8')).includes(env.OPENROUTER_API_KEY)) throw new Error('Secret found in education artifact');
const costs = [];
const generationIds = new Set();
for (const file of textFiles.filter((file) => file.endsWith('.json'))) {
  const entry = JSON.parse(await readFile(file, 'utf8'));
  const id = entry.response ? entry.generationId : entry.id;
  const cost = entry.response ? entry.response.usage?.cost : entry.choices ? entry.usage?.cost : null;
  if (id && cost !== null && cost !== undefined && !generationIds.has(id)) {
    generationIds.add(id);
    costs.push({ generationId: id, costUsd: cost, record: path.relative(root, file).replaceAll('\\', '/') });
  }
}
for (const filename of ['bitcoin-studio-concept-provenance.json', 'bitcoin-network-provenance.json']) {
  const entry = JSON.parse(await readFile(path.join(docsDirectory, filename), 'utf8'));
  costs.push({ generationId: entry.generationId, costUsd: entry.costUsd, record: `docs/education/${filename}` });
}
const totalCostUsd = costs.reduce((sum, entry) => sum + (entry.costUsd || 0), 0);
await writeFile(path.join(docsDirectory, 'provider-costs.json'), `${JSON.stringify({ totalKnownCostUsd: totalCostUsd, includesRejectedPunctuationAttempts: true, generations: costs }, null, 2)}\n`);
const report = {
  validatedAt: new Date().toISOString(), status: 'passed', duration: transcript.duration, encodedDuration: Number(audio.format.duration),
  segments: transcript.segments.length, chapters: transcript.chapters.length, waveformBins: transcript.waveform.length,
  mp3Bytes: (await stat(audioPath)).size, originalUnchanged: true, noSecretInArtifacts: true,
  wordingAndTimingPreservedDuringPunctuation: true, durationAndWaveformPreservedDuringPunctuation: true,
  vttMatchesJson: true, scenic: { width: scenic.width, height: scenic.height, bytes: (await stat(path.join(mediaDirectory, 'bitcoin-network.webp'))).size },
  concept: { width: concept.width, height: concept.height }, totalKnownProviderCostUsd: totalCostUsd,
  background: { coverWidth: studioCover.width, coverHeight: studioCover.height, provenanceMatches: true, scenes: ['beams', 'paths', 'flow'] },
  historicalGlobe: { textureWidth: globe.width, textureHeight: globe.height, coverWidth: cover.width, coverHeight: cover.height, provenanceMatches: true, currentlyDisplayed: false },
};
await writeFile(path.join(docsDirectory, 'validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
