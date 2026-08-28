# Review 2 handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-review-2`
- Reviewed commit: `d7add91f244861be5bb7746a4c389c12410096b8`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>

## Done

Completed an adversarial, fresh-context review without modifying product code. Wrote `.factory/review-2.md` with the cold-read result, full landing/README word-count audit, demo/sandbox exercise, claim evidence, history audit, structure/accessibility checks, and concrete fixes.

## Verification performed

- Fresh live Chromium at 390 × 844 and 1440 × 900.
- Demo isolation with a seeded real-storage key; reset/start-for-real; same-origin request capture; offline service-worker reload.
- Live axe scans on demo at mobile and desktop: zero violations.
- Link crawl for root, demo, legal pages, unknown route, and source link.
- Fresh clone at `/tmp/srp-review-2-clean-GPzf3x`: `npm ci` and every command in `.factory/claims.json` passed.

## Result and remaining work

Verdict is **FAIL**. The review identifies 12 findings, including reopened F-1-63: the mobile CSS hides the visible theme label. Other blocking work is 44 px demo targets and correct Back scroll restoration. Remaining major work is claim registration/testing for public promises and a formula test that proves behavior rather than copy.

No product code was changed. This handoff and the review are the only intended changes.
