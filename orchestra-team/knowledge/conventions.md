# Conventions — the stack every agent follows

> Read before writing or reviewing any code. These are non-negotiable for the
> Orchestra launch site. Match what's here; don't introduce parallel patterns.

## Stack
- **Next.js App Router** + **TypeScript**. Route handlers for the API
  (e.g. `app/api/waitlist/route.ts`). Server components by default; `'use client'`
  only where interactivity/animation requires it.
- **Tailwind** for styling — utility-first, tokens bound via CSS variables (below).
- **shadcn/ui** for primitives (button, input, etc.) — compose, don't re-invent.
- **Motion** (`motion/react`) for animation — `transform`/`opacity` only.
- **better-sqlite3** for persistence — **parameterized queries only**, never string
  interpolation into SQL.
- **zod** for validation at every request/input boundary; reject bad input with a
  clear, non-leaky message.

> Note: this project pins a version of Next.js with **breaking changes** from the
> familiar API. Before writing framework code, read the relevant guide under
> `node_modules/next/dist/docs/` and heed deprecation notices — don't rely on
> memory for App Router/route-handler specifics.

## Code style
- **Immutable patterns** — return new objects, never mutate inputs/props/state.
- **Small files** — under 400 lines; many small, focused files over few large ones.
  Keep functions small; extract utilities.
- **No `console.log`** in committed code.
- **No hardcoded secrets** — read config from the environment; fail loudly if a
  required var is missing.
- Validate inputs at boundaries; handle errors meaningfully (no silent catches).

## Locked design tokens (from `orchestra-site/DESIGN.md`)

Direction: **vibrant, block-based, animation-forward, light mode** with an animated
aurora hero and deep-indigo ink blocks. Designer and Frontend must stay on-system —
bind to these, don't eyeball new values.

### Color (hex)
```
--bg:          #FFFFFF   /* page */
--bg-muted:    #F5F3FF   /* alternating sections (light indigo) */
--ink:         #1E1B4B   /* hero/CTA dark blocks, deep indigo */
--fg:          #1E1B4B   /* primary text on light */
--fg-muted:    #64748B   /* secondary text */
--fg-on-dark:  #F8FAFC   /* text on ink/aurora */
--primary:     #6366F1   /* indigo */
--violet:      #8B5CF6
--fuchsia:     #D946EF
--cyan:        #22D3EE
--accent:      #EA580C   /* energetic orange — primary CTA */
--success:     #10B981   /* live counter pulse */
--card:        #FFFFFF
--border:      #E0E7FF
--ring:        #6366F1
```
Gradients:
- `--grad-aurora`: mesh `#6366F1 → #8B5CF6 → #D946EF → #22D3EE` (animated 10s loop).
- `--grad-brand`: `linear-gradient(135deg,#6366F1,#8B5CF6,#D946EF)` (headings, accents).
- Primary CTA: solid `--accent` (#EA580C).

### Typography (all via `next/font/google`)
- **Heading:** **Space Grotesk** (600/700) — distinctive, techy.
- **Body:** **DM Sans** (400/500/700) — highly readable.
- **Numeric (counter, code-ish):** **Space Mono** — tabular figures.
- Scale: 14 / 16 / 18 / 24 / 32 / 48 / 64+. Headline `clamp(2.5rem, 6vw, 4.5rem)`,
  tracking-tight.

### Motion + guardrails
- Aurora hero loops 10–12s; word-stagger headline; scroll reveals (fade + 16px up);
  hover lift 1.03; count-up live counter; logo marquee. Micro-interactions 150–300ms.
- **Respect `prefers-reduced-motion` everywhere.** SVG icons (Lucide), never emoji.
- Text contrast ≥ 4.5:1; visible focus rings; responsive at 375 / 768 / 1024 / 1440.
- One primary CTA per section (the orange "Join waitlist").
