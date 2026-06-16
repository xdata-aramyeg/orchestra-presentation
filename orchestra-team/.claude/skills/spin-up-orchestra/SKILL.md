---
name: spin-up-orchestra
description: Use when the user wants to stand up the Orchestra agent team (orchestrator + researcher + designer + frontend + backend + qa + reviewer) and start a coordinated, two-wave build. Triggers on "spin up the team", "start Orchestra", "assemble the agents", or when beginning a multi-agent feature that needs quality gates.
---

# Spin Up Orchestra

This skill stands up the seven-agent Orchestra team and kicks off a coordinated
build in **two async waves** with synchronous quality gates between them.

## Steps

1. **Confirm the goal.** Restate what the team will build in one sentence. For the
   demo this is the **Orchestra launch site's waitlist feature**. If the user
   hasn't given a goal, ask for one line before proceeding.

2. **Verify the roster exists.** Check `.claude/agents/` for `orchestrator`,
   `researcher`, `designer`, `frontend`, `backend`, `qa`, `reviewer`. If any are
   missing, tell the user which — do not invent replacements.

3. **Create the team.** Use `TeamCreate` with name `orchestra` and the seven
   members above. (Or, if running manually, just spawn the orchestrator and let it
   spawn the rest.)

4. **Confirm the integrations are wired.** Each specialist relies on a tool the
   Orchestrator should have available before the wave it's needed in:
   - **Designer** → **ui-ux-pro-max** skill (design-system generator) +
     **Figma MCP** (`use_figma`) for the file and tokens.
   - **Frontend** → **21st.dev magic MCP**
     (`mcp__magic__21st_magic_component_builder`, `logo_search`) + Motion.
   - **QA** → **Playwright MCP** for the E2E signup flow.

5. **Brief the orchestrator.** Spawn the `orchestrator` agent with the goal and
   this instruction:
   > Run **Wave 1** — Researcher and Designer — in parallel with
   > `run_in_background: true`. Insert a synchronous barrier; verify the brief and
   > the design tokens are real. Then run **Wave 2** — Frontend and Backend — in
   > parallel. Barrier again before QA, and again before review. Report every
   > async/sync transition to the human as it happens.

6. **Make the work visible.** If the user wants the multi-pane view, run
   `bash scripts/tmux-orchestra.sh`. Otherwise stream status updates: what's in
   flight, what's blocked on what, what's done.

7. **Enforce the gates.** Do not let the run skip a barrier:
   - Wave 2 starts only after the Designer's tokens + the brief are verified.
   - QA runs only after both Frontend and Backend report complete.
   - Reviewer runs only after QA returns PASS.
   - A FAIL or a CRITICAL/HIGH review finding routes back to Frontend/Backend.

## What "done" looks like
Reviewer returns a clean verdict (no CRITICAL/HIGH) on a QA-passed change, and the
human has a summary of: what was built, what async ran in parallel in each wave,
and where the sync barriers fired.

## Notes
- This skill is the "automation" beat of the talk: one trigger assembles a whole
  team with embedded quality control across two waves. Point that out live.
- The team spec lives in `AGENTS.md`; role prompts in `.claude/agents/`.
