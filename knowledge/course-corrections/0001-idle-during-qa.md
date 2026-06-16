# 0001 — Devs stay idle while QA tests

- **Date:** 2026-06-17
- **Applies to:** frontend, backend / QA gate phase
- **Trigger:** Risk that a dev keeps editing code while QA is testing, making the QA result
  meaningless (the thing tested no longer matches the code).
- **Correction:** While QA is testing, **Frontend and Backend stay idle** — the Lead assigns
  them no work and they self-claim nothing. They resume only after QA returns a verdict
  (fixes if FAIL, hand to Reviewer if PASS).
- **Why:** A verdict is only trustworthy if nothing mutates under the test. The held barrier
  is what makes QA's PASS/FAIL mean something.
