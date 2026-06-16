# QA tests through the Chrome MCP and only tests

- **Date:** 2026-06-17
- **Trigger:** QA scope was ambiguous — it implied Playwright as the primary path
  and gave QA write/edit tools, which risked QA **editing the code it was grading**.
  An agent that fixes its own findings is no longer an independent gate.
- **Correction:** QA drives a **real browser via the claude-in-chrome MCP**
  (`mcp__claude-in-chrome__*`) + **computer use** to exercise the live signup flow
  (fill the email, submit, assert "You're #N" + the counter). It **only observes and
  reports** — its tools are read/observe + browser; it **never edits code**. Fixes
  route back to the **frontend / backend** specialist, then re-gate. Playwright is a
  fallback only.
- **Applies-to:** qa / gate phase.
