# Orchestra — Team Charter

> Read this first. It defines the team, the workflow, and the one rule that makes
> multi-agent work produce *higher* quality instead of just more output.

## The team

| Role | File | Tools | Catches |
|------|------|-------|---------|
| **Orchestrator** | `.claude/agents/orchestrator.md` | route + sync | "wrong sequencing / no coordination" |
| **Researcher / BA** | `.claude/agents/researcher.md` | read + web | "we built the wrong thing" |
| **Designer** | `.claude/agents/designer.md` | ui-ux-pro-max + Figma | "it looks generic / off-brand" |
| **Frontend** | `.claude/agents/frontend.md` | write + magic MCP + Motion | "the page doesn't match the design" |
| **Backend** | `.claude/agents/backend.md` | write + SQLite + zod | "the signup is insecure or loses data" |
| **QA** | `.claude/agents/qa.md` | test + Playwright | "it doesn't actually work" |
| **Reviewer** | `.claude/agents/reviewer.md` | read-only | "works, but unsafe/unmaintainable" |

> The generic `developer.md` role still ships in the repo; for this project it is
> **split into `frontend` + `backend`** so the two halves run in parallel.

> **The main session IS the Orchestrator — and it NEVER writes feature code.** It
> decomposes the goal, routes ALL production code to the **frontend** and
> **backend** specialists, and holds the barriers. Coordination and gating only;
> the keystrokes in the app belong to the dedicated devs.

## The workflow

Two async waves, with a synchronous barrier between them and another before QA.

```
GOAL
  │
  │   ┌──── WAVE 1 — async, in parallel ────┐
  ├──▶│   Researcher    ∥    Designer       │   ← fan out independent work
  │   └──────────────────┬──────────────────┘     (brief + design tokens)
  │                      ▼
  │            ══ SYNC BARRIER ══   Orchestrator waits + verifies
  │                      ▼
  │   ┌──── WAVE 2 — async, in parallel ────┐
  │   │   Frontend (page)  ∥  Backend (API)  │   ← build on the verified handoff
  │   └──────────────────┬──────────────────┘
  │                      ▼
  │            ══ SYNC BARRIER ══   Orchestrator waits + verifies
  │                      ▼
  │                     QA  ─── FAIL ──▶ back to Frontend / Backend
  │                      │ PASS
  │                      ▼
  │            ══ SYNC BARRIER ══
  │                      ▼
  │                  Reviewer  ─── CRITICAL/HIGH ──▶ back to Frontend / Backend
  │                      │ clean
  │                      ▼
  └────────────────▶   LIVE
```

## The one rule

**Independent work runs in parallel; dependent work waits at a barrier.**

- Parallel (async): research and design have no dependency on each other — run
  them together in Wave 1. Same for the page and the API in Wave 2.
- Barrier (sync): Wave 2 must not start until the Designer's tokens are *done* and
  verified; QA must not run until both halves are *complete*; the Reviewer must
  not run until QA has *passed*. The Orchestrator enforces each with a
  wait-and-verify checkpoint, not by hoping the order works out.

Quality comes from this separation. A single agent grading its own work is the
weakest QA there is. Independent context + independent tools = independent
judgment.

## Knowledge base & course corrections

The team's durable context lives in **`knowledge/`**:

- **`knowledge/conventions.md`** — the stack + style + locked design tokens. Every
  agent reads it before writing or reviewing code.
- **`knowledge/workflow-discipline.md`** — the hard async/sync rules (this charter's
  rules, in enforceable form).
- **`knowledge/course-corrections/`** — a running log of steering captured *during*
  a run. The **Orchestrator reads every entry here before each wave and each
  barrier** and applies it. When the human course-corrects mid-run, the Orchestrator
  **appends a new correction** (from `TEMPLATE.md`) so the lesson persists.

## How to start

- Automated: run the **`/spin-up-orchestra`** skill (or `TeamCreate` the team),
  then give the Orchestrator a goal.
- Manual: open the Orchestrator agent and hand it the goal; it spawns the rest.
- Live view: `bash scripts/tmux-orchestra.sh` for the multi-pane audience view.

## Demo goal (for the talk)

> "Build the **Orchestra launch site's waitlist feature**: research comparable
> product launch pages, design a vibrant visual direction with real tokens,
> then build the landing page and the waitlist API in parallel, test the signup
> flow end-to-end, and review it — and show me the async vs. sync handoffs across
> the two waves as you go."
