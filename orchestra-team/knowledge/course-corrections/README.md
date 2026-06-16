# Course Corrections

> A running log of steering captured **during** a run, so the team self-corrects and
> the lesson **persists** beyond the moment it was learned.

## What this directory is for

Standing rules live in `../conventions.md` and `../workflow-discipline.md`. This
directory is the **learning layer**: each file records one correction — something
that went wrong (or that the human steered) and the rule the team follows from now
on. Over a run these accumulate into the team's "case law."

## How it's used

- **Before each wave and each barrier**, the Orchestrator reads **every** entry here
  and applies it. A correction is not a note to read once; it's an active constraint
  on the next decision.
- **When the human course-corrects mid-run** — "you skipped a barrier", "the
  Reviewer started before QA passed", "stay on the locked palette" — the
  Orchestrator appends a **new** entry using `TEMPLATE.md`, so the same mistake
  doesn't recur in a later wave or a later run.

## Conventions for entries

- One correction per file. Number them in order: `0001-...md`, `0002-...md`, …
- Use a short, descriptive kebab-case title in the filename.
- Fill in every field of `TEMPLATE.md`: Title, Date, Trigger, Correction, Applies-to.
- Keep it terse and actionable — a rule the Orchestrator can apply, not an essay.

## Index

| # | Correction | Applies to |
|---|------------|------------|
| 0001 | Reviewer waits for QA PASS before starting | reviewer / final gate |
| 0002 | Orchestrator never writes feature code | orchestrator / all phases |
| 0003 | QA tests through the Chrome MCP and only tests | qa / gate phase |
