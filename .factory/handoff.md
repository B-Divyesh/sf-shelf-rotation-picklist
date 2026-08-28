# Repair handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-repair-1`
- Repair base: `8974ac4c1833f2225b88b7269cb122afed48f856`
- Artifact / deployment class: static Vite + TypeScript site, Azure Static Web Apps, `dist/`
- Status: repaired, verified locally, pushed, and deployed.

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

Deployment completed with `/opt/fleet/lib/deploy-static.sh shelf-rotation-picklist dist`.

- Source repair commit: `c28a8559e99a1601c9001e55bcf489a09d5ce749` (pushed to `origin/main`).
- Live URL: <https://shelf-rotation-picklist.sociobot.in> — `/`, `/privacy`, `/terms`, and `/sw.js` all returned **200**.
- Live identity: byte-identical local/live SHA-256 values were `index.html` `b2a1361edc3a20728a08c8de69981cfe3b2b8d1e39e983355082babe69fc0d36`, JavaScript `ee4e9cbc82bf041e8798a184a14d4fd50eb064bcf3379c214c983d1ef85a2913`, CSS `d5340a032d32f650de195ebd8a7a0f6502f265ad1ec548ae8d048687649cf8a6`, and `sw.js` `7ee92bcc5df9cfeb3530da5d28686b4f3668e9bd025dc3628c12e0bf6f88d312`.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy, the camera/microphone/geolocation-denying Permissions Policy, strict CSP with `style-src 'self'`, immutable hashed assets, and `no-cache` for `sw.js`.
- Live Chromium smoke: loaded samples and generated three cards under the real CSP; cards contained no inline styles, browser console errors were zero, axe violations were zero, and all requests stayed first-party. At 390×844 there was no horizontal overflow (`scrollWidth` 390) and footer targets measured Privacy 75.44×44, Terms 56.17×44, and MIT source 80.25×44 CSS px.

## Known product boundaries

- Data remains browser/device-local; CSV remains the portability path. There is no account or cross-device sync.
- The app stores the latest ten saved rotations. It does not scrape BoardGameGeek or enrich user data from a remote catalog.
- The only incomplete measurement is Lighthouse scoring because this worker’s Chrome launcher cannot attach to its supplied browser. No functional, accessibility, privacy, response-policy, or offline blocker remains in local verification.
