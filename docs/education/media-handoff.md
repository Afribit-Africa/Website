# Education media handoff

Complete, 2026-10-01. Assets are finalized; no asset changes were made during
the production build. The original source recording remains intact.

Published assets:

- `public/education/bitcoin-101.mp3`: 11,244,247 bytes, mono MP3, 64 kbps,
  44.1 kHz. Container duration 1405.492245 seconds; decoded duration 1405.4575.
- `public/education/bitcoin-101-transcript.json`: duration 1405.457415 seconds,
  211 timed caption segments, 8 chapters, 1,200 normalized waveform peaks.
- `public/education/bitcoin-101.vtt`: 211 captions matching the JSON text.
- `public/education/bitcoin-network.webp`: 2400 x 1340 pixels, 169,004 bytes.

The concept and scenic asset were generated through OpenRouter and inspected
with the local image viewer. `concept-review.md` records corrections identified
in the concept; the scenic asset uses the corrected charcoal architecture.

## Recorded provider costs

All amounts below are USD, summed from saved provider `usage.cost` values.
They include exploratory transcription and rejected punctuation responses.
No new provider requests were made for this handoff.

| Model | Purpose | Reported Cost (USD) |
|---|---|---:|
| `google/gemini-3.1-flash-image` | Concept and scenic asset | 0.202099 |
| `openai/whisper-1` | Final timestamped ASR | 0.140600 |
| `openai/whisper-large-v3-turbo` | Exploratory ASR, superseded | 0.005613905188843111 |
| `google/gemini-3.1-flash-lite` | Accepted punctuation and retries | 0.0167715 |
| `google/gemini-2.5-flash-lite` | Rejected punctuation attempts | 0.001528 |
| **Total** | **All recorded requests** | **0.3666124051888431** |

Image cost split: concept USD 0.101097; scenic asset USD 0.101002.
Raw request/response records and generation IDs are indexed in
`provider-costs.json`. Floating-point representation can produce trailing digits
in individual JSON sums; the table preserves the provider-reported amounts.

## Verification and limits

`node tools/education/validate-media.mjs` passed. Checks cover caption chronology,
JSON/VTT consistency, actual caption boundaries for chapters, preserved words
and timestamps during punctuation, unchanged duration and waveform, MP3 encoding
and duration, source/encoded hashes, image metadata, and secret absence.

Punctuation was verified against the ASR word/number tokens. Every response used
a strict schema with exact segment counts and IDs; word changes were rejected
and retried. This verifies that editorial punctuation preserved the ASR output.
It does not establish that the ASR recognized every spoken word correctly.

The transcript has not received a full human verbatim listening review. ASR can
misrecognize words, especially near 120-second chunk boundaries. Timestamps are
provider estimates offset to the original recording, not manually annotated
ground truth. Chapter starts use existing caption boundaries and can precede the
precise topic transition within that caption. Narrated technical and financial
claims have not been fact-checked as part of this media-preparation task.

The waveform is genuine decoded audio data from the initial encode of the same
untrimmed source. It remains unchanged per the integration instruction. The
final encode's peak-headroom correction changes amplitude slightly; waveform
provenance is recorded in `audio-quality.json`. Final encoded audio measures
-17.66 LUFS integrated and -1.55 dBTP true peak.

Reusable utilities are tracked under `tools/education/`. Downloaded ffmpeg
binaries and temporary transcription inputs are in ignored `scripts/education/`.
Media preparation did not edit application source, package files, AGENTS.md, or
merchant artifacts, and did not create a commit.
