# Review 3 handoff — Shelf Rotation Picklist

- Work order: `shelf-rotation-picklist-review-3`
- Reviewed source: `7867c5348c9e353f6ebec6fbb4f4ec2d174b002e`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>
- Verdict: **FAIL**

## Done

Completed the requested adversarial review without changing product code. The full evidence, copy inventory, claim results, demo/storage checks, structure/accessibility checks, missed-leverage decision, and per-finding history audit are in `.factory/review-3.md`.

The live demo itself is one-click, realistic, resettable, offline-capable, and isolated from a seeded real-data key. A separate real-data browser flow successfully added a game, imported a mixed CSV, generated picks, exported correct CSV content, and invoked print.

## Verification performed

- Cold live captures in fresh Chromium contexts at 390 × 844 and 1440 × 900.
- Live demo save/reset/exit with separate real and demo storage namespaces.
- Live offline reload and same-origin request interception.
- Every command in `.factory/claims.json` from clean clone `/tmp/srp-review3-clean-kP2uM6/repo`; browser commands required an unlisted explicit build, and `picklist-size` failed once before passing on rerun.
- After building: `npm test` 11/11, lint pass, typecheck pass, build pass, full browser suite 16/16.
- Live route metadata, h1/main/lang, canonical/OG, link crawl, deep-link/Back behavior, 200% reflow, mobile target measurements, and Axe checks in light/dark themes.
- `/opt/fleet/lib/verify-url.sh` passed its baseline checks; temporary evidence is at `/tmp/srp-review3-verify-rWwLhJ`.

## Left to address

The report contains 19 findings. Blocking items include the desktop first screen, clean-clone claim commands, a flaky size claim, HTTP-200 not-found routing, missing legal-route announcements, dark-hover contrast, incomplete tagged claim coverage, the absent 180 px touch icon, stale footer build id, and reopened terminology. Two major findings cover an overbroad clear-data promise and a 37 px touch target. Three minor copy findings remain.

No deployment, infrastructure, source, styling, or test code was changed.
