# Repair handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-repair-2`
- Repair base: `8974ac4c1833f2225b88b7269cb122afed48f856`
- Verifier report: `.factory/verification-2.md` at `f2d3b1f9a2c85dbf8307001a65bb9736cab1d478`
- Artifact / deployment class: static Vite + TypeScript site, Azure Static Web Apps, `dist/`
- Status: **PASS — deployed and independently exercised on the live domain.**

## Release-blocking repair

The verifier's P1 was reproduced from the code path: successful shortlist generation set the persistent `#status-live` toast to `position: fixed; z-index: 60`, where it overlapped both the mobile station navigation and the second pick card at 390 × 844.

The live region is now visually hidden and remains `aria-live="polite"` for assistive technology. A visible, high-contrast `Picklist ready with N contenders.` confirmation is rendered in the normal results flow immediately above the results summary. It scrolls with the content and cannot cover a fixed control or card. The ticket entrance remains motionful, but its travel is now 12px (within mobile station padding) and it no longer fades text below the contrast threshold during entry. No CSP, privacy, storage, scoring, import, or rotation behavior was changed.

`e2e/repair.spec.ts` adds an exact 390 × 844 regression: it creates the normal three-contender shortlist, checks the in-flow confirmation, runs axe over that mobile result state, proves the 1 × 1 screen-reader region intersects neither the fixed navigation nor the second card, asserts `scrollWidth === 390` while the entrance animation runs, and activates the Tonight navigation link. The eight pre-existing regressions for CSP-safe cards, blank titles, CSV dates/import duplicates, footer targets, keyboard, axe, offline/cache update, reduced motion, and local-only requests continue to pass.

## How to run and verify

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
CI=1 PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm run test:browser
npm run preview -- --host 127.0.0.1
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence-repair-2
```

`npm run build` emits `dist/index.html`; this remains a static application with no package/consumer artifact.

## Exact local evidence (2026-08-28 UTC)

- `npm ci` — PASS; 58 packages installed, 0 vulnerabilities.
- `npm run lint` and `npm run typecheck` — PASS (`tsc --noEmit`).
- `npm test` — PASS; 2 files, 8 tests.
- `npm run build` — PASS. Output: JS 28,982 bytes / 10,251 gzip bytes; CSS 19,752 bytes / 5,047 gzip bytes; mobile AVIF 19,217 bytes; desktop AVIF 47,443 bytes. All are below the static budgets (200 KB JS, 50 KB CSS, 300 KB mobile image).
- `CI=1 PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm run test:browser` — PASS; 9/9 tests. It covers desktop keyboard/skip-link/result focus and axe; 390 × 844 normal-result axe, overflow, footer targets, and repaired obstruction; strict deployed CSP with zero browser errors; privacy/legal routes and first-party requests; service-worker offline shell and old-cache cleanup; and reduced-motion tickets.
- Local production preview: `verify-url.sh` — PASS: HTTP 200, 582 ms load, zero console/page errors; title present; `lang=en`; exactly one h1; main landmark; zero images without alt; zero unlabeled buttons.
- Response policy: the existing strict CSP in `public/staticwebapp.config.json` remains `style-src 'self'` and no `unsafe-inline` was added. The Playwright CSP regression confirms a generated shortlist has no inline card style and no console errors.
- Privacy: no remote script/font/catalog or analytics was added. Browser request capture remains first-party only; product data remains only `shelf-rotation-picklist:v1` in browser local storage and is exportable/clearable.
- Lighthouse 13.4.1 was retried against the production preview with the supplied Playwright Chromium path and returned `Unable to connect to Chrome`. No Lighthouse score is claimed; the direct asset-budget, browser, axe, and responsive checks above passed.

## Deployment and live verification

Deployment completed with Azure Static Web Apps deployment `bb6ff251-ef28-4739-b565-ff57992fb371`:

```sh
/opt/fleet/lib/deploy-static.sh shelf-rotation-picklist dist
```

- Source repair commits: `8dd4e6e` (in-flow feedback), `d023971` (animated mobile width), and `59722a8` (animated contrast), all pushed to `origin/main`.
- Live URL: <https://shelf-rotation-picklist.sociobot.in> — `/`, `/privacy`, `/terms`, and `/sw.js` each return HTTP 200.
- Live identity: local and live SHA-256 values match for `index.html` `6baa7eb4c207f0d50c9750b3f6e61acd5c98fc6ffdfd07ab4a6e82a95d660a50`, JavaScript `d3c5f9b50faa72cb99fe4232fc5645288f9e269c4bb64899ccf4e6b7b99ad289`, CSS `8727f0fab0f9a6ea9d00dcb2d709f5201b31701ba89f83407553b17bc343bc99`, and `sw.js` `7ee92bcc5df9cfeb3530da5d28686b4f3668e9bd025dc3628c12e0bf6f88d312`.
- Live response policy: HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation-denying Permissions Policy, and strict CSP with `style-src 'self'` are present. HTML is `max-age=30, must-revalidate`.
- Live browser check: `verify-url.sh` passed in 630 ms with zero console/page errors and valid title/lang/h1/main/alt/button basics. The real 390 × 844 sample-to-picklist flow has `scrollWidth` 390, a visible in-flow success confirmation, no status/card or status/navigation overlap, usable Tonight navigation, zero console errors, zero axe violations, and first-party-only automatic requests.

## Known product boundaries

- Data remains browser/device-local; CSV is the portability path. There is no account or cross-device sync.
- The app stores the latest ten saved rotations. It does not scrape BoardGameGeek or enrich user data from a remote catalog.
- Lighthouse cannot attach to the worker's supplied Chromium despite direct Playwright verification succeeding; this is the only incomplete measurement.
