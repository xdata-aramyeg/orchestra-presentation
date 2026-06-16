# Claude Design Prompts — Orchestra (taste-calibrated)

These prompts are run through the **taste skill** discipline (`design-taste-frontend`):
state a design read, lock one accent, kill the AI-tells (Inter, AI-purple, generic
glass, dead grid cells). The skill scopes *itself* out of dashboards — so we borrow
its **color + type + anti-slop calibration**, not its landing-page architecture.

---

## Design Read (declare this first — it's what keeps the output intentional)

> **Reading this as:** a developer-tool **product dashboard** (AI agent monitoring)
> for a **mixed eng + non-eng** audience, with a **calm dark-tech** language,
> leaning toward a **restrained custom palette + Geist / Geist Mono + minimal,
> functional motion.**

Dials (from the taste skill, tuned for a cockpit UI):
`DESIGN_VARIANCE 5` · `MOTION_INTENSITY 3` · `VISUAL_DENSITY 6`
(A dashboard is *legible density*, not artsy chaos — symmetry and clarity win.)

---

## Locked design tokens (paste these verbatim into the prompt)

**One accent, locked page-wide. Status hues are functional/semantic only — desaturated, never competing with the accent.**

```
/* Neutrals — near-black, faintly warm to harmonize with terracotta */
--bg:            #0C0C0E   /* page */
--surface:       #161619   /* panels */
--surface-raised:#1D1D21   /* cards on panels */
--border:        #2A2A30
--text:          #ECECEE   /* primary */
--text-muted:    #9A9AA2   /* secondary */

/* THE accent — Claude terracotta. Orchestrator + primary actions ONLY. */
--accent:        #D97757

/* Functional status — semantic, muted (<80% sat). Not decorative accents. */
--status-run:    #6E9E78   /* running / healthy  (muted sage) */
--status-wait:   #C9A24B   /* waiting / blocked  (muted amber) */
--status-async:  #5B7A99   /* async / background (muted slate-blue) */
--status-idle:   #6B6B73   /* idle               (grey) */
```

**Typography:** `Geist` for UI + display, `Geist Mono` for all data — metrics,
timestamps, agent IDs, task counts. (Mono-for-data is the single highest-leverage
"this is a real dev tool" signal.) **No Inter.**

**Hard bans (tell the design tool explicitly):** no AI-purple/violet glow, no
centered-hero-over-mesh, no generic glassmorphism on every panel, no neon
gradients, no Inter, no `SECTION 01` style meta-labels, no empty/dead grid cells,
no invisible low-contrast button text.

---

## Prompt 1 — Primary product mockup (the "money shot")

> **Design read:** developer-tool product dashboard for a mixed technical audience,
> calm dark-tech language, Geist + Geist Mono, minimal functional motion. Density 6,
> variance 5, motion 3.
>
> **Design a desktop web dashboard called "Orchestra" — a control room for a team
> of AI coding agents working together on a software project.** 1440px wide,
> shippable-product screenshot quality. Use the locked tokens below; do not
> introduce other colors.
>
> **Tokens:** bg `#0C0C0E`, panels `#161619`, raised cards `#1D1D21`, borders
> `#2A2A30`, text `#ECECEE` / muted `#9A9AA2`. **Single accent** terracotta
> `#D97757`, used ONLY for the orchestrator and the primary action. Functional
> status colors (semantic only, muted): running `#6E9E78`, waiting `#C9A24B`,
> async/background `#5B7A99`, idle `#6B6B73`. Type: **Geist** for UI, **Geist Mono**
> for every number/timestamp/ID. Rounded-12px corners, 1px borders, soft shadows,
> generous spacing.
>
> **Layout — three columns:**
> 1. **Left rail (narrow) — team roster.** Five agent cards: small geometric glyph,
>    role name, live status pill. Orchestrator (terracotta, "Coordinating"),
>    Researcher/BA (idle→done), Developer (running, subtle progress shimmer),
>    QA ("Waiting on Dev", amber), Reviewer ("Idle", grey).
> 2. **Center (widest) — "Async Workstream" swimlane.** One horizontal lane per
>    agent on a shared time axis. Task blocks left-to-right with dependency arrows:
>    Researcher's block feeds two PARALLEL Developer blocks; QA's block drawn as
>    queued/blocked waiting on Dev; a dashed vertical line labeled
>    **"Orchestrator checkpoint — wait for all"** where lanes converge. Mark some
>    blocks "parallel", one "background". This is the hero element — it must read,
>    at a glance, as *parallel async work with one controlled sync barrier.*
> 3. **Right rail — "Agent Messages" feed.** Chat-like inter-agent messages with
>    role chips + Geist Mono timestamps. e.g. *Orchestrator → Developer: "Proceed
>    on layout, QA validates after." / Developer → QA: "Branch ready." /
>    Researcher → Orchestrator: "3 reference dashboards attached."* Highlight one as
>    a "blocking handoff."
>
> **Top bar:** "Orchestra · Sprint 14", global status "3 active · 1 waiting · 1 idle",
> one terracotta primary button "New Task → Orchestrator."
> **Bottom metrics strip (Geist Mono):** "Tasks in flight: 4" · "Parallel
> efficiency: 3.2×" · "Review pass rate: 96%" · "Avg sync latency: 1.4s".
>
> Realistic copy, not lorem ipsum. Motion: only a soft pulse on the "running" pill
> and a faint shimmer on the active task block — nothing decorative. Prioritize
> legibility of the async-vs-sync story above all.

---

## Prompt 2 — Hero / title-slide visual

> **Design read:** title-slide hero for a tech talk, calm dark-tech, same locked
> palette, near-static (motion 2). NOT a landing page — a single cinematic graphic
> with room for a title overlay.
>
> **Design a 16:9 title hero for a talk titled "Agent Teams in Claude Code."**
> Background `#0C0C0E`. Centerpiece: a restrained node graph — one larger node
> "Orchestrator" in terracotta `#D97757`, connected to four satellite nodes
> "Researcher," "Developer," "QA," "Reviewer" in neutral `#ECECEE`. Solid lines =
> sync handoffs; dashed lines = async. Subtle constellation/grid texture behind,
> deep radial vignette — **no mesh-gradient, no purple glow.** Lots of negative
> space top-left for a title. Geist for any labels. Quiet, premium, engineered —
> not flashy.

---

## How to use these live

1. Paste **Prompt 1** into Claude Design → generate. The stated design read + locked
   tokens are what make it come back intentional instead of templated.
2. If a variant drifts (introduces a color, wraps the H1 badly, adds glass
   everywhere), say one line: *"Re-read: single terracotta accent only, Geist Mono
   for data, kill the glass."* — that's the taste-skill correction loop.
3. Pick the cleanest dashboard → that becomes your Figma reference and the artifact
   your dev agents rebuild. Same tokens carry into Figma variables, so the whole
   demo stays one branded system.
