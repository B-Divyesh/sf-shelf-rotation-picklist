# Adversarial first-read review 2 — Shelf Rotation Picklist

- Reviewed: 2026-08-28 UTC
- Source reviewed: `d7add91f244861be5bb7746a4c389c12410096b8`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>
- Contexts: fresh Chromium contexts at 390 × 844 and 1440 × 900; a separate fresh context seeded with a real-data key
- Verdict: **FAIL** — 12 findings remain. A pass requires zero findings.

## Thirty-second cold read

Before scrolling, the product is understandable on both sizes: it picks neglected board games that fit tonight, for board-game collectors, and the first action is **Try it with sample data**. The adjacent line says that it will show five games ranked by the limits. This is a clear first screen, so there is no first-read blocking finding.

## Findings

### F-1-63 — BLOCKING — Reopened: the mobile theme control again hides its visible name

- Exact location: mobile header at 390 px. The control's DOM text is **“Dark theme”**, but `src/styles.css:249-250` applies `font-size: 0` and replaces it with the glyph **“◐”**.
- Evidence: live mobile computed `font-size` was `0px`; the 72 × 50 px button showed only the glyph. Its accessible name remains good, but a cold visitor cannot see whether it changes the theme.
- Why this fails: this is the same unresolved part of review-1 finding F-1-63. The prior repair map says it added a labelled theme control, but the responsive rule removes that label at the required phone size.
- Concrete fix: keep visible **“Dark theme”** / **“Light theme”** text at 390 px, or replace the glyph with a visibly labelled switch that states both current state and result. Add a 390 px screenshot/assertion that checks rendered text, not only the accessible name.

### F-2-1 — BLOCKING — Demo controls miss the 44 px touch-target minimum

- Exact location: live `/demo` at 390 px: **“Reset demo”** measures 104.3 × 36 px and **“Start for real”** measures 142.9 × 36 px. Source: `src/styles.css:62` sets `.demo-banner .text-button { min-height: 36px; }`.
- Why this fails: these are primary demo exit/reset controls on a phone. They are 8 px short of the stated 44 px minimum, making an otherwise useful demo harder to operate reliably.
- Concrete fix: set both demo-banner controls to `min-height: 44px` (and retain adequate horizontal padding). Add a mobile browser assertion for their bounding boxes.

### F-2-2 — BLOCKING — Back navigation does not restore the previous scroll position

- Exact flow: fresh mobile visit to `/#tonight` → click header **Privacy** → browser Back.
- Evidence: before navigation `scrollY` was 1759 and `#tonight` began at 22.5 px. After Back, the URL correctly returned to `/#tonight`, but `scrollY` was 800 and `#tonight` began at 845.5 px, below the viewport. `#hero-title` was focused while positioned above the viewport at -786.9 px.
- Why this fails: the deep link and URL look correct, but Back neither returns the visitor to the section they left nor leaves the focused route heading visible. This is broken route restoration on a phone.
- Concrete fix: record scroll positions per history entry before `pushState`; on `popstate`, restore the saved position after rendering (or restore the hash target) and then move focus to a visible route heading without fighting scroll restoration. Add this exact `/#tonight → /privacy → Back` test.

### F-2-3 — MAJOR — Landing promise of 3–5 picks is not listed as a claim

- Exact quote/location: root hero, **“For board-game collectors choosing from a crowded shelf, get 3–5 picks that fit tonight’s players, time, and setup.”**
- Why this fails: the visitor is promised an output range. No `.factory/claims.json` entry states or tests the 3–5 range; the current filtering test checks only the seeded count of three.
- Concrete fix: add a `picklist-size` claim and tagged demo test covering list-size choices 3, 4, and 5 with enough eligible games, or remove the numerical promise.

### F-2-4 — MAJOR — README repeats the unlisted 3–5-pick promise

- Exact quote/location: `README.md`, **“The picker returns three to five games with visible reasons and points.”**
- Why this fails: it is a second public, claim-like promise without a matching registry entry or range test.
- Concrete fix: use the same registered `picklist-size` claim/test as F-2-3, or rewrite the sentence without the range.

### F-2-5 — MAJOR — The landing promises five sample games without a claim/test

- Exact quote/location: root hero action note, **“See five games ranked by tonight’s limits.”**
- Why this fails: the demo contains five shelf games but shows three picks. The demo-isolation test asserts three `.pick-card` elements, not five visible sample games or the wording's outcome. The first action therefore makes a precise unregistered promise.
- Concrete fix: either say **“See a sample picklist ranked by tonight’s limits.”** or add a claim that asserts the demo shelf has five named games and the immediate result has the configured number of picks.

### F-2-6 — MAJOR — Repeatability is promised without a registered claim

- Exact quote/location: `README.md`, **“Generate a repeatable picklist with visible points.”**
- Why this fails: repeatable results are a behavioral promise. `score-points` does not state it, and its tagged browser test does not regenerate with identical input and compare order/scores.
- Concrete fix: add `repeatable-picklist` to `claims.json` and a tagged test that generates twice from the same demo data and limits, asserting identical titles and totals.

### F-2-7 — MAJOR — Alphabetical ties are an unlisted behavioral claim

- Exact quote/location: `README.md` scoring section, **“Ties are alphabetical.”**
- Why this fails: a tie-break rule changes a user's expected outcome. It has no claim entry or tagged test, even though an untagged unit test may cover related scoring.
- Concrete fix: add a `tie-breaks` claim and tagged test with equal-score titles in reverse insertion order, asserting alphabetical output; or remove the sentence.

### F-2-8 — MAJOR — “No remote catalog” is an unlisted public privacy boundary

- Exact quote/location: root privacy section, **“This tool does not fetch game ratings, prices, or catalog data.”**
- Why this fails: this is a privacy/network behavior a visitor can rely on. `privacy-local` only claims that game data is not uploaded and asserts same-origin requests; it does not state or prove absence of a catalog request.
- Concrete fix: add a `no-remote-catalog` claim with a demo network-interception test that exercises the entire shelf/pick flow and asserts no catalog endpoint or third-party request, or remove the sentence.

### F-2-9 — MAJOR — README repeats the unlisted remote-catalog promise

- Exact quote/location: `README.md`, **“The app does not use a remote game catalog, ratings, or prices.”**
- Why this fails: this repeats F-2-8's unregistered promise in product documentation.
- Concrete fix: register and test the same `no-remote-catalog` claim as F-2-8, or remove the statement.

### F-2-10 — MAJOR — “Save it as a PDF” is more than the registered print claim

- Exact quote/location: `README.md`, **“Print the current picklist or save it as a PDF.”**
- Why this fails: `saved-picklists` intercepts `window.print`; it does not prove that the product generates or saves a PDF. PDF saving is browser-dialog behavior, not an observable app result covered by the registry.
- Concrete fix: rewrite to **“Print the current picklist from your browser.”** If the intended product feature is a generated PDF file, implement it and add a download-content claim test.

### F-2-11 — MAJOR — The formula claim's tagged test verifies copy, not the published rules

- Exact claim/location: `.factory/claims.json` `score-points`: **“Picks score up to 85 points using the published neglect, never-played, setup, and tag rules.”**
- Evidence: `e2e/smoke.spec.ts` opens the scoring dialog, checks its text, then checks that the first seeded score contains `85` and all scores are no higher. It does not vary last-played date, never-played state, setup, or tag overlap and assert each observed score component.
- Why this fails: a passing button/copy/cap test cannot prove the score formula a visitor is asked to trust. The existing untagged unit tests do not satisfy the registry's required tagged claim test.
- Concrete fix: make the `@claim:score-points` test seed explicit eligible cases for each component and assert the visible reason rows/totals, including the 50-point cap and 85-point maximum.

## Demo and sandbox exercise

| Check | Result | Evidence |
| --- | --- | --- |
| First-screen one-click demo | Pass | Hero action goes directly to `/demo`. |
| Immediate realistic result | Pass | `/demo` showed five fictional shelf games and three ranked picks immediately. |
| Persistent isolated-demo banner | Pass | **“Demo — sample data, nothing is saved”** remained visible. |
| Reset / start-for-real behavior | Pass | Reset restored the sample under `demo:shelf-rotation-picklist:v1`; Start for real removed that key and returned to `/`. |
| Real data isolation | Pass | Seeded `shelf-rotation-picklist:v1` containing `MY REAL PRIVATE GAME` remained unchanged and absent from demo. |
| Privacy interception | Pass | The demo flow made same-origin requests only; no console/page error occurred in the normal demo flow. |
| Offline exercise | Pass | After service-worker control, offline `/demo` reload showed its offline banner and three picks. |
| Demo control targets | Fail | Both banner buttons were 36 px high; see F-2-1. |

## Claim-test execution from a clean clone

Fresh clone: `/tmp/srp-review-2-clean-GPzf3x`. `npm ci` added 58 packages with 0 vulnerabilities. Every command listed in `.factory/claims.json` passed:

| Claim id | Result |
| --- | --- |
| `demo-isolation` | Pass |
| `picklist-filters-and-reasons` | Pass |
| `score-points` | Pass, but coverage finding F-2-11 remains |
| `csv-io` | Pass |
| `privacy-local` | Pass |
| `saved-picklists` | Pass |
| `free-no-account` | Pass |
| `clear-local-data` | Pass |
| `docs-build` | Pass |
| `offline-reload` | Pass |
| `themes-and-accessibility` | Pass, but visual-label finding F-1-63 remains |
| `routing-metadata-and-provenance` | Pass |

## History audit

Read: `.factory/review-1.md`, `.factory/polish-1.md`, `verification-1.md`, `verification-2.md`, `verification-3.md`, and the prior handoff. The earlier repair map is confirmed in live UI/code/tests for F-1-1 through F-1-62, except that F-1-63 is reopened above. In particular, the original focus/body failure in F-1-56 is fixed, but the separately required Back scroll restoration now fails as F-2-2.

| Earlier finding ids | Live/code confirmation | Status |
| --- | --- | --- |
| F-1-1, F-1-2, F-1-4 | Clear board-game hero; direct isolated demo with immediate picks; designed client 404 | Fixed |
| F-1-3, F-1-5–F-1-54 | Claims registry exists and every registered command passed from the clean clone | Fixed; new unlisted promises are F-2-3–F-2-10 |
| F-1-55 | 390 px at 200% text has no horizontal overflow in the registered browser test | Fixed |
| F-1-56 | Forward/back route h1 focus and polite announcement code exist; original BODY-focus defect is fixed | Fixed; scroll-restoration defect is F-2-2 |
| F-1-57–F-1-60 | Privacy boundary section, route metadata/social image/sitemap, shared header/footer present | Fixed |
| F-1-61, F-1-62 | Current landing/README audit below has no sentence over 22 words and no banned marketing adjective | Fixed |
| F-1-63 | Hero/demo and score-dialog actions are accurate, but mobile CSS hides the theme label | **Reopened; blocking** |

## Structure, accessibility, and visual checks

Confirmed: every tested route has one h1 and a route-pattern title; root, demo, privacy, terms, unknown route, sitemap, and source link all responded successfully; canonical, description, OG/Twitter image, favicon, robots, sitemap, headers, skip link, legal footer, and designed 404 are present. Live axe scans on `/demo` at 390 px and 1440 px returned zero violations. No normal-flow console errors occurred. The shelf-label neo-brutalist identity matches `.factory/design.md` and is distinct from a generic SaaS template.

The negative results are F-1-63, F-2-1, and F-2-2. No additional AI feature is expected: the brief requires inspectable, non-LLM scoring, and the app already supplies the implied CSV import/export. No decorative or key-bearing AI integration was found.

## Copy audit

Method: whitespace-separated word count; visible headings, labels, controls, and sentence fragments are included. README fenced code is excluded as code. No item exceeds 22 words. `*` marks a finding already recorded above.

### Landing page, initial root state

| Words | Copy unit | Flag |
| ---: | --- | --- |
| 2 | SRP /// | — |
| 1 | Demo | — |
| 1 | Shelf | — |
| 1 | Tonight | — |
| 1 | Privacy | — |
| 2 | Dark theme | F-1-63 at 390 px: visually hidden |
| 4 | A picklist for tonight | — |
| 6 | Pick neglected board games for tonight | — |
| 18 | For board-game collectors choosing from a crowded shelf, get 3–5 picks that fit tonight’s players, time, and setup. | F-2-3 |
| 6 | Try it with sample data → | — |
| 7 | See five games ranked by tonight’s limits. | F-2-5 |
| 1 | Free | — |
| 6 | Works offline after the first visit | — |
| 6 | Shelf data stays in this browser | — |
| 8 | Fig. 01 Games rise by the published score. | — |
| 3 | 01 / Shelf | — |
| 4 | Add your board games | — |
| 10 | Add games one at a time or import a CSV. | — |
| 7 | Add only games you want to rotate. | — |
| 4 | Add one game | — |
| 2 | Import CSV | — |
| 2 | Download template | — |
| 3 | No games added. | — |
| 10 | Add a board game or try a ready-made sample picklist. | — |
| 6 | Try it with sample data → | — |
| 3 | 02 / Tonight | — |
| 3 | Set tonight’s limits | — |
| 6 | Games outside your limits are excluded. | — |
| 5 | Limits do not change points. | — |
| 1 | Players | — |
| 3 | Time ceiling min | — |
| 9 | Most setup; Light only; Up to medium; Any setup | — |
| 4 | Must-have tag; Any tag | — |
| 2 | List size | — |
| 2 | The rule | — |
| 20 | Picks score up to 85 points: neglect 50 + never played 20 + easy setup 10 + tag variety 5. | — |
| 4 | See scoring details → | — |
| 3 | 03 / Picklist | — |
| 3 | Generate tonight’s picklist | — |
| 7 | Games are ranked by the published score. | — |
| 6 | Your group makes the final choice. | — |
| 4 | Make my picklist → | — |
| 2 | [ ] | — |
| 3 | No picklist yet. | — |
| 3 | Private / clear | — |
| 3 | What stays private | — |
| 6 | Shelf data stays in this browser. | — |
| 8 | CSV files and game details are not uploaded. | — |
| 3 | Export or clear | — |
| 5 | Export your shelf as CSV. | — |
| 8 | Clear all real data from the Privacy page. | — |
| 3 | No remote catalog | — |
| 11 | This tool does not fetch game ratings, prices, or catalog data. | F-2-8 |
| 2 | No account | — |
| 6 | Use the picker without signing in. | — |
| 3 | Shelf Rotation Picklist | — |
| 6 | Pick neglected board games for tonight. | — |
| 1 | Terms | — |
| 9 | Built by Param Factory · build polish-1 · MIT source | — |

### README

| Words | Sentence / heading | Flag |
| ---: | --- | --- |
| 3 | Shelf Rotation Picklist | — |
| 6 | Pick neglected board games for tonight. | — |
| 9 | It is for collectors choosing from a crowded shelf. | — |
| 7 | Set players, time, setup, and tag limits. | — |
| 12 | The picker returns three to five games with visible reasons and points. | F-2-4 |
| 6 | Try the ready-made sample at https://shelf-rotation-picklist.sociobot.in/demo. | — |
| 3 | What it does | — |
| 10 | Add games one at a time or import a CSV. | — |
| 6 | Export your shelf as a CSV. | — |
| 5 | Exclude games outside tonight’s limits. | — |
| 7 | Generate a repeatable picklist with visible points. | F-2-6 |
| 8 | Save up to ten picklists in this browser. | — |
| 10 | Print the current picklist or save it as a PDF. | F-2-10 |
| 5 | Use light or dark themes. | — |
| 6 | Works offline after the first visit. | — |
| 6 | Shelf data stays in this browser. | — |
| 5 | Game details are not uploaded. | — |
| 1 | Scoring | — |
| 10 | Neglect adds five points per full month, up to 50. | — |
| 4 | Never-played games add 20. | — |
| 11 | Light, medium, and heavy setup add 10, 5, and 0 points. | — |
| 6 | A new tag adds five points. | — |
| 6 | Games outside your limits are excluded. | — |
| 5 | Limits do not change points. | — |
| 3 | Ties are alphabetical. | F-2-7 |
| 2 | CSV format | — |
| 10 | Download a template in the app, or provide these columns. | — |
| 6 | `last_played` is blank or uses `YYYY-MM-DD`. | — |
| 6 | `setup` is `light`, `medium`, or `heavy`. | — |
| 4 | Separate tags with `|`. | — |
| 9 | `available` accepts `true`, `false`, `yes`, `no`, `1`, or `0`. | — |
| 8 | Invalid rows show errors while valid rows import. | — |
| 3 | Privacy and boundaries | — |
| 14 | The app stores your shelf, limits, theme, and saved picklists in browser local storage. | — |
| 8 | The Privacy page can clear real shelf data. | — |
| 12 | The app does not use a remote game catalog, ratings, or prices. | F-2-9 |
| 1 | Develop | — |
| 5 | Requires Node.js 20 or newer. | — |
| 3 | Test and build | — |
| 7 | `npm run build` type-checks and creates `dist/index.html`. | — |
| 7 | Deploy `dist/` to Azure Static Web Apps. | — |
| 11 | Run every registered product claim from `.factory/claims.json` with its listed command. | — |
| 1 | License | — |
| 4 | MIT — see LICENSE. | — |

All visible action labels name a concrete result except the mobile theme glyph noted in F-1-63. No >22-word, banned-marketing-word, terminology, or out-of-context-heading finding remains beyond those listed.

## What would make this perfect

Make the theme mode visible on the phone; enlarge the demo controls; make Back restore the section a visitor left; and either prove or remove every numerical, repeatability, tie-break, catalog, and PDF promise. Strengthen the formula claim test to test the actual score components. Then repeat this complete review in a fresh live context with zero findings.
