# Round-2 Enhancements (after the base rebuild)

> Sourced from `knowledge/research-ideas.md`. Layer these onto the base site once Frontend's
> first pass is in and reviewed. **Hard rule: every self-referential element must map to
> something that actually happened** (real mailbox messages, real course-corrections, real git
> log). Fabricated "making-of" content would destroy the whole point.

## P1 — signature, build these first
1. **"Watch the agents talk" message thread** — the signature scroll moment. Real Lead↔teammate
   messages reveal one bubble at a time on scroll (teammates left, Lead right; mono handles;
   terracotta on the Lead). `<MessageThread>` fed by a JSON of real excerpts + a "▶ replay" pill.
   *(Lead/PM compiles the real excerpts from this session — see data note below.)*
2. **Provenance bylines** — each section gets a mono chip: `сверстал @scenographer · проверил
   @diapason · ревью @reviewer`. `<Byline>` component, data-driven.
3. **"Кладбище ошибок" (Mistakes Graveyard)** — give the mistakes content a form: "headstone"
   double-bezel cards (problem → lesson → rule), engraved/desaturated. Maps over
   `knowledge/course-corrections/`.
4. **Two-wave org chart / flow diagram** — inline SVG; hover a node (Маэстро/Либреттист/…)
   highlights its lane + files-owned, dims the rest; BARRIER + idle-during-QA bands called out;
   nodes link to `/agents/[slug]`; path draws on scroll.

## P2 — high polish
5. **Build timeline / changelog** — vertical dated timeline of the real build (Wave 1 → barrier
   → QA → reset v1→v2). Seed from the real `git log`. Sticky date rail, fade-up entries.
6. **v1 → v2 before/after** — we reset v1 because it "looked so bad"; show it. Draggable
   clip-path slider of v1 vs v2 hero (v1 lives on `archive/v1-build`). Turns the failure into a feature.
7. **Real proof counters** — agents (6), waves (2), QA cycles, mistakes logged, skills/MCP/
   plugins used. `useInView` count-up, snaps to final under reduced-motion.
8. **Toolbelt wall** — skills/MCP/plugins as mono chips grouped by kind, each expands to "что
   делал на этом сайте"; filter by agent → ties to the org chart.

## P3 — easter eggs (optional, cheap, memorable)
9. **Hidden terminal** — press `~`/`/` → in-page overlay (NOT native alert/confirm — breaks QA
   automation + a11y), prints roster / `whoami → "сайт, который построил себя"`. Focus trap + Esc.
10. **Footer build signature** — "Сделано командой агентов" + real git short-hash + build date.
11. **Breathing grain** — very slow opacity drift on the film-grain; off under reduced-motion.

## Business/narrative (fold into copy where it fits)
- Honest ROI framing: ~2.5–3.5× avg / 4–6× top-quartile *with token cost counted*; the win is
  fewer review cycles. The 17% "collaboration gap" + review-bottleneck data justifies our gates.
- Best lines: "Reviewer can't edit, so it can't hide a bug by fixing it." · "Six narrow roles
  beat one omniscient prompt." · "We made the product document its own construction, mistakes included."

## Data note (Lead/PM to compile, from THIS session — all real)
- **Message thread excerpts:** e.g. Lead→devs "fan out Wave 2"; Backend "11/11 DB checks pass";
  QA "PASS 9/10, AC10 needs restart"; the human "this is awful — you should be orchestrating";
  "this looks so bad"; the reset. Keep them true to what was said.
- **Timeline events:** brainstorm → spec → plan → v1 build → "looks so bad" → Figma rate-limit →
  full reset → team redefined (5 roles, Opus) → idle-during-QA rule → Russian pivot → rebuild.
- **Mistakes:** the 4 course-corrections + the bad-Figma/rate-limit + the dark AI-slop reset.

## Guardrails (keep)
One signature scroll moment, everything else restrained. Contrast ≥4.5:1. Everything
`prefers-reduced-motion`-safe. Verify Cyrillic renders. Don't oversell ROI — honesty persuades.
