# Orchestra — Live Demo Runbook

The exact sequence to run on stage, with timings, copy-paste prompts, and a
fallback for every step. Rule #1 of live demos: **every live step has a recorded
backup.** If something hangs for >20s, switch to the backup and keep the story moving.

---

## Pre-flight (do this BEFORE you present)

- [ ] `tmux -V` works (3.x). Run `bash orchestra-team/scripts/tmux-orchestra.sh` once
      to confirm the layout builds, then `... kill`.
- [ ] Figma MCP connected and authenticated (`whoami` returns you). Have a target
      Figma file open.
- [ ] Claude Design reachable; **pre-generate** the Orchestra dashboard once and save
      the image as `backup/orchestra-dashboard.png`.
- [ ] Pre-record a 60–90s screen capture of the full tmux run as
      `backup/tmux-run.mp4` (the single most important backup).
- [ ] Terminal font bumped to ~18–20pt. Dark theme. Hide notifications / Slack.
- [ ] `orchestra-team/` open in your editor with `AGENTS.md` and one agent file
      visible.
- [ ] Pin this runbook on a second screen / phone.

---

## DEMO 1 — Design with taste  (~3–4 min)

**Goal:** generate the Orchestra dashboard, and make the *taste* visible.

1. Open `presentation/03-DESIGN-PROMPTS.md`. Read the **Design Read** line aloud —
   that one sentence is the teaching moment.
2. Paste **Prompt 1** into Claude Design. Generate.
3. While it renders, narrate the locked tokens: "single terracotta accent, Geist Mono
   for data, no AI-purple, no glass-everywhere."
4. When it lands: "Intentional, not templated. That's the difference a design read +
   locked palette make."

**If it drifts** (adds a color / bad H1 wrap): type the correction line live —
*"Re-read: single terracotta accent only, Geist Mono for data, kill the glass."* —
and show it self-correct. (A *great* moment if it happens; don't force it.)

**Fallback:** show `backup/orchestra-dashboard.png`.

---

## DEMO 2 — MCP: design → Figma → tokens  (~3–4 min)

**Goal:** prove Claude reaches into a real tool and reads real design data.

1. "Now I'll push this into Figma — and more importantly, have Claude *read it back*."
2. Trigger the Figma MCP flow (load the `figma-use` skill first — it's mandatory
   before `use_figma`). Recreate/import the dashboard, OR open an existing Figma file.
3. Ask Claude to **get the design context / variables** and show the output: real
   hex values, spacing, the terracotta token.
4. Land it: "That's not a guess from a screenshot. Through MCP, Claude is reading the
   actual tokens — and can turn them into code that matches the design exactly."

**Fallback:** screenshot of a prior `get_variable_defs` / design-context output.

---

## DEMO 3 — Skills + Agents scaffold the team  (~4–5 min)

**Goal:** show a whole team is just markdown + one command.

1. In the editor, open `orchestra-team/AGENTS.md` — walk the roster table and "the one
   rule" (parallel vs. barrier). 20 seconds, no more.
2. Open `.claude/agents/reviewer.md` — point at `tools: Read, Grep, Glob, Bash`
   (no Write). "Read-only by design."
3. Open `.claude/skills/spin-up-orchestra/SKILL.md` — "this is the automation: one
   trigger stands up the team with the gates built in."
4. Run it:
   ```
   /spin-up-orchestra
   ```
   Give it the goal when prompted (see DEMO 4).

**Fallback:** the files themselves are the demo — just walk them.

---

## DEMO 4 — tmux: watch the team work  (~5 min)  ⭐ the showpiece

**Goal:** make async-parallel and the sync-barrier *visible* at the same time.

1. Build the control room:
   ```
   bash orchestra-team/scripts/tmux-orchestra.sh
   ```
   Four panes: ORCHESTRATOR (left, you drive), RESEARCHER / DEVELOPER / QA-REVIEWER
   watchers (right).
2. In the orchestrator pane, start Claude and give the goal — copy-paste:

   > Rebuild the Orchestra dashboard from the Figma file. Fan out the independent
   > work in parallel: Researcher gathers 3 reference agent-monitoring dashboards
   > while the Developer scaffolds the layout from the design tokens — both in the
   > background. Then insert a synchronous barrier: do NOT run QA until the Developer
   > reports the feature complete, and do NOT run the Reviewer until QA returns PASS.
   > Tell me out loud each time you fan out (async) and each time you wait (sync).

3. **Narrate the panes** as it runs:
   - "Researcher and Developer — different panes, running at the *same time*. Async."
   - "QA pane is idle — it's *waiting*. The orchestrator hit a barrier."
   - "QA just passed → now, and only now, the Reviewer wakes up. That's the sync gate."
4. Close on the Reviewer's verdict. "Independent review, structurally guaranteed."

**Watcher panes:** to make them live instead of placeholders, point each at its
task's output (e.g. follow a task's output or an agent log). If that's fiddly on
stage, leave the seeded labels — the orchestrator's narration carries it.

**Fallback:** play `backup/tmux-run.mp4` and narrate over it. Just as effective.

---

## Timing summary

| Segment | Target |
|---|---|
| Intro + pillars + team + async/sync (slides 0–4) | ~13 min |
| Demo 1 (design/taste) | ~4 min |
| Demo 2 (MCP/Figma) | ~4 min |
| Demo 3 (skills/agents) | ~5 min |
| Demo 4 (tmux) | ~5 min |
| Plugins + business + close (slides 9–11) | ~5 min |
| **Total** | **~36 min** + Q&A |

---

## Stage discipline

- One sentence of *why* before every demo; don't narrate keystrokes.
- If a tool hangs past ~20s: "Here's one I ran earlier" → backup → keep moving.
- Keep the Orchestra mockup on a corner of the screen the whole time — it's the anchor.
- It's fine to say the dashboard is a mockup being rebuilt live. The honesty is the demo.
