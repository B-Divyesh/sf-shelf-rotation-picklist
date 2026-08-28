# Polish 1 handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-polish-1`
- Repaired and deployed application commit: `2712341`
- Base reviewed: `872ecfed89e3669c4ea30057cbd98f0b28d3a196`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>
- Deployed through: `/opt/fleet/lib/deploy-static.sh shelf-rotation-picklist dist`

## Delivered

- Rewrote the first screen in plain words and preserved the shelf-label neo-brutalist identity.
- Added immediate, isolated `/demo` and `?demo=1` flows, demo controls, documentation, and separate `demo:` storage.
- Added `.factory/claims.json`, 11 observable claim tests, real route handling, route titles/canonical metadata, sitemap, social image, legal skeleton, focus announcements, and designed not-found state.
- Fixed 200% mobile reflow and removed the final live demo axe violations.
- Added privacy boundaries, source/build documentation, copy audit, catalog description, and the complete finding-to-evidence map in `.factory/polish-1.md`.

## Verification

Fresh clone at `/tmp/srp-final-clean-pDZwgi` passed `npm ci`, `npm test` (11 tests), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:browser` (11/11). Every claim command in `.factory/claims.json` was run from that clone and passed.

Final local regression passed: `npm test` (11), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:browser` (11/11). Production asset sizes: JavaScript 32.56 KB raw / 11.08 KB gzip; CSS 21.65 KB raw / 5.34 KB gzip.

Live cold checks after the final deployment found: `/demo` title correct, banner visible, three immediate picks, seeded real data untouched, 390px width with no overflow, reset/exit working, no console errors, zero axe violations, working `/privacy`, and designed unknown-route 404. `verify-url.sh` passed live (771ms load; title/lang/h1/main/alt/button checks). Evidence: `.factory/evidence/live/verify.json`, `screenshot-desktop.png`, and `screenshot-mobile.png`.

The standalone `@axe-core/cli` launcher could not locate a Chrome binary in this container. The Playwright axe integration ran against the live demo instead and returned zero violations.

## Known gaps

None. The product remains a static Vite application with local browser storage and no third-party runtime services.
