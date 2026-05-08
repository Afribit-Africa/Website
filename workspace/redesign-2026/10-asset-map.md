# 10 Asset Map

Prepared: 2026-05-05

## Current Public Asset Roots

- `public/Images/`
- `public/Logo/`
- `public/Partner logos/`
- `public/Videos/`
- root public SVG assets

## Future Canonical Path

- `public/Media/**`

## Migration Intent

- `public/Images/**` -> `public/Media/Images/**`
- `public/Logo/**` -> `public/Media/Logo/**`
- `public/Partner logos/**` -> `public/Media/Partner logos/**`
- `public/Videos/**` -> `public/Media/Videos/**`

## Confirmed Live-Site Asset Dependencies

- Afribit logo assets
- partner logos for Bitcoin Conference, Geyser, FBCE Global, Fedi, and Rottweil
- Fedi QR images
- campaign and merchant photography used across home, donate, and program storytelling
- media section thumbnails and partner imagery

## Current Gaps

- No `public/Media/**` tree exists yet.
- A full file-by-file live-asset mapping still needs completion before frontend rebuild starts.

## Implementation Rule

- Do not move assets in this planning pass.
- Every live dependency must map to an existing local asset or be flagged as missing before implementation begins.