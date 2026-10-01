# Bitcoin Podcast 101 media contract

Status: preparation complete and validated, 2026-10-02. This document is owned by media
preparation; application integration is handled separately.

Original source: `audio/How_Bitcoin_Replaces_Banks_With_Math.m4a`, 45,233,876 bytes.
MP4 movie header duration: **1405.4574149659863 seconds** (23:25.46), timescale 44,100.
The original remains intact (SHA-256 recorded in `audio-provenance.json`).
The final MP3 has container duration **1405.492245 seconds**; its decoded duration
is **1405.4575 seconds**. JSON uses source duration **1405.457415 seconds**.

Validated browser assets:

- `/education/bitcoin-101.mp3`: mono speech, MP3, 64 kbps, 44.1 kHz; 11,244,247 bytes.
- `/education/bitcoin-101.vtt`: 211 English captions derived from real ASR timestamps.
- `/education/bitcoin-101-transcript.json`: static player/transcript metadata.
- `/education/globe-cover.webp`: text-free 1600x900 globe cover and WebGL fallback.
- `/education/earth-surface.webp`: text-free 2048x1024 NASA Blue Marble surface map
  used by the Three.js Earth. Source, byte sizes and hashes: `globe-provenance.json`.
  The sourced Earth video is rejected and not included in the application release.
- `/education/bitcoin-network.webp`: retained historical generated concept asset,
  not displayed in the redesigned studio.

JSON shape:

```ts
interface EducationMedia {
  duration: number;
  segments: { start: number; end: number; text: string }[];
  chapters: { start: number; title: string; summary: string }[];
  waveform: number[];
}
```

All times are seconds relative to the untrimmed recording. Segments are real
speech-recognition output, with chronological start/end times. Chapters are
editorial topic labels attached to actual segment start times after transcript
review. `waveform` contains 1,200 real decoded-audio peak values, evenly covering
the recording, globally normalized to 0-1. No fake or random peaks. The supplied
waveform remains identical to the first delivered JSON, as requested; these are
real peaks from the initial MP3 encode of the same untrimmed source, before the
final headroom correction. See `audio-quality.json`.

The transcript is ASR from `openai/whisper-1` through OpenRouter, grouped using
actual word timestamps. Editorial punctuation uses `google/gemini-3.1-flash-lite`
through OpenRouter. Every returned ID and word/number token is validated; wording
changes are rejected and retried. Punctuation preserved every caption time,
duration, and waveform value. Machine transcription has not been manually
verified against every spoken word. Chapter labels follow actual narrated topics.

Eight chapter starts: 0, 229.96, 367.48, 493.58, 606.8, 795.56, 987.92, 1115.06.
Source: `chapters.json`; exact `{start,title,summary}` shape retained.

The lyric-style reader derives shorter phrases without changing this JSON or
its captions. It distributes phrase duration proportionally by word count inside
each actual utterance. This is approximate phrase alignment, not a forced-aligned
word-level transcript. Silent gaps stay silent; seeking derives the current
phrase from media time rather than an independent animation timer.

Concept review: `docs/education/bitcoin-studio-concept.webp`; its overlay text,
topic names and playback time are design placeholders, never transcript data.
Request prompt: `docs/education/concept-prompt.json`.
Generation provenance is saved alongside it, including the actual reported cost.

Provider documentation checked 2026-10-01:

- [OpenRouter Image Generation](https://openrouter.ai/docs/guides/overview/multimodal/image-generation)
- [OpenRouter Transcription](https://openrouter.ai/blog/tutorials/transcription-on-openrouter/)
- [OpenRouter Structured Outputs](https://openrouter.ai/docs/guides/features/structured-outputs)

The local OpenRouter key was accepted by `GET /api/v1/key`. Its value never goes
into prompts, outputs, provenance, tools, browser code, or logs.

Verification: `node tools/education/validate-media.mjs` passed. Detailed output in
`validation.json`; provider requests/costs in `provider-costs.json`. Total reported
spend, including exploratory ASR and rejected punctuation responses:
**USD 0.3666124051888431**.

Final handoff, exact model costs, and verification limits:
`media-handoff.md`. ASR export provenance describes the pre-punctuation stage;
`validation.json` reflects the final published 211 captions and 8 chapters.
