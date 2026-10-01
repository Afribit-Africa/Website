# Afribit Studio Review

Verified 2026-10-02 against the production build. Local review URL:
http://localhost:3003/studio. Public review URL: https://afribit.africa/studio.
Git publication and Vercel status are tracked in the local AGENTS.md session log.

## Evidence

- [Studio library](qa-globe/library-1440.png)
- [Desktop listening room](qa-globe/listen-desktop.png)
- [Mobile globe and touch exploration](qa-globe/globe-mobile-touch.png)
- [Small mobile reader](qa-globe/read-320.png)
- [Synchronized mobile reading](qa-globe/read-390.png)
- [Transcript search](qa-globe/transcript-desktop.png)
- [Saved notes](qa-globe/saved-desktop.png)
- [Reduced motion](qa-globe/read-reduced-motion.png)
- [WebGL fallback](qa-globe/webgl-fallback.png)
- [Browser results and canvas-pixel measurements](qa-globe/results.json)
- [Media validation and recorded provider cost](validation.json)

Manually inspected desktop, mobile, transcript and saved views. The primary
Three.js Earth is visible, framed and interactive, with a text-free satellite map.
The rejected sculpture and sourced video are not rendered. Text and controls have no
incoherent overlaps. Mobile chapter navigation uses a drawer rather than a
compressed desktop sidebar.

## Verification Results

| Check | Result |
| --- | --- |
| Production build | Passed, 93 routes generated |
| TypeScript | Passed |
| Repository lint | No errors; two pre-existing unused-variable warnings |
| Media unit tests | 5 passed |
| Browser suite | Passed, no runtime or hydration errors |
| Responsive screenshots | 320, 390, 768, 1440 and 1920 pixel widths |
| Rendered canvas | Nonblank desktop/mobile pixels; rotation, pause, mouse/touch drag and keyboard verified |
| Audio | Real MP3 decoding, play/pause, seeking, skip, rate, volume and mute verified |
| Stored state | Progress, notes and bookmarks survive reload |
| Loading and failure | Early seeking, cached metadata, network retry and WebGL fallback verified |
| Access | Reduced motion, accessible controls and native no-JS audio verified |
| Delivery | Library/lesson metadata, sitemap entries, 308 legacy redirect and HTTP 206 audio verified |
| Media integrity | Original unchanged; 211 timed captions, 8 chapters, 1,200 waveform peaks |
| Credential exposure | No supplied API credentials in source, public media, artifacts or browser bundles |

Lint warnings are in `scripts/check-osm-verifications.ts` and
`src/components/ui/card-spotlight.tsx`, outside this task.

## Review Limits

The recording is 23:25.46, not an assumed 25 minutes. Automatic transcription
uses real ASR timing, followed by punctuation that preserves spoken-word tokens.
It has not received a complete human listening/correction pass. Review the Read
view against the audio when editing educational copy. Short reading phrases use
proportional timing within actual utterances, not forced word alignment.

Visual and touch QA used Chromium, including emulated mobile input and software
WebGL. This is not a physical-device or Safari verification. Stored learning
state belongs to the current browser, not a signed-in account.

The library and first supplied audiobook are functional. Video generation, book readers and
authenticated content uploads are separate future publishing work, not hidden
features. Production playback needs no OpenRouter credentials. Preparation cost
for the concept, artwork, transcription and punctuation was approximately USD 0.37.
