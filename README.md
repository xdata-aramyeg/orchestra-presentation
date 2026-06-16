# Agent Teams in Claude Code — Talk Package

Everything for the company tutorial on **Skills · MCP · Plugins · Agent Teams**,
built around one self-referential artifact: the **Orchestra** dashboard — a control
room for a team of AI agents, *rebuilt live by a team of AI agents.*

## What's here

```
AgentTeams/
├── README.md                          ← you are here (start + run order)
├── presentation/
│   ├── 01-TALK-OUTLINE.md             ← slide-by-slide speaker notes (mixed audience)
│   ├── 02-DEMO-RUNBOOK.md             ← live demo choreography + fallbacks
│   └── 03-DESIGN-PROMPTS.md           ← taste-calibrated Claude Design prompts
└── orchestra-team/
    ├── AGENTS.md                      ← the team charter (read first)
    ├── docs/
    │   └── agent-teams-spec.md        ← async vs sync, the real CC primitives
    ├── .claude/
    │   ├── agents/                    ← 5 role definitions (real subagent format)
    │   │   ├── orchestrator.md
    │   │   ├── researcher.md
    │   │   ├── developer.md
    │   │   ├── qa.md
    │   │   └── reviewer.md
    │   └── skills/
    │       └── spin-up-orchestra/SKILL.md   ← one command stands up the team
    └── scripts/
        └── tmux-orchestra.sh          ← multi-pane "control room" view
```

## The story in one paragraph

A single agent doing everything grades its own homework. **Quality comes from
separation of concerns + independent review.** So we run a team: an **orchestrator**
decomposes the goal, runs independent work (research + scaffolding) **in parallel
(async)**, and inserts **synchronous barriers** at the quality gates — QA never runs
before the feature is done, the read-only Reviewer never runs before QA passes. The
demo product visualizes exactly this, and the demo *act* is the team rebuilding it.

## Run order for the talk

1. **Read** `presentation/01-TALK-OUTLINE.md` — the narrative + timings.
2. **Generate visuals** with `presentation/03-DESIGN-PROMPTS.md` (Claude Design).
3. **Rehearse** with `presentation/02-DEMO-RUNBOOK.md` — and record the backups it lists.
4. **On stage:** design (taste) → Figma (MCP) → `/spin-up-orchestra` (skills+agents)
   → `tmux-orchestra.sh` (watch async/sync live) → plugins (package & share).

## Quick start (try it now)

```bash
# from this directory
cd orchestra-team
cat AGENTS.md                       # the charter
bash scripts/tmux-orchestra.sh      # build the control-room view ( 'kill' to tear down)
# then in the orchestrator pane: run claude, then  /spin-up-orchestra
```

## The four pillars, mapped to this repo

| Pillar | Where it shows up |
|--------|-------------------|
| **Skills** | `.claude/skills/spin-up-orchestra` + the taste-calibrated design prompts |
| **MCP** | Figma (design↔code), the browser, any connected tool — Demo 2 |
| **Plugins** | the closing beat: package agents + skill + MCP as one shareable install |
| **Agent Teams** | `.claude/agents/*` + `AGENTS.md` + the orchestrator's async/sync control |

## Design system (one locked palette across Design, Figma, and code)

Neutrals `#0C0C0E / #161619 / #1D1D21`, borders `#2A2A30`, text `#ECECEE / #9A9AA2`.
**Single accent:** Claude terracotta `#D97757` (orchestrator + primary actions only).
Functional status: run `#6E9E78`, wait `#C9A24B`, async `#5B7A99`, idle `#6B6B73`.
Type: **Geist** (UI) + **Geist Mono** (all data). No Inter, no AI-purple. See
`presentation/03-DESIGN-PROMPTS.md`.
