# Orchestra — Live Agent-Team Demo (Design Spec)

**Date:** 2026-06-17
**Purpose:** A company tutorial on Claude Code's **Skills · MCP · Plugins · Agent Teams**,
structured so the talk's *form mirrors its content*: an agent team builds a real
product **asynchronously in the background while the presenter shows slides**, with
the orchestrator enforcing **synchronous checkpoints**. Audience *watches*
async-vs-sync instead of hearing about it.

## 1. Concept

The team builds a **launch landing page + working waitlist backend** for a fictional
product called **"Orchestra"** (an agent-orchestration tool). Self-referential: AI
agents build the launch site for an agent-team product.

The build genuinely needs a team — design, frontend, and backend run in parallel and
must be coordinated and quality-gated. That justification is the whole point.

**Decisions (locked):**
- Product: self-referential "Orchestra" launch site.
- Stack: **Next.js (App Router) full-stack + SQLite** — one app, one local DB, nothing
  external to fail on stage.
- Choreography: **live async build during the slides**, with a pre-built golden copy
  as the safety net.
- Live scope: **extend a pre-built base** — the team adds the waitlist + live counter
  feature on stage (finishes in talk-time, low risk, still genuinely live).
- Slides: **rendered reveal.js HTML deck**, styled to match the chosen design direction.
- **Design direction is owned by ui-ux-pro-max** — NOT a predetermined palette. Aim
  for a **vibrant, animation-rich** landing page (the opposite of a flat dashboard),
  with components generated via the **21st.dev magic MCP**.

## 2. The product (what gets built)

### 2.1 Frontend (landing page)
Sections: hero (tagline + email capture), feature trio, "how it works" 3-step, logo
strip, waitlist form, footer. **Vibrant and animation-rich** — scroll reveals, hover
physics, an animated hero, a live-counting waitlist number. The visual direction
(style family, palette, type, motion language) is set by **ui-ux-pro-max**, not
hardcoded here. Built from **magic MCP** components.

### 2.2 Backend (the waitlist — the live feature)
- `POST /api/waitlist` → validate email with **zod** → insert into SQLite (unique
  email, dedup) → return `{ position }`.
- `GET /api/waitlist/count` → returns total → feeds a live "**N builders waiting**"
  counter on the hero.
- DB: `better-sqlite3`, table `waitlist(id, email UNIQUE, created_at)`. Parameterized
  queries (no string interpolation).

### 2.3 Stack
Next.js App Router · TypeScript · Tailwind · shadcn/ui (magic MCP outputs this) ·
**Motion** (`motion/react`) for animation · `better-sqlite3` · zod. Immutable patterns,
small files, errors handled at boundaries.

### 2.4 Design direction (determined by ui-ux-pro-max — not predetermined)
The look is **chosen by the ui-ux-pro-max skill** at build time, not locked in this
spec. Brief to ui-ux-pro-max: a launch landing page for a developer-facing
agent-orchestration product; **vibrant, energetic, animation-forward**; modern and
premium, avoiding generic AI-slop. ui-ux-pro-max selects the style family, color
system, font pairing, and motion language; magic MCP generates the components to match.
The deck (§6) and any Figma tokens (§5) adopt whatever palette ui-ux-pro-max returns,
so the whole demo stays one coherent system. (The earlier dark/terracotta palette is
retired — too flat/robotic for this.)

## 3. The agent team (7 roles)

| Agent | Model | Responsibility | Tooling |
|---|---|---|---|
| **orchestrator** | opus | decompose, fan-out async, enforce sync gates, report state | Agent, SendMessage, Monitor, Task* |
| **researcher** | sonnet | value prop, hero copy, competitor refs, acceptance criteria | WebSearch/WebFetch |
| **designer** | sonnet | style+UX system → Figma file → design tokens + screenshot | **ui-ux-pro-max skill + Figma MCP** |
| **frontend** | sonnet | build the page from the design + tokens | **21st magic MCP** + Figma read (`get_design_context`/`get_variable_defs`) |
| **backend** | sonnet | waitlist API + SQLite + zod validation | Bash, Write, Edit |
| **qa** | sonnet | E2E the signup flow + edge cases (dup email, invalid, empty) | Playwright MCP |
| **reviewer** | opus | read-only: email validation, injection, error leakage, code review | Read, Grep, Bash |

Role separation = independent judgment. Reviewer stays **read-only** (cannot hide a
problem by fixing it). Designer hands off tokens, not opinions; Frontend consumes them.

## 4. Async/sync choreography (the spine)

```
Kickoff (stage): brief orchestrator
   │
   ├─ Wave 1 ── async, parallel ──►  Researcher  ∥  Designer
   │                                  (slides run: pillars + async/sync concept)
   ║ BARRIER: orchestrator waits for BOTH, verifies brief + design exist
   │
   ├─ Wave 2 ── async, parallel ──►  Frontend  ∥  Backend
   │                                  (slides run: design tooling + tmux view)
   ║ BARRIER: feature complete (page renders, API responds)
   │
   ├─ Gate ──►  QA  ── PASS ──►  Reviewer  ── clean ──►  LIVE
   │            (FAIL → back to Frontend/Backend)
   │
   └─ Finale (stage): submit email live → backend returns "#1 on the waitlist"
```

The orchestrator decides parallel-vs-wait. Wave 1 and Wave 2 are independent within
themselves; barriers sit where a dependency or a quality gate requires order.

## 5. Design tooling integration (the three design beats)

1. **ui-ux-pro-max** (Designer agent) — picks style family, color system, font pairing,
   UX guidelines, layout. Produces the *design intent*, not pixels.
2. **Figma MCP** — the design *lives* in Figma: Designer creates the file + token
   variables; Frontend reads it back (`get_design_context`, `get_variable_defs`) so
   code matches design. **Consolidate Figma calls** — we hit the per-seat MCP rate
   limit by making many small ones; batch operations into few large scripts.
3. **21st.dev magic MCP** (Frontend agent) — `21st_magic_component_builder` for the
   hero/form/feature components, `logo_search` for the logo strip. High-quality
   shadcn/Tailwind output, fast.

These map to three slide beats so the audience sees *why* three tools, not one.

## 6. The slide deck (reveal.js)

`presentation/slides/` — a self-contained reveal.js deck (single `index.html` + a
theme CSS adopting the ui-ux-pro-max-chosen palette, so the deck and the product
match). Slides are paced to the waves:
- Opening + kickoff
- Pillars (Skills/MCP/Plugins/Agent Teams) — runs during Wave 1
- Async vs sync — the centerpiece concept
- Design tooling (ui-ux-pro-max → Figma → magic) — runs during Wave 2
- tmux control-room beat
- Plugins (package & share) + business value
- Finale (live waitlist) + close

Each "runs during Wave N" slide has a presenter note: *what the team is doing right now.*

## 7. Repository structure (deliverables)

```
AgentTeams/
├── orchestra-site/                 # the Next.js app (golden base the team extends)
│   ├── app/ (page + api/waitlist)
│   ├── lib/db.ts, lib/schema.ts
│   └── ...
├── orchestra-team/
│   ├── AGENTS.md                   # updated charter (7 roles, 2-wave DAG)
│   ├── .claude/agents/             # add designer, frontend, backend; keep others
│   ├── .claude/skills/spin-up-orchestra/  # wired for ui-ux-pro-max + magic + Figma
│   ├── docs/agent-teams-spec.md
│   └── scripts/tmux-orchestra.sh   # updated for 7 panes / 2 waves
├── presentation/
│   ├── slides/                     # NEW: reveal.js deck
│   ├── 01-TALK-OUTLINE.md          # rewritten for the new choreography
│   ├── 02-DEMO-RUNBOOK.md          # rewritten: kickoff, waves, gates, backups
│   └── 03-DESIGN-PROMPTS.md        # repurposed: ui-ux-pro-max + magic + Figma flow
└── docs/superpowers/specs/2026-06-17-orchestra-demo-design.md
```

## 8. Live-demo plan (primary + backup)

**Primary (live):** pre-built base running locally. On stage, brief the orchestrator;
the team adds the waitlist feature async across the two waves while slides play; finish
with a live email submission.

**Backups (each step):**
- Pre-built **golden** `orchestra-site` with the feature already complete — cut to it
  if the live build slips.
- Pre-recorded tmux run video.
- Pre-generated Figma file + screenshot (so the MCP beat survives a rate limit).
- The deck stands alone if all live tooling fails.

**Pre-flight:** base app runs; SQLite writable; Playwright installed; Figma authed;
magic MCP reachable; deck opens; terminal font bumped; notifications off.

## 9. Success criteria

- The audience can point at the screen and say "those two are running at the same time"
  and "now it's waiting" — async and sync are *visible*.
- The team produces a working waitlist (real persistence) the presenter uses live.
- Each of the four pillars has a concrete on-screen moment.
- The landing page looks **vibrant and alive** (motion, taste) — not a flat dashboard;
  it reads as ui-ux-pro-max-designed, not template AI-slop.
- The whole thing degrades gracefully to backups without breaking the narrative.

## 9b. Execution intent

We **build the full golden version now** (app complete, including the waitlist feature)
and save it as the backup the presenter can switch to live. The on-stage live build
then *extends a base* toward this same golden result — so the backup is always a
correct, finished reference.

## 10. Out of scope (YAGNI)

Auth, email sending, payments, analytics, multi-page routing, deployment to prod,
mobile-native. The waitlist is the single live feature; everything else is static.

## 11. Open risks

- **Live timing** — Wave 2 must finish within the slide budget. Mitigation: extend a
  base (not from scratch), keep the feature small, golden backup ready.
- **Figma MCP rate limit** — consolidate calls; pre-generate the Figma artifact.
- **Tool availability live** (magic/Figma/Playwright) — every beat has a static backup.
