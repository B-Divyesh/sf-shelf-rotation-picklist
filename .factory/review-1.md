# Adversarial first-read review 1 — Shelf Rotation Picklist

- Reviewed: 2026-08-28 UTC
- Source: `2d0d46cdf5087822443f64363ea3f882df71a9be`
- Live URL: <https://shelf-rotation-picklist.sociobot.in>
- Viewports: 390 × 844 and 1440 × 900, each in a fresh Chromium context
- Verdict: **FAIL**

The review has 63 findings: 4 blocking, 53 major, and 6 minor. A pass requires zero findings and no untested claim.

## Thirty-second cold read

Before scrolling, I could infer that the page filters games for tonight and favors neglected ones. I could not identify the intended user as a board-game collector: the mobile first screen says only “games” and “shelf,” and the unbranded shelf art is hidden at 390 px. The obvious first click is **Build tonight’s list**, but it only scrolls to an empty shelf; it does not build a list or start the sample.

| Question | Mobile, 390 px | Desktop, 1440 px |
| --- | --- | --- |
| What does this do? | Inferred: filters games for tonight and favors neglected games. “Board game” and “3–5 game picklist” are absent. | Same inference, helped by the box art but not stated in words. |
| For whom? | Cannot answer. No audience is named. | Cannot answer. No audience is named. |
| What should I click first? | **Build tonight’s list**. It scrolls to the empty shelf. | Same. |

## Blocking findings

### F-1-1 — BLOCKING — The first screen does not identify the user or plainly name the job

- Exact copy: “Stop scrolling. Rotate the shelf.” / “Filter what actually fits tonight, then bring the neglected games forward. Every pick tells you why it made the cut.”
- Location: root hero, live mobile and desktop.
- Why this fails: the headline is a command and metaphor, not the job. The support copy never says “board games” or names collectors. The three facts are “Local only,” “Hard constraints,” and “Visible scoring”; they omit the required price and offline facts, and two use product jargon. **Build tonight’s list** implies an immediate result but only moves to an empty form.
- Concrete fix: use **“Pick neglected board games for tonight”** as the h1. Follow with **“For board-game collectors choosing from a crowded shelf, get 3–5 picks that fit tonight’s players, time, and setup.”** Use **“Try it with sample data”** plus **“See five games ranked by tonight’s limits.”** Show **“Free,” “Works offline after the first visit,”** and **“Shelf data stays in this browser.”**

### F-1-2 — BLOCKING — There is no one-click, isolated demo

- Exact locations: hero action **Build tonight’s list**; empty-state action **Try five sample games →**; `/demo`.
- Evidence:
  - The hero action changes the URL to `/#shelf`; the visitor must scroll and click again.
  - The second click shows five plausible fictional games, but no generated picklist, so the principal result is still another click away.
  - No **“Demo — sample data, nothing is saved”** banner, **Reset demo**, or **Start for real** control exists.
  - The samples are written to `localStorage['shelf-rotation-picklist:v1']` and survive reload.
  - Loading `/demo` after seeding that real key displayed `MY REAL PRIVATE GAME`; the route had no sample seed and used the normal title.
  - `.factory/demo.md` is absent.
- Why this fails: a first-time visitor cannot try the value in one click, and the alleged demo reads and overwrites the same namespace as real shelf data.
- Concrete fix: make the first-screen action open `/demo`; seed and generate a realistic picklist immediately; use a `demo:` storage namespace or memory; add the persistent banner and both controls; make Reset restore the seed; discard demo changes on exit; document all of this in `.factory/demo.md`; add tests proving the real key is neither read nor written.

### F-1-3 — BLOCKING — The claims registry is missing, leaving every product claim untested by contract

- Location: `.factory/claims.json` does not exist.
- Evidence: there were no listed claim commands to run. `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:browser` all pass, but none of the 17 tests carries an `@claim:<id>` tag.
- Why this fails: the product makes many capability, privacy, offline, scoring, and provenance claims without the required one-to-one registry and sandbox tests. “No untested claim” cannot be established.
- Concrete fix: add `.factory/claims.json`; give every retained claim exactly one tagged observable test using `/demo` and the isolated sample namespace. Remove subjective or untestable wording. Findings F-1-5 through F-1-54 enumerate the unlisted claim sentences.

### F-1-4 — BLOCKING — Unknown routes silently render the picker instead of a designed 404

- Exact location: `https://shelf-rotation-picklist.sociobot.in/not-a-real-route` returns HTTP 200 and renders “Stop scrolling. Rotate the shelf.”
- Code location: the fallback rewrites all routes to `index.html`, while `src/main.ts` renders the app for every path except `/privacy` and `/terms`.
- Why this fails: a mistyped or stale URL looks valid, and `/demo` is accidentally treated as the ordinary app. This is broken routing under the site-structure contract.
- Concrete fix: explicitly route `/`, `/demo`, `/privacy`, `/terms`, and a styled not-found page. Return a real 404 status where the host permits it, and at minimum render a clear not-found h1 with a home action for unknown client paths.

## Major findings: unlisted claims

Each row is a separate finding. “Untested” means absent from `.factory/claims.json`, even where an unrelated regression test or this review happened to exercise the behavior.

| ID | Exact quote and location | Why a visitor can be misled | Concrete fix |
| --- | --- | --- | --- |
| F-1-5 | Landing: “Filter what actually fits tonight, then bring the neglected games forward.” | Filtering and neglect ranking are promised without a claim test. | Add a tagged test that seeds eligible/ineligible and recent/neglected games, then asserts filtering and order. |
| F-1-6 | Landing: “Every pick tells you why it made the cut.” | A reason for every result is promised without coverage. | Test that every seeded pick renders a complete, matching score explanation. |
| F-1-7 | Landing: “Local only” | This is an ambiguous privacy claim with no registry entry. | Rewrite to “Shelf data stays in this browser” and intercept the whole demo flow, asserting no data-bearing outbound request. |
| F-1-8 | Landing: “Hard constraints” | The phrase is jargon and claims strict filtering. | Rewrite to “Games outside your limits are excluded” and test every limit. |
| F-1-9 | Landing: “Visible scoring” | The interface promises exposed scoring without a tagged assertion. | Rewrite to “See the points behind every pick” and test totals plus components. |
| F-1-10 | Landing figure caption: “The front of the shelf is earned, not random.” | “Not random” is a deterministic-ranking claim hidden in metaphor. | Rewrite plainly and test repeatable output for identical input. |
| F-1-11 | Landing: “Add games one by one or import a simple CSV.” | Manual entry and CSV import are claimed without a claim test; “simple” is subjective. | Remove “simple”; test one manual add and a valid/invalid mixed CSV. |
| F-1-12 | Landing: “Games outside them are excluded, not quietly penalized.” | Strict exclusion rather than score adjustment is a behavioral promise. | Add a tagged boundary test for players, time, setup, tag, and availability. |
| F-1-13 | Landing: “Eligible games score up to 85 points: neglect 50 + never played 20 + easy setup 10 + tag variety 5.” | The exact quantitative formula has no registered test. | Add a tagged test that reaches and asserts 85 and every component cap. |
| F-1-14 | Landing: “Ranked for rotation, not universal quality.” | The ranking basis is asserted while “universal quality” is not testable. | Replace with “Ranked by the published rotation score” and test it. |
| F-1-15 | Landing footer: “No account.” | Account-free use is claimed without a registry entry. | Test a complete fresh-context demo without authentication or account requests. |
| F-1-16 | Landing footer: “No ratings.” | The product boundary is unregistered. | Either remove it or test that import, forms, storage, and output contain no rating field or remote rating data. |
| F-1-17 | Landing offline banner: “Offline mode — your shelf and picker still work.” | Offline operation is claimed conditionally with no tagged test. | Register the claim and test a demo reload plus generation after `context.setOffline(true)`. |
| F-1-18 | Score dialog: “+5 per full month since played, capped at +50” | Exact arithmetic and cap are unregistered. | Test 0, 1, 10, and more than 10 full months. |
| F-1-19 | Score dialog: “+20 on top of maximum neglect” | Exact never-played scoring is unregistered. | Test a never-played game receives 50 + 20 before other components. |
| F-1-20 | Score dialog: “Light +10 · medium +5 · heavy +0” | Exact setup scoring is unregistered. | Test all three setup values. |
| F-1-21 | Score dialog: “+5 if a pick introduces a tag not already in the list” | Order-dependent tag scoring is unregistered. | Test repeated and new tags across successive picks. |
| F-1-22 | Score dialog: “Availability, players, time, setup limit, and must-have tag are hard filters.” | Five filtering promises have no registered evidence. | Use one tagged table-driven test covering all five. |
| F-1-23 | Score dialog: “They never alter the score.” | Filters are claimed not to affect scoring. | Test the same eligible game score across different non-excluding limits. |
| F-1-24 | Score dialog: “Ties are alphabetical, making the result repeatable.” | Tie-breaking and repeatability are unregistered. | Test equal-score titles in reverse input order and repeat the run. |
| F-1-25 | Landing footer: “Original AI-generated shelf artwork” | Asset provenance is asserted without a listed verification. | Add a provenance check for the retained source prompt/metadata, or remove the public claim. |
| F-1-26 | README: “Shelf Rotation Picklist turns an owned board-game shelf into a practical 3–5 game shortlist for tonight.” | The result size is testable; “practical” is not. | Remove “practical” and test 3, 4, and 5 requested results where enough games qualify. |
| F-1-27 | README: “The app is free, static, offline-capable, and local-first.” | Four claims are bundled, unregistered, and two terms are jargon. | Split into plain claims; test offline use, first-party static delivery, local storage, and absence of payment UI. |
| F-1-28 | README: “Collection data never leaves the browser.” | This absolute privacy promise has no registered interception test. | Intercept all requests through import, edit, generate, save, export, reset, and exit from `/demo`; assert no shelf data leaves. |
| F-1-29 | README: “There are no accounts, analytics, scraped ratings, third-party scripts, or remote recommendations.” | Five absence claims are unregistered. | Add a tagged network/DOM/storage test or split and remove claims that cannot be proved. |
| F-1-30 | README: “Add games manually or import/export a user-provided CSV.” | Three capabilities are unregistered. | Test manual add, CSV import, and downloaded CSV contents. |
| F-1-31 | README: “Mark each game in or out for tonight.” | Availability changes are unregistered. | Test both states and their effect on eligibility. |
| F-1-32 | README: “Apply hard limits for players, time, setup effort, and an optional tag.” | Four limit behaviors are unregistered. | Register a table-driven boundary test and replace “hard limits” with “exclude games outside…”. |
| F-1-33 | README: “Generate a deterministic 3–5 game picklist with a visible point breakdown.” | Determinism, size, and displayed arithmetic are unregistered. | Test repeated runs, all sizes, and each visible component. |
| F-1-34 | README: “Save up to ten rotations locally and print the current list.” | The cap, persistence, and print behavior are unregistered. | Test eleven saves retain ten in the demo namespace and intercept `window.print`. |
| F-1-35 | README: “Work after the first load without a network connection.” | This is the principal offline claim and has no claim entry. | Register the existing offline behavior under `@claim:offline-reload` and include demo generation, not just shell rendering. |
| F-1-36 | README: “Switch between high-contrast light and dark treatments.” | Theme switching and contrast are unregistered. | Test persistence plus automated contrast checks in both themes; say “themes,” not “treatments.” |
| F-1-37 | README: “Scoring is intentionally small and inspectable: +5 per full neglected month (up to 50), +20 if never played, +10/+5/+0 for light/medium/heavy setup, and +5 when a pick adds tag variety.” | The full quantitative formula has no claim test. | Split the sentence and map the exact formula to one tagged table-driven score test. |
| F-1-38 | README: “Constraints are filters, not hidden score adjustments.” | The behavior is unregistered and “constraints” is jargon. | Rewrite as “Games outside your limits are excluded; limits do not change points” and test both halves. |
| F-1-39 | README: “Ties are alphabetical.” | Tie behavior is unregistered. | Add the alphabetical tie test to the registry. |
| F-1-40 | README: “Invalid rows are reported without discarding valid rows.” | Partial-import recovery is unregistered. | Test a mixed CSV and assert both the row error and retained valid row. |
| F-1-41 | README: “Shelf data, settings, theme, and saved rotations are stored in browser `localStorage`.” | Exact stored data and mechanism are unregistered. | Test keys and values in normal mode and the separate demo namespace. |
| F-1-42 | README: “The Privacy page includes a control to clear this product’s data.” | Clear-data behavior is unregistered. | Test confirmation, deletion of all product keys, and the resulting empty state. |
| F-1-43 | README: “CSV import is entirely in-browser.” | No registered test proves that import avoids uploads. | Intercept a demo CSV import and assert no request carries file contents. |
| F-1-44 | README: “This product deliberately does not scrape BoardGameGeek, use external catalog data, manage ratings or prices, or attempt to replace a collection manager.” | Several absence claims are bundled and unregistered; the final intent is not testable. | Retain only observable boundaries and test network traffic plus the available fields; remove “attempt to replace…”. |
| F-1-45 | README: “Download a template in the app, or provide these columns:” | Template availability and format are unregistered. | Test the downloaded filename, header, and example rows. |
| F-1-46 | README: “`last_played` is blank or `YYYY-MM-DD`; `setup` is `light`, `medium`, or `heavy`; tags are separated with `\|`; and `available` accepts `true`/`false`, `yes`/`no`, or `1`/`0`.” | Accepted CSV values are detailed without a registered compatibility test. | Add a tagged table-driven import test for every documented value and rejection boundary. |
| F-1-47 | README: “Requires Node.js 20 or newer.” | The development requirement is asserted but `package.json` has no `engines` declaration or claim test. | Add `engines.node`, enforce it in CI, and register the supported-version check. |
| F-1-48 | README: “Open the local URL printed by Vite.” | The documented development flow is not registered. | Add a smoke test that starts Vite, parses the URL, and receives the app shell. |
| F-1-49 | README: “The exact production build command is `npm run build`.” | The stated build path is unregistered. | Add a tagged clean-build check for this exact command. |
| F-1-50 | README: “It type-checks the project and writes the deployable static site to `dist/`, with `dist/index.html` at its root.” | Both the typecheck and artifact layout are unregistered. | Test a clean build exit code and assert `dist/index.html` plus referenced assets exist. |
| F-1-51 | README: “Azure Static Web Apps routing and security headers live in `public/staticwebapp.config.json`.” | The configuration location and behavior are unregistered. | Validate the file and assert deployed route/header behavior in one tagged test. |
| F-1-52 | README: “The visual system and generated-asset provenance are documented in `.factory/design.md`.” | Documentation/provenance presence is asserted without a registry entry. | Test the file and referenced source assets exist, or remove this from claim-bearing copy. |
| F-1-53 | README: “Implementation verification and known limits are in `.factory/handoff.md`.” | The documentation pointer is an unregistered assertion and can become stale. | Check the file, current work order/build, and known-gap section in a tagged documentation test. |
| F-1-54 | README: “MIT — see `LICENSE`.” | The licensing assertion is unregistered. | Assert that `LICENSE` exists and contains the MIT license text. |

## Other major findings

### F-1-55 — MAJOR — The page fails 200% text reflow at the required phone width

- Location: root route at 390 × 844 after setting root text size to 200%.
- Evidence: viewport width was 390 px and document width became 512 px. `.hero-copy` reached 514.59 px; the h1 reached 494.59 px; the hero action reached 460.52 px; the Rotation heading region reached 512.31 px.
- Why this fails: text and controls require horizontal scrolling and are clipped, violating the accessibility requirement to resize text to 200% without loss.
- Concrete fix: remove fixed/min-content width pressure, allow headings/actions to wrap, use `min-width: 0`, and add a 390 px/200% browser test that asserts `scrollWidth <= innerWidth` throughout empty, sample, and result states.

### F-1-56 — MAJOR — Route navigation does not manage focus or announce the new page

- Location: root → Privacy, Privacy → back, and legal routes.
- Evidence: clicking Privacy loads the correct route but leaves `document.activeElement` on `BODY`; legal pages contain no `aria-live` region. Back restored the prior scroll position but again left focus on `BODY`. There is no `pushState`/`popstate` route layer.
- Why this fails: keyboard and screen-reader users are not told that the page changed and do not land on its h1.
- Concrete fix: implement explicit route handling; set the route title and metadata; focus the new h1 with `tabindex="-1"`; announce it in a polite live region; test direct load, forward, and back.

### F-1-57 — MAJOR — The landing structure omits the required privacy/product-boundaries section

- Exact location: after the three workflow stations, the root goes directly to the footer. “Local only” is the only hero privacy text.
- Why this fails: visitors must open README or Privacy to learn what is stored, what leaves the device, and what the tool deliberately does not do.
- Concrete fix: add a plain section after “How it works”: **“What stays private”**, with short, registered statements about browser storage, no upload, export/clear controls, and no remote catalog data.

## Minor findings

### F-1-58 — MINOR — Canonical and sharing metadata are incomplete

- Location: every route uses the same head metadata.
- Evidence: no canonical link, no Twitter card tags, and no apple-touch icon. The OG image is a relative 1200 × 800 hero image rather than a route-appropriate 1200 × 630 social image. `/demo`, when implemented, also needs **“Demo — Shelf Rotation Picklist.”**
- Concrete fix: emit per-route canonical URLs, title/description/OG values, an absolute 1200 × 630 product image, Twitter card tags, and a linked 180 px apple-touch icon.

### F-1-59 — MINOR — `sitemap.xml` is missing

- Exact location: `/sitemap.xml` returns HTTP 200 with `text/html` and the app shell, not XML. `public/` contains no sitemap.
- Why this fails: crawlers receive a false success and cannot discover the real routes from a sitemap.
- Concrete fix: ship `public/sitemap.xml` with `/`, `/demo`, `/privacy`, and `/terms`, and verify `application/xml` or `text/xml` content.

### F-1-60 — MINOR — Header and footer are not the required consistent skeleton

- Location: Privacy/Terms headers replace the root workflow navigation with only “← Back to picker.” The footer omits “Built by Param Factory” and a version/build id.
- Why this fails: navigation changes between routes and the required ownership/build information is absent.
- Concrete fix: use one header component on every route with wordmark, Demo, Privacy, and the relevant product navigation. Add **“Built by Param Factory”** and the deployed build id to the shared footer.

### F-1-61 — MINOR — Four README sentences exceed the 22-word cap

- Exact sentences and rewrites:
  - 24 words: “It is for collectors who want to rotate neglected games without ignoring player count, available time, setup effort, tags, or what is actually available.” Rewrite: **“It is for board-game collectors choosing from a crowded shelf. It considers players, time, setup, tags, and availability.”**
  - 30 words: “Scoring is intentionally small and inspectable: +5 per full neglected month (up to 50), +20 if never played, +10/+5/+0 for light/medium/heavy setup, and +5 when a pick adds tag variety.” Rewrite: **“Neglect adds 5 points per full month, up to 50. Never-played games add 20. Setup and tag variety add up to 15.”**
  - 23 words: “`last_played` is blank or `YYYY-MM-DD`; `setup` is `light`, `medium`, or `heavy`; tags are separated with `|`; and `available` accepts `true`/`false`, `yes`/`no`, or `1`/`0`.” Rewrite as three sentences, one per field group.
  - 24 words: “`npm run test:browser` runs the Playwright regression and product smoke suite against the production preview; it uses the Chromium version bundled for Playwright 1.58.2.” Rewrite: **“`npm run test:browser` checks the production preview. It uses the Chromium version bundled with Playwright 1.58.2.”**

### F-1-62 — MINOR — Metaphors, jargon, subjective adjectives, and inconsistent result terms reduce clarity

- Exact flagged copy: “A fair next-play shortlist,” “Stop scrolling. Rotate the shelf,” “Local only,” “Hard constraints,” “Visible scoring,” “The front of the shelf is earned,” “Put your shelf on the table,” “Set the edges of the evening,” “Print the night’s contenders,” “Ranked for rotation,” “No list stamped yet,” “No shelf guilt,” “No mystery math,” README “practical,” “offline-capable,” “local-first,” “deterministic,” “high-contrast … treatments,” and “Constraints.”
- Terminology conflict: the same generated result is called **shortlist**, **list**, **picklist**, **rotation**, and **contenders**. Storage/privacy is described as **Local only**, **local-first**, **in-browser**, and **stored in browser localStorage**.
- Why this fails: several headings do not make sense out of context, and users must infer whether these terms name different objects.
- Concrete fix: apply these exact replacements:

| Current wording | Proposed wording |
| --- | --- |
| A fair next-play shortlist | A picklist for tonight |
| Stop scrolling. Rotate the shelf. | Pick neglected board games for tonight. |
| Local only / local-first / in-browser | Shelf data stays in this browser. |
| Hard constraints | Games outside your limits are excluded. |
| Visible scoring | See the points behind every pick. |
| The front of the shelf is earned, not random. | Games rise by the published score. |
| Put your shelf on the table. | Add your board games. |
| Add games one by one or import a simple CSV. | Add games one at a time or import a CSV. |
| This is a picker, not another collection chore. | Add only the games you want to rotate. |
| Your shelf is blank. | No games added. |
| Set the edges of the evening. | Set tonight’s limits. |
| Print the night’s contenders. | Generate tonight’s picklist. |
| Ranked for rotation, not universal quality. | Ranked by the published score. |
| No list stamped yet. | No picklist yet. |
| No shelf guilt. | Remove. |
| No mystery math | Published scoring |
| One shelf box | Game details |
| contender / rotation / list, when naming the generated result | pick / picklist |
| practical | Remove. |
| offline-capable | Works offline after the first visit. |
| deterministic | repeatable |
| high-contrast light and dark treatments | light and dark themes that meet contrast requirements |
| inspectable | visible |
| Constraints | Limits |

### F-1-63 — MINOR — Three controls do not accurately name their result

- **Build tonight’s list** does not build anything; it scrolls. Use **Try it with sample data** for the demo, or **Add shelf games** if it remains an anchor.
- **Got it** closes the scoring dialog. Use **Close scoring details**.
- The visible theme control is only **◐/◑**. Its accessible name is good, but the visible control is opaque to a new visitor. Add visible **Dark theme** / **Light theme** text or an immediately recognizable labelled switch.

## Demo and sandbox exercise

| Check | Result | Evidence |
| --- | --- | --- |
| First-screen one-click sample action | FAIL | The first action scrolls; sample loading needs a second click. |
| Immediate realistic sample | PARTIAL | Five plausible fictional games appear after the second click, but no picklist is generated. |
| Persistent demo banner | FAIL | No matching text or element. |
| Reset demo | FAIL | No control. |
| Start for real | FAIL | No control. |
| Direct `/demo` entry | FAIL | It renders the normal app, normal title, and pre-existing real data. |
| Separate storage namespace | FAIL | Samples write to `shelf-rotation-picklist:v1`. |
| Real data untouched | FAIL | `/demo` read the seeded real game `MY REAL PRIVATE GAME`. |
| Offline exercise | PASS behavior, unregistered claim | After first load, `/demo` reloaded offline with five rows and the offline banner. |
| Privacy interception | PASS observation, unregistered claim | Load, sample, and generate emitted only same-origin GET requests and no console/page errors. |

## Claim-test execution

`.factory/claims.json` is absent, so there are no listed commands to execute and every retained claim is untested under the claims contract. This is not a vacuous pass. General gates from the clean base worktree were:

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 58 packages, 0 vulnerabilities |
| `npm test` | PASS — 2 files, 8 tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — `dist/` produced; JS 28.98 kB raw / 10.25 kB gzip |
| `npm run test:browser` | PASS — 9 tests |

## History audit

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. I also read the prior verification reports and handoff and independently rechecked every previously reported defect:

| Earlier finding | Live confirmation | Code/test confirmation | Status |
| --- | --- | --- | --- |
| Verification 1: result inline style violated CSP | Generated three picks with zero console/page errors. | Pick cards use classes, and the strict-CSP browser test passes. | Fixed |
| Verification 1: whitespace-only title saved | The live form shows “Enter a game title, not only spaces.” and remains open. | Browser regression passes. | Fixed |
| Verification 1: impossible date and same-file duplicate accepted | Live mixed CSV reports both errors and accepts only the valid title. | Unit and browser regressions pass. | Fixed |
| Verification 1: footer links below 44 px | Live mobile boxes: Privacy 75.44 × 44, Terms 56.17 × 44, MIT source 80.25 × 44. | Browser regression passes. | Fixed |
| Verification 2: success status blocked mobile content/nav | Live status is 1 × 1 assistive text; it overlaps neither nav nor card, and confirmation is in flow. | Browser regression passes. | Fixed |

No earlier finding is being repeated under its old id.

## Structure, accessibility, and visual checks

Confirmed passes:

- Root, Privacy, and Terms have route-pattern titles under 60 characters, `lang="en"`, one h1, and a main landmark.
- Root hero image has meaningful alt text; all tested states produced zero axe violations on desktop and mobile, including dark mode.
- The first Tab reaches the visible skip link. Generated results receive focus. Reduced motion and 44 px mobile footer targets pass.
- Root, Privacy, Terms, all in-page anchors, the GitHub source link, and the privacy mail link are not dead.
- No horizontal overflow occurs at normal 390 px sizing. No console or page errors occurred in reviewed flows.
- The shelf-label neo-brutalist identity is distinctive and matches `.factory/design.md`; it is not a generic SaaS hero/card template.
- CSP and other configured security headers are consistent with loaded resources.

Failures are recorded in F-1-4 and F-1-55 through F-1-60.

## Copy audit

Counting method: whitespace-separated tokens; numbers and symbols count as tokens. Headings and fragments are included so the inventory does not hide short unclear copy. README code blocks and command-only lines are excluded as code rather than sentences. `—` means no length, jargon, adjective, terminology, heading, or button flag; claim findings are tracked separately above.

### Cold landing and reachable dialog copy

| # | Words | Exact text | Copy flag |
| ---: | ---: | --- | --- |
| 1 | 4 | A fair next-play shortlist | F-1-62: subjective “fair”; result term |
| 2 | 2 | Stop scrolling. | F-1-1/F-1-62: contextless h1 |
| 3 | 3 | Rotate the shelf. | F-1-1/F-1-62: metaphor |
| 4 | 11 | Filter what actually fits tonight, then bring the neglected games forward. | — |
| 5 | 9 | Every pick tells you why it made the cut. | — |
| 6 | 2 | Local only | F-1-62: jargon/ambiguous |
| 7 | 2 | Hard constraints | F-1-62: jargon |
| 8 | 2 | Visible scoring | F-1-62: jargon |
| 9 | 9 | The front of the shelf is earned, not random. | F-1-62: metaphor |
| 10 | 6 | Put your shelf on the table. | F-1-62: metaphorical heading |
| 11 | 10 | Add games one by one or import a simple CSV. | F-1-62: subjective “simple” |
| 12 | 8 | This is a picker, not another collection chore. | F-1-62: negative/subjective framing |
| 13 | 4 | Your shelf is blank. | F-1-62: use “No games added” |
| 14 | 7 | Start with five games you keep overlooking. | — |
| 15 | 5 | You can grow it later. | — |
| 16 | 6 | Set the edges of the evening. | F-1-62: metaphorical heading |
| 17 | 4 | These are hard limits. | — |
| 18 | 8 | Games outside them are excluded, not quietly penalized. | — |
| 19 | 21 | Eligible games score up to 85 points: neglect 50 + never played 20 + easy setup 10 + tag variety 5. | — |
| 20 | 4 | Print the night’s contenders. | F-1-62: wrong action/result term |
| 21 | 6 | Ranked for rotation, not universal quality. | F-1-62: abstract/negative |
| 22 | 7 | Your group still makes the final call. | — |
| 23 | 4 | No list stamped yet. | F-1-62: metaphor/result term |
| 24 | 8 | Add at least one shelf game to begin. | — |
| 25 | 7 | Set tonight’s limits, then make the picklist. | — |
| 26 | 2 | No account. | — |
| 27 | 2 | No ratings. | — |
| 28 | 3 | No shelf guilt. | F-1-62: subjective/unprovable |
| 29 | 3 | No mystery math | F-1-62: negative metaphor |
| 30 | 4 | How the score works | — |
| 31 | 9 | +5 per full month since played, capped at +50 | — |
| 32 | 6 | +20 on top of maximum neglect | — |
| 33 | 8 | Light +10 · medium +5 · heavy +0 | — |
| 34 | 12 | +5 if a pick introduces a tag not already in the list | F-1-62: “list” conflicts with “picklist” |
| 35 | 11 | Availability, players, time, setup limit, and must-have tag are hard filters. | — |
| 36 | 5 | They never alter the score. | — |
| 37 | 7 | Ties are alphabetical, making the result repeatable. | — |
| 38 | 3 | One shelf box | F-1-62: unclear out of context |
| 39 | 3 | Add a game | — |
| 40 | 5 | Last played (blank = never) | — |
| 41 | 5 | Light · under 5 min | — |
| 42 | 4 | Medium · 5–15 min | — |
| 43 | 5 | Heavy · over 15 min | — |
| 44 | 4 | Tags (separate with commas) | — |
| 45 | 6 | Original AI-generated shelf artwork · MIT source | — |

Landing average: 5.9 words. No landing item exceeds 22 words and no banned word appears.

### Conditional root-route states and errors

| # | Words | Exact template text | Copy flag |
| ---: | ---: | --- | --- |
| 1 | 6 | Your change could not be saved. | — |
| 2 | 7 | Browser storage may be full or disabled. | — |
| 3 | 4 | [title] is available tonight. | — |
| 4 | 4 | [title] is unavailable tonight. | — |
| 5 | 4 | No game matches “[search]”. | — |
| 6 | 5 | Picklist ready with [N] contenders. | F-1-62: “contenders” conflicts with “picklist” |
| 7 | 8 | [N] contenders · [N] excluded by tonight’s limits | F-1-62: result term |
| 8 | 4 | Nothing fits all limits. | — |
| 9 | 3 | [N] games excluded. | — |
| 10 | 9 | Loosen a hard limit or mark another game available. | — |
| 11 | 3 | See exclusion reasons | — |
| 12 | 7 | Enter a game title, not only spaces. | — |
| 13 | 8 | Maximum players must be at least the minimum. | — |
| 14 | 10 | A game with that title is already on the shelf. | — |
| 15 | 5 | [title] added to the shelf. | — |
| 16 | 6 | That file is over 2 MB. | — |
| 17 | 9 | Split it into a smaller CSV and try again. | — |
| 18 | 6 | The file could not be read. | — |
| 19 | 9 | Save it as a UTF-8 CSV and try again. | — |
| 20 | 7 | Imported [N] games; skipped [N] duplicate titles. | — |
| 21 | 4 | Some rows need attention | — |
| 22 | 3 | And [N] more. | — |
| 23 | 5 | Five fictional sample games added. | — |
| 24 | 3 | Tonight’s limits updated. | — |
| 25 | 4 | Generate a fresh picklist. | — |
| 26 | 4 | [title] marked available tonight. | — |
| 27 | 4 | [title] marked unavailable tonight. | — |
| 28 | 5 | Remove “[title]” from this shelf? | — |
| 29 | 2 | [title] removed. | — |
| 30 | 6 | Check tonight’s player and time values. | — |
| 31 | 7 | No games fit all of tonight’s limits. | — |
| 32 | 5 | Rotation saved on this device. | F-1-62: result term |
| 33 | 4 | The CSV is empty. | — |
| 34 | 3 | Missing columns: [columns]. | — |
| 35 | 4 | [N] months waiting: +[score] | — |
| 36 | 3 | Maximum neglect: +[score] | — |
| 37 | 3 | Never played: +20 | — |
| 38 | 7 | Played within the last month: +0 neglect | — |
| 39 | 3 | [setup] setup: +[score] | — |
| 40 | 4 | Adds tag variety: +[score] | — |
| 41 | 3 | marked unavailable tonight | — |
| 42 | 3 | needs [range] players | — |
| 43 | 6 | [minutes] min exceeds the time limit | — |
| 44 | 6 | [setup] setup exceeds the setup limit | — |
| 45 | 6 | does not have the “[tag]” tag | — |
| 46 | 8 | Offline mode — your shelf and picker still work. | — |

All conditional items are at or below 22 words. The error messages state the problem and, where recovery is needed, the next action.

### README prose

| # | Words | Exact text | Copy flag |
| ---: | ---: | --- | --- |
| 1 | 16 | Shelf Rotation Picklist turns an owned board-game shelf into a practical 3–5 game shortlist for tonight. | F-1-62: “practical”; result term |
| 2 | 24 | It is for collectors who want to rotate neglected games without ignoring player count, available time, setup effort, tags, or what is actually available. | F-1-61: over cap |
| 3 | 8 | The app is free, static, offline-capable, and local-first. | F-1-62: jargon |
| 4 | 6 | Collection data never leaves the browser. | — |
| 5 | 12 | There are no accounts, analytics, scraped ratings, third-party scripts, or remote recommendations. | — |
| 6 | 8 | Add games manually or import/export a user-provided CSV. | — |
| 7 | 8 | Mark each game in or out for tonight. | — |
| 8 | 12 | Apply hard limits for players, time, setup effort, and an optional tag. | — |
| 9 | 11 | Generate a deterministic 3–5 game picklist with a visible point breakdown. | F-1-62: jargon “deterministic” |
| 10 | 11 | Save up to ten rotations locally and print the current list. | F-1-62: result terms |
| 11 | 9 | Work after the first load without a network connection. | — |
| 12 | 7 | Switch between high-contrast light and dark treatments. | F-1-62: “treatments” |
| 13 | 30 | Scoring is intentionally small and inspectable: +5 per full neglected month (up to 50), +20 if never played, +10/+5/+0 for light/medium/heavy setup, and +5 when a pick adds tag variety. | F-1-61: over cap; “inspectable” |
| 14 | 7 | Constraints are filters, not hidden score adjustments. | F-1-62: jargon |
| 15 | 3 | Ties are alphabetical. | — |
| 16 | 10 | Download a template in the app, or provide these columns: | — |
| 17 | 23 | `last_played` is blank or `YYYY-MM-DD`; `setup` is `light`, `medium`, or `heavy`; tags are separated with `\|`; and `available` accepts `true`/`false`, `yes`/`no`, or `1`/`0`. | F-1-61: over cap |
| 18 | 8 | Invalid rows are reported without discarding valid rows. | — |
| 19 | 5 | Requires Node.js 20 or newer. | — |
| 20 | 7 | Open the local URL printed by Vite. | — |
| 21 | 24 | `npm run test:browser` runs the Playwright regression and product smoke suite against the production preview; it uses the Chromium version bundled for Playwright 1.58.2. | F-1-61: over cap |
| 22 | 9 | The exact production build command is `npm run build`. | — |
| 23 | 17 | It type-checks the project and writes the deployable static site to `dist/`, with `dist/index.html` at its root. | — |
| 24 | 11 | Azure Static Web Apps routing and security headers live in `public/staticwebapp.config.json`. | — |
| 25 | 12 | Shelf data, settings, theme, and saved rotations are stored in browser `localStorage`. | — |
| 26 | 11 | The Privacy page includes a control to clear this product’s data. | — |
| 27 | 5 | CSV import is entirely in-browser. | F-1-62: “in-browser” conflicts with chosen privacy phrase |
| 28 | 22 | This product deliberately does not scrape BoardGameGeek, use external catalog data, manage ratings or prices, or attempt to replace a collection manager. | — |
| 29 | 10 | The visual system and generated-asset provenance are documented in `.factory/design.md`. | — |
| 30 | 8 | Implementation verification and known limits are in `.factory/handoff.md`. | — |
| 31 | 4 | MIT — see `LICENSE`. | — |

README average: 11.5 words. Four sentences exceed 22 words. No banned word appears.

All README headings—**What it does**, **CSV format**, **Develop**, **Test and build**, **Privacy and product boundaries**, and **License**—make sense out of context.

### Button and action-label audit

Result-naming labels that pass: **Skip to picker**, **Add one game**, **Import CSV**, **Download template**, **Export shelf**, **Inspect scoring**, **Make my picklist**, **Save rotation**, **Print / PDF**, **Delete saved list**, **Add to shelf**, and accessible close/remove names. **Build tonight’s list**, **Try five sample games**, **Got it**, and the visible theme glyph are addressed in F-1-2 and F-1-63. **Cancel** is conventional in the add dialog and is not ambiguous in context.

## What would make this perfect

Resolve every finding, then rerun this entire checklist from a fresh live context. The acceptance target is: a phone visitor immediately sees the board-game job, audience, one-click sample action, next result, price, offline fact, and storage fact; `/demo` is visibly isolated and resettable; every retained claim is registered and passes from that demo; unknown routes show the designed 404; 200% text reflows; route focus/metadata are complete; every copy flag is gone. Anything less remains a FAIL.
