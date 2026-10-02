# Studio Background Selection

Official free component sources reviewed on 2026-10-02:

- [Aceternity Background Beams](https://ui.aceternity.com/components/background-beams):
  animated SVG paths; evaluated as an alternative, not copied.
- [Kokonut Beams Background](https://kokonutui.com/docs/backgrounds/beams-background):
  canvas light beams; adapted for the initial scene.
- [Kokonut Background Paths](https://kokonutui.com/docs/backgrounds/background-paths):
  layered Bezier curves; adapted to the same canvas renderer.
- [Kokonut Flow Field](https://kokonutui.com/docs/backgrounds/flow-field):
  trigonometric vector field; adapted to continuous lines rather than particles.

Kokonut's [official MIT license](https://github.com/kokonut-labs/kokonutui/blob/main/LICENSE)
is retained verbatim in `kokonut-LICENSE.txt`. No paid blocks, new UI framework,
remote media, product icons or component-template hero text are included.

The adaptation uses Afribit's charcoal background with mint, silver, muted cyan
and amber accents. Geometry changes every 45 seconds with a five-second smooth
crossfade before each boundary. The manual Change scenery control resets the
cycle to the next scene. Read-along remains in the same Listen workspace.

Animation is independent of audio playback. Pausing motion freezes geometry and
the scene clock without pausing the audio. Reduced motion disables autonomous
animation and cycling, but manual scene changes remain available. Hidden and
offscreen scenes suspend animation without accumulating skipped time.
Canvas sizing follows its container and caps pixel density (1.25 mobile, 1.5
desktop); rendering is capped at 30 fps. Observers, listeners and RAF are disposed.
Pointer movement subtly offsets the scene without capturing touch scrolling.

The server-rendered, text-free bitmap fallback also supplies library art and OG
metadata. Reproduce it using:

```powershell
node tools/education/prepare-studio-cover.mjs <path-to-playwright-module>
```

This bundles the real renderer with the existing esbuild/tsx toolchain and
captures a deterministic 1600x900 frame. Hash, generator and upstream URLs are
recorded in `studio-background-provenance.json`. No API key is needed.
