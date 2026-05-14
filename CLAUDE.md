# Artemis II Mission Passport

A cinematic, scroll-driven landing page that functions as a personalized digital gift. The recipient (RIFA) is treated as an honorary member of the Artemis II crew. The page tells a story of the Orion spacecraft assembling and disassembling against the Carina Nebula, then reveals 3 downloadable commemorative badges.

## Tech Stack

- **Astro** (TypeScript, Strict mode) — static site generator
- **anime.js v4** — the animation library (imported as `import { animate, utils } from 'animejs'`)
- **pnpm** — package manager
- **No CSS framework** — pure CSS with custom properties (design tokens in `src/styles/tokens.css`)
- **No frontend framework integrations** — vanilla TS for scripts

## The Narrative (3 Acts)

### Act 1: Hero
Title "Orion Spacecraft" appears with sequential fade-ins. Subtitle mentions Wiseman, Glover, Koch, Hansen, "and you". A "SCROLL TO BEGIN" hint pulses at the bottom.

### Act 2: Orion Theater (sticky scroll, 500vh tall)
A sticky stage where the user controls a scroll-bound animation. The spacecraft progresses through 4 phases tied to scroll progress (0–1):

- **0.00–0.15 — APPROACH**: Module fades in, scales from 0.4 to 1.0, slight rotation correction.
- **0.15–0.55 — SEPARATION**: 5 parts separate from each other. Labels appear next to each part.
- **0.55–0.85 — REASSEMBLY**: Parts return to their assembled positions. Labels fade out.
- **0.85–1.00 — DEPARTURE**: Module fades out, scales down to 0.2, tilts away.

HUD overlays during this act: phase indicator (bottom-left), telemetry (top-right), progress dots (right side).

The Orion module is composed of **5 PNG layers** stacked with `position: absolute`:
1. `orion-las.png` — Launch Abort System (top)
2. `orion-crew.png` — Crew Module
3. `orion-service.png` — Service Module
4. `orion-solar.png` — Solar Arrays
5. `orion-adapter.png` — Spacecraft Adapter (bottom)

All 5 PNGs share the same canvas dimensions (1024×1024) so they stack perfectly when overlaid.

### Act 3: Passport
Heading appears. A passport book is shown. Three triangular badges fall as stamps with stagger and spring physics. Each impact triggers a shockwave ring and a short screen shake for visual feedback. Download buttons fade in after all stamps land. Final note signs off with "RIFA — HONORARY CREW MEMBER".

## Background

Fixed-position parallax stack behind everything:
- `carina.jpeg` (Carina Nebula image) — moves at 0.35× scroll speed, slight hue rotation as user scrolls.
- Star layer — moves at 0.15× scroll speed.
- Violet glow gradient overlay — drifts opposite direction.
- Vignette — static, ensures edges always blend to dark.

## Design Tokens (CSS Variables)

```css
--bg-deep: #04000d;
--bg-mid: #0a0420;
--violet: #8b3fff;
--violet-bright: #b876ff;
--violet-deep: #5b21b6;
--violet-glow: rgba(184, 118, 255, 0.5);
--white: #f5f0ff;
--muted: #a89cc8;
--line: rgba(184, 118, 255, 0.4);
--line-soft: rgba(184, 118, 255, 0.15);
```

## Typography

- **Syncopate** (700) — for big titles (`h1`, `h2`)
- **Space Mono** (400, 700) — for technical/HUD elements, labels, telemetry
- **Inter** (300–700) — for body text

All loaded from Google Fonts in `Layout.astro`.

## Folder Conventions

- **`src/components/<actN-name>/`** — components scoped to one act
- **`src/components/background|nav|footer/`** — global UI
- **`src/scripts/`** — vanilla TypeScript modules, each one a single concern (parallax, choreography, stamp animation)
- **`src/styles/global.css`** — reset + font imports
- **`src/styles/tokens.css`** — only CSS custom properties (no rules)
- **`public/assets/`** — all static images (the 5 Orion parts, Carina, 3 badges)

## Key Technical Decisions

1. **Scroll-bound animations, not time-bound.** The Orion choreography is driven by scroll progress (0–1), not by `setTimeout` or anime.js timelines. This is implemented in `src/scripts/orionChoreography.ts` using `getBoundingClientRect` + `requestAnimationFrame` throttling.

2. **Only `animate` and `utils` are imported from anime.js.** All scroll logic is vanilla TS for full control. anime.js handles only the one-shot animations (stamp drops, hero fade-ins, download buttons reveal).

3. **Stamps fall once per page load.** Triggered by `IntersectionObserver` with a `passportTriggered` flag.

## Personalization

The recipient's name is **RIFA**. It appears in:
- The third badge image (`badge-3.png`, crew patch)
- The final note below the download buttons ("RIFA — HONORARY CREW MEMBER")
- The `crew` download button subtitle ("WGKH · RIFA")

If RIFA needs to change, search and replace in:
- `src/components/act3-passport/PassportSection.astro`
- `src/components/act3-passport/DownloadButtons.astro`

## Commands

- `pnpm install` — install dependencies
- `pnpm run dev` — start dev server (http://localhost:4321)
- `pnpm run build` — production build to `dist/`
- `pnpm run preview` — preview the production build locally

## Working Style for Claude Code

When working on this project:

1. **Read this file first** every session to understand the architecture.
2. **Use design tokens** from `tokens.css` — never hardcode hex colors in components.
3. **Keep components small and single-purpose**. If a component grows past 200 lines, consider splitting it.
4. **Scripts go in `src/scripts/`** as `.ts` files, imported into Astro components via `<script>` tags with `type="module"`.
5. **Test in `pnpm run dev`** after every change. If the page doesn't render correctly, check the browser console first.
6. **Performance**: scroll handlers must be RAF-throttled. Heavy DOM queries must be cached outside the scroll loop.
