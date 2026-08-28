# Polish 3 — cumulative adversarial repair map

This round closes every finding in `review-1.md`, `review-2.md`, and `review-3.md`. The application repair was deployed from `36235cb` to <https://shelf-rotation-picklist.sociobot.in> under deployment `99470c17-2282-4146-b82e-d7ce7756ea4f`.

Evidence shorthand:

- **CC16** — every one of the 16 exact commands in `.factory/claims.json` passed from clean clone `/tmp/srp-polish3-release-check/repo`.
- **LIVE17** — `PLAYWRIGHT_BASE_URL=https://shelf-rotation-picklist.sociobot.in npm run test:browser`: 17/17 passed against the deployed site.
- **LIVE-SRV** — `verify-url.sh` passed; `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown path returned 404; CSP, referrer, and content-type headers were present.
- **LIVE-LH** — live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.05 s, CLS 0, TBT 20 ms. Report: `.factory/evidence/polish-3/live/lighthouse.json`.
- **Shots** — `.factory/evidence/polish-3/live/screenshot-desktop.png`, `screenshot-mobile.png`, `demo-mobile.png`, and `404-mobile.png`.

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote and tightened the first screen around the board-game job, collector audience, direct sample action, next result, and three facts; reduced desktop hero spacing so all are visible at 1440 × 900. | `desktop first screen shows…`; LIVE17; desktop/mobile Shots. |
| F-1-2 | Kept `/?demo=1` as the primary one-click entry, `/demo` as an alias, a separate `demo:` namespace, immediate picks, persistent banner, reset, and exit that discards demo state. | `@claim:demo-isolation`; CC16; LIVE17; demo Shot. |
| F-1-3 | Completed `.factory/claims.json`; every entry has exactly one tagged observable test and commands now build their own browser artifact. | CC16; 16 IDs each occur exactly once. |
| F-1-4 | Added a dedicated 404 document and explicit SWA rewrites only for real SPA routes, so unknown URLs return the styled page with HTTP 404. | `@claim:routing-metadata-and-provenance`; LIVE-SRV; 404 Shot. |
| F-1-5 | Retained ranking/filter copy only with independent eligibility and order assertions. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-6 | Asserted the exact visible reason list for every seeded pick. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-7 | Uses the precise “Shelf data stays in this browser” boundary and captures the complete marked-data flow. | `@claim:privacy-local`; CC16; LIVE17. |
| F-1-8 | Replaced “hard constraints” with “Games outside your limits are excluded” and tests every limit separately. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-9 | Replaced jargon with visible point totals and exact component rows. | `@claim:score-points`; CC16; LIVE17. |
| F-1-10 | Replaced the metaphor with published-score wording and proves identical output from unchanged input. | `@claim:repeatable-picklist`; CC16; LIVE17. |
| F-1-11 | Removed “simple”; the tagged browser test now adds a game and exercises valid and invalid CSV rows. | `@claim:csv-io`; CC16; LIVE17. |
| F-1-12 | Covers availability, player, time, setup, and tag exclusion boundaries in the UI. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-13 | Proves the published 85-point maximum and every component, including monthly steps. | `@claim:score-points`; CC16; LIVE17. |
| F-1-14 | Uses “ranked by the published rotation score” and asserts visible scores/order. | `@claim:score-points`; LIVE17; demo Shot. |
| F-1-15 | Registers account-free sample use and verifies no account/payment fields or copy appear. | `@claim:free-no-account`; CC16; LIVE17. |
| F-1-16 | Removed the old standalone “No ratings” claim; the narrower remote-catalog boundary is registered. | `@claim:no-remote-catalog`; CC16; LIVE17. |
| F-1-17 | Registers offline operation and reloads an already controlled demo with visible picks while offline. | `@claim:offline-reload`; CC16; LIVE17. |
| F-1-18 | Tests 0, 1, 2, 10, and more than 10 full neglected months. | `@claim:score-points`; CC16; LIVE17. |
| F-1-19 | Asserts never-played +20 on top of capped neglect and the resulting 85 total. | `@claim:score-points`; CC16; LIVE17. |
| F-1-20 | Asserts light +10, medium +5, and heavy +0 as visible output. | `@claim:score-points`; CC16; LIVE17. |
| F-1-21 | Asserts a new tag receives +5 and a repeated tag does not. | `@claim:score-points`; CC16; LIVE17. |
| F-1-22 | Tests all five published filters independently with exact exclusion text. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-23 | Compares an eligible game before and after non-excluding limit changes and proves its points do not change. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-24 | Separately proves alphabetical equal-score ties and repeatability. | `@claim:tie-breaks`; `@claim:repeatable-picklist`; CC16; LIVE17. |
| F-1-25 | Keeps provenance in `.factory/design.md` and removes the untestable public art-provenance claim. | Copy audit; design provenance; LIVE17. |
| F-1-26 | Removes “practical” and proves selected sizes 3, 4, and 5 with enough eligible games. | `@claim:picklist-size`; 10-repeat flake run passed; CC16; LIVE17. |
| F-1-27 | Splits the bundle into plain Free, offline-after-first-visit, and browser-storage facts. | `@claim:free-no-account`; `@claim:offline-reload`; `@claim:privacy-local`; LIVE17. |
| F-1-28 | Captures requests through marked manual add, CSV import, limits, theme, pick, save, export, reset, and exit. | `@claim:privacy-local`; CC16; LIVE17. |
| F-1-29 | Registers no-account, no-analytics, no-third-party-script, and remote-data boundaries under observable tests. | `@claim:free-no-account`; `@claim:privacy-local`; `@claim:no-remote-catalog`; LIVE17. |
| F-1-30 | Tests manual add, import, and exact downloaded export contents. | `@claim:csv-io`; CC16; LIVE17. |
| F-1-31 | Tests both available and unavailable outcomes through the exclusion rule. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-32 | Replaces “hard limits” with exclusions and covers player, time, setup, and optional tag. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-33 | Proves deterministic ordering/points, every 3–5 selection, and visible breakdown rows. | `@claim:picklist-size`; `@claim:repeatable-picklist`; `@claim:score-points`; LIVE17. |
| F-1-34 | Saves eleven times, verifies only ten remain, and intercepts the print request. | `@claim:saved-picklists`; CC16; LIVE17. |
| F-1-35 | Reloads the ready demo after the browser is placed offline and verifies three picks remain. | `@claim:offline-reload`; CC16; LIVE17. |
| F-1-36 | Keeps labelled themes, fixes dark-hover contrast with ink text on blue, and scans light, dark, hover, and focus states with Axe. | `@claim:themes-and-accessibility`; CC16; LIVE17; LIVE-LH. |
| F-1-37 | Maps the short score prose to exact 0/1/2/10/>10-month and component assertions. | `@claim:score-points`; CC16; LIVE17. |
| F-1-38 | Uses “limits” and proves both strict exclusion and unchanged eligible points. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-1-39 | Proves reverse-inserted equal-score titles render alphabetically. | `@claim:tie-breaks`; CC16; LIVE17. |
| F-1-40 | A mixed CSV keeps six valid rows while announcing bad date and setup rows. | `@claim:csv-io`; CC16; LIVE17. |
| F-1-41 | Inspects exact demo fields/keys and verifies the real and demo namespaces stay separate. | `@claim:privacy-local`; `@claim:demo-isolation`; CC16; LIVE17. |
| F-1-42 | Confirms and removes only the real shelf key, then shows the completed state. | `@claim:clear-local-data`; CC16; LIVE17. |
| F-1-43 | Imports a uniquely marked CSV while recording all requests and proves the marker is never sent. | `@claim:privacy-local`; CC16; LIVE17. |
| F-1-44 | Narrows the public boundary and records requests during pick, save, and export; no catalog/rating/price path is used. | `@claim:no-remote-catalog`; CC16; LIVE17. |
| F-1-45 | Asserts template filename, exact header, and both example rows. | `@claim:csv-io`; CC16; LIVE17. |
| F-1-46 | Exercises blank/leap-day dates, all setup values, pipe tags, six availability spellings, and invalid date/setup boundaries. | `@claim:csv-io`; CC16; LIVE17. |
| F-1-47 | Declares Node `>=20` and checks it in the tagged repository test. | `@claim:docs-build`; CC16. |
| F-1-48 | Removes the fragile “URL printed by Vite” claim and documents the stable command/localhost URL. | `.factory/copy-audit.md`; `@claim:docs-build`; CC16. |
| F-1-49 | The tagged test deletes `dist` and actually executes `npm run build`. | `@claim:docs-build`; CC16. |
| F-1-50 | The tagged test asserts `dist/index.html`, `dist/404.html`, and every referenced built asset exists. | `@claim:docs-build`; CC16. |
| F-1-51 | Removes the stale README configuration claim while validating configuration and deployed route/header behavior. | `@claim:docs-build`; `@claim:routing-metadata-and-provenance`; LIVE-SRV. |
| F-1-52 | Removes public provenance/documentation assertions; retained source provenance remains complete in the design record. | `.factory/design.md`; copy audit. |
| F-1-53 | Removes the stale public handoff assertion; this handoff records the current work order and evidence. | `.factory/handoff.md`; copy audit. |
| F-1-54 | Retains MIT wording and asserts the license text. | `@claim:docs-build`; CC16. |
| F-1-55 | Removes min-content pressure and asserts 390 px at 200% text has no horizontal overflow. | `@claim:themes-and-accessibility`; CC16; LIVE17; mobile Shot. |
| F-1-56 | Keeps one persistent polite live region, moves focus to each route h1, and restores focus/scroll through Back and Forward. | `@claim:themes-and-accessibility`; CC16; LIVE17. |
| F-1-57 | Adds the landing “What stays private” section with clear account, export/clear, and remote-catalog boundaries. | LIVE17; desktop/mobile Shots. |
| F-1-58 | Completes per-route canonical/OG/Twitter metadata, social art, SVG favicon, and a real 180 × 180 PNG touch icon. | `@claim:routing-metadata-and-provenance`; CC16; LIVE17; LIVE-SRV. |
| F-1-59 | Ships robots discovery and a sitemap listing all four real routes. | `@claim:routing-metadata-and-provenance`; LIVE-SRV. |
| F-1-60 | Shares the wordmark/nav/footer/legal links everywhere and injects the immutable Git build id at build time. | `@claim:routing-metadata-and-provenance`; LIVE17; desktop and 404 Shots. |
| F-1-61 | Rewrites landing and README prose; the current sentence inventory has no sentence above 22 words. | `.factory/copy-audit.md`; LIVE17. |
| F-1-62 | Replaces “List size,” “hard limit,” metaphors, and inconsistent result nouns with the terminology table’s plain words. | `.factory/copy-audit.md`; LIVE17; Shots. |
| F-1-63 | Uses result-naming verbs, including “Use dark theme” / “Use light theme”; mobile no longer hides the label. | `@claim:themes-and-accessibility`; LIVE17; mobile and 404 Shots. |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-63 | Reopened mobile theme control is fully visible, verb-led, keyboard reachable, and at least 44 px. | `@claim:themes-and-accessibility`; LIVE17; mobile Shots. |
| F-2-1 | Reset demo and Start for real have 44 px minimum targets. | `mobile demo controls meet touch…`; LIVE17; demo Shot. |
| F-2-2 | Stores route scroll positions and restores the focused Tonight section after legal-route Back navigation. | `mobile demo controls meet touch…`; LIVE17. |
| F-2-3 | Registers the 3/4/5 promise and waits for seeded, enabled controls before checking all values. | `@claim:picklist-size`; 10-repeat run passed; CC16; LIVE17. |
| F-2-4 | Maps the README 3–5 wording to the same observable size claim. | `@claim:picklist-size`; CC16; LIVE17. |
| F-2-5 | Removes the exact five-game promise; the first action promises only the visible sample picklist. | `.factory/copy-audit.md`; desktop/mobile Shots. |
| F-2-6 | Registers unchanged-data repeatability and compares titles and points. | `@claim:repeatable-picklist`; CC16; LIVE17. |
| F-2-7 | Registers alphabetical ties and proves them from reverse input order. | `@claim:tie-breaks`; CC16; LIVE17. |
| F-2-8 | Registers the root “No remote catalog” boundary and records all demo-flow requests. | `@claim:no-remote-catalog`; CC16; LIVE17. |
| F-2-9 | Maps the README remote-catalog boundary to the same request-capture proof. | `@claim:no-remote-catalog`; CC16; LIVE17. |
| F-2-10 | Replaces the PDF promise with “Print the current picklist from your browser.” | `@claim:saved-picklists`; CC16; LIVE17. |
| F-2-11 | Replaces copy-only score checks with visible seeded cards for every rule, total, step, and cap. | `@claim:score-points`; CC16; LIVE17. |

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Reduced desktop hero heading, spacing, and copy gaps; audience, action, next-result note, and all facts end above 900 px. | `desktop first screen shows…`; LIVE17; desktop Shot. |
| F-3-2 | Browser claim commands now run `npm run build` before preview and never depend on pre-existing `dist`. | CC16 from a clone without `dist`. |
| F-3-3 | Waits for five sample rows and an enabled action, disables motion, then tests 3/4/5; ten repeated runs passed. | `@claim:picklist-size`; repeat-each=10; CC16; LIVE17. |
| F-3-4 | Replaced the catch-all fallback with explicit real-route rewrites and a 404 response override to `404.html`. | `@claim:routing-metadata-and-provenance`; LIVE-SRV 404; 404 Shot. |
| F-3-5 | Moves the polite status region outside replaced route markup and asserts exact legal-route announcements plus Back/Forward focus. | `@claim:themes-and-accessibility`; CC16; LIVE17. |
| F-3-6 | Uses near-black ink on utility-blue hover in dark mode and Axe-scans both hover/focus states. | `@claim:themes-and-accessibility`; LIVE17; LIVE-LH. |
| F-3-7 | The CSV tag now covers manual add, exact template contents, every documented value, invalid boundaries, and exact export rows. | `@claim:csv-io`; CC16; LIVE17. |
| F-3-8 | The filter tag now asserts all five exclusions, every exact pick reason, and unchanged points under non-excluding limits. | `@claim:picklist-filters-and-reasons`; CC16; LIVE17. |
| F-3-9 | The score tag now asserts 0, 1, 2, 10, and >10 full months alongside every remaining rule and the 85 cap. | `@claim:score-points`; CC16; LIVE17. |
| F-3-10 | The privacy tag uses unique real/manual/CSV markers through the complete workflow, checks exact keys/fields, and rejects analytics or data-bearing outbound traffic. | `@claim:privacy-local`; CC16; LIVE17. |
| F-3-11 | The docs tag deletes `dist`, runs the documented build, and verifies both pages plus referenced assets. | `@claim:docs-build`; CC16. |
| F-3-12 | Adds and links a genuine 180 × 180 PNG touch icon derived from the hand-authored shelf mark. | `@claim:routing-metadata-and-provenance`; LIVE17; LIVE-SRV. |
| F-3-13 | Replaces `polish-1` with the Git-derived build id in every footer, including 404. | `@claim:routing-metadata-and-provenance`; LIVE17; desktop/404 Shots show `36235cb`. |
| F-3-14 | Replaces “List size” with “Picklist size” and “hard limit” with “limit.” | `.factory/copy-audit.md`; LIVE17; demo Shot. |
| F-3-15 | Renames the action to “Clear shelf data” and precisely says it removes this product’s real shelf, limits, theme, and saved picklists only. | `@claim:clear-local-data`; CC16; LIVE17. |
| F-3-16 | Makes the empty-shelf sample link an inline-flex 44 px target and keeps its `/?demo=1` destination. | `mobile demo controls meet touch…`; LIVE17; mobile Shot. |
| F-3-17 | Theme actions now say “Use dark theme” and “Use light theme.” | `@claim:themes-and-accessibility`; LIVE17; Shots. |
| F-3-18 | Renames the README heading to “What Shelf Rotation Picklist does.” | `.factory/copy-audit.md`; README. |
| F-3-19 | Renames “Most setup” to “Maximum setup effort.” | `.factory/copy-audit.md`; LIVE17; demo Shot. |

## Acceptance result

Every listed finding is closed. All registered claims pass from a clean clone and against the live deployment. The deployed product has no known remaining acceptance gap.
