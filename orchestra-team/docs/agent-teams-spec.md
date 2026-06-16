# Claude Code Agent Teams — Technical Reference

This is the grounding doc for the **Orchestra** demo. It explains the actual
Claude Code primitives that make a multi-agent team work, and — most importantly
for the talk — how an orchestrator runs work **asynchronously** but can force a
**synchronous barrier** when correctness depends on it.

---

## 1. The mental model

A "team" is one **orchestrator** (the main Claude Code session you're typing in)
plus a set of **subagents** it spawns. Each subagent:

- has its own context window (it does NOT see your whole conversation),
- has a focused system prompt (its role), and
- optionally a restricted toolset (e.g. the reviewer is read-only).

The orchestrator's job is **decomposition + routing + synchronization** — not
doing the work itself. This is the single most important idea to land with the
audience: *quality comes from separation of concerns, not from one model trying
to do everything in one context.*

```
                    ┌──────────────────┐
                    │   ORCHESTRATOR   │  (you, the main session)
                    └────────┬─────────┘
            spawns / routes / synchronizes
   ┌──────────┬──────────┬────┴─────┬──────────┬──────────┐
   ▼          ▼          ▼          ▼          ▼          ▼
Researcher Designer  Frontend   Backend       QA      Reviewer
(read+web) (figma)  (page+anim) (api+db)    (test)   (read-only)
   └─ Wave 1 ─┘      └────── Wave 2 ──────┘
```

---

## 2. The primitives (real tools)

| Tool | What it does | Role in the demo |
|------|--------------|------------------|
| `Agent` | Spawn a subagent with a `subagent_type`, optional `name`, `team_name`, `run_in_background`, `isolation` | How the orchestrator creates each teammate |
| `SendMessage` | Send a message to an **already-running** agent by name/ID, keeping its context | Async back-and-forth between agents |
| `TaskCreate` / `TaskList` / `TaskGet` / `TaskOutput` / `TaskUpdate` / `TaskStop` | Create and track units of work | The "swimlane" board state |
| `Monitor` | Block until a condition is true (e.g. "all background tasks done") | The **synchronous barrier** |
| `TeamCreate` / `TeamDelete` | Group agents under a named team | "Spin up the Orchestra team" |
| `run_in_background: true` | Detaches a spawned agent/command; you're re-invoked when it finishes | Parallel async work |

> Note for the talk: you do not need the audience to memorize this table. Show
> ONE async spawn and ONE barrier. The table is your cheat-sheet, not a slide.

---

## 3. Async vs. Sync — the heart of the talk

The Orchestra build runs in **two async waves** with synchronous barriers between
them. Each wave fans out independent work; each barrier verifies before the next
wave (or gate) begins.

```
WAVE 1   Researcher  ∥  Designer          ← independent: brief + design tokens
            ══ BARRIER ══  verify the tokens + brief are real
WAVE 2   Frontend    ∥  Backend           ← independent: landing page + waitlist API
            ══ BARRIER ══  verify both halves complete
            QA  ── PASS ──▶  ══ BARRIER ══  ──▶  Reviewer  ──▶  live
```

### Asynchronous (fan-out)
The orchestrator spawns a wave's workers **in one turn**, each
`run_in_background: true`. They run concurrently. The orchestrator is
re-invoked automatically as each one reports back. Wall-clock time ≈ the slowest
single worker in the wave, not the sum.

```
Wave 1 — Orchestrator: "Researcher, gather comparable launch pages (background).
                        Designer, set the visual direction + tokens in Figma (background)."
Wave 2 — Orchestrator: "Frontend, build the page from the tokens (background).
                        Backend, build the waitlist API + SQLite (background)."
   → within each wave, both run at the same time. Orchestrator does NOT block.
```

### Synchronous (barrier)
Some steps must NOT start until prior ones are *proven* done. The orchestrator
inserts a **checkpoint**: it waits for all relevant background work, inspects the
results, and only then routes the next step.

```
Orchestrator: [waits] until Designer reports "tokens ready" (end of Wave 1)
              → ONLY THEN → start Wave 2 (Frontend + Backend)
              [waits] until both report "complete" AND QA reports "tests green"
              → ONLY THEN → SendMessage(Reviewer, "review the build")
```

This is the dashed "Orchestrator checkpoint — wait for all" line in the Orchestra
mockup. The visual and the behavior are the same thing — that's the payoff.

### When to use which (the quality argument)
- **Async** for independent exploration within a wave: research + design (Wave 1),
  page + API (Wave 2).
- **Sync** for dependency + quality gates: never start Wave 2 before the design
  tokens are verified; never let QA sign off on an un-built feature; never let the
  Reviewer review code QA hasn't cleared.

The orchestrator is the thing that *knows the difference*. That judgment is the
product.

---

## 4. Quality control through role separation

Each role exists to catch a different failure class:

- **Researcher / BA** — catches "we built the wrong thing."
- **Designer** — catches "it looks generic / off-brand"; owns style, palette,
  type, motion, and real design tokens (ui-ux-pro-max + Figma MCP).
- **Frontend** — produces the landing page from the tokens (magic MCP + Motion);
  catches "the page doesn't match the design."
- **Backend** — produces the waitlist API + SQLite (zod, parameterized queries);
  catches "the signup is insecure or loses data."
- **QA** — catches "it doesn't actually work" (tests, edge cases, Playwright E2E).
- **Reviewer** — catches "it works but it's unsafe/unmaintainable" (read-only, so
  it can't be tempted to 'just fix it' and hide the problem).

> The generic single **Developer** role is **split into Frontend + Backend** for
> this project so the two halves build in parallel during Wave 2.

Separation matters because a single agent grading its own work is the weakest
form of QA. Independent context + independent toolset = independent judgment.

---

## 5. How this maps to files in this repo

- `.claude/agents/*.md` — one file per role (the system prompts).
- `.claude/skills/spin-up-orchestra/SKILL.md` — automates standing up the team.
- `AGENTS.md` — the team charter the orchestrator reads first.
- `scripts/tmux-orchestra.sh` — the multi-pane live view for the audience.
