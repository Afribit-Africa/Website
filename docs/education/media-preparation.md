# Education media preparation

Utilities live in `tools/education/` so they are trackable. Downloaded ffmpeg
binaries and transcription input chunks live in ignored `scripts/education/`.
No dependencies were added to the application's package files.

Install preparation tools into the ignored runtime:

```powershell
npm install --prefix scripts/education/runtime --no-save --package-lock=false ffmpeg-static ffprobe-static
```

`FFMPEG_PATH` and `FFPROBE_PATH` can instead point at existing complete binaries.
Playwright's ffmpeg is unsuitable because it omits AAC and MP3 audio support.

Run from the repo root:

```powershell
node tools/education/inspect-provider.mjs
node tools/education/generate-image.mjs docs/education/concept-prompt.json docs/education/bitcoin-studio-concept.webp
node tools/education/generate-image.mjs docs/education/network-prompt.json public/education/bitcoin-network.webp
node tools/education/prepare-audio.mjs
node tools/education/transcribe-audio.mjs --first
node tools/education/transcribe-audio.mjs
node tools/education/finalize-chapters.mjs
node tools/education/punctuate-transcript.mjs
node tools/education/prepare-globe.mjs
node tools/education/validate-media.mjs
```

Image generation and transcription read `OPENROUTER_API_KEY` from the process
environment or ignored `.env.local`. Requests send credentials in the server-side
Authorization header only. Model availability is discovered from the current
OpenRouter catalog, and the checked catalog is preserved without secret values.

Transcription uses 120-second mono MP3 chunks taken directly from the original
recording. Segment start/end values come from the provider's `verbose_json`
response plus the exact source chunk offset; utilities fail if no timestamps are
returned. Raw provider responses are retained in `docs/education/transcription/`
for review and regeneration without repeating paid requests.

After reading `transcript-readable.txt`, create `docs/education/chapters.json`
with `{start,title,summary}` entries at actual segment boundaries. Re-running the
transcription utility then rebuilds the browser JSON and captions from cached
ASR responses. `finalize-chapters.mjs` can update chapter labels without replacing
punctuated text or waveform values. Generated transcripts remain machine-generated unless a human
has completed verbatim audio review. Never substitute a topic outline for speech.

The final caption source is `docs/education/transcription/whisper-1/`. Earlier
Whisper Large V3 Turbo responses remain in the parent transcription directory for
provenance; they were replaced because some segments were long or overlapped.
ASR exports intentionally produce raw wording; run punctuation afterward when
regenerating. Word timestamps may omit punctuation and ASR may mistranscribe
phrases near chunk boundaries. The punctuation step preserves those words exactly
and does not pretend to correct recognition errors.

Punctuation requests use strict JSON Schema plus local Zod checks for response
shape, count and IDs. A Unicode token comparison permits punctuation/case changes
while rejecting any spoken-word/number change. Rejected IDs are retried. Public
JSON is written only after all IDs have accepted text; all original start/end
times, duration, waveform and concurrent chapter updates are retained. Responses,
including rejected attempts, are saved in `docs/education/punctuation/`.

Final encoded audio loudness: -17.66 LUFS integrated, -1.55 dBTP true peak, 4.0 LU
loudness range, measured across the complete file. See `audio-quality.json` for
the final peak-headroom correction and preserved waveform provenance.

All image prompts and actual provider usage/cost records are kept under
`docs/education/`. Scenic images are synthetic Bitcoin architecture, not
documentary photographs of Kibera. The original M4A is never overwritten.

Final verification covers JSON/VTT consistency, chronological captions, chapter
boundaries, unchanged spoken words/times during punctuation, unchanged duration
and waveform, MP3 codec/channel/bitrate/duration, original/encoded hashes, image
metadata, and exact-key absence from education text artifacts. Verification does
not substitute for human verbatim listening review. No application source,
package files, AGENTS.md, or merchant artifacts were edited by media preparation.
