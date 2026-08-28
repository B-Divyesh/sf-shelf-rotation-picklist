# Adversarial first-read review 3 — Shelf Rotation Picklist

- Reviewed: 2026-08-28 UTC
- Source: `7867c5348c9e353f6ebec6fbb4f4ec2d174b002e`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900
- Verdict: **FAIL** — 19 findings remain. A pass requires zero findings and no untested claim.

## Thirty-second cold read

I recorded this before reading the brief or earlier reviews.

| Question | Mobile, 390 × 844 | Desktop, 1440 × 900 |
| --- | --- | --- |
| What does this do? | Picks neglected board games that fit tonight. | Picks neglected board games for tonight. |
| For whom? | Board-game collectors choosing from a crowded shelf. | **Cannot answer before scrolling.** The audience sentence starts at y=911, below the 900 px viewport. |
| What should I click first? | **Try it with sample data.** | **Cannot answer before scrolling.** The action starts at y=1066. |

The desktop first screen contains only **“A picklist for tonight”** and the 671 px-tall **“Pick neglected board games for tonight”** headline in its left column. The required audience sentence, **“For board-game collectors choosing from a crowded shelf…”**, and first action, **“Try it with sample data”**, are below the fold. See F-3-1.

## Findings

### F-3-1 — BLOCKING — The desktop first screen hides the audience and first action

- Exact location: `/`, 1440 × 900, before scrolling.
- Evidence: `#hero-title` spans y=212–883; `.hero-lede` begins at y=911; `.hero-action` begins at y=1066.
- Why this fails: a first-time desktop visitor can identify the job, but cannot identify the intended user or what to click within the first screen.
- Concrete fix: reduce the desktop headline scale and vertical padding, or rebalance the hero grid, until the audience sentence, sample action, next-result note, and three facts all fit above 900 px. Add a 1440 × 900 assertion that each element's bottom is at or above the viewport bottom.

### F-3-2 — BLOCKING — Registered browser claim commands do not run from a clean clone (reopens F-1-3)

- Exact location: `.factory/claims.json`; `playwright.config.ts` uses `npm run preview`, while `dist/` is ignored and absent after `npm ci`.
- Evidence: from `/tmp/srp-review3-clean-kP2uM6/repo`, the first seven browser claim commands each timed out after 60 seconds waiting for `config.webServer`. The first failure was `npm run test:browser -- --grep @claim:demo-isolation`. Only after the reviewer manually ran `npm run build` could browser assertions start.
- Why this fails: the registry commands are not self-contained from the required clean state, so a verifier cannot run the claimed proof as written. Any failing claim command is blocking.
- Concrete fix: make the Playwright web-server command build before preview, or make every browser claim command include the build prerequisite. Verify all commands in registry order after only `git clone` and `npm ci`.

### F-3-3 — BLOCKING — The 3/4/5-pick claim test failed during this review (reopens F-1-26, F-1-33, F-2-3, and F-2-4)

- Exact claims: landing **“get 3–5 picks”** and README **“The picker returns three to five games…”**.
- Evidence: after an explicit build, `npm run test:browser -- --grep @claim:picklist-size` timed out because **Make my picklist** remained disabled. The isolated rerun and full suite later passed.
- Why this fails: one observed failure is enough to make the registered claim non-deterministic. A verifier cannot rely on a test that sometimes stalls on a disabled primary action.
- Concrete fix: identify and remove the state/server race; assert the seeded shelf and enabled Generate control before changing each size; run this claim repeatedly in isolated fresh contexts without `reuseExistingServer`.

### F-3-4 — BLOCKING — The designed not-found view still returns HTTP 200 (reopens F-1-4)

- Exact location: `GET /not-a-real-route` returns `200 text/html` while showing **“This page does not exist”**.
- Code evidence: `public/staticwebapp.config.json` sends unknown routes through `navigationFallback` and has no 404 response override or `404.html`.
- Why this fails: crawlers and clients are told that a nonexistent route is valid. The route is visually designed but is not a real 404.
- Concrete fix: add the host's 404 response override and a styled `404.html` (or equivalent supported route) that returns status 404; test both the status and the designed recovery link.

### F-3-5 — BLOCKING — Route changes to legal pages are not announced (reopens F-1-56)

- Exact location: root → **Privacy**. Focus moves to **“Your shelf stays on your device.”**, but `/privacy` and `/terms` contain no `[aria-live]` region.
- Code evidence: `renderRoute()` calls `announce(...)`, while `renderLegal()` does not render `#status-live`.
- Why this fails: the focus part of the prior repair works, but the required polite route announcement silently has no target on legal routes.
- Concrete fix: put one persistent polite live region outside route-specific markup, then test its text after root → Privacy, Privacy → Terms, back, and forward navigation.

### F-3-6 — BLOCKING — The dark-theme control fails contrast in its hover state (reopens F-1-36)

- Exact location: **Light theme** button after switching to dark mode, on `/` and `/demo` at both tested widths.
- Evidence: Axe reports a serious `color-contrast` violation: white `#ffffff` on blue `#7392ff`, 11 px bold, ratio 2.88:1; 4.5:1 is required.
- Why this fails: the public light/dark-theme claim is registered, but its test misses the hovered state. The control becomes hard to read during direct interaction.
- Concrete fix: use dark ink on the blue hover fill or darken the blue to reach 4.5:1, and scan default, hover, focus, and active states in both themes.

### F-3-7 — BLOCKING — Manual entry and detailed CSV promises remain under-tested (reopens F-1-11, F-1-30, F-1-45, and F-1-46)

- Exact copy: **“Add games one at a time or import a CSV.”**, **“Export your shelf as a CSV.”**, **“Download a template in the app…”**, and the documented `last_played`, `setup`, tag, and `available` values.
- Evidence: `@claim:csv-io` imports one valid/one invalid row and checks two suggested filenames. It never adds a game manually, reads either downloaded file, or tests all documented field values. The broader parser checks are untagged unit tests, so they are not the one registered proof for these public claims.
- Why this fails: public capabilities and compatibility promises exceed the observable assertions attached to `csv-io`.
- Concrete fix: split these into explicit registered claims or expand one tagged test to add a game, inspect template/export contents, and exercise every documented value and rejection boundary.

### F-3-8 — BLOCKING — Filtering and per-pick reason promises are not fully asserted (reopens F-1-6, F-1-8, F-1-12, F-1-22, F-1-23, F-1-32, and F-1-38)

- Exact copy: **“Games outside your limits are excluded. Limits do not change points.”** The claim also says **“every pick shows its reasons.”**
- Evidence: `@claim:picklist-filters-and-reasons` changes only the player count. It does not independently exercise availability, time, setup, and tag filters. It counts at least three reason rows globally instead of asserting at least one correct reason on every pick. It never compares points across non-excluding limit changes.
- Why this fails: a single player-count case does not prove all limits, per-pick reasons, or unchanged scoring.
- Concrete fix: use a tagged table-driven browser test for every filter, assert each rendered pick has its expected reasons, and compare one eligible game's points before and after non-excluding limit changes.

### F-3-9 — BLOCKING — The monthly scoring rate is still not tested (reopens F-1-13, F-1-18, F-1-37, and F-2-11)

- Exact copy: **“Neglect adds five points per full month, up to 50.”**
- Evidence: `@claim:score-points` checks a recent game, an old capped game, a never-played game, setup values, variety, and the 85 maximum. It does not assert one month = 5, ten months = 50, or a value between them.
- Why this fails: a formula could award any positive monthly amount and still satisfy the current tagged assertions.
- Concrete fix: seed dates at 0, 1, 2, 10, and more than 10 full months and assert the rendered neglect component for each.

### F-3-10 — BLOCKING — Privacy promises exceed the registered interception flow (reopens F-1-7, F-1-28, F-1-29, F-1-41, and F-1-43)

- Exact copy: landing **“CSV files and game details are not uploaded.”**; README **“Game details are not uploaded.”**; Privacy **“There are no accounts, analytics, or remote game catalog requests.”**
- Evidence: `@claim:privacy-local` loads the sample and saves its existing picklist. It does not enter unique game details, import a uniquely identifiable CSV, change limits/theme, export, reset, or exit while checking request URLs and bodies. **“No analytics”** has no claims entry.
- Why this fails: the test does not place identifiable user input in the operations covered by the promise, and one live privacy claim is unlisted.
- Concrete fix: intercept the entire demo flow, submit unique marker strings through manual and CSV entry, inspect request URLs/bodies, verify exact storage keys/fields, and register or remove the analytics sentence.

### F-3-11 — BLOCKING — The build claim test checks configuration, not a build (reopens F-1-49 and F-1-50)

- Exact README copy: **“`npm run build` type-checks and creates `dist/index.html`.”**
- Evidence: `@claim:docs-build` only checks that `package.json.scripts.build` contains `vite build`; it does not invoke the command or assert `dist/index.html` and referenced assets. The reviewer ran the build separately and it passed, but that does not repair the registered test.
- Why this fails: the claim test would pass even if the build command failed after launch or emitted no deployable site.
- Concrete fix: make the registered command run a clean build and then assert `dist/index.html` plus every referenced asset exists.

### F-3-12 — BLOCKING — The required 180 px Apple touch icon is still absent (reopens F-1-58)

- Exact location: every route links `<link rel="apple-touch-icon" href="/favicon.svg">`; the SVG has a 64 × 64 viewBox. No 180 × 180 asset exists in `public/`.
- Why this fails: canonical, OG, Twitter, and SVG favicon metadata are present, but the earlier metadata repair stopped short of the required touch icon.
- Concrete fix: add an original 180 × 180 PNG touch icon and link it with `sizes="180x180"`; add a metadata assertion for URL, status, MIME type, and dimensions.

### F-3-13 — BLOCKING — The shared footer exposes a stale build id (reopens F-1-60)

- Exact live copy: **“Built by Param Factory · build polish-1”**.
- Evidence: the reviewed source is the post-polish-2 commit `7867c53`; `footer()` falls back to the literal `polish-1` when `VITE_BUILD_ID` is absent.
- Why this fails: the required build identifier is present but misleading, so a visitor or verifier cannot relate the live artifact to the release.
- Concrete fix: inject an immutable short commit/build id during every production build and use a neutral package version only for local builds; test that the deployed value is not a stale fallback.

### F-3-14 — BLOCKING — Prior terminology cleanup is incomplete (reopens F-1-62)

- Exact locations: the picker labels the choice **“List size”**, while the sole result term is **picklist**; the no-result recovery says **“Loosen a hard limit…”**, while the product otherwise uses **limits**.
- Why this fails: the old terminology finding was marked fixed, but conditional UI and one control still reintroduce competing terms and jargon.
- Concrete fix: use **“Picklist size”** and **“Change a limit or mark another game available.”** Add conditional/error text to the maintained copy audit.

### F-3-15 — MAJOR — “Clear local data” overstates what the control removes

- Exact Privacy copy: **“Clearing local data permanently removes this product’s saved browser data.”** Button: **“Clear local data.”**
- Code evidence: the handler removes only `localStorage['shelf-rotation-picklist:v1']`. Product-owned `sessionStorage` keys with prefix `shelf-rotation-picklist:scroll:` remain, and the sentence is not in `claims.json`.
- Why this fails: the broad label and sentence promise removal of all product data, but the implementation clears only the real shelf namespace.
- Concrete fix: either clear every product-owned local/session key and test it, or rename the control and copy to **“Clear shelf data”** and state exactly what remains.

### F-3-16 — MAJOR — The empty-shelf sample link is only 37 px high

- Exact location: `/`, empty shelf, **“Try it with sample data →”** at 390 px.
- Evidence: its live bounding box is 249 × 37 px. `.text-button` declares `min-height: 44px`, but the element is an inline `<a>`, so the minimum height does not apply.
- Why this fails: the repeated demo entry point misses the 44 px touch-target baseline.
- Concrete fix: render `.text-button` links as `inline-flex` or otherwise provide a measured 44 × 44 px activation area; add this link to the mobile target assertion.

### F-3-17 — MINOR — The theme button does not name its result with a verb

- Exact copy: **“Dark theme”** / **“Light theme.”**
- Why this fails: the label names a theme, not what activation will do, contrary to the plain-words action rule.
- Concrete fix: use **“Use dark theme”** and **“Use light theme.”**

### F-3-18 — MINOR — The README heading “What it does” lacks context

- Exact location: README second-level heading **“What it does.”**
- Why this fails: it is ambiguous when headings are read as a standalone screen-reader list.
- Concrete fix: use **“What Shelf Rotation Picklist does.”**

### F-3-19 — MINOR — “Most setup” is an ambiguous field label

- Exact location: Tonight form label **“Most setup.”**
- Why this fails: a first-time user must infer that this means the greatest acceptable setup effort.
- Concrete fix: use **“Maximum setup effort.”**

## Demo and sandbox exercise

| Check | Result | Evidence |
| --- | --- | --- |
| One-click entry | Pass | The first mobile action navigates directly to `/demo`. |
| Immediate realistic use | Pass | The first demo screen shows three ranked fictional games with scores and reasons. |
| Banner | Pass | **“Demo — sample data, nothing is saved”** remains present. |
| Reset | Pass | After saving, Reset restores the three original picks and clears saved picklists in the demo namespace. |
| Start for real | Pass | It deletes the demo key, returns to `/`, and reveals the pre-seeded real shelf unchanged. |
| Namespace isolation | Pass | Demo writes only `demo:shelf-rotation-picklist:v1`; the seeded real key containing `MY REAL PRIVATE GAME` stayed unchanged. |
| Network boundary | Pass for exercised flow | All observed requests were same-origin. Coverage gaps are F-3-10. |
| Offline | Pass | After service-worker control, an offline `/demo` reload showed the offline banner and three picks. |

## Claim execution from a clean clone

Clean clone: `/tmp/srp-review3-clean-kP2uM6/repo`; `npm ci` installed 58 packages with no audit vulnerabilities.

The registry's browser commands first failed because no `dist/` existed. After an explicit `npm run build`, every listed command was executed. `picklist-size` failed once and passed on an isolated rerun; all others passed after the build.

| Claim | Result after explicit build | Qualification |
| --- | --- | --- |
| `demo-isolation` | Pass | Its exact command previously timed out from the unbuilt clone. |
| `picklist-filters-and-reasons` | Pass | Coverage is incomplete; F-3-8. |
| `picklist-size` | **Fail, then pass on rerun** | Blocking under the stated rule; F-3-3. |
| `repeatable-picklist` | Pass | — |
| `tie-breaks` | Pass | — |
| `score-points` | Pass | Monthly-rate coverage is incomplete; F-3-9. |
| `csv-io` | Pass | Public CSV/manual promises exceed the assertions; F-3-7. |
| `privacy-local` | Pass | Flow coverage is incomplete; F-3-10. |
| `no-remote-catalog` | Pass | — |
| `saved-picklists` | Pass | — |
| `free-no-account` | Pass | — |
| `clear-local-data` | Pass | The narrower real-shelf claim passes; broader live copy is F-3-15. |
| `docs-build` | Pass | It does not execute the documented build; F-3-11. |
| `offline-reload` | Pass | — |
| `themes-and-accessibility` | Pass | It misses the live dark-hover contrast failure; F-3-6. |
| `routing-metadata-and-provenance` | Pass | It does not assert the 404 HTTP status or 180 px touch icon; F-3-4/F-3-12. |

General gates after the explicit build: `npm test` 11/11, `npm run lint` pass, `npm run typecheck` pass, `npm run build` pass, and full `npm run test:browser` 16/16. Build output: JS 34.25 kB raw / 11.60 kB gzip; CSS 21.64 kB raw / 5.32 kB gzip.

## Copy audit

Method: whitespace-separated words; hyphenated words and number ranges count as one; decorative arrows/slashes do not. Code blocks are excluded. Headings, controls, and fragments are included because the requested checks apply to them. No item exceeds 22 words and no banned marketing adjective appears.

### Landing page, initial real-data state

| Words | Exact copy | Flag |
| ---: | --- | --- |
| 2 | SRP /// | — |
| 1 | Demo | — |
| 1 | Shelf | — |
| 1 | Tonight | — |
| 1 | Privacy | — |
| 2 | Dark theme | F-3-17 |
| 4 | A picklist for tonight | — |
| 6 | Pick neglected board games for tonight | — |
| 18 | For board-game collectors choosing from a crowded shelf, get 3–5 picks that fit tonight’s players, time, and setup. | F-3-1/F-3-3 |
| 5 | Try it with sample data → | — |
| 8 | See a sample picklist ranked by tonight’s limits. | — |
| 1 | Free | — |
| 6 | Works offline after the first visit | — |
| 6 | Shelf data stays in this browser | F-3-10 coverage |
| 8 | Fig. 01 Games rise by the published score. | — |
| 2 | 01 / Shelf | — |
| 4 | Add your board games | — |
| 10 | Add games one at a time or import a CSV. | F-3-7 |
| 7 | Add only games you want to rotate. | — |
| 3 | Add one game | F-3-7 coverage |
| 2 | Import CSV | — |
| 2 | Download template | F-3-7 |
| 3 | No games added. | — |
| 10 | Add a board game or try a ready-made sample picklist. | — |
| 5 | Try it with sample data → | F-3-16 target size |
| 2 | 02 / Tonight | — |
| 3 | Set tonight’s limits | — |
| 6 | Games outside your limits are excluded. | F-3-8 |
| 5 | Limits do not change points. | F-3-8 |
| 1 | Players | — |
| 2 | Time ceiling | — |
| 1 | min | — |
| 2 | Most setup | F-3-19 |
| 2 | Light only | — |
| 3 | Up to medium | — |
| 2 | Any setup | — |
| 2 | Must-have tag | — |
| 2 | Any tag | — |
| 2 | List size | F-3-14; use **Picklist size**. |
| 1 | 3 | — |
| 1 | 4 | — |
| 1 | 5 | — |
| 2 | The rule | — |
| 20 | Picks score up to 85 points: neglect 50 + never played 20 + easy setup 10 + tag variety 5. | F-3-9 |
| 3 | See scoring details → | — |
| 2 | 03 / Picklist | — |
| 3 | Generate tonight’s picklist | — |
| 7 | Games are ranked by the published score. | — |
| 6 | Your group makes the final choice. | — |
| 3 | Make my picklist → | — |
| 3 | No picklist yet. | — |
| 8 | Add at least one shelf game to begin. | — |
| 2 | Private / clear | — |
| 3 | What stays private | — |
| 6 | Shelf data stays in this browser. | F-3-10 coverage |
| 8 | CSV files and game details are not uploaded. | F-3-10 |
| 3 | Export or clear | — |
| 5 | Export your shelf as CSV. | F-3-7 coverage |
| 8 | Clear all real data from the Privacy page. | —; the narrower real-data claim passes. |
| 3 | No remote catalog | — |
| 11 | This tool does not fetch game ratings, prices, or catalog data. | — |
| 2 | No account | — |
| 6 | Use the picker without signing in. | — |
| 3 | Shelf Rotation Picklist | — |
| 6 | Pick neglected board games for tonight. | — |
| 1 | Terms | — |
| 6 | Built by Param Factory · build polish-1 | F-3-13 |
| 2 | MIT source | — |

Reachable dialogs and conditional copy were also checked. No item exceeds 22 words or uses a banned adjective. Two flags remain: **“Loosen a hard limit or mark another game available.”** (9 words; F-3-14; rewrite **“Change a limit or mark another game available.”**) and the dark-theme hover label contrast in F-3-6.

### README

| Words | Exact sentence or heading | Flag |
| ---: | --- | --- |
| 3 | Shelf Rotation Picklist | — |
| 6 | Pick neglected board games for tonight. | — |
| 9 | It is for collectors choosing from a crowded shelf. | — |
| 7 | Set players, time, setup, and tag limits. | — |
| 12 | The picker returns three to five games with visible reasons and points. | F-3-3/F-3-8 |
| 6 | Try the ready-made sample at https://shelf-rotation-picklist.sociobot.in/demo. | — |
| 3 | What it does | F-3-18 |
| 10 | Add games one at a time or import a CSV. | F-3-7 |
| 6 | Export your shelf as a CSV. | F-3-7 |
| 5 | Exclude games outside tonight’s limits. | F-3-8 |
| 7 | Generate a repeatable picklist with visible points. | — |
| 8 | Save up to ten picklists in this browser. | — |
| 7 | Print the current picklist from your browser. | — |
| 5 | Use light or dark themes. | F-3-6 |
| 6 | Works offline after the first visit. | — |
| 6 | Shelf data stays in this browser. | F-3-10 coverage |
| 5 | Game details are not uploaded. | F-3-10 |
| 1 | Scoring | — |
| 10 | Neglect adds five points per full month, up to 50. | F-3-9 |
| 4 | Never-played games add 20. | — |
| 11 | Light, medium, and heavy setup add 10, 5, and 0 points. | — |
| 6 | A new tag adds five points. | — |
| 6 | Games outside your limits are excluded. | F-3-8 |
| 5 | Limits do not change points. | F-3-8 |
| 3 | Ties are alphabetical. | — |
| 2 | CSV format | — |
| 10 | Download a template in the app, or provide these columns. | F-3-7 |
| 6 | `last_played` is blank or uses `YYYY-MM-DD`. | F-3-7 |
| 6 | `setup` is `light`, `medium`, or `heavy`. | F-3-7 |
| 4 | Separate tags with `|`. | F-3-7 |
| 9 | `available` accepts `true`, `false`, `yes`, `no`, `1`, or `0`. | F-3-7 |
| 8 | Invalid rows show errors while valid rows import. | — |
| 3 | Privacy and boundaries | — |
| 14 | The app stores your shelf, limits, theme, and saved picklists in browser local storage. | F-3-10 coverage; **browser local storage** is avoidable jargon. Rewrite with **in this browser**. |
| 8 | The Privacy page can clear real shelf data. | — |
| 12 | The app does not use a remote game catalog, ratings, or prices. | — |
| 1 | Develop | — |
| 5 | Requires Node.js 20 or newer. | — |
| 3 | Test and build | — |
| 7 | `npm run build` type-checks and creates `dist/index.html`. | F-3-11 |
| 7 | Deploy `dist/` to Azure Static Web Apps. | — |
| 11 | Run every registered product claim from `.factory/claims.json` with its listed command. | F-3-2 |
| 1 | License | — |
| 4 | MIT — see LICENSE. | — |

## Structure, accessibility, and live crawl

- Pass: `/`, `/demo`, `/privacy`, `/terms`, and the designed not-found view each have `lang=en`, one h1, one main landmark, route-specific title/description/canonical/OG text, the same product art, and zero default-state Axe violations.
- Pass: root, demo, legal routes, `robots.txt`, `sitemap.xml`, favicon, social image, and GitHub source all returned 200; `mailto:` was treated as exempt. No dead link was found.
- Pass: `/#tonight` deep-links correctly. Back eventually restores and focuses **Set tonight’s limits**. At 390 px with 200% root text, root/demo/legal/not-found had no horizontal overflow.
- Pass: the shelf-label neo-brutalist identity matches `.factory/design.md` and is not a generic SaaS template. No third-party font/script or AI key was found. Initial JS is 11.60 kB gzip.
- Fail: real 404 status (F-3-4), legal-route announcement (F-3-5), dark hover contrast (F-3-6), 180 px touch icon (F-3-12), stale build id (F-3-13), and one 37 px target (F-3-16).

`/opt/fleet/lib/verify-url.sh` independently returned HTTP 200, 642 ms load, no console errors, one h1, `lang=en`, a main landmark, no missing alt, and no unlabelled buttons. Its evidence directory is `/tmp/srp-review3-verify-rWwLhJ`.

## Earlier-finding audit

Every earlier review, polish report, and handoff was read. Each earlier finding was checked against current live behavior and source/tests; **Reopened** means the earlier ID remains blocking and is cross-referenced to this round's finding.

| Earlier id | Current evidence | Status |
| --- | --- | --- |
| F-1-1 | Mobile hero is clear; desktop fold now fails separately in F-3-1. | Fixed as written |
| F-1-2 | Direct isolated demo, immediate picks, banner, Reset, and exit all work. | Fixed |
| F-1-3 | Registry exists, but browser commands fail before a build. | **Reopened → F-3-2** |
| F-1-4 | Designed view exists, but unknown routes still return 200. | **Reopened → F-3-4** |
| F-1-5 | Ranked/filter behavior is registered and visible. | Fixed |
| F-1-6 | Tagged test does not assert a reason on every pick. | **Reopened → F-3-8** |
| F-1-7 | Privacy interception does not exercise user-entered/imported data. | **Reopened → F-3-10** |
| F-1-8 | Tagged browser test exercises only player count, not every limit. | **Reopened → F-3-8** |
| F-1-9 | Visible totals and components are asserted. | Fixed |
| F-1-10 | Repeatability is registered and passed. | Fixed |
| F-1-11 | Manual add remains outside the tagged claim test. | **Reopened → F-3-7** |
| F-1-12 | Every exclusion boundary is not covered by the tagged test. | **Reopened → F-3-8** |
| F-1-13 | The published formula still lacks intermediate monthly assertions. | **Reopened → F-3-9** |
| F-1-14 | Published-score wording and ranking are present. | Fixed |
| F-1-15 | Account-free sample use is registered and passed. | Fixed |
| F-1-16 | The old public “No ratings” fragment was removed. | Fixed |
| F-1-17 | Offline demo reload passed. | Fixed |
| F-1-18 | One-month and intermediate neglect rates remain unasserted. | **Reopened → F-3-9** |
| F-1-19 | Never-played +20 and 85 total are asserted visibly. | Fixed |
| F-1-20 | Light, medium, and heavy cases are asserted visibly. | Fixed |
| F-1-21 | New/repeated tag behavior is represented in visible totals. | Fixed |
| F-1-22 | Availability/time/setup/tag filters are not independently tested by the tag. | **Reopened → F-3-8** |
| F-1-23 | Non-excluding limits are not compared for unchanged points. | **Reopened → F-3-8** |
| F-1-24 | Tie and repeatability claims are separately registered and passed. | Fixed |
| F-1-25 | Public art-provenance claim remains removed; design provenance exists. | Fixed |
| F-1-26 | Pick-size test failed once in this run. | **Reopened → F-3-3** |
| F-1-27 | Bundled jargon was replaced with discrete plain facts. | Fixed |
| F-1-28 | Interception still omits add/import and identifiable payloads. | **Reopened → F-3-10** |
| F-1-29 | Privacy now again says “no analytics” without a registry entry. | **Reopened → F-3-10** |
| F-1-30 | Manual add and downloaded CSV contents are not asserted by the tag. | **Reopened → F-3-7** |
| F-1-31 | The old README availability sentence was removed. | Fixed |
| F-1-32 | The broad limits promise exceeds tagged browser coverage. | **Reopened → F-3-8** |
| F-1-33 | Size proof failed once; the other deterministic/visible parts passed. | **Reopened → F-3-3** |
| F-1-34 | Ten-save cap and print invocation passed. | Fixed |
| F-1-35 | Offline reload with visible sample picks passed. | Fixed |
| F-1-36 | Dark hover contrast is 2.88:1. | **Reopened → F-3-6** |
| F-1-37 | Monthly rate is not fully asserted. | **Reopened → F-3-9** |
| F-1-38 | Unchanged points across non-excluding limits are not asserted. | **Reopened → F-3-8** |
| F-1-39 | Alphabetical tie test passed. | Fixed |
| F-1-40 | Mixed CSV error/valid-row behavior passed. | Fixed |
| F-1-41 | Exact stored fields are not asserted by the privacy tag. | **Reopened → F-3-10** |
| F-1-42 | Real shelf namespace clearing passed. | Fixed |
| F-1-43 | CSV upload privacy is not exercised by the tagged interception test. | **Reopened → F-3-10** |
| F-1-44 | Narrow no-remote-catalog claim passed with request capture. | Fixed |
| F-1-45 | Template filenames are checked, but contents are not. | **Reopened → F-3-7** |
| F-1-46 | Documented field values remain only in untagged unit tests. | **Reopened → F-3-7** |
| F-1-47 | Node engine and MIT/static configuration checks passed. | Fixed |
| F-1-48 | Obsolete Vite URL claim remains removed. | Fixed |
| F-1-49 | Tagged check inspects script text instead of running the build. | **Reopened → F-3-11** |
| F-1-50 | Tagged check does not assert emitted index/assets. | **Reopened → F-3-11** |
| F-1-51 | Old README configuration claim remains removed; headers are live. | Fixed |
| F-1-52 | Old public design/provenance sentence remains removed. | Fixed |
| F-1-53 | Old handoff assertion remains removed. | Fixed |
| F-1-54 | MIT license text is asserted. | Fixed |
| F-1-55 | All five routes reflowed at 390 px/200% with scroll width 390. | Fixed |
| F-1-56 | Focus works, but legal routes omit the announcement region. | **Reopened → F-3-5** |
| F-1-57 | Privacy/boundary section is present. | Fixed |
| F-1-58 | Canonical/social metadata exist; 180 px touch icon does not. | **Reopened → F-3-12** |
| F-1-59 | XML sitemap lists all four real routes. | Fixed |
| F-1-60 | Shared shell exists, but its build id is stale. | **Reopened → F-3-13** |
| F-1-61 | No current landing or README sentence exceeds 22 words. | Fixed |
| F-1-62 | “List size” and “hard limit” remain. | **Reopened → F-3-14** |
| F-1-63 | Theme text and corrected action labels are visibly present. | Fixed |
| F-2-1 | Both demo controls measure at least 44 px. | Fixed |
| F-2-2 | Deep-link Back restoration settles on the focused Tonight heading; full test passed. | Fixed |
| F-2-3 | Registered size test failed once. | **Reopened → F-3-3** |
| F-2-4 | Same README size promise and failing proof. | **Reopened → F-3-3** |
| F-2-5 | Precise five-game outcome was removed. | Fixed |
| F-2-6 | Repeatability claim passed. | Fixed |
| F-2-7 | Tie-break claim passed. | Fixed |
| F-2-8 | Root remote-catalog claim is registered and passed. | Fixed |
| F-2-9 | README remote-catalog claim uses the same passing proof. | Fixed |
| F-2-10 | PDF claim was replaced with browser-print wording. | Fixed |
| F-2-11 | Visible component coverage improved, but monthly rate remains untested. | **Reopened → F-3-9** |

The earlier verification findings for CSP rendering, whitespace titles, impossible CSV dates/duplicates, footer targets, and obstructive success status were also rechecked and remain fixed.

## Missed leverage

No AI feature is warranted. The brief explicitly requires inspectable rather than LLM-generated scoring, and no provider key or decorative AI feature exists. The expected import/export path is present and works in a fresh real-data context. No additional sync feature is implied strongly enough to add a finding for a local-first, account-free tool.

## What would make this perfect

Fit the complete promise and sample action into the desktop first screen; make claim commands clean-clone-safe and deterministic; complete the tagged behavioral/privacy coverage; return a real 404; restore legal-route announcements; fix dark hover contrast and the 37 px link target; ship a real 180 px touch icon and current build id; then remove the remaining terminology and privacy overclaims. Repeat the full live and clean-clone review only after all findings above are closed.
