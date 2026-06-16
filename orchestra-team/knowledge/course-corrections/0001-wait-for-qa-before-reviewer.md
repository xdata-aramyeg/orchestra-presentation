# Reviewer waits for QA PASS before starting

- **Date:** 2026-06-17
- **Trigger:** The Reviewer started reviewing code that QA hadn't cleared — review
  ran before the QA gate returned a verdict, so it burned a cycle on a build that
  wasn't yet proven to work, and risked signing off on something QA would later fail.
- **Correction:** The Reviewer runs **only after QA returns PASS** — never before.
  At the pre-review barrier the Orchestrator confirms QA's verdict is an explicit
  PASS before routing the Reviewer. If the Reviewer is handed work QA hasn't cleared,
  it says so and stops. After any QA FAIL, the fix re-gates through QA again, and only
  on PASS does the Reviewer run.
- **Applies-to:** reviewer / final gate; orchestrator / pre-review barrier.
