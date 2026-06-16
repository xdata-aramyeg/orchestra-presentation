---
name: spin-up-orchestra
description: Use when the user wants to stand up the Orchestra agent team (orchestrator + researcher + developer + qa + reviewer) and start a coordinated build. Triggers on "spin up the team", "start Orchestra", "assemble the agents", or when beginning a multi-agent feature that needs quality gates.
---

# Spin Up Orchestra

This skill stands up the five-agent Orchestra team and kicks off a coordinated
build with proper async fan-out and synchronous quality gates.

## Steps

1. **Confirm the goal.** Restate what the team will build in one sentence. If the
   user hasn't given a goal, ask for one line before proceeding.

2. **Verify the roster exists.** Check `.claude/agents/` for `orchestrator`,
   `researcher`, `developer`, `qa`, `reviewer`. If any are missing, tell the user
   which — do not invent replacements.

3. **Create the team.** Use `TeamCreate` with name `orchestra` and the five
   members above. (Or, if running manually, just spawn the orchestrator and let it
   spawn the rest.)

4. **Brief the orchestrator.** Spawn the `orchestrator` agent with the goal and
   this instruction:
   > Fan out independent work (research + scaffolding) in parallel with
   > `run_in_background: true`. Insert a synchronous barrier before QA and again
   > before review. Report async/sync transitions to the human as they happen.

5. **Make the work visible.** If the user wants the multi-pane view, run
   `bash scripts/tmux-orchestra.sh`. Otherwise stream status updates: what's in
   flight, what's blocked on what, what's done.

6. **Enforce the gates.** Do not let the run skip a barrier:
   - QA runs only after the Developer reports the feature complete.
   - Reviewer runs only after QA returns PASS.
   - A FAIL or a CRITICAL/HIGH review finding routes back to the Developer.

## What "done" looks like
Reviewer returns a clean verdict (no CRITICAL/HIGH) on a QA-passed change, and the
human has a summary of: what was built, what async ran in parallel, and where the
sync barriers fired.

## Notes
- This skill is the "automation" beat of the talk: one trigger assembles a whole
  team with embedded quality control. Point that out live.
- The team spec lives in `AGENTS.md`; role prompts in `.claude/agents/`.
