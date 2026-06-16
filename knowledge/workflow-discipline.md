# Workflow Discipline

The hard coordination rules. These keep the team from becoming messy. The Lead enforces
them; the PM records any new lesson in `course-corrections/`.

## Phases

1. **Plan** — the PM writes the epic + tasks with acceptance criteria and dependencies.
2. **Build (parallel)** — Frontend ∥ Backend work on different files against an agreed API
   contract. QA, if specs are clear, **writes test cases** in parallel.
3. **Barrier: feature complete** — the Lead verifies the page renders *and* the API responds
   before anyone moves on.
4. **QA gate** — QA tests the running app via Chrome MCP + computer use.
5. **Review gate** — only after QA **PASS**, the Reviewer reviews (read-only).
6. **Done** — Reviewer clean (no CRITICAL/HIGH) on QA-passed code.

## The rules

- **Lead never writes feature code.** Decompose, route, gate. Spawn/assign a dev instead.
- **Idle-during-QA.** While QA tests, **Frontend and Backend are idle** — assigned nothing,
  self-claiming nothing. Nothing mutates under QA or the verdict is worthless. They resume
  only on QA's verdict.
- **QA tests only; writes only test cases.** No app/feature edits. A FAIL routes back to the
  owning dev, then QA re-tests.
- **Reviewer reads only**, and only after QA PASS. A CRITICAL/HIGH finding routes back to the
  dev → re-QA → re-review.
- **No file conflicts.** Frontend owns UI files; Backend owns API/DB files. Never the same
  file in the same wave.
- **Wait for teammates.** The Lead holds each barrier and verifies before proceeding; it does
  not race ahead of in-flight work.
- **Continuous improvement.** Human course-corrections and recurring snags get written to
  `course-corrections/` by the PM, and applied by the Lead before each phase.

## Why these matter
A single agent grading its own work is the weakest QA there is. Independent context +
independent tools + a held barrier = an independent, trustworthy verdict.
