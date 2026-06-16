# Orchestra — Design Direction

> Chosen by **ui-ux-pro-max** (vibrant query). Source of truth for the app, the deck,
> and any Figma tokens. Direction: **vibrant, energetic, animation-forward, premium** —
> a light, block-based landing page with an animated aurora hero. NOT a flat dashboard.

## Style
- **Family:** Vibrant & Block-based + **Aurora UI** hero (mesh gradients, flowing motion).
- **Pattern:** Scroll-triggered storytelling — each section reveals on scroll.
- **Mode:** Light (vibrant on white), with deep-indigo ink for the hero/CTA blocks.
- **Feel:** bold geometric blocks, large type, duotone accents, generous 48px+ gaps.

## Color tokens (hex)
```
--bg:            #FFFFFF   /* page */
--bg-muted:      #F5F3FF   /* alternating sections (light indigo) */
--ink:           #1E1B4B   /* hero/CTA dark blocks, deep indigo */
--fg:            #1E1B4B   /* primary text on light */
--fg-muted:      #64748B   /* secondary text */
--fg-on-dark:    #F8FAFC   /* text on ink/aurora */
--primary:       #6366F1   /* indigo */
--violet:        #8B5CF6
--fuchsia:       #D946EF
--cyan:          #22D3EE
--accent:        #EA580C   /* energetic orange — primary CTA */
--success:       #10B981   /* live counter pulse */
--card:          #FFFFFF
--border:        #E0E7FF
--ring:          #6366F1
```
**Gradients:**
- `--grad-aurora`: mesh of `#6366F1 → #8B5CF6 → #D946EF → #22D3EE` (animated 10s loop).
- `--grad-brand`: `linear-gradient(135deg,#6366F1,#8B5CF6,#D946EF)` (headings, accents).
- Primary CTA: solid `--accent` (#EA580C) for max contrast against indigo.

## Typography
- **Heading:** **Space Grotesk** (600/700) — distinctive, techy, dev-tool-appropriate.
- **Body:** **DM Sans** (400/500/700) — highly readable.
- **Numeric (counter, code-ish):** **Space Mono** or JetBrains Mono — tabular figures.
- Scale: 14 / 16 / 18 / 24 / 32 / 48 / 64+. Headline `clamp(2.5rem, 6vw, 4.5rem)`,
  tracking-tight, 2-3 lines max.
- All via `next/font/google`.

## Motion language (animation-forward)
- **Hero aurora:** animated mesh gradient, 10-12s smooth loop (`background-position`).
- **Headline:** word-stagger entrance, 30-50ms per word, ease-out, 250ms.
- **Scroll reveals:** sections fade + translate-up 16px on enter (ease-out, 250ms),
  feature cards staggered.
- **Hover physics:** feature blocks scale 1.03 + brand-gradient border on hover (200ms).
- **Live counter:** Motion count-up animation when it enters view; success-green pulse dot.
- **Logo strip:** infinite marquee (continuous).
- **CTA:** scale 0.97 on press. Respect `prefers-reduced-motion` everywhere.
- Use `transform`/`opacity` only. Micro-interactions 150-300ms; exits ~70% of enter.

## Sections (top → bottom)
1. **Nav** — floating glass pill: wordmark left, anchor links center, "Join waitlist" (orange) right.
2. **Hero** — full-bleed animated aurora; headline "Conduct your AI agents.", subhead,
   inline email capture + live counter "**{N} builders already in line**"; two CTAs.
3. **Logo strip** — "Built by teams shipping with agents" + infinite logo marquee.
4. **Feature trio** — 3 bold duotone blocks: *Orchestrate* · *Async + Sync* · *Quality gates*,
   each with a Lucide icon, short copy, hover lift.
5. **How it works** — 3 steps (Brief → Fan out → Ship), connected by a line, scroll-revealed.
6. **Waitlist CTA** — large indigo/aurora block, repeated email form + the live counter.
7. **Footer** — wordmark, minimal links, copyright.

## Guardrails (ui-ux-pro-max checklist)
- SVG icons (Lucide), never emoji. cursor-pointer on clickables. Hover 150-300ms.
- Text contrast ≥4.5:1 (verify orange/indigo on their backgrounds). Visible focus rings.
- `prefers-reduced-motion` respected. Responsive at 375 / 768 / 1024 / 1440.
- One primary CTA per section (the orange "Join waitlist").
