# Shelf Rotation Picklist

Pick neglected board games for tonight. It is for collectors choosing from a crowded shelf.

Set players, time, setup, and tag limits. The picker returns three to five games with visible reasons and points.

Try the ready-made sample at <https://shelf-rotation-picklist.sociobot.in/?demo=1>.

## What Shelf Rotation Picklist does

- Add games one at a time or import a CSV.
- Export your shelf as a CSV.
- Exclude games outside tonight’s limits.
- Generate a repeatable picklist with visible points.
- Save up to ten picklists in this browser.
- Print the current picklist from your browser.
- Use light or dark themes.
- Works offline after the first visit.

Shelf data stays in this browser. Game details are not uploaded.

## Scoring

Neglect adds five points per full month, up to 50. Never-played games add 20.

Light, medium, and heavy setup add 10, 5, and 0 points. A new tag adds five points.

Games outside your limits are excluded. Limits do not change points. Ties are alphabetical.

## CSV format

Download a template in the app, or provide these columns.

```csv
title,last_played,min_players,max_players,minutes,setup,tags,available
Example Game,2026-01-15,1,4,45,light,cards|co-op,true
Never Played Game,,2,5,90,medium,strategy,true
```

`last_played` is blank or uses `YYYY-MM-DD`.

`setup` is `light`, `medium`, or `heavy`. Separate tags with `|`.

`available` accepts `true`, `false`, `yes`, `no`, `1`, or `0`. Invalid rows show errors while valid rows import.

## Privacy and boundaries

The app stores your shelf, limits, theme, and saved picklists in this browser.

The Privacy page can clear your real shelf data. The app does not use a remote game catalog, ratings, or prices.

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

## Test and build

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run test:browser
```

`npm run build` type-checks and creates `dist/index.html`. Deploy `dist/` to Azure Static Web Apps.

Run every registered product claim from `.factory/claims.json` with its listed command.

## License

MIT — see [LICENSE](LICENSE).
