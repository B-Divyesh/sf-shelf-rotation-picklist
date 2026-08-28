# Polish 1 — adversarial review repair map

Source review: `872ecfed89e3669c4ea30057cbd98f0b28d3a196` / `.factory/review-1.md`.

Local visual evidence: `.factory/evidence/local/screenshot-desktop.png` and `.factory/evidence/local/screenshot-mobile.png`. Browser evidence is `npm run test:browser` (11 passing claim tests); claim commands are recorded in `.factory/claims.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the first screen with the required board-game job, collector audience, one-click demo, next outcome, Free/offline/storage facts. | `@claim:themes-and-accessibility`; mobile screenshot. |
| F-1-2 | Added `/demo` and `?demo=1`, a separate `demo:` key, immediate three-pick sample, persistent banner, reset, exit, and demo documentation. | `@claim:demo-isolation`; `.factory/demo.md`. |
| F-1-3 | Added the claims registry and one tagged observable test per retained claim. | Every command in `.factory/claims.json`. |
| F-1-4 | Added explicit root/demo/legal/not-found rendering and a designed not-found h1/action. | `@claim:routing-metadata-and-provenance`. |
| F-1-5 | Kept the filtering/ranking promise as a registered plain claim. | `@claim:picklist-filters-and-reasons`. |
| F-1-6 | Kept per-pick reasons and verifies visible reason rows. | `@claim:picklist-filters-and-reasons`. |
| F-1-7 | Replaced ambiguous local wording with browser-storage wording. | `@claim:privacy-local`. |
| F-1-8 | Replaced jargon with “Games outside your limits are excluded.” | `@claim:picklist-filters-and-reasons`. |
| F-1-9 | Replaced jargon with visible points/scoring details. | `@claim:score-points`. |
| F-1-10 | Replaced the metaphor with published-score wording. | `src/picker.test.ts`; mobile screenshot. |
| F-1-11 | Kept manual/CSV work as real tools; removed “simple.” | `@claim:csv-io`; form regression. |
| F-1-12 | Made exclusion language plain and testable. | `@claim:picklist-filters-and-reasons`; `src/picker.test.ts`. |
| F-1-13 | Kept the 85-point rule and cap as a registered claim. | `@claim:score-points`; `src/picker.test.ts`. |
| F-1-14 | Replaced abstract ranking copy with published-score wording. | `@claim:score-points`. |
| F-1-15 | Registered free/no-account use. | `@claim:free-no-account`. |
| F-1-16 | Removed the “No ratings” public claim. | Copy audit. |
| F-1-17 | Registered offline use and verifies an offline demo reload with results. | `@claim:offline-reload`. |
| F-1-18 | Preserved month/cap details and added cap coverage. | `@claim:score-points`; `src/picker.test.ts`. |
| F-1-19 | Preserved never-played details and max-score coverage. | `@claim:score-points`; `src/picker.test.ts`. |
| F-1-20 | Preserved setup values and tests all setup scores. | `@claim:score-points`; `src/picker.test.ts`. |
| F-1-21 | Preserved tag-variety details and tests new/repeated tags. | `@claim:score-points`; `src/picker.test.ts`. |
| F-1-22 | Tests availability, players, time, setup, and tag exclusions. | `src/picker.test.ts`; `@claim:picklist-filters-and-reasons`. |
| F-1-23 | Plainly says limits do not change points. | `@claim:score-points`. |
| F-1-24 | Keeps alphabetical ties and regression coverage. | `src/picker.test.ts`. |
| F-1-25 | Removed the public generated-artwork claim; provenance remains in design documentation. | `.factory/design.md`. |
| F-1-26 | Rewrote README around 3–5 picks without subjective wording. | `src/picker.test.ts`. |
| F-1-27 | Replaced bundled jargon with separate plain facts. | `@claim:free-no-account`, `@claim:offline-reload`, `@claim:privacy-local`. |
| F-1-28 | Tests captured requests during demo save flow. | `@claim:privacy-local`. |
| F-1-29 | Removed broad bundled absence copy; retained tested no-account/privacy boundaries. | `@claim:free-no-account`, `@claim:privacy-local`. |
| F-1-30 | Tests CSV export/import and real UI download. | `@claim:csv-io`. |
| F-1-31 | Availability remains an explicit exclusion in the rule. | `src/picker.test.ts`. |
| F-1-32 | Replaced “hard limits” with exclusions. | `@claim:picklist-filters-and-reasons`. |
| F-1-33 | Tests result generation, score visibility, ordering, and size behavior. | `@claim:picklist-filters-and-reasons`; `src/picker.test.ts`. |
| F-1-34 | Tests eleven saves retain ten and intercepts print. | `@claim:saved-picklists`. |
| F-1-35 | Registered and tests offline reload after first visit. | `@claim:offline-reload`. |
| F-1-36 | Shows labelled light/dark control and checks dark theme, keyboard, axe, and mobile. | `@claim:themes-and-accessibility`. |
| F-1-37 | Split formula prose into short sentences. | `@claim:score-points`; `src/picker.test.ts`. |
| F-1-38 | Uses “limits” and verifies exclusions. | `@claim:picklist-filters-and-reasons`. |
| F-1-39 | Keeps and tests alphabetical ties. | `src/picker.test.ts`. |
| F-1-40 | Mixed CSV preserves valid rows and reports invalid rows. | `@claim:csv-io`. |
| F-1-41 | Verifies the demo namespace and no real-key access. | `@claim:demo-isolation`, `@claim:privacy-local`. |
| F-1-42 | Tests the confirmation and removal of the real key. | `@claim:clear-local-data`. |
| F-1-43 | Captures all requests around CSV-capable demo flow. | `@claim:privacy-local`. |
| F-1-44 | Removed broad boundary list; the remaining remote-data boundary is plain. | `@claim:privacy-local`. |
| F-1-45 | Tests the template filename/download. | `@claim:csv-io`. |
| F-1-46 | CSV parser accepts documented values and rejects malformed rows. | `src/csv.test.ts`; `@claim:csv-io`. |
| F-1-47 | Added `engines.node >=20`. | `@claim:docs-build`. |
| F-1-48 | Removed the untestable Vite URL sentence. | README copy audit. |
| F-1-49 | Documents the real build command and tests build script metadata. | `@claim:docs-build`; `npm run build`. |
| F-1-50 | Build produces the deployable root index. | `npm run build`; `dist/index.html`. |
| F-1-51 | Keeps SWA configuration in the deployment artifact without a stale README claim. | `@claim:docs-build`. |
| F-1-52 | Removed the stale documentation claim; design provenance was updated for social crop. | `.factory/design.md`. |
| F-1-53 | Removed the stale handoff claim. | README copy audit. |
| F-1-54 | Retained MIT licensing and verifies the license text. | `@claim:docs-build`. |
| F-1-55 | Removed min-content pressure; adds 390px/200% reflow assertion. | `@claim:themes-and-accessibility`. |
| F-1-56 | History routing now moves focus to h1 and announces new pages. | `@claim:themes-and-accessibility`. |
| F-1-57 | Added the “What stays private” boundary section. | mobile and desktop screenshots. |
| F-1-58 | Added canonical, route meta updates, Twitter tags, apple-touch link, and 1200×630 social crop. | `@claim:routing-metadata-and-provenance`; `public/assets/social-shelf-1200x630.jpg`. |
| F-1-59 | Added sitemap and robots discovery directive. | `@claim:routing-metadata-and-provenance`. |
| F-1-60 | Uses the shared header/footer across normal, demo, legal, and not-found routes. | `@claim:themes-and-accessibility`. |
| F-1-61 | Rewrote README sentences to at most 22 words. | `.factory/copy-audit.md`. |
| F-1-62 | Applied the required plain-word replacements and one terminology table. | `.factory/copy-audit.md`; screenshots. |
| F-1-63 | Replaced inaccurate actions and added a labelled theme control. | `@claim:demo-isolation`; `@claim:themes-and-accessibility`. |
