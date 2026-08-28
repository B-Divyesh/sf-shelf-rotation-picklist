# Polish 2 handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-polish-2`
- Repair commits: `963bb6ac6612693b8b6328f02cf2c8f62c8eaf9c`, `aaf64a8`, and final `20ae31cff23753c3c5bddaf5c03c445c98fdb67d`
- Branch: `main` (pushed to `origin`)
- Live URL: <https://shelf-rotation-picklist.sociobot.in/demo>
- Static deployment: Azure Static Web Apps deployment `19e0a0e7-cb5e-431b-912d-06fa8fb8e717`, succeeded.

## Done

Resolved all cumulative review findings recorded in `.factory/review-1.md` and `.factory/review-2.md`. The full finding-to-change map is in `.factory/polish-2.md`.

Highlights: visible 390 px theme wording; 44 px demo controls; isolated one-click demo; claim registry expanded for size, repeatability, ties, and remote-catalog behavior; score claim now proves visible components; plain browser-print wording; and fragment-aware Back restoration that keeps the focused Tonight heading visible after mobile layout settles.

## Verification

- Final local suite: `npm test` — 11 passing tests; `npm run lint`; `npm run typecheck`; `npm run build`; `npm run test:browser` — 16 passing browser tests, including offline, privacy interception, keyboard/mobile, and Axe coverage.
- Build output: `dist/index.html`; initial JS gzip 11.60 KB and CSS gzip 5.32 KB.
- Fresh clone: `/tmp/srp-polish-2-clean-LVhSeT`; `npm ci`, then every command in `.factory/claims.json`, completed from the clean checkout.
- Live cold verification: `/opt/fleet/lib/verify-url.sh https://shelf-rotation-picklist.sociobot.in/demo .factory/evidence/live-polish-2` returned HTTP 200 with no page/console errors, title `Demo — Shelf Rotation Picklist`, `lang=en`, one h1, main landmark, and no missing image alt or unlabelled buttons.
- Live Playwright/Axe recheck at 390 px: zero Axe violations; sample banner and three picks present; Reset demo and Start for real measure 44 px high; visible `Dark theme` text is 11 px; `/#tonight → /privacy → Back` returns a focused Tonight heading at 119.8 px from the viewport top.
- Evidence: `.factory/evidence/live-polish-2/screenshot-desktop.png`, `.factory/evidence/live-polish-2/screenshot-mobile.png`, and `.factory/evidence/live-polish-2/verify.json`.

## How to run

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:browser
```

Run each command listed in `.factory/claims.json` from a fresh checkout for per-claim proof. Open `/demo` or `?demo=1` for the isolated sample.

## Known gaps

None.
