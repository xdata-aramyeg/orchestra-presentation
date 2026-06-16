# 0003 — QA tests via Chrome MCP + computer use; writes only test cases

- **Date:** 2026-06-17
- **Applies to:** qa / QA gate phase
- **Trigger:** QA's scope was ambiguous and risked QA editing code to "help."
- **Correction:** QA exercises the **running app in a real browser** via the **Chrome MCP**
  (`mcp__claude-in-chrome__*`) + computer use, and **reports PASS/FAIL with observed
  evidence**. It never edits app/feature code. Its only writing is **test cases / test
  plans**, which it produces from the PM's specs during idle time and then executes.
- **Why:** Testing the real rendered behavior (not reading code and assuming) catches what
  unit tests miss; keeping QA out of the code keeps its verdict independent.
