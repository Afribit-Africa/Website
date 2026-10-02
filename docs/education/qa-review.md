# Afribit Studio Review

Verified 2026-10-02 against the production build. Local review URL:
http://localhost:3003/studio. Public review URL: https://afribit.africa/studio.
Git publication and Vercel status are tracked in the local AGENTS.md session log.

## Evidence

- [Studio library](qa-backgrounds/library-1440.png)
- [Unified desktop listening room](qa-backgrounds/listen-desktop.png)
- [Small mobile listening room](qa-backgrounds/listen-320.png)
- [Synchronized mobile reading](qa-backgrounds/listen-390.png)
- [Contour flow scenery](qa-backgrounds/scenery-flow.png)
- [Browser results and canvas-pixel measurements](qa-backgrounds/results.json)
- [Media validation and recorded provider cost](validation.json)

Manually inspected desktop, mobile, transcript and saved views. The primary
canvas scenery is visible behind unified audio/read-along. Beams, flowing paths
and contour streams use free Kokonut component geometry, not downloaded video.
The Earth globe, rejected sculpture and sourced video are not rendered. Text and controls have no
incoherent overlaps. Mobile chapter navigation uses a drawer rather than a
compressed desktop sidebar.

## Verification Results

| Check | Result |
| --- | --- |
| Production build | Passed, 93 routes generated |
| TypeScript | Passed |
| Repository lint | No errors; two pre-existing unused-variable warnings |
| Media unit tests | 7 passed, including attribution and crossfade boundaries |
| Browser suite | 14 groups passed, no runtime or hydration errors |
| Responsive screenshots | 320, 390, 768, 1440 and 1920 pixel widths |
| Rendered canvas | Three nonblank scenes, changing frames, mouse/touch scenery control and motion pause |
| Automatic scenery | 45-second cycle, five-second smooth crossfade, paused scene clock, hidden/offscreen suspension |
| Audio | Real MP3 decoding, play/pause, seeking, skip, rate, volume and mute verified |
| Stored state | Progress, notes and bookmarks survive reload |
| Loading and failure | Early seeking, cached metadata, network retry and unavailable-canvas fallback verified |
| Access | Reduced motion, accessible controls and native no-JS audio verified |
| Delivery | Metadata, sitemap, 308 education alias, 307 legacy Read redirect, external Btrust link and HTTP 206 audio |
| Media integrity | Original unchanged; 211 timed captions, 8 chapters, 1,200 waveform peaks |
| Credential exposure | No supplied API credentials in source, public media, artifacts or browser bundles |

Lint warnings are in `scripts/check-osm-verifications.ts` and
`src/components/ui/card-spotlight.tsx`, outside this task.

Credit update (2026-10-02): the focused `credits.browser.mjs` suite passes on the
library and lesson at 320, 390, 768 and 1440 pixels, verifying the Btrust logo,
distinct content/AI-audio labels, official links, nonoverlapping layout, JSON-LD
credits and audio playback. Screenshots/results live under
`%TEMP%/afribit-credit-qa/<hostname>/`. Btrust has its official mark; Gemini is a
linked name credit because its product-icon approval has not been provided.

The full current screenshot set is written to
`%TEMP%/afribit-background-qa/<hostname>/`; selected evidence is committed above.
`tests/education/browser.mjs` accepts an optional fourth argument for output.
Periodic transitions use Playwright's virtual clock; hidden-document behavior
uses a simulated visibility event, and offscreen suspension uses real scrolling.
External-link navigation is checked with a stubbed destination; the link itself
points to the official Btrust Pathways URL.
The previously committed `qa-globe` folder is historical evidence only.

## Review Limits

The recording is 23:25.46, not an assumed 25 minutes. Automatic transcription
uses real ASR timing, followed by punctuation that preserves spoken-word tokens.
It has not received a complete human listening/correction pass. Review the Listen
read-along against the audio when editing educational copy. Short reading phrases use
proportional timing within actual utterances, not forced word alignment.

Visual and touch QA used Chromium, including emulated mobile input and canvas
pixel checks. This is not a physical-device or Safari verification. Stored learning
state belongs to the current browser, not a signed-in account.

The library and first supplied audiobook are functional. Video generation, book readers and
authenticated content uploads are separate future publishing work, not hidden
features. Production playback needs no OpenRouter credentials. Preparation cost
for the concept, artwork, transcription and punctuation was approximately USD 0.37.
