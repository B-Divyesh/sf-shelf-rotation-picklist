# Build handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-build-1`
- Completed: 2026-08-27
- Deploy class: static web, `dist/`

## What shipped

- A responsive three-station workflow: add/import shelf → set tonight’s hard limits → generate and save a ranked rotation.
- Manual entry plus resilient CSV import with required-column checks, row-level errors, duplicate-title skipping, a downloadable template, and shelf export.
- Per-game tonight availability, title search, and removal with confirmation.
- Constraints for player count, maximum duration, maximum setup burden, required tag, and 3/4/5 result length.
- Transparent deterministic scoring, per-pick reasons, explicit no-match exclusions, print/PDF styling, and ten locally saved rotations.
- Local-only persistence, light/dark themes, a clear-data control, `/privacy`, and `/terms`.
- Offline shell caching with an explicit offline state; no runtime third parties, accounts, analytics, or network recommendation calls.
- Product-specific shelf-label neo-brutalist visual system and an original generated cardboard-shelf illustration. Prompt, tool, date, and source are recorded in `.factory/design.md` and `assets/src/hero-shelf.json`.

## How to verify

```sh
npm ci
npm test
npm run build
npm run preview
```

Expected build root: `dist/index.html`. Current production output is 28.49 KB JavaScript (10.05 KB gzip), 19.67 KB CSS (5.05 KB gzip), and a 47 KB desktop / 19 KB responsive hero AVIF with WebP/JPEG fallbacks.

Verification completed locally against the production preview:

- `npm test`: 6/6 unit tests pass (CSV parsing/export and scoring/filtering/order).
- `npm run build`: passes TypeScript strict checks and Vite production build.
- Browser flow at 390×844: sample shelf, set constraints, generate three picks, save rotation, open/close scoring dialog, visit `/privacy`; zero console errors.
- Offline reload after service-worker activation: shell, styles, JavaScript, artwork, local shelf, and offline banner all load.
- axe-core 4.13: zero violations in empty, populated-results, dark-theme, and privacy states.
- Lighthouse 13.4.1 mobile on local production preview: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, TBT 10 ms, CLS 0, total transferred 36 KiB on the phone layout.
- Visual review completed at desktop and 390 px widths. Focus rings, native modal focus containment, touch targets, semantic landmarks, one h1 per route, reduced motion, and print layout were checked.

## Known limits and intentional boundaries

- Data is browser/device-specific; there is no account or cross-device sync. CSV is the portability path.
- Saved rotations are capped at the latest ten to keep local storage bounded.
- Import does not enrich titles from BoardGameGeek or any third-party catalog. This is intentional and matches the product contract.
- “Last played” is date-only and must be updated by re-importing or replacing a shelf row; full play logging and collection management are non-goals for v1.

## Suggested next validation

Observe whether collectors with 20+ games save a second rotation within 30 days using a privacy-preserving, explicitly approved aggregate page counter or opt-in research. If shared shelves emerge as a repeated request, validate family/club collaboration before introducing any account or backend.
