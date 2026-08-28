# Polish 2 — cumulative adversarial repair map

Source reviews: `.factory/review-1.md` and `.factory/review-2.md`. This round retains the shelf-label neo-brutalist visual system in `.factory/design.md`; it changes behavior, proof, and small-screen controls rather than replacing the product surface.

Local evidence: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:browser`. Browser evidence includes the exact 390 px demo/control/history flow in `e2e/smoke.spec.ts`; deployment evidence is added to `.factory/evidence/live/` after publish.

| Finding id(s) | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the plain board-game job, collector audience, direct sample action, and Free/offline/browser facts. | `@claim:themes-and-accessibility`; local mobile screenshot after deploy verification. |
| F-1-2 | Kept `/demo` and `?demo=1`, the `demo:` namespace, immediate sample result, persistent banner, Reset demo, and Start for real. | `@claim:demo-isolation`; `.factory/demo.md`. |
| F-1-3 | Kept the claims registry and added every newly discovered behavioral claim. | Every command in `.factory/claims.json`. |
| F-1-4 | Kept explicit root/demo/legal/not-found routing and route-specific metadata. | `@claim:routing-metadata-and-provenance`. |
| F-1-5–F-1-14 | Kept tested filtering, per-pick reasons, private browser storage, visible points, deterministic published scoring, manual entry, CSV import, exclusion behavior, and the 85-point rule. | `@claim:picklist-filters-and-reasons`, `@claim:score-points`, `@claim:csv-io`, `@claim:privacy-local`. |
| F-1-15–F-1-17 | Kept the account-free, offline, and accurately bounded privacy copy. | `@claim:free-no-account`, `@claim:offline-reload`, `@claim:privacy-local`. |
| F-1-18–F-1-24 | Strengthened the score claim test to seed and visibly assert the 50 cap, never-played 20, all setup values, tag variety, and 85 maximum; registered repeatability and alphabetical ties. | `@claim:score-points`, `@claim:repeatable-picklist`, `@claim:tie-breaks`. |
| F-1-25–F-1-30 | Kept provenance in design docs, removed untestable public art copy, and retained tested CSV, browser-storage, no-upload, and account boundaries. | `.factory/design.md`; `@claim:csv-io`, `@claim:privacy-local`, `@claim:free-no-account`. |
| F-1-31–F-1-40 | Kept tested availability/limit filters, 3–5 result sizing, saved-list cap, offline use, themes, arithmetic, tie behavior, and mixed-CSV recovery. | `@claim:picklist-filters-and-reasons`, `@claim:picklist-size`, `@claim:saved-picklists`, `@claim:offline-reload`, `@claim:themes-and-accessibility`, `@claim:score-points`, `@claim:tie-breaks`, `@claim:csv-io`. |
| F-1-41–F-1-54 | Kept isolated storage/reset, real-data clearing, privacy request capture, CSV template/parser, Node/build/SWA docs, corrected provenance, and MIT licensing. | `@claim:demo-isolation`, `@claim:clear-local-data`, `@claim:privacy-local`, `@claim:csv-io`, `@claim:docs-build`. |
| F-1-55–F-1-62 | Kept 390 px/200% reflow, route focus/live announcement, privacy/legal structure, metadata/sitemap, shared shell, and plain-language copy audit. | `@claim:themes-and-accessibility`, `@claim:routing-metadata-and-provenance`, `.factory/copy-audit.md`. |
| F-1-63 | Removed the mobile icon-only rule. The 390 px control visibly reads “Dark theme” or “Light theme.” | `@claim:themes-and-accessibility` checks text and nonzero computed font size. |
| F-2-1 | Raised Reset demo and Start for real to a 44 px minimum height. | `mobile demo controls meet touch and route-restoration requirements`. |
| F-2-2 | Added stored per-route scroll positions, fragment-target restoration after layout, and focused visible section headings on Back. | `mobile demo controls meet touch and route-restoration requirements` exercises `/#tonight → /privacy → Back`. |
| F-2-3, F-2-4 | Registered the three/four/five result range and tested every chooser value with five eligible sample games. | `@claim:picklist-size`. |
| F-2-5 | Rewrote the first-screen outcome as “See a sample picklist…”; no untested count remains. | `.factory/copy-audit.md`; first-screen browser check. |
| F-2-6 | Registered and tested repeated generation against unchanged titles and points. | `@claim:repeatable-picklist`. |
| F-2-7 | Registered and tested reverse-inserted equal-score titles in alphabetical output order. | `@claim:tie-breaks`. |
| F-2-8, F-2-9 | Registered the remote-catalog boundary and exercised demo pick, save, and export while capturing all requests. | `@claim:no-remote-catalog`. |
| F-2-10 | Rewrote README output wording to “Print the current picklist from your browser”; the UI says “Print picklist.” | `@claim:saved-picklists`; `.factory/copy-audit.md`. |
| F-2-11 | Replaced copy-only score coverage with seeded visible-card assertions for every score component and total. | `@claim:score-points`. |

Live recheck target: <https://shelf-rotation-picklist.sociobot.in/demo>. The post-deploy verification records its screenshots and basic browser report in `.factory/evidence/live/`.
