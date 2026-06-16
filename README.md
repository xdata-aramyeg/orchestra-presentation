# Agent Teams in Claude Code — Talk Package

Everything for the company tutorial on **Skills · MCP · Plugins · Agent Teams**, built
around one self-referential act: a **7-agent team builds a vibrant launch landing page +
a real waitlist** for **Orchestra** — a fictional agent-orchestration tool. AI agents
ship the launch site for an agent-team product, **live**, while the presenter talks.

The talk's *form mirrors its content*: the team is kicked off on stage and builds in the
**background (async)** during the slides; the orchestrator stops at **synchronous quality
gates**. The audience watches async-vs-sync happen instead of hearing it described — and
the finale is submitting a real email into the working waitlist on stage.

## What's here

```
AgentTeams/
├── README.md                          ← you are here (start + run order)
├── orchestra-site/                    ← the Next.js app the team extends (+ golden backup)
│   ├── app/                           ← landing page + /api/waitlist (SQLite-backed)
│   ├── DESIGN.md                      ← the ui-ux-pro-max design direction (source of truth)
│   └── ...                            ← Next.js + Tailwind + shadcn + Motion + better-sqlite3 + zod
├── orchestra-team/                    ← the 7-agent team
│   ├── AGENTS.md                      ← team charter + the 2-wave async/sync DAG (read first)
│   ├── docs/                          ← agent-teams spec (the real CC primitives)
│   ├── knowledge/                     ← shared references the team draws on
│   ├── .claude/
│   │   ├── agents/                    ← 7 role definitions (real subagent format)
│   │   │   ├── orchestrator.md  researcher.md  designer.md
│   │   │   ├── frontend.md      backend.md     qa.md      reviewer.md
│   │   │   └── developer.md     ← legacy (now split into frontend + backend)
│   │   └── skills/spin-up-orchestra/  ← one command stands up the team
│   └── scripts/tmux-orchestra.sh      ← 7-pane "control room" view (2 waves)
├── presentation/
│   ├── slides/                        ← reveal.js deck (themed to the product palette)
│   ├── 01-TALK-OUTLINE.md             ← slide-by-slide speaker notes (mixed audience)
│   ├── 02-DEMO-RUNBOOK.md             ← live choreography, waves, gates, fallbacks
│   ├── 03-DESIGN-PROMPTS.md           ← the design-tooling workflow (ui-ux-pro-max → Figma → magic)
│   └── KICKOFF-PROMPT.md              ← the live brief pasted to the orchestrator (EN + RU)
└── docs/superpowers/
    ├── specs/2026-06-17-orchestra-demo-design.md   ← the design spec (source of truth)
    └── plans/2026-06-17-orchestra-demo.md          ← the implementation plan
```

## The story in one paragraph

A single agent doing everything grades its own homework. **Quality comes from separation
of concerns + independent review.** So we run a team: an **orchestrator** takes one brief
and fans out **Wave 1 — Researcher ∥ Designer** in parallel (async), stops at a **barrier**
to verify both outputs exist, then fans out **Wave 2 — Frontend ∥ Backend**, stops again
when the feature is complete, then runs **QA** as a gate — only on **PASS** does the
**read-only Reviewer** run. The product they build (a launch site with a live,
database-backed waitlist) is real, and the demo *act* is the team building it on stage
while the slides explain what it's doing.

## The 7-role team

| Role | Model | Catches | Key tooling |
|------|-------|---------|-------------|
| **Orchestrator** | opus | wrong sequencing / no coordination | Agent, SendMessage, Monitor |
| **Researcher / BA** | sonnet | "we built the wrong thing" | WebSearch / WebFetch |
| **Designer** | sonnet | "it looks like generic AI slop" | ui-ux-pro-max + Figma MCP |
| **Frontend** | sonnet | "the UI doesn't match the design" | 21st magic MCP + Figma read |
| **Backend** | sonnet | "the data doesn't persist" | better-sqlite3 + zod |
| **QA** | sonnet | "it doesn't actually work" | Playwright MCP |
| **Reviewer** | opus | "works, but unsafe / unmaintainable" | Read / Grep / Bash (read-only) |

## Run order for the talk

1. **Read** `presentation/01-TALK-OUTLINE.md` — the narrative, timings, and "what the team
   is doing now" notes mapped to each slide.
2. **Review the design workflow** in `presentation/03-DESIGN-PROMPTS.md` (ui-ux-pro-max →
   Figma → magic) so you can narrate slide 5.
3. **Rehearse** with `presentation/02-DEMO-RUNBOOK.md` — run the pre-flight, record the
   backups, and confirm the **golden backup** runs.
4. **On stage:** paste `KICKOFF-PROMPT.md` to the orchestrator → present slides while
   Wave 1 (Researcher ∥ Designer) runs → cross the barrier → Wave 2 (Frontend ∥ Backend)
   → QA gate → Reviewer → **submit an email live** in the finished site.

## Quick start (try it now)

```bash
# 1) run the app the team extends (and the golden-backup reference)
cd orchestra-site
npm install
npm run dev                          # → http://localhost:3000

# 2) in another shell, build the control-room view
cd orchestra-team
cat AGENTS.md                        # the charter + 2-wave DAG
bash scripts/tmux-orchestra.sh       # 7-pane layout ( 'kill' to tear down)
# then in the orchestrator pane: run claude, /spin-up-orchestra, paste KICKOFF-PROMPT.md
```

## The four pillars, mapped to this repo

| Pillar | Where it shows up |
|--------|-------------------|
| **Skills** | `.claude/skills/spin-up-orchestra` + the **ui-ux-pro-max** design-system skill |
| **MCP** | **Figma** (design↔tokens), **21st magic** (components), **Playwright** (QA) — slides 5–7 |
| **Plugins** | the closing beat: package the 7 agents + skill + MCP connections as one shareable install |
| **Agent Teams** | `.claude/agents/*` + `AGENTS.md` + the orchestrator's 2-wave async/sync control |

## Design system (one palette across the app, the deck, and Figma)

Vibrant, animation-forward, **aurora** direction (chosen by ui-ux-pro-max — see
`orchestra-site/DESIGN.md`). Light mode on white with deep-indigo ink blocks:

- **Surfaces:** bg `#FFFFFF`, muted `#F5F3FF`, ink `#1E1B4B`, border `#E0E7FF`
- **Brand spectrum (aurora):** indigo `#6366F1` · violet `#8B5CF6` · fuchsia `#D946EF` · cyan `#22D3EE`
- **CTA:** energetic orange `#EA580C` (the one primary action) · success `#10B981` (counter pulse)
- **Type:** **Space Grotesk** (headings) · **DM Sans** (body) · **Space Mono** (the live counter)

The stack: **Next.js (App Router) · Tailwind · shadcn/ui · Motion · better-sqlite3 · zod.**
See `presentation/03-DESIGN-PROMPTS.md` for the full design-tooling workflow.
