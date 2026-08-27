# Independent verification 1 — FAIL

- Work order: `shelf-rotation-picklist-verify-1`
- Tested candidate: `9f3217b59ad21d49098b2deb7369e06d70b0910f`
- Tested URL: <https://shelf-rotation-picklist.sociobot.in>
- Verified: 2026-08-27 (UTC)
- Verdict: **FAIL — do not release this candidate.**

This is an independent verification report. The candidate was checked from a clean worktree at the stated SHA; product source was not changed.

## Blocking defects

### Medium — result rendering violates the deployed CSP and emits console errors

`pickCard()` emits an inline `style="--order:…"` attribute at `src/main.ts:211`, while the deployed response policy is `style-src 'self'` (no `unsafe-inline` or matching hashes). On the live site, generating the normal three-result sample emits four browser errors: “Applying inline style violates the following Content Security Policy directive `style-src 'self'` … The action has been blocked.” The per-ticket motion-delay style is therefore blocked. This violates the product quality gate of no console errors on end-to-end use and makes the declared motion treatment inconsistent in production.

### Medium — whitespace-only manual titles are accepted and saved as invisible games

In a clean browser profile, entering `"   "` as Title and `1` minute, then submitting Add to shelf, closes the dialog and creates one game row whose rendered heading is empty. HTML `required` accepts the whitespace; application code trims it only after validity has passed and never rejects the empty result. This is invalid user input that corrupts the shelf and cannot be found by title.

### Medium — CSV accepts impossible calendar dates and duplicate titles within one import

The parser accepts `2026-02-30` and `2024-02-30` with no errors because its date check accepts JavaScript's normalised `Date`; those values are not real calendar dates. A two-row CSV containing the same title (`Same`) also imports two games: deduplication compares only against titles that existed before the import rather than titles already accepted from the same file. Both outcomes contradict the documented resilient validation/duplicate skipping and can distort a shortlist.

### Low — mobile footer links miss the 44px touch-target requirement

At a 390px viewport, visible `Privacy` and `Terms` links measure 67×25px and 48×25px; `MIT source` measures 296×33px. The factory accessibility contract requires interactive touch targets of at least 44×44 CSS px.

## Evidence that passed

### Clean install, tests, build, and budget

```text
npm ci                         PASS — 54 packages audited, 0 vulnerabilities
npm test                       PASS — 2 files / 6 tests
npm run build                  PASS — tsc --noEmit && vite build
```

`dist/` was produced. Production sizes: JS 28,486 bytes (10.05 KB gzip), CSS 19,673 bytes (5.05 KB gzip), mobile AVIF 19,217 bytes, and desktop AVIF 47,443 bytes. These are within the 200 KB initial JS, 50 KB CSS, and 300 KB mobile hero budgets. No lint script exists; the build's TypeScript check is the repository's available static-analysis gate.

### Deployment identity, policies, caching, and privacy

The live root, JS, CSS, and service worker have byte-identical SHA-256 digests to the local candidate build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `6b0c1962799e2355af2ac58e42f1de056ae861a0165478087d1d4066a8db6cad` |
| `assets/index-WKsRVNZs.js` | `25cb01dfc516220de5e7ad3b184dbfac2b88e1765ec635b94be14a95dad63199` |
| `assets/index-BuHD-R0c.css` | `83f753f755fd8ad5a68505663a7521a5d1fb9faa813d0854f2ca22649e34b2b0` |
| `sw.js` | `7ee92bcc5df9cfeb3530da5d28686b4f3668e9bd025dc3628c12e0bf6f88d312` |

`/`, `/privacy`, `/terms`, and `/sw.js` return 200. Live headers include HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation-denying Permissions-Policy, and the CSP above. Hashed JS is cached `public, max-age=31536000, immutable`; `sw.js` is `no-cache`; HTML is `max-age=30, must-revalidate`.

Browser request capture on the live normal flow recorded only `https://shelf-rotation-picklist.sociobot.in`. The app stores only `shelf-rotation-picklist:v1` in local storage; no analytics, CDN font, remote catalog, or third-party request was observed. `/privacy` and `/terms` render from the same local app shell.

### End-to-end functional coverage

- Normal local and live flows: load the five fictional sample games; generate the expected 2-player/90-minute/medium shortlist (`Cardboard Cartographers`, `Pocket Tides`, `Orbital Orchard`); save a rotation; toggle dark theme. The live normal flow had no page exceptions, but did have the CSP console errors described above.
- Constraint boundary/recovery: changing Players to 20 produces the explicit “Nothing fits all limits” state and exclusion disclosure; returning it to 2 regenerates a list. A manual max-player value less than min-player is rejected with “Maximum players must be at least the minimum.” Case-insensitive duplicate manual titles are rejected.
- CSV recovery: a mixed CSV imported the valid `Good Import` row, skipped the malformed row, and focused/announced its detailed row errors.

### Browser, accessibility, responsive, and PWA checks

- Desktop and 390×844 mobile were exercised in Chromium. Mobile has no horizontal overflow (`scrollWidth = 390`), intentionally hides hero art, and stacks the workflow.
- Keyboard smoke test: first Tab reaches the skip link; it displays a visible 4px focus outline and moves on-screen. Native dialogs support Escape; controls expose labels and status/error regions.
- Axe-core 4.13 browser runs reported zero violations on empty, populated/reduced-motion mobile, `/privacy`, and `/terms` states (therefore zero serious/critical findings). The separate manual touch-target failure is listed above.
- With `prefers-reduced-motion: reduce`, pick-card animation duration is `0.00001s`.
- Service worker installed and controlled the page. It created `shelf-rotation-v2`; an offline reload rendered the cached shell and the offline banner with no errors. After seeding `shelf-rotation-v1` and reactivating the worker, cache storage contained only `shelf-rotation-v2`, confirming update cleanup.

## Required remediation and re-verification

1. Remove the CSP-incompatible inline result styles (or safely redesign the animation ordering without weakening CSP), then verify a live generated shortlist has zero console errors.
2. Reject trimmed-empty manual titles before persistence.
3. Validate real calendar dates and maintain an import-local title set so duplicate rows are skipped/reported.
4. Expand footer link hit areas to at least 44×44px.
5. Add regression tests for all four findings, deploy a new candidate, and rerun this verification.
