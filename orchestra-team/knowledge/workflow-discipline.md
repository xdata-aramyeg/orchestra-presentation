# Workflow Discipline — the hard rules

> These keep the team from drifting during a live run. They are not suggestions.
> The Orchestrator enforces them; every agent respects them. If a step would
> violate one of these, **stop and flag it** rather than proceed.

## The one rule
**Independent work runs in parallel (async); dependent work waits at a barrier
(sync).** Parallelism is for work with no dependency on each other; a barrier is a
wait-and-verify checkpoint before dependent work begins.

## The hard rules

1. **Wave 2 must NOT start until Wave 1 is verified.** Frontend and Backend do not
   begin until the **Designer's tokens** *and* the **Researcher's brief** are
   complete and the Orchestrator has inspected them. Building on un-verified design
   or requirements is drift.

2. **QA runs ONLY after both Frontend and Backend report complete.** No testing a
   half-built feature; both Wave-2 halves must be done first.

3. **The Reviewer runs ONLY after QA returns PASS — never before.** The Reviewer is
   **read-only by design** (it cannot edit, so it cannot quietly hide a problem). If
   the Orchestrator routes the Reviewer something QA hasn't cleared, the Reviewer
   says so and stops.

4. **A failure routes back, then re-gates.** A QA **FAIL** or a Reviewer
   **CRITICAL/HIGH** finding goes back to the **owning specialist** (Frontend or
   Backend). After the fix, it **re-gates**: QA runs again, and only on PASS does the
   Reviewer run again. You never skip the gate on the second pass.

5. **No agent marks its own work "verified."** The producing agents (Designer,
   Frontend, Backend) report "complete," not "verified." **QA and the Reviewer are
   the only sign-off** — independent context + independent tools = independent
   judgment.

6. **The Orchestrator announces every transition.** Every **fan-out** (async: "Wave 1
   — Researcher ∥ Designer, in background") and every **wait** (sync: "barrier —
   waiting on tokens + brief before Wave 2") is stated to the human as it happens.
   Silent sequencing hides exactly the thing the demo is about.

## The shape, at a glance
```
Wave 1:  Researcher ∥ Designer
            └─ BARRIER (verify brief + tokens) ─┐
Wave 2:  Frontend ∥ Backend                      │
            └─ BARRIER (both complete) ─┐         │
         QA  ── FAIL → owning specialist → re-gate
            └─ PASS → BARRIER ─┐
         Reviewer ── CRITICAL/HIGH → owning specialist → re-gate (QA, then Reviewer)
            └─ clean → LIVE
```

## Before each wave and barrier
Read `course-corrections/` and apply every entry. When the human course-corrects
mid-run, append a new correction (from `course-corrections/TEMPLATE.md`) so the
lesson persists.
