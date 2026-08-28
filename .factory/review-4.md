# Adversarial first-read review 4 — Shelf Rotation Picklist

- Reviewed: 2026-08-28 UTC
- Source: `5ccd562a00b959f0a500ac362e3ffa2ca6742af0`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>
- Contexts: new Chromium contexts at 390 × 844 and 1440 × 900, plus isolated demo, route, offline/privacy, and accessibility contexts
- Verdict: **PASS**

No blocking, major, or minor findings remain. No `F-4-k` finding is issued.

## Thirty-second cold read

This was recorded before scrolling on the live site.

| Question | 390 × 844 phone | 1440 × 900 desktop |
| --- | --- | --- |
| What does it do? | Picks neglected board games that fit tonight. | Picks neglected board games that fit tonight. |
| For whom? | Board-game collectors choosing from a crowded shelf. | Board-game collectors choosing from a crowded shelf. |
| What should I click first? | **Try it with sample data.** | **Try it with sample data.** |

The answer comes from the visible headline, audience sentence, primary action, adjacent result note, and three facts. The required text is above the fold at both sizes. The phone view has no horizontal overflow; the desktop view also presents the original shelf art without obscuring the action.

## Demo and sandbox verification

The first-screen action opens `/?demo=1` in one click. Its first rendered screen already contains a realistic five-game shelf and a three-pick result with scores and reasons. The persistent **“Demo — sample data, nothing is saved”** banner has both **Reset demo** and **Start for real** controls.

A fresh context was seeded with the real key `shelf-rotation-picklist:v1` containing `REAL-SHELF-MARKER`. In demo, the marker was absent, Reset wrote only `demo:shelf-rotation-picklist:v1`, and the real key was unchanged. Start for real removed the demo key and returned to the real route. The observed normal-flow requests were same-origin product assets only. The registered offline test reloads the service-worker-controlled demo after `context.setOffline(true)` and verifies the picklist remains available.

## Claims from a clean clone

Clean clone: `/tmp/srp-review4-k7G5qI/repo`. After `npm ci`, every command registered in `.factory/claims.json` was run. The complete browser suite covers the 15 browser-tagged claims; the separately registered repository/build claim also passed. `npm run lint` and `npm run build` passed from that clone; the build emitted `dist/index.html` and `dist/404.html`.

| Claim id | Result |
| --- | --- |
| `demo-isolation` | Pass |
| `picklist-filters-and-reasons` | Pass |
| `picklist-size` | Pass |
| `repeatable-picklist` | Pass |
| `tie-breaks` | Pass |
| `score-points` | Pass |
| `csv-io` | Pass |
| `privacy-local` | Pass |
| `no-remote-catalog` | Pass |
| `saved-picklists` | Pass |
| `free-no-account` | Pass |
| `clear-local-data` | Pass |
| `docs-build` | Pass |
| `offline-reload` | Pass |
| `themes-and-accessibility` | Pass |
| `routing-metadata-and-provenance` | Pass |

All landing and README claims map to one of these registered checks. This includes result size, deterministic ordering, the published scoring formula, CSV input/output, browser-only storage, no remote catalog, free/no-account use, local-data clearing, offline reload, theme/reflow accessibility, and route/provenance metadata. No unlisted claim was found.

## Earlier finding audit

Every earlier review and polish record was read. The following is a verification ledger, not reliance on a prior “fixed” label.

| Earlier ids checked | Live and code verification | Result |
| --- | --- | --- |
| F-1-1 | Visible plain-language board-game job, audience, direct sample action, result note, price/offline/privacy facts at both required viewport sizes. | Fixed |
| F-1-2 | Direct isolated demo has immediate ranked results, banner, Reset, Start for real, separate `demo:` storage, and documentation. | Fixed |
| F-1-3; F-1-5–F-1-54 | Registry exists; all 16 exact registered proofs pass from the clean clone, including the former unlisted capability, scoring, privacy, offline, build, and license claims. | Fixed |
| F-1-4 | Unknown live route returns HTTP 404 and renders a styled recovery page. | Fixed |
| F-1-55 | 390 px at 200% text is checked by the browser claim and has no horizontal overflow. | Fixed |
| F-1-56 | In-app legal navigation and Back/Forward focus the new h1 and update the polite live region. | Fixed |
| F-1-57 | Landing contains the plain “What stays private” boundary section. | Fixed |
| F-1-58–F-1-60 | Per-route metadata, social image, 180 px touch icon, robots/sitemap, shared header/footer, legal links, and current Git build id are live. | Fixed |
| F-1-61–F-1-63 | Current copy stays within the word cap, keeps maintained terminology, and uses visible result-naming theme actions. | Fixed |
| F-2-1 | Demo controls measure at least 44 px on the phone. | Fixed |
| F-2-2 | `/#tonight → Privacy → Back` restores the Tonight location and focus. | Fixed |
| F-2-3–F-2-11 | Size, sample wording, repeatability, ties, catalog boundary, browser print wording, and scoring-rule evidence are all registered and asserted. | Fixed |
| F-3-1 | Desktop first screen fits the audience, action, next-result note, and all facts above 900 px. | Fixed |
| F-3-2–F-3-3 | Browser claims build their own preview from a clone and the size claim is stable in the complete run. | Fixed |
| F-3-4–F-3-6 | HTTP 404, persistent route announcement, and dark-theme hover contrast are verified. | Fixed |
| F-3-7–F-3-11 | Tagged browser/repository tests now exercise manual and CSV behavior, all limits/reasons, score intervals/caps, full privacy flow, and an actual build. | Fixed |
| F-3-12–F-3-13 | Live touch icon is 180 × 180 PNG; live footer build is `5ccd562a`. | Fixed |
| F-3-14–F-3-19 | Current terms are “Picklist size” and “Maximum setup effort”; precise shelf clearing, mobile target, verb-led theme action, and README heading all verify. | Fixed |

## Structure, accessibility, and identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns 404. `robots.txt`, `sitemap.xml`, favicon, and touch icon return 200.
- Each checked route has `lang="en"`, exactly one `<main>` and `<h1>`, a route-specific title, description, canonical URL, Open Graph image/title, Twitter card, favicon, and touch icon. Normal routes produced no console errors.
- Header, skip link, footer, Privacy, Terms, and build identification are consistent. Every internal URL and the GitHub source link was checked; there are no dead links.
- The live root → Privacy in-app route check focuses **“Your shelf stays on your device.”** and announces it. Back/Forward route focus is covered by the registered browser claim.
- Axe found zero violations on root, demo, Privacy, Terms, and 404 at the tested mobile/desktop widths. The 404’s browser network message is the expected HTTP 404 response, not an application console exception.
- The thick rules, fluorescent lime, hard offset shadows, mono data copy, original shelf photograph, and ticket-like controls are recognisably shelf-label neo-brutalism. They match `.factory/design.md` and are not a generic SaaS template.

## Copy audit

Method: whitespace-separated words; code blocks are excluded. The tables list every prose sentence or standalone copy unit on the initial landing state and README. Headings and controls are included because the plain-words check also applies to them. No item exceeds 22 words. No jargon, banned marketing adjective, inconsistent product term, context-free heading, or non-result-naming button was found.

### Landing page

| Words | Copy unit |
| ---: | --- |
| 4 | A picklist for tonight |
| 6 | Pick neglected board games for tonight |
| 18 | For board-game collectors choosing from a crowded shelf, get 3–5 picks that fit tonight’s players, time, and setup. |
| 5 | Try it with sample data |
| 8 | See a sample picklist ranked by tonight’s limits. |
| 1 | Free |
| 6 | Works offline after the first visit |
| 6 | Shelf data stays in this browser |
| 8 | Games rise by the published score. |
| 4 | Add your board games |
| 10 | Add games one at a time or import a CSV. |
| 7 | Add only games you want to rotate. |
| 3 | Add one game |
| 2 | Import CSV |
| 2 | Download template |
| 3 | No games added. |
| 10 | Add a board game or try a ready-made sample picklist. |
| 5 | Try it with sample data |
| 3 | Set tonight’s limits |
| 6 | Games outside your limits are excluded. |
| 5 | Limits do not change points. |
| 1 | Players |
| 2 | Time ceiling |
| 3 | Maximum setup effort |
| 3 | Light only |
| 3 | Up to medium |
| 2 | Any setup |
| 2 | Must-have tag |
| 2 | Any tag |
| 2 | Picklist size |
| 20 | Picks score up to 85 points: neglect 50 + never played 20 + easy setup 10 + tag variety 5. |
| 3 | See scoring details |
| 3 | Generate tonight’s picklist |
| 7 | Games are ranked by the published score. |
| 6 | Your group makes the final choice. |
| 3 | Make my picklist |
| 3 | No picklist yet. |
| 8 | Add at least one shelf game to begin. |
| 3 | What stays private |
| 6 | Shelf data stays in this browser. |
| 8 | CSV files and game details are not uploaded. |
| 3 | Export or clear |
| 5 | Export your shelf as CSV. |
| 9 | Clear all real data from the Privacy page. |
| 3 | No remote catalog |
| 11 | This tool does not fetch game ratings, prices, or catalog data. |
| 2 | No account |
| 6 | Use the picker without signing in. |
| 3 | Shelf Rotation Picklist |
| 6 | Pick neglected board games for tonight. |
| 1 | Privacy |
| 1 | Terms |
| 8 | Built by Param Factory · build 5ccd562a |
| 5 | MIT source on GitHub |

### README

| Words | Copy unit |
| ---: | --- |
| 3 | Shelf Rotation Picklist |
| 6 | Pick neglected board games for tonight. |
| 9 | It is for collectors choosing from a crowded shelf. |
| 7 | Set players, time, setup, and tag limits. |
| 12 | The picker returns three to five games with visible reasons and points. |
| 6 | Try the ready-made sample at <https://shelf-rotation-picklist.sociobot.in/?demo=1>. |
| 5 | What Shelf Rotation Picklist does |
| 10 | Add games one at a time or import a CSV. |
| 6 | Export your shelf as a CSV. |
| 5 | Exclude games outside tonight’s limits. |
| 7 | Generate a repeatable picklist with visible points. |
| 9 | Save up to ten picklists in this browser. |
| 7 | Print the current picklist from your browser. |
| 5 | Use light or dark themes. |
| 6 | Works offline after the first visit. |
| 6 | Shelf data stays in this browser. |
| 4 | Game details are not uploaded. |
| 1 | Scoring |
| 10 | Neglect adds five points per full month, up to 50. |
| 4 | Never-played games add 20. |
| 11 | Light, medium, and heavy setup add 10, 5, and 0 points. |
| 6 | A new tag adds five points. |
| 6 | Games outside your limits are excluded. |
| 5 | Limits do not change points. |
| 3 | Ties are alphabetical. |
| 2 | CSV format |
| 9 | Download a template in the app, or provide these columns. |
| 6 | `last_played` is blank or uses `YYYY-MM-DD`. |
| 6 | `setup` is `light`, `medium`, or `heavy`. |
| 4 | Separate tags with `|`. |
| 8 | `available` accepts `true`, `false`, `yes`, `no`, `1`, or `0`. |
| 7 | Invalid rows show errors while valid rows import. |
| 3 | Privacy and boundaries |
| 13 | The app stores your shelf, limits, theme, and saved picklists in this browser. |
| 9 | The Privacy page can clear your real shelf data. |
| 12 | The app does not use a remote game catalog, ratings, or prices. |
| 1 | Develop |
| 6 | Requires Node.js 20 or newer. |
| 3 | Test and build |
| 7 | `npm run build` type-checks and creates `dist/index.html`. |
| 6 | Deploy `dist/` to Azure Static Web Apps. |
| 10 | Run every registered product claim from `.factory/claims.json` with its listed command. |
| 1 | License |
| 4 | MIT — see [LICENSE](LICENSE). |

## Missed leverage

No finding. The brief explicitly requires inspectable, non-LLM scoring. The obvious useful import/export path is present: manual entry, CSV import, CSV template, CSV export, browser printing, and local storage. An AI feature or cloud sync would increase scope and weaken the stated local-first/privacy model without improving this job’s essential decision.

## What would make this perfect

Nothing additional is required for the defined product. Preserve the current plain copy, isolated demo, claim coverage, and visual system when making future changes; rerun this full checklist after any release.
