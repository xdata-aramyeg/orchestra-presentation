# Design Brief — Orchestra (self-referential, Russian, high-end editorial)

> Art direction for the rebuild. Frontend executes this AND runs `high-end-visual-design` +
> `design-taste-frontend` to refine it. The bar: looks like a **$150k agency / editorial
> feature**, not "a template with nice fonts." Reviewed by screenshot each round.

## Vibe (locked) — Editorial Luxury, LIGHT
- **NOT dark. No AI-slop.** Banned: OLED-black backgrounds, neon/purple glows, radial mesh
  "AI orbs," centered-hero-over-gradient, glassmorphism everywhere, generic 1px gray borders,
  harsh dark shadows, edge-to-edge sticky navbars, symmetric 3-column Bootstrap grids.
- **Canvas:** warm paper. Background `#FBFAF7` (warm off-white); alt sections `#F3F0E9`.
  Ink text `#1A1714`. A subtle fixed **film-grain** overlay (`opacity ~0.03`, pointer-events
  none) for a physical, printed feel.
- **One accent, used sparingly:** an editorial **vermilion/terracotta** `#C5482F` (warm, print-
  like) — for the eyebrow tags, links, and one CTA. Optional secondary ink-tint `#3B3A36`.
  No second bright color. (If `design-taste-frontend` argues for a different single accent,
  fine — but keep it warm/editorial, never blue/purple.)

## Typography (Cyrillic is mandatory — all of these have Cyrillic on Google Fonts)
- **Display / headings:** **Unbounded** (variable, expressive, has Cyrillic) — big, confident.
  *Alternative editorial-serif option:* **Cormorant** or **Playfair Display** if a more
  classic-magazine feel reads better (both have Cyrillic). Pick ONE display family.
- **Body / UI:** **Onest** (or **Manrope** / **Golos Text**) — clean, modern, excellent
  Cyrillic. Generous line-height (1.6).
- **Mono (technical labels — tools, MCP names, agent handles, code-ish):** **JetBrains Mono**
  (has Cyrillic).
- All via `next/font/google`. Verify each renders Cyrillic before shipping. **No Inter/Roboto/
  Arial/Helvetica/Open Sans.**

## Layout & components (from high-end-visual-design)
- **Macro-whitespace:** sections `py-24` → `py-40`. Let it breathe. Max content width ~`1200px`.
- **Eyebrow tags:** tiny pill before major headings — `rounded-full px-3 py-1 text-[10px]
  uppercase tracking-[0.2em]` in the accent.
- **Double-bezel cards:** every major card/agent-card = outer shell (warm tint, hairline ring,
  small padding, `rounded-[2rem]`) + inner core (own fill, inset highlight, concentric smaller
  radius). No flat cards on the background.
- **Island buttons:** fully-rounded pills, generous padding; trailing arrow lives in its own
  nested circle ("button-in-button"); press `active:scale-[0.98]`.
- **Icons:** ultra-light line icons only (Phosphor Light / Remix Line). No thick Lucide.
- **Asymmetry:** prefer an editorial split or asymmetric bento over symmetric grids; break
  monotony. Collapses to single-column `w-full px-4` below `768px`; `min-h-[100dvh]` not `h-screen`.

## Motion (tasteful, not flashy)
- Custom cubic-bezier only (e.g. `cubic-bezier(0.32,0.72,0,1)`); never `linear`/`ease-in-out`.
- Scroll entry: gentle heavy fade-up with slight blur (`translate-y-16 blur-md opacity-0` →
  settled) via Motion `whileInView` / IntersectionObserver. Stagger lists.
- `transform`/`opacity` only. `backdrop-blur` only on fixed nav/overlays. Respect
  `prefers-reduced-motion`. Numeric counters animate up.

## What it must feel like
A beautifully typeset **engineering field-notes / case study** with real personality —
confident Cyrillic display headlines, warm paper, refined cards, and honest storytelling
(including the mistakes). Quiet, premium, intentional. If it could be a generic AI landing
page, it has failed.
