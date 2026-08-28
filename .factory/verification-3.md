# Independent verification 3 — PASS

- Tested commit: `f8fe950f32c73c750bcd274b1a17e68bfb341428`
- Tested URL: <https://shelf-rotation-picklist.sociobot.in>
- Date: 2026-08-28 UTC
- Scope: clean-checkout static-web QA against `.factory/brief.json`, the factory product contract, and the attached accessibility/performance requirements.

## Release decision

**PASS.** The deployed artifact is byte-identical to the production build from the tested commit, and the smallest useful product works end to end: a user can manually add or locally import shelf games, set hard tonight constraints, get an explainable 3–5 game shortlist, save it locally, recover from no eligible games and invalid input, and clear their data. The earlier P1 mobile feedback obstruction is fixed in the candidate and was not reproduced from fresh live evidence.

## Clean local gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 58 packages installed; 0 audit vulnerabilities. |
| `npm test` | PASS — 2 test files, 8 tests. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run typecheck` | PASS — `tsc --noEmit`. |
| `npm run build` | PASS — emits `dist/` using the exact production build command. |
| `npm run test:browser` | PASS — 9/9 Playwright checks against the production preview. |
| `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 …` | PASS — HTTP 200; 655 ms load; no console/page errors; title, `lang=en`, one h1, main landmark, image alt text, and labelled buttons all present. |

The repository browser suite additionally passed strict-CSP shortlist creation, desktop keyboard/axe smoke, 390px overflow/touch targets, privacy and terms routes, first-party-only local requests, service-worker old-cache cleanup plus offline reload, and reduced-motion behavior.

## Independent live product exercise

Fresh Chromium checks were executed directly against the public URL, in new browser contexts rather than through the preview:

- Desktop normal path: loaded the five fictional samples, generated exactly three candidates, verified visible per-pick reasons/scores and a visible in-flow success message, saved the rotation, then reloaded and verified persistence.
- Constraints and recovery: 20 players produced **Nothing fits all limits**; restoring two players produced three candidates again.
- Manual validation: whitespace-only title produced `Enter a game title, not only spaces.`; maximum players lower than minimum produced its documented error; correcting it added the game.
- CSV validation and boundary: a future date and `30.5` minutes produced row errors; valid `1–20` players, `600` minutes, heavy-setup row imported and `available=false` displayed as `OUT`.
- Privacy control: the `/privacy` clear-data confirmation removed `shelf-rotation-picklist:v1` from local storage.
- Desktop axe 4.11: 0 serious/critical findings. Dark-mode axe 4.11: 0 serious/critical findings. Console errors and page errors: 0.
- Keyboard: Tab initially focused the skip link; its computed focus outline is solid 4px; Enter reached main. Successful generation moved focus to the rotation heading.
- Mobile 390 × 844: `scrollWidth` was exactly 390; the visually hidden assistive-status node intersected neither the fixed station navigation nor the second result card; the in-flow confirmation was present. Axe found 0 serious/critical findings. Under reduced motion, ticket animation duration computed to `0.01ms`.
- Visual inspection of fresh local production screenshots confirmed the product-specific shelf-label visual system on desktop and its intentional one-column mobile treatment (hero art omitted, controls stacked, station navigation remains reachable).

The live automated-request capture contained only `https://shelf-rotation-picklist.sociobot.in`. No remote fonts, scripts, analytics, trackers, game-catalog scraping, or third-party requests were observed. The user-initiated GitHub source link was not followed.

## Deployment identity, privacy, policies, and performance

Live and locally built assets have matching SHA-256 digests:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `6baa7eb4c207f0d50c9750b3f6e61acd5c98fc6ffdfd07ab4a6e82a95d660a50` |
| `assets/index-DqLi3SKW.js` | `d3c5f9b50faa72cb99fe4232fc5645288f9e269c4bb64899ccf4e6b7b99ad289` |
| `assets/index-CM3-eKg-.css` | `8727f0fab0f9a6ea9d00dcb2d709f5201b31701ba89f83407553b17bc343bc99` |
| `sw.js` | `7ee92bcc5df9cfeb3530da5d28686b4f3668e9bd025dc3628c12e0bf6f88d312` |

`/`, `/privacy`, `/terms`, and `/sw.js` return HTTP 200 on the live host. Live headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, camera/microphone/geolocation-denying Permissions Policy, and CSP `default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`. No `unsafe-inline` is present. HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS use `public, max-age=31536000, immutable`; `/sw.js` uses `no-cache`.

The production build meets direct static budgets: JS 28,982 bytes (10,251 gzip), CSS 19,752 bytes (5,047 gzip), mobile AVIF 19,217 bytes, desktop AVIF 47,443 bytes, and no shipped font files. The local-first storage key is documented, exportable, and clearable; no account or payment processing exists.

Lighthouse 13.4.1 was attempted against the public URL with the supplied Playwright Chromium (`CHROME_PATH=/opt/pw-browsers/chromium-1208/chrome-linux64/chrome`) but failed before auditing with `Unable to connect to Chrome`. No Lighthouse score is claimed; direct bundle, responsive, accessibility, browser-error, and functional checks above passed.

## Defects

No product defects found: **P0 0, P1 0, P2 0, P3 0**.

QA limitation (not a product defect): Lighthouse could not attach to the supplied Chromium in this environment. Re-run it in a runner with a compatible Chrome launcher if a numeric Lighthouse gate is required.
