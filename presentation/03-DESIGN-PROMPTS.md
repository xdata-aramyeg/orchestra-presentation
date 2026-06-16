# Design Tooling Workflow — Orchestra (ui-ux-pro-max → Figma → magic MCP)

How the Orchestra site got its look — and how to narrate it on stage. Design here is
**three jobs done by three tools**, split across two agents:

| Job | Tool | Agent | Output |
|---|---|---|---|
| **Decide** the system | `ui-ux-pro-max` skill | Designer | style, palette, type, motion → `DESIGN.md` |
| **Store** it as tokens | Figma MCP | Designer | a Figma file + token variables (read back as code) |
| **Generate** components | 21st.dev magic MCP | Frontend | animated hero / form / feature trio (shadcn + Tailwind) |

This maps to **slide 5 (Design tooling)** in the deck. The point for the audience: *three
tools because design is three jobs — decide, store, generate.*

---

## Step 1 — Decide: ui-ux-pro-max (Designer agent)

`ui-ux-pro-max` is a design-system generator skill. The Designer hands it a brief; it
returns a concrete, opinionated system — not a templated guess.

**The brief used:**

> Launch landing page for a developer-facing **agent-orchestration product, "Orchestra."**
> Vibrant, energetic, animation-forward, premium — avoid generic AI-slop. Needs a hero
> with email capture + a live waitlist counter, a feature trio, a how-it-works, a logo
> strip, and a footer.

**What it chose** (recorded verbatim in `orchestra-site/DESIGN.md` — the source of truth
for the app, the deck theme, and the Figma tokens):

- **Style:** Vibrant & block-based + an **Aurora UI** hero (animated mesh gradients),
  light mode on white with deep-indigo ink blocks. Scroll-triggered storytelling.
- **Motion:** animated aurora (10–12s loop), word-stagger headline, scroll fade+rise
  reveals, hover lift on feature blocks, a Motion **count-up** on the live counter,
  infinite logo marquee. `transform`/`opacity` only; `prefers-reduced-motion` respected.

> **Stage line:** "I didn't pick these colors. A skill did — given a one-paragraph brief,
> it returned a whole design system: palette, fonts, motion. That's taste, on tap."

---

## The chosen palette (locked — used across app, deck, and Figma)

```
/* Surfaces */
--bg:            #FFFFFF   /* page */
--bg-muted:      #F5F3FF   /* alternating sections (light indigo) */
--ink:           #1E1B4B   /* hero/CTA dark blocks, deep indigo */
--card:          #FFFFFF
--border:        #E0E7FF

/* Text */
--fg:            #1E1B4B   /* primary on light */
--fg-muted:      #64748B   /* secondary */
--fg-on-dark:    #F8FAFC   /* on ink / aurora */

/* Brand spectrum (the aurora) */
--primary:       #6366F1   /* indigo */
--violet:        #8B5CF6
--fuchsia:       #D946EF
--cyan:          #22D3EE

/* Action + state */
--accent:        #EA580C   /* energetic orange — THE primary CTA ("Join waitlist") */
--success:       #10B981   /* live-counter pulse dot */
--ring:          #6366F1   /* focus ring */
```

**Gradients**
- `--grad-aurora`: animated mesh `#6366F1 → #8B5CF6 → #D946EF → #22D3EE` (10s loop) — the hero.
- `--grad-brand`: `linear-gradient(135deg, #6366F1, #8B5CF6, #D946EF)` — headings, accents.
- **Primary CTA stays solid `--accent` (#EA580C)** for max contrast against the indigo.

**Typography**
- **Headings:** **Space Grotesk** (600/700) — distinctive, techy, dev-tool-appropriate.
- **Body:** **DM Sans** (400/500/700) — highly readable.
- **Numeric (the counter):** **Space Mono** / JetBrains Mono — tabular figures.
- All via `next/font/google`. Headline `clamp(2.5rem, 6vw, 4.5rem)`, tracking-tight.

**Guardrails (the ui-ux-pro-max checklist):** Lucide SVG icons, never emoji · contrast
≥4.5:1 (verify orange/indigo) · visible focus rings · `prefers-reduced-motion` respected ·
responsive at 375 / 768 / 1024 / 1440 · **one primary CTA per section** (the orange "Join
waitlist").

---

## Step 2 — Store: the Figma file (Designer agent, via Figma MCP)

The design **lives in Figma** so the Frontend can read it back as real tokens — code
matches design instead of eyeballing a screenshot.

**⚠️ Rate-limit lesson (the one operational gotcha):** the Figma MCP enforces a per-seat
rate limit, and we hit it by making **many small `use_figma` calls**. The fix is to
**consolidate**: do the whole token setup in *one* script, the hero layout in a *second*.
Two large calls, not twenty small ones.

1. **Load the `figma-use` skill first** — it's mandatory before any `use_figma` call.
2. **One consolidated `use_figma` script** creates all token variables from the palette
   above (surfaces, text, brand spectrum, action/state) in a single pass.
3. **A second consolidated script** lays out one hero frame using those tokens (so there's
   something visual to show, and the tokens are proven in use).
4. **`get_variable_defs`** returns the tokens — this is the live "Claude reads the design
   back" moment. If you're rate-limited on stage, show `backup/figma-tokens.png` instead.

> **Stage line:** "The design isn't a picture — it's data. Through MCP, the next agent
> reads these exact hex values and spacing out of Figma."

---

## Step 3 — Generate: components with magic MCP (Frontend agent)

The Frontend turns the design into real, animated components with the **21st.dev magic
MCP** — high-quality shadcn + Tailwind output, fast.

- **`21st_magic_component_builder`** for the hero (animated, with email capture + the live
  counter slot), the waitlist form, the feature trio, and the how-it-works steps.
- **`logo_search`** for the logo-strip marquee.
- The Frontend feeds magic the **DESIGN.md tokens + the Figma values** it read back, so
  generated components land on-palette (indigo/aurora, orange CTA) and on-type (Space
  Grotesk / DM Sans / Space Mono) — not magic's defaults.
- Motion is layered per the DESIGN.md motion list: aurora loop, word-stagger headline,
  scroll reveals, hover lift, the count-up counter.

> **Stage line:** "Now it generates the actual components — and because it's reading our
> tokens, they come back *in our brand*, not a generic template."

---

## Section spec the components target (from DESIGN.md)

1. **Nav** — floating glass pill: wordmark left, anchor links center, orange "Join
   waitlist" right.
2. **Hero** — full-bleed animated aurora; headline "**Conduct your AI agents.**", subhead,
   inline email capture + live counter "**{N} builders already in line**", two CTAs.
3. **Logo strip** — "Built by teams shipping with agents" + infinite marquee.
4. **Feature trio** — three duotone blocks: *Orchestrate · Async + Sync · Quality gates*,
   Lucide icon each, hover lift.
5. **How it works** — three steps (Brief → Fan out → Ship), connected by a line, scroll-revealed.
6. **Waitlist CTA** — large indigo/aurora block, repeated email form + the live counter.
7. **Footer** — wordmark, minimal links, copyright.

---

## How to use this live (mapped to the demo)

- **On slide 5**, walk the three steps above in order — decide / store / generate — and
  name the tool for each. That's the whole "why three tools" beat.
- The Designer's Step 1–2 work happens during **Wave 1**; the Frontend's Step 3 happens
  during **Wave 2**. So this doc is also the script for narrating those two panes.
- **Every beat has a fallback:** DESIGN.md is already written (Step 1 can't fail the
  story); `backup/figma-tokens.png` covers a Figma rate limit (Step 2); the pre-built base
  app already contains on-brand components if magic MCP is slow (Step 3).
