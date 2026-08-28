# Repair handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-repair-1`
- Repair base: `8974ac4c1833f2225b88b7269cb122afed48f856`
- Artifact / deployment class: static Vite + TypeScript site, Azure Static Web Apps, `dist/`
- Status: repaired, verified locally, and ready for static deployment.

## Release-blocking repairs

1. **CSP-safe result cards.** The result-card delay is now selected by one of five static CSS classes (`pick-card--1` through `pick-card--5`) instead of an inline custom-property style. The existing strict `style-src 'self'` CSP is preserved. A Playwright regression loads the app with that exact deployed CSP, makes a shortlist, asserts that no card has a `style` attribute, and captures zero browser errors.
2. **Blank manual titles.** Manual entry trims the title before persistence, rejects an all-whitespace value in the dialog, returns focus to Title, and leaves the shelf untouched. Browser coverage submits exactly `"   "` and verifies the dialog error, no row, and no stored invisible title.
3. **CSV calendar dates and import-local duplicates.** Date validation now round-trips UTC year/month/day components so normalised JavaScript dates such as `2026-02-30` cannot pass. The parser tracks accepted, case-insensitive titles by source row; a duplicate from the same file is skipped and reported with both row numbers. Existing-shelf filtering also updates its title set as it accepts rows. Unit and browser coverage cover impossible non-leap dates, a valid leap day, and same-file case-insensitive duplicates.
4. **Footer hit areas.** Every footer link is now an inline flex target with a minimum 44×44 CSS-pixel area. The 390px Playwright regression measures Privacy, Terms, and MIT source links.

## How to run and verify

```sh
npm ci
npm run lint
npm run typecheck
npm test
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm run test:browser
npm run build
npm run preview
```

`npm run build` writes the deployable site to `dist/index.html`. `npm run lint` and `npm run typecheck` are strict TypeScript static-analysis gates; this small vanilla TypeScript product has no separate linter rule set. `npm run test:browser` uses pinned `@playwright/test` 1.58.2 and the matching Chromium.

## Exact local evidence (2026-08-28 UTC)

- Clean install: `npm ci` — **PASS**, 58 packages installed, 0 vulnerabilities.
- Static checks: `npm run lint` and `npm run typecheck` — **PASS**.
- Unit tests: `npm test` — **PASS**, 2 files / 8 tests. This includes the two CSV regressions.
- Production build: `npm run build` — **PASS**. `dist/` was produced with `index.html` at its root. Initial JavaScript is 28,876 bytes (10.23 KB gzip); CSS is 19,907 bytes (5.09 KB gzip); the mobile AVIF is 19,217 bytes and desktop AVIF is 47,443 bytes. All are within the static-product budgets.
- Browser suite: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm run test:browser` — **PASS**, 8 tests. It verifies the four repair regressions; desktop keyboard skip-link and result focus; zero axe 4.11 violations after normal-flow rendering; desktop console cleanliness; 390×844 no horizontal overflow; only same-origin requests; `/privacy` and `/terms`; service-worker offline shell; old `shelf-rotation-v1` cache cleanup; and reduced-motion ticket behavior.
- Response policy: the strict production CSP remains in `public/staticwebapp.config.json` with no `unsafe-inline`; the CSP browser regression applies that exact header to the production preview.
- Privacy: browser request capture found only the local app origin, and the product continues to use only its documented local-storage key. No analytics, remote catalog, CDN font, or third-party script was added.
- Lighthouse 13.4.1 was attempted against the production preview with the provided Chromium 145 binary. The launcher could not connect (`Unable to connect to Chrome`), so no Lighthouse score is claimed. The direct production size, browser, axe, and responsive checks above passed.

## Deployment and live verification

Deploy `dist/` with the factory static deployment configuration for `shelf-rotation-picklist`. After deployment, verify `/`, `/privacy`, `/terms`, and `/sw.js` are 200; confirm `style-src 'self'` remains present; compare live hashed JS/CSS and `sw.js` with `dist/`; and rerun the normal shortlist flow while recording zero console errors. The deployment result and commit SHA are appended after push.

## Known product boundaries

- Data remains browser/device-local; CSV remains the portability path. There is no account or cross-device sync.
- The app stores the latest ten saved rotations. It does not scrape BoardGameGeek or enrich user data from a remote catalog.
- The only incomplete measurement is Lighthouse scoring because this worker’s Chrome launcher cannot attach to its supplied browser. No functional, accessibility, privacy, response-policy, or offline blocker remains in local verification.
