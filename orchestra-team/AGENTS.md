# Orchestra — Team Charter

> Read this first. It defines the team, the workflow, and the one rule that makes
> multi-agent work produce *higher* quality instead of just more output.

## The team

| Role | File | Tools | Catches |
|------|------|-------|---------|
| **Orchestrator** | `.claude/agents/orchestrator.md` | route + sync | "wrong sequencing / no coordination" |
| **Researcher / BA** | `.claude/agents/researcher.md` | read + web | "we built the wrong thing" |
| **Developer** | `.claude/agents/developer.md` | write | produces the change |
| **QA** | `.claude/agents/qa.md` | test + run | "it doesn't actually work" |
| **Reviewer** | `.claude/agents/reviewer.md` | read-only | "works, but unsafe/unmaintainable" |

## The workflow

```
        ┌─ async, in parallel ─┐
GOAL → Researcher  +  Developer(scaffold)         ← fan out independent work
        └──────────┬───────────┘
                   ▼
            Developer (build feature)
                   ▼
        ══ SYNC BARRIER ══  Orchestrator waits + verifies
                   ▼
                  QA  ─── FAIL ──▶ back to Developer
                   │ PASS
                   ▼
        ══ SYNC BARRIER ══
                   ▼
               Reviewer  ─── CRITICAL/HIGH ──▶ back to Developer
                   │ clean
                   ▼
                 MERGE
```

## The one rule

**Independent work runs in parallel; dependent work waits at a barrier.**

- Parallel (async): research and scaffolding have no dependency on each other —
  run them at the same time.
- Barrier (sync): QA must not run until the feature is *complete*; the Reviewer
  must not run until QA has *passed*. The Orchestrator enforces this with a
  wait-and-verify checkpoint, not by hoping the order works out.

Quality comes from this separation. A single agent grading its own work is the
weakest QA there is. Independent context + independent tools = independent
judgment.

## How to start

- Automated: run the **`/spin-up-orchestra`** skill (or `TeamCreate` the team),
  then give the Orchestrator a goal.
- Manual: open the Orchestrator agent and hand it the goal; it spawns the rest.
- Live view: `bash scripts/tmux-orchestra.sh` for the multi-pane audience view.

## Demo goal (for the talk)

> "Rebuild the **Orchestra dashboard** from the Claude Design mockup / Figma file:
> research comparable agent-monitoring UIs, scaffold the layout, implement it from
> the design tokens, test it, and review it — and show me the async vs. sync
> handoffs as you go."
