# Orchestra — Knowledge Base

> Shared, durable context for the team. Every agent reads the relevant parts of
> this directory **before acting**; the Orchestrator consults
> `course-corrections/` at **every wave and barrier** so the team stays disciplined
> and doesn't drift during a live run.

## What's here

| File | Who reads it | When |
|------|--------------|------|
| `conventions.md` | every agent | before writing or reviewing any code |
| `workflow-discipline.md` | orchestrator + every agent | before each wave/barrier; it's the hard rule set |
| `course-corrections/` | orchestrator (primary) | before each wave and gate — apply every entry |

## How the two relate

- **`conventions.md` and `workflow-discipline.md` are the standing rules** — the
  stack, the style, and the async/sync discipline that never changes between runs.
- **`course-corrections/` is the *learning* layer** — a running log of steering
  captured *during* a run. When the human course-corrects mid-run ("you skipped a
  barrier", "the Reviewer started too early"), the Orchestrator appends a new entry
  so the lesson **persists** into the next wave and the next run.

Think of it as: conventions/discipline = the constitution; course-corrections =
the case law that accumulates as the team operates.

## The contract

1. **Agents** read `conventions.md` + `workflow-discipline.md` before they act.
2. **The Orchestrator** reads all of `course-corrections/` before each wave and
   each barrier, and applies every correction.
3. **When the human steers**, the Orchestrator appends a new correction (from
   `course-corrections/TEMPLATE.md`) so the team self-corrects and the lesson is
   not lost.
