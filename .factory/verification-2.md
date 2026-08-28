# Independent verification 2 — FAIL

- Verified commit: `5cbfecbf82bc1873effe73f08fb8045fcd045dd1`
- Verified URL: <https://shelf-rotation-picklist.sociobot.in>
- Date: 2026-08-28 UTC
- Scope: clean-install static-web verification against `.factory/brief.json`, the product contract, and the deployed production response.

## Release decision

**FAIL — P1 mobile obstruction.** The normal successful-picklist notice is fixed and never clears. At the required 390 × 844 viewport it covers both a contender card and the fixed station navigation, contrary to the mobile requirement that content not hide behind fixed bars. This is present in the live deployment that exactly matches the candidate artifact.

### P1 — persistent success notice blocks mobile content and navigation

Reproduction on the live site in a clean Chromium profile:

1. Set viewport to 390 × 844.
2. Select **Try five sample games**, then **Make my picklist**.
3. The success notice, `Picklist ready with 3 contenders.`, remains displayed with no timeout or dismiss control.

Fresh live DOM geometry after the action:

| Element | Bounding rectangle (CSS px) |
| --- | --- |
| `#status-live` | x 97.5–292.5, y 721.61–824.00 |
| fixed `.workflow-nav` | x 8.0–382.0, y 774.0–836.0 |
| second `.pick-card` | x 16.0–374.0, y 583.17–898.78 |

The status has `position: fixed; z-index: 60`, while the station navigation is fixed at `z-index: 30`; their areas overlap by 50 CSS pixels. The notice also covers the middle of the second result card. The code only replaces this status text on a later action, so a user who has just generated their list cannot use the central **Tonight** navigation target and cannot see all result content until they manually scroll around the obstruction. This is a functional mobile regression, not merely a transient visual effect.

## Passing evidence

### Clean local gates

Ran from the clean candidate checkout:

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 58 packages installed; audit reported 0 vulnerabilities. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run typecheck` | PASS — `tsc --noEmit`. |
| `npm test` | PASS — 2 files, 8 tests. |
| `npm run build` | PASS — exact production `dist/` created. |
| `CI=1 PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx playwright test --reporter=line` | PASS — 8 browser tests in 13.0 s, after the required production build. |

The browser suite covers strict deployed CSP shortlist creation, blank manual titles, impossible CSV dates, same-file duplicate titles, desktop skip-link/result focus, zero axe violations in the normal flow, 390px overflow/touch targets, local-only requests, privacy/terms routes, offline reload/cache update, and reduced motion.

### Independent live product exercise

In addition to the repository suite, a clean live Chromium context exercised the real job:

- Loaded the five fictional shelf samples; generated the normal three-game shortlist; verified visible per-pick score/reasons; saved it and verified persistence after reload.
- Exercised no-match recovery: changed players to 20, received **Nothing fits all limits** plus exclusion details, returned to 2 players, and regenerated three picks.
- Exercised manual validation/recovery: whitespace-only title returned the documented error and focus to Title; inverted min/max players returned the documented error; correcting it added the game.
- Exercised CSV validation/boundaries: future date and fractional minutes were rejected with row errors; a 1–20 player, 600-minute valid row imported as unavailable.
- Verified the live privacy clear-data confirmation removes `shelf-rotation-picklist:v1` and changes the button to **Local data cleared**.
- Live desktop axe 4.11 scan after the normal flow: 0 total violations (therefore 0 serious/critical). Live console errors: 0. Live `pageerror` events: 0. All 10 captured automatic requests were same-origin.
- Keyboard smoke: Tab reached the skip link; Enter went to `#main`; its visible focus had a solid 4px outline. Generated results moved focus to the rotation heading. Reduced-motion ticket animation computed to `0.01ms`.
- At 390px, document width was exactly 390 (no horizontal overflow); footer touch targets were Privacy 75.44 × 44, Terms 56.17 × 44, and MIT source 80.25 × 44 CSS px. This otherwise passing mobile result exposed the P1 overlap above.

### Production identity, privacy, policy, and performance evidence

- `GET /`, `/privacy`, `/terms`, and `/sw.js` each returned HTTP 200 from the live host. `/privacy` and `/terms` correctly use the app-shell fallback and client routes.
- The local production build and live deployment are byte-identical: `index.html` SHA-256 `b2a1361edc3a20728a08c8de69981cfe3b2b8d1e39e983355082babe69fc0d36`; JS `ee4e9cbc82bf041e8798a184a14d4fd50eb064bcf3379c214c983d1ef85a2913`; CSS `d5340a032d32f650de195ebd8a7a0f6502f265ad1ec548ae8d048687649cf8a6`; service worker `7ee92bcc5df9cfeb3530da5d28686b4f3668e9bd025dc3628c12e0bf6f88d312`.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, camera/microphone/geolocation-denying Permissions Policy, and CSP `default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'` with no `unsafe-inline`. HTML uses a short revalidation cache; hashed JS/CSS use `public, max-age=31536000, immutable`; `/sw.js` uses `no-cache`.
- Privacy is local-first: no automatic third-party requests, remote scripts, remote fonts, analytics, catalog access, or tracking were observed. The only product data key is documented browser local storage and is exportable/clearable. The footer’s GitHub link is a user-initiated source link, not an automatic request.
- Production sizes are within the static budgets: JS 28,876 bytes (10.23 kB gzip), CSS 19,907 bytes (5.09 kB gzip), desktop AVIF 47,443 bytes, mobile AVIF 19,217 bytes; no font files ship. Service-worker offline reload and old-cache cleanup passed in the browser suite.

Lighthouse 13.4.1 was attempted against the live URL with the installed Playwright Chromium (`CHROME_PATH=/opt/pw-browsers/chromium-1208/chrome-linux64/chrome`) but its launcher returned `Unable to connect to Chrome`; no Lighthouse score is claimed. Direct asset-budget, browser accessibility, and responsive checks above completed.

## Required follow-up

Make status feedback auto-dismiss, dismissible, or positioned so it does not overlap the mobile fixed navigation or results; then rerun the 390px successful-picklist flow and the full verification suite. No production-code change was made during this verification.
