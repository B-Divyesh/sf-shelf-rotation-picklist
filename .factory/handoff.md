# Polish 3 handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-polish-3`
- Candidate repaired: `7867c5348c9e353f6ebec6fbb4f4ec2d174b002e`
- Review base: `ddd0e893e299de65d5b980b12a5177139ad506aa`
- Deployed application commit: `36235cb`
- Azure deployment: `99470c17-2282-4146-b82e-d7ce7756ea4f`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>

## Delivered

Closed all 93 unique findings across reviews 1–3. The complete one-row-per-ID ledger is in `.factory/polish-3.md`.

The release now has a complete first screen at desktop and mobile widths, a one-click isolated `/?demo=1` sample, comprehensive claim tests, real HTTP 404 handling, route-specific metadata and focus announcements, an exact 180 px touch icon, precise privacy controls, and corrected product language. The shelf-label neo-brutalist identity and static Vite deployment class remain unchanged.

The catalog description is now: “Pick neglected board games that fit tonight’s players, time, and setup.” It is verb-first and 71 characters excluding its newline.

## Exact verification

- Clean clone: `/tmp/srp-polish3-release-check/repo`; `npm ci` installed 60 packages with 0 vulnerabilities.
- Claims: all 16 exact `.factory/claims.json` commands passed from that clone without an existing `dist` directory.
- Unit/repository: `npm test` — 11/11 passed.
- Lint: `npm run lint` — passed.
- Types: `npm run typecheck` — passed.
- Production build: `npm run build` — passed; `dist/index.html` and `dist/404.html` exist.
- Output: main JS 33.48 KB raw / 11.32 KB gzip; CSS 21.67 KB raw / 5.32 KB gzip.
- Browser integration: `npm run test:browser` — 17/17 passed locally.
- Flake check: `@claim:picklist-size --repeat-each=10` — 10/10 passed.
- Live browser integration: `PLAYWRIGHT_BASE_URL=https://shelf-rotation-picklist.sociobot.in npm run test:browser` — 17/17 passed after deployment.
- Live baseline: `/opt/fleet/lib/verify-url.sh` — 200 response, no console errors, one titled English page, one h1/main, no missing image text or button names.
- Live routes: root, direct query demo, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns the designed page with HTTP 404.
- Live security: CSP, `Referrer-Policy`, and `X-Content-Type-Options` are present; privacy tests observed only same-origin traffic.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.05 s, CLS 0, TBT 20 ms.
- Axe: no violations in the tested light, dark, hover, focus, 200% text, and not-found states.
- Visual evidence: `.factory/evidence/polish-3/live/`; local pre-deployment evidence: `.factory/evidence/polish-3/local/`.

## Run and verify

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:browser
```

To repeat browser checks against production without starting a local server:

```bash
PLAYWRIGHT_BASE_URL=https://shelf-rotation-picklist.sociobot.in npm run test:browser
```

## Known gaps and next steps

None. Every current and reopened finding is mapped to an implemented change and passing evidence in `.factory/polish-3.md`.
