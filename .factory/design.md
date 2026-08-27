# Shelf Rotation Picklist — visual thesis

## Direction: shelf-label neo-brutalism

This is a working tool for making a decision beside a crowded game shelf, not a collection showroom. Its visual language borrows from fluorescent inventory stickers, graph paper, rubber stamps, and the blunt geometry of stacked game boxes. Thick black rules and offset shadows make states legible at a glance; a strict grid keeps the expressive treatment useful rather than ornamental.

## Palette

Light is the primary treatment because the product is a practical picklist. Dark is a deliberate late-game treatment selected with the theme control.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| Paper | `#F4EEDC` | `#171713` | Page background |
| Ink | `#191914` | `#F6F0DE` | Text and hard rules |
| Card | `#FFFDF5` | `#24241E` | Work surfaces |
| Muted | `#625E50` | `#C4BDA8` | Secondary copy |
| Electric lime | `#DFFF3F` | `#CBEA37` | Primary action, selection |
| Ticket coral | `#FF6B4A` | `#FF8065` | Neglect signal, warning |
| Utility blue | `#5078FF` | `#7392FF` | Informational marks |
| Success | `#167744` | `#72D39A` | Saved/available state |
| Danger | `#A8271E` | `#FF8A7A` | Validation/destructive state |

All body combinations meet WCAG AA. Accent fills use ink text; status never depends on hue alone.

## Typography

- Headings and controls: `Arial Black`, `Arial Narrow Bold`, then system sans. Its compact, poster-like caps resemble a shelf label and costs no font download.
- Body and data: `ui-monospace`, `SFMono-Regular`, `Cascadia Mono`, `Roboto Mono`, monospace. Dates, scores, and ranges stay aligned and inspectable.
- Scale: 16px body with 1.55 leading; 18/22/30px work headings; fluid 40–76px single h1. Labels never drop below 13px.

## Spacing, shape, and depth

- An 8px base rhythm: 4, 8, 12, 16, 24, 32, 48, 64.
- 3px hard borders, square or lightly clipped corners, and 6px offset shadows.
- Cards represent independent games or workflow stages only. Dense metadata uses rows and chips.
- Desktop uses a 12-column editorial grid. At 390px, the image and nonessential explanatory annotations drop; tools become one column; all controls remain at least 44px.

## Interaction grammar

- Primary actions depress their offset shadow by 3px, like stamping a ticket.
- Selected game rows gain a lime index tab; excluded rows explain why in text.
- The picker is a three-station workflow: add shelf → set tonight → print rotation. Navigation scrolls to each station and current counts stay visible.
- Shortlist generation moves focus to the results heading; validation and import summaries use polite live regions. Dialogs trap focus and return it to their trigger.

## Motion policy

Only state changes move: shortlist tickets enter from their stacked origin over 220ms and pressed controls translate over 100ms. No looping animation. With `prefers-reduced-motion: reduce`, transitions and smooth scrolling become instant; hierarchy remains through borders, index tabs, and contrast.

## Original asset plan and provenance

One hero illustration clarifies the product: an editorial still life of uneven board-game-like boxes rotating onto a fluorescent picklist, used beside the product promise on wide screens and omitted on narrow phones. Small interface icons are original inline SVG line drawings or typographic symbols.

### Image prompt sheet

- Use case: `stylized-concept`
- Subject: a compact shelf of unbranded, textless tabletop game boxes, three boxes sliding onto a paper picklist
- World/materials: tactile screen-printed cardboard, torn inventory labels, black registration marks, off-white paper grain
- Composition: landscape, three-quarter top-down view, objects weighted to the right, quiet negative space on the left, no UI screenshot
- Light/lens: hard overhead studio light, crisp short shadows, graphic editorial lens
- Palette words: warm paper, near-black ink, fluorescent chartreuse, coral-orange, utility blue
- Negative list: people, hands, readable words, letters, logos, brand marks, copyrighted game imagery, gradients, glassmorphism, photorealistic packaging, watermark

Generation command: `/opt/fleet/lib/gen-image.sh`, Azure factory image deployment. Generated 2026-08-27 for this product; original AI-generated asset, reviewed for brand/text artifacts. Source prompt is retained in `assets/src/hero-shelf.json`; shipping derivatives are WebP/AVIF with PNG fallback, each under 300 KB.
