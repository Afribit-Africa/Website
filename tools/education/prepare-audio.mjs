import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const runtime = createRequire(path.join(root, 'scripts/education/runtime/package.json'));
const ffmpeg = process.env.FFMPEG_PATH || runtime('ffmpeg-static');
const ffprobe = process.env.FFPROBE_PATH || runtime('ffprobe-static').path;
const source = path.join(root, 'audio/How_Bitcoin_Replaces_Banks_With_Math.m4a');
const publicDirectory = path.join(root, 'public/education');
const docsDirectory = path.join(root, 'docs/education');
const clipDirectory = path.join(root, 'scripts/education/chunks');

function run(command, args, binary = false) {
  const result = spawnSync(command, args, { encoding: binary ? null : 'utf8', maxBuffer: 128 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(String(result.stderr).slice(-4000));
  return result.stdout;
}

function probe(file) {
  return JSON.parse(run(ffprobe, ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', file]));
}

await mkdir(publicDirectory, { recursive: true });
await mkdir(docsDirectory, { recursive: true });
await mkdir(clipDirectory, { recursive: true });
const sourceMetadata = probe(source);
const duration = Number(sourceMetadata.format.duration);
if (!Number.isFinite(duration) || duration <= 0) throw new Error('Source has no valid duration.');
const mp3 = path.join(publicDirectory, 'bitcoin-101.mp3');
console.log(JSON.stringify({ status: 'encoding', duration }));
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-map', '0:a:0', '-vn',
  '-ac', '1', '-ar', '44100', '-af', 'loudnorm=I=-16:TP=-5:LRA=11', '-c:a', 'libmp3lame', '-b:a', '64k',
  '-map_metadata', '-1', '-metadata', 'title=Bitcoin Podcast 101', '-metadata', 'artist=Afribit Africa', mp3]);
const encodedMetadata = probe(mp3);
const pcm = run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '8000', '-f', 'f32le', 'pipe:1'], true);
const samples = pcm.length / 4;
const peakCount = 1200;
const rawPeaks = Array.from({ length: peakCount }, (_, index) => {
  const first = Math.floor(index * samples / peakCount);
  const last = Math.floor((index + 1) * samples / peakCount);
  let peak = 0;
  for (let sample = first; sample < last; sample++) peak = Math.max(peak, Math.abs(pcm.readFloatLE(sample * 4)));
  return peak;
});
const maximum = Math.max(...rawPeaks);
const waveform = rawPeaks.map((peak) => Number((maximum ? peak / maximum : 0).toFixed(4)));
await writeFile(path.join(docsDirectory, 'waveform.json'), `${JSON.stringify({ duration, decodedDuration: samples / 8000, waveform })}\n`);

const chunks = [];
const chunkSeconds = 120;
for (let start = 0, index = 0; start < duration; start += chunkSeconds, index++) {
  const end = Math.min(duration, start + chunkSeconds);
  const filename = `chunk-${String(index).padStart(3, '0')}.mp3`;
  const destination = path.join(clipDirectory, filename);
  run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(start), '-i', source, '-t', String(end - start),
    '-map', '0:a:0', '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'libmp3lame', '-b:a', '48k', '-map_metadata', '-1', destination]);
  chunks.push({ index, start, end, file: path.relative(root, destination).replaceAll('\\', '/') });
}
await writeFile(path.join(docsDirectory, 'audio-chunks.json'), `${JSON.stringify({ duration, chunks }, null, 2)}\n`);
const sourceHash = createHash('sha256').update(await readFile(source)).digest('hex');
const encodedHash = createHash('sha256').update(await readFile(mp3)).digest('hex');
const provenance = {
  preparedAt: new Date().toISOString(),
  original: { path: 'audio/How_Bitcoin_Replaces_Banks_With_Math.m4a', bytes: (await stat(source)).size, sha256: sourceHash, metadata: sourceMetadata },
  browserAudio: { path: 'public/education/bitcoin-101.mp3', bytes: (await stat(mp3)).size, sha256: encodedHash, metadata: encodedMetadata },
  processing: { codec: 'libmp3lame', bitrate: '64k', channels: 1, sampleRate: 44100, loudness: 'loudnorm=I=-16:TP=-5:LRA=11', peakHeadroom: 'conservative pre-encoder peak target to allow MP3 codec overshoot', trimmed: false },
  waveform: { bins: peakCount, input: 'encoded playback audio', peakType: 'absolute maximum', decodeSampleRate: 8000, normalizedMaximum: maximum, decodedDuration: samples / 8000 },
  transcriptionChunks: { secondsPerChunk: chunkSeconds, count: chunks.length, codec: 'MP3 48k mono 16kHz', offsetsFrom: 'untrimmed original recording' },
};
await writeFile(path.join(docsDirectory, 'audio-provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(JSON.stringify({ status: 'done', duration, encodedDuration: Number(encodedMetadata.format.duration), decodedDuration: samples / 8000, mp3Bytes: provenance.browserAudio.bytes, chunks: chunks.length, waveformBins: waveform.length, sourceSha256: sourceHash }));
