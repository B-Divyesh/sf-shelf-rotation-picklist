# Review handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-review-1`
- Reviewed source: `2d0d46cdf5087822443f64363ea3f882df71a9be`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>
- Verdict: **FAIL**

The adversarial first-read report is in `.factory/review-1.md`. No product code was changed.

## What was done

- Reviewed fresh 390 × 844 and 1440 × 900 first screens.
- Audited every cold-landing, conditional root-route, dialog, and README sentence with word counts.
- Exercised the sample path, direct `/demo`, storage isolation, reset/banner controls, offline reload, and request interception.
- Checked the claims registry and every claim-like sentence.
- Crawled routes and links; checked titles, h1s, metadata, 404 behavior, focus/back behavior, footer/header consistency, and 200% text reflow.
- Read the brief, design thesis, handoff, and all three prior verification reports; independently reconfirmed their five earlier defects are fixed.
- Ran live axe scans on desktop/mobile initial, sample, dark, Privacy, and Terms states: zero violations.

## Verification

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:browser
```

All commands passed: 8 unit tests and 9 browser tests; `dist/` was produced. The FAIL verdict comes from requirements outside the existing test coverage, chiefly the missing isolated demo and claim registry.

## Known gaps / next steps

The report contains 63 findings. The blocking gaps are first-screen audience/job clarity, the non-isolated two-click sample flow, missing `.factory/claims.json`, and unknown paths rendering the normal picker instead of a 404. It also records unlisted claims, 200% mobile overflow, route-focus, metadata/sitemap/skeleton, and copy issues with concrete fixes.
