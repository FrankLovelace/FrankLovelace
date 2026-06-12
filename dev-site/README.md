# Frank Lovelace — microscope journey portfolio

A continuous-zoom portfolio: scrolling racks up magnification through five levels
(naked eye → optical → SEM → TEM → diffraction). Past the SEM line everything goes
grayscale — electrons carry no color.

**Stack:** Astro 6 · TypeScript · GSAP ScrollTrigger · Three.js · 3Dmol.js · vanilla CSS.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/ (deploy with your own pipeline)
npm run preview
```

## Where to put your real content (all marked `TODO`)

| File | What |
| --- | --- |
| `src/data/projects.ts` | Projects: titles, EN/ES descriptions, GitHub/demo URLs, optional CIF per card |
| `src/data/videos.ts` | Instagram/TikTok video links + titles |
| `src/data/publications.ts` | Papers (status: `in-progress` / `preprint` / `published`, DOI/arXiv links) |
| `src/data/links.ts` | GitHub / LinkedIn / Instagram + art & personal site URLs |
| `public/structures/*.cif` | Crystal structures rendered by the 3D viewers (see below) |
| `src/i18n/en.ts`, `es.ts` | Every UI string, bio paragraphs, the hero quote |

## Adding a language (3 steps)

1. Create `src/i18n/<code>.ts` (copy `es.ts`, it is type-checked against `en.ts`).
2. Register the locale in `astro.config.mjs` → `i18n.locales` and in `src/i18n/index.ts`.
3. Add `src/pages/<code>/index.astro` (copy `src/pages/es/index.astro`).

## CIF viewers render full Bravais cells

`src/scripts/bravais.ts` reconstructs the conventional unit cell before rendering,
so atoms appear everywhere they belong (a corner atom shows at all 8 corners):

1. **Symmetry operators** — if the CIF has `_symmetry_equiv_pos_as_xyz` /
   `_space_group_symop_operation_xyz`, the full orbit is generated from the
   asymmetric unit (validated against α-quartz: Si–O 1.605/1.613 Å).
2. **Lattice centering** — otherwise the centering letter of
   `_symmetry_space_group_name_H-M` (P/A/B/C/I/F/R) adds the centering
   translations; an explicit `_bravais_centering F` tag overrides both.
3. **Boundary replication** — atoms at fract 0 are mirrored to 1 per axis
   (corner → ×8, edge → ×4, face → ×2), and the cell box is drawn.

`nacl.cif` shows route 2 (2-atom motif + `F m -3 m` → 27 rendered atoms);
`Silicon-Dioxide.cif` is an explicit P1 cell (route 3 only).

## How the zoom works

- `src/scripts/zoom-journey.ts` — pinned stage; each scene declares a focal reticle
  (`.focal__ring`). The next scene renders live behind it, clipped to a circle locked
  to the same point, while GSAP scrubs the current scene up to 22× scale. The depth-field
  canvas recycles dust particles across scales so motion never breaks.
- Mobile (<900px), `prefers-reduced-motion`, and no-JS all get a fully readable
  stacked layout (`data-journey="static"`), with reveal-on-scroll only.
- The pro/pop color toggle (`data-mode`) deliberately stops mattering below the
  SEM threshold (`--grayness` drives the chrome crossover).
