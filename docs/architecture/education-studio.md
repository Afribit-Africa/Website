# Afribit Studio

Redesigned 2026-10-02 after feedback on the sculpture, sourced video and Earth globe.

## Routes And Navigation

- `/studio`: media-selection library, linked as Studio in desktop/mobile menus
  and footer. Audiobooks contains the first supplied lesson. Videos and
  Books are selectable collections with honest empty states, not fake titles.
- `/studio/bitcoin-podcast-101`: unified Listen workspace with synchronized text.
  The bare URL and `?view=listen` both open this workspace. Legacy `?view=read`
  returns a 307 redirect to `https://pathways.btrust.tech/`.
- Read in both the library and lesson is a native external Btrust Pathways link,
  opening a new tab so the current audio session remains uninterrupted.
- `/education`: permanent 308 redirect to the library.

Both Studio routes use their own header. Shared website header/footer are retained
on other routes. The library has CollectionPage/ItemList JSON-LD; the lesson has
LearningResource/AudioObject/BreadcrumbList. Both canonical URLs enter the sitemap.
The lesson uses async Next.js searchParams only for the legacy Read redirect.

## Experience

Bitcoin Podcast 101 is the supplied 23:25.46 recording. Its original M4A remains
intact; the prepared mono MP3 is 11.24 MB. Playback is user-initiated, with seek,
15-second skips, rate, volume/mute, downloads, and OS media controls.

Listen presents audio and large clickable phrases over changing dark scenery. The current
phrase brightens and stays centered in a local scroll container. Seeking follows
immediately, including while paused. Wheel/touch/keyboard browsing suspends
following; the Follow narration control restores it. Clicking a phrase seeks
slightly inside its boundary and explicitly recenters even if it was already active.
Document scrolling is not used for automatic narration following.

The complete searchable transcript remains available in an accessible Radix
dialog with actual caption timestamps and a VTT download. Listen retains the
original concept explanations and a Hide/Show read-along control. The Change
scenery control is available by mouse, touch and keyboard. It does not capture
the reader's scrolling gestures.
Saved contains bookmarks and personal notes. Progress and bookmarks remain in
localStorage using the original keys; storage failure does not block playback.

## Episode Credits

`bitcoinLesson.credits` is the attribution source for both library and lesson.
The project owner identifies Btrust Pathway as the supplied learning-content
source and Gemini as the AI audio-generation tool. `StudioCredits` shows these
roles separately below the tile/player; scenery and reading remain unobstructed.
LearningResource and AudioObject JSON-LD also include the credit text, with the
pathway linked via `isBasedOn`. No exact Gemini model/version is claimed.

The Btrust mark comes from its official website and is rasterized without
redrawing or recoloring. Source/hashes and attribution basis are recorded in
`docs/education/credits-provenance.json`; `prepare-credit-assets.mjs` reproduces it.
Gemini uses a linked name and neutral audio icon, not a product-logo badge:
Google's current product-icon rules request approval, which has not been supplied.
These are educational credits, not sponsor/partner claims. Automatic-transcription
disclosure remains separate. NASA is no longer credited in the live UI because
its historical map is no longer used there.

## Timings

The original 211 ASR utterances and VTT timings are unchanged. `createReadingCues`
breaks long utterances into short phrases, distributing time proportionally by
word count within their actual boundaries. This is approximate phrase timing,
not claimed forced word alignment. No independent timer advances the reader;
the native audio element is authoritative. Silent gaps are not invented narration.
Automatic ASR is labeled as such; a complete human listening review remains recommended.

## Media And Performance

The globe, rejected footage and sculptural Bitcoin model are not rendered.
`background-runtime.ts` adapts free MIT Kokonut Beams, Background Paths and Flow
Field into one deterministic 2D canvas. Scenes change every 45 seconds, crossfading
for five seconds before the next boundary. See `docs/education/backgrounds.md`
for official sources, adaptation decisions and the retained MIT notice.

Geometry and the scene clock stop when motion is disabled, the document is hidden
or the canvas is offscreen. Animation is independent of the audio transport.
Reduced motion is static; manual scene selection still works. Container-based
sizing, capped pixel density and a 30 fps paint limit keep mobile rendering bounded.
All observers, listeners and animation frames are disposed on unmount.
Missing canvas retains the text-free cover and usable audio/reader. The 1600x900
cover is generated from the real renderer by `prepare-studio-cover.mjs`;
`studio-background-provenance.json` records its hash and upstream sources.
The library loads only this cover, not the animated renderer or a video.
Three.js and its types have been removed because no other code used them.
Native audio remains available without JavaScript.

All media are self-hosted prepared artifacts. Visitors do not call OpenRouter or
need its expiring key. Historical concept/artwork, Whisper ASR and punctuation
used OpenRouter for approximately USD 0.37; this redesign uses free component
geometry without another generation charge. The secret remains only in ignored
local env. There is no public generation/upload endpoint.

## Source Map

- `src/app/studio/`: library, lesson, layout, library/reader styles.
- `src/app/education/studio.css`: shared player/sidebar scaffold.
- `src/components/education/studio-library.tsx`: Radix media formats/search.
- `studio-shell.tsx`: dedicated header and library return.
- `education-studio.tsx`: views, audio controls, chapter drawer, transcript dialog,
  bookmarks, finite Anime.js entrance, focus mode.
- `synced-reading.tsx`: local scrolling, current phrase and manual browsing.
- `studio-backdrop.tsx` / `background-runtime.ts`: canvas scenery, cycle,
  motion/visibility lifecycle, pointer response and bitmap fallback.
- `src/lib/studio-background.ts`: pure crossfade timing and scene order.
- `use-studio-audio.ts`: media events, saved progress, error recovery, Media Session.
- `src/lib/education.ts`: media contract, lesson metadata, cue derivation/lookups.
- `public/education/`: MP3, captions, transcript/waveform JSON, Studio cover and credits.
- `tools/education/`: reproducible audio, transcription, cover and credit preparation.
  Historical globe preparation and assets are retained but not loaded by the app.

Further supplied audio needs the same typed media contract and a catalog entry.
Video/book publishing still requires storage and an authenticated upload workflow.
Empty collection tabs do not claim that upload or reading tools exist.

## Verification

```powershell
npx tsx --test tests/education/media.test.ts
node tests/education/browser.mjs <path-to-playwright-module> http://localhost:3003
node tools/education/validate-media.mjs
npx tsc --noEmit
npm run lint
npm run build
```

The seven unit tests check attribution, scenery timing, media integrity, phrase
token/timing preservation, seeking, chapter selection and silence. Current browser
screenshots/results are under `%TEMP%/afribit-background-qa/<hostname>/` by default;
the fourth browser argument can select another output folder. Older committed
QA folders document replaced prototypes, not the current experience.
Tests wait for hydration before testing pre-metadata seeking.
See `docs/education/qa-review.md` for current evidence and device-review limitations.

Avoid rebuilding while the same workspace's dev server is serving a browser test;
the initial simultaneous build/dev run hit a transient generated-cache error.
Studio data and rendering have no database dependency.

Credit-specific layout, logo loading, links, structured data and playback checks:
`node tests/education/credits.browser.mjs <path-to-playwright-module> <base-url>`.
Evidence is written to `%TEMP%/afribit-credit-qa/<hostname>/`, separate from the
original globe QA so those screenshots/results are not silently overwritten.
