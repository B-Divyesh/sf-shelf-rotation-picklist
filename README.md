# Shelf Rotation Picklist

Shelf Rotation Picklist turns an owned board-game shelf into a practical 3–5 game shortlist for tonight. It is for collectors who want to rotate neglected games without ignoring player count, available time, setup effort, tags, or what is actually available.

The app is free, static, offline-capable, and local-first. Collection data never leaves the browser. There are no accounts, analytics, scraped ratings, third-party scripts, or remote recommendations.

Live product: <https://shelf-rotation-picklist.sociobot.in>

## What it does

- Add games manually or import/export a user-provided CSV.
- Mark each game in or out for tonight.
- Apply hard limits for players, time, setup effort, and an optional tag.
- Generate a deterministic 3–5 game picklist with a visible point breakdown.
- Save up to ten rotations locally and print the current list.
- Work after the first load without a network connection.
- Switch between high-contrast light and dark treatments.

Scoring is intentionally small and inspectable: +5 per full neglected month (up to 50), +20 if never played, +10/+5/+0 for light/medium/heavy setup, and +5 when a pick adds tag variety. Constraints are filters, not hidden score adjustments. Ties are alphabetical.

## CSV format

Download a template in the app, or provide these columns:

```csv
title,last_played,min_players,max_players,minutes,setup,tags,available
Example Game,2026-01-15,1,4,45,light,cards|co-op,true
Never Played Game,,2,5,90,medium,strategy,true
```

`last_played` is blank or `YYYY-MM-DD`; `setup` is `light`, `medium`, or `heavy`; tags are separated with `|`; and `available` accepts `true`/`false`, `yes`/`no`, or `1`/`0`. Invalid rows are reported without discarding valid rows.

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Test and build

```sh
npm test
npm run build
npm run preview
```

The exact production build command is `npm run build`. It type-checks the project and writes the deployable static site to `dist/`, with `dist/index.html` at its root. Azure Static Web Apps routing and security headers live in `public/staticwebapp.config.json`.

## Privacy and product boundaries

Shelf data, settings, theme, and saved rotations are stored in browser `localStorage`. The Privacy page includes a control to clear this product’s data. CSV import is entirely in-browser. This product deliberately does not scrape BoardGameGeek, use external catalog data, manage ratings or prices, or attempt to replace a collection manager.

The visual system and generated-asset provenance are documented in [`.factory/design.md`](.factory/design.md). Implementation verification and known limits are in [`.factory/handoff.md`](.factory/handoff.md).

## License

MIT — see [LICENSE](LICENSE).
