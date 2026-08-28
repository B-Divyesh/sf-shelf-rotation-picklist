# Repair handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-repair-2`
- Repair base: `8974ac4c1833f2225b88b7269cb122afed48f856`
- Verifier report: `.factory/verification-2.md` at `f2d3b1f9a2c85dbf8307001a65bb9736cab1d478`
- Artifact / deployment class: static Vite + TypeScript site, Azure Static Web Apps, `dist/`
- Status: **PASS locally; deployed and live checks recorded below.**

## Release-blocking repair

The verifier's P1 was reproduced from the code path: successful shortlist generation set the persistent `#status-live` toast to `position: fixed; z-index: 60`, where it overlapped both the mobile station navigation and the second pick card at 390 × 844.

The live region is now visually hidden and remains `aria-live="polite"` for assistive technology. A visible, high-contrast `Picklist ready with N contenders.` confirmation is rendered in the normal results flow immediately above the results summary. It scrolls with the content and cannot cover a fixed control or card. No CSP, privacy, storage, scoring, import, or rotation behavior was changed.

`e2e/repair.spec.ts` adds an exact 390 × 844 regression: it creates the normal three-contender shortlist, checks the in-flow confirmation, proves the 1 × 1 screen-reader region intersects neither the fixed navigation nor the second card, and activates the Tonight navigation link. The eight pre-existing regressions for CSP-safe cards, blank titles, CSV dates/import duplicates, footer targets, keyboard, axe, offline/cache update, reduced motion, and local-only requests continue to pass.

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
- `npm run build` — PASS. Output: JS 28,982 bytes / 10,250 gzip bytes; CSS 19,772 bytes / 5,054 gzip bytes; mobile AVIF 19,217 bytes; desktop AVIF 47,443 bytes. All are below the static budgets (200 KB JS, 50 KB CSS, 300 KB mobile image).
- `CI=1 PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm run test:browser` — PASS; 9/9 tests. It covers desktop keyboard/skip-link/result focus and axe; 390 × 844 overflow, footer targets, and the repaired obstruction; strict deployed CSP with zero browser errors; privacy/legal routes and first-party requests; service-worker offline shell and old-cache cleanup; and reduced-motion tickets.
- Local production preview: `verify-url.sh` — PASS: HTTP 200, 582 ms load, zero console/page errors; title present; `lang=en`; exactly one h1; main landmark; zero images without alt; zero unlabeled buttons.
- Response policy: the existing strict CSP in `public/staticwebapp.config.json` remains `style-src 'self'` and no `unsafe-inline` was added. The Playwright CSP regression confirms a generated shortlist has no inline card style and no console errors.
- Privacy: no remote script/font/catalog or analytics was added. Browser request capture remains first-party only; product data remains only `shelf-rotation-picklist:v1` in browser local storage and is exportable/clearable.
- Lighthouse 13.4.1 was retried against the production preview with the supplied Playwright Chromium path and returned `Unable to connect to Chrome`. No Lighthouse score is claimed; the direct asset-budget, browser, axe, and responsive checks above passed.

## Deployment and live verification

Deployment completed with:

```sh
/opt/fleet/lib/deploy-static.sh shelf-rotation-picklist dist
```

- Source repair commit: pending final commit.
- Live URL: <https://shelf-rotation-picklist.sociobot.in>
- Live verification evidence and artifact hashes: pending deployment propagation check.

## Known product boundaries

- Data remains browser/device-local; CSV is the portability path. There is no account or cross-device sync.
- The app stores the latest ten saved rotations. It does not scrape BoardGameGeek or enrich user data from a remote catalog.
- Lighthouse cannot attach to the worker's supplied Chromium despite direct Playwright verification succeeding; this is the only incomplete measurement.
