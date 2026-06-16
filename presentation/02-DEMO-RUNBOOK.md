# Orchestra — Live Demo Runbook

The exact choreography to run on stage. The conceit: **kick the team off live, then let
it build in the background while you present.** You narrate the async waves and the sync
gates as they happen. Rule #1 of live demos: **every live beat has a fallback.** If
anything slips, you can switch to the fully pre-built **golden backup** — the end state
is identical, so the story still lands.

---

## Pre-flight (do this BEFORE you present)

**The app**
- [ ] `cd orchestra-site && npm run dev` serves the base app at `localhost:3000`. Hero
      animates, sections render. Leave it running.
- [ ] SQLite is **writable**: submit a test email through the form → row persists →
      counter increments on refresh. Then **reset** the table so the live counter starts
      clean (note your reset command).
- [ ] The **golden backup** (`orchestra-site` with the waitlist feature already complete)
      is checked out / copied somewhere you can switch to in one command. Confirm it runs.

**The tools the team needs**
- [ ] Playwright installed (`npx playwright install` done) — QA depends on it.
- [ ] Figma MCP connected + authenticated (`whoami` returns you). Target Figma file open.
- [ ] magic MCP (21st.dev) reachable — do one throwaway `21st_magic_component_builder`
      call to confirm it answers.
- [ ] ui-ux-pro-max skill available (it already chose the direction in DESIGN.md; the
      Designer re-runs it live, but the output is pre-known).

**The room**
- [ ] tmux 3.x: run `bash orchestra-team/scripts/tmux-orchestra.sh` once to confirm the
      7-pane layout builds, then `... kill`.
- [ ] The **deck opens** (`presentation/slides/index.html`) and arrow-key nav works.
- [ ] Terminal font ~18–20pt. Notifications / Slack off. Browser zoomed for the back row.
- [ ] `KICKOFF-PROMPT.md` open and ready to paste. This runbook pinned on a 2nd screen.

**Backups staged** (so you never improvise a recovery)
- [ ] `backup/figma-tokens.png` — a `get_variable_defs` / design-context screenshot.
- [ ] `backup/tmux-run.mp4` — a 60–90s recording of a full async/sync run.
- [ ] `backup/orchestra-final.png` (or the golden app itself) — the finished site.

---

## Beat 0 — Kickoff (live)  (~2 min)

**Goal:** start the team in front of the audience; everything after this builds in the
background.

1. (Optional) run `/spin-up-orchestra` first if you want the team assembled before the
   brief.
2. Read the **spoken intro** from `KICKOFF-PROMPT.md` (~15s, English or Russian).
3. Paste **The Prompt** from `KICKOFF-PROMPT.md` into the orchestrator pane. Do **not**
   re-type it — it's the rehearsed brief that drives the two waves and the gate.
4. Confirm the orchestrator announces **"fanning out Wave 1 — Researcher and Designer."**
   That sentence is your signal the demo is alive. Move to slides.

**Fallback:** if the orchestrator stalls on kickoff, paste the prompt once more; if it
still won't start, say "here's a run I did earlier," play `backup/tmux-run.mp4`, and
present over it. The slides + finale (golden backup) still carry the talk.

---

## Beat 1 — Wave 1 runs during the early slides  (Researcher ∥ Designer)

**You are on slides 1–4 (problem → pillars → team → async/sync).** The team works while
you talk.

- **Narrate the parallelism:** glance at the two Wave-1 panes — "those two are running at
  the *same time*: one's finalizing the value prop and copy, the other's locking the
  visual system with ui-ux-pro-max."
- **Catch the design landing:** if the Designer's palette/tokens appear while you're on
  the pillars slide, flash it — "that aurora direction just got *decided*, live."
- **The first barrier is the payoff of slide 4.** Watch for the orchestrator to say it's
  **waiting for both** before Wave 2. Say out loud: "See — it just stopped. It won't
  start Frontend until the design actually exists. That's a sync barrier."

**Fallback:** if Wave 1 runs long, keep moving through slides — the team catches up in the
background. If the Designer beat fails (rate limit, tool down), show
`backup/figma-tokens.png` and say "the design system, pre-generated — same tokens."

---

## Beat 2 — Cross the barrier → Wave 2  (Frontend ∥ Backend)

**You are on slides 5–6 (design tooling → tmux).** This is the richest stretch to narrate
because the slide content *is* what the panes are doing.

- **At the barrier:** "Both Wave 1 outputs are in — brief and design. The orchestrator
  verifies, then fans out again." Point at the two new active panes.
- **Slide 5 narrates the Frontend pane:** "Right now that agent is calling magic MCP for
  the hero and form components, and reading the Figma tokens back so the colors match."
- **Slide 6 (tmux) narrates both:** "Frontend and Backend, parallel lanes. Backend's
  building `POST /api/waitlist` and the counter endpoint with SQLite and zod." Then:
  "Watch for the **feature-complete barrier** — it won't run QA until the page renders
  *and* the API responds."

**Fallback:** if magic MCP is slow/unavailable, the Frontend extends the pre-built base
components (they already exist in the base app) — narrate that as "building on the base."
If Wave 2 won't converge, this is the natural place to decide on the **golden backup**
(see the switch procedure below) so the finale is guaranteed.

---

## Beat 3 — The quality gate: QA → Reviewer  (~3 min)

**You are on slide 7 (the gate).**

1. **QA runs first.** Read its verdict off the QA pane: "it's driving the real signup flow
   with Playwright — valid email, duplicate, invalid, empty."
2. **The gate:** "Only on **PASS** does the orchestrator wake the Reviewer. If QA had
   failed, it loops back to Wave 2 — nobody downstream works on broken code."
3. **Reviewer is read-only** — point at its tools (no Write). "It checks email validation,
   injection, error leakage. It *can't* fix-and-hide, because it can't edit."
4. Close on the orchestrator's **"it's clean — it's live"** announcement.

**Fallback:** if QA flaps on stage, say "QA's doing its job — catching exactly the kind of
thing we don't want to ship," and switch to the golden backup for the finale. A visible QA
failure *supports* the thesis; don't panic, frame it.

---

## Beat 4 — Finale: submit an email live  (~2 min)

**You are on slide 10.** The payoff.

1. Bring up the finished landing page. Scroll once so the room sees the motion the team
   built minutes ago (aurora hero, scroll reveals, the live counter).
2. **Type a real email into the waitlist form and submit, on stage.** It hits the SQLite
   backend → returns **"You're #N on the list."**
3. **Refresh** — the live counter ticks up. "That number is real — it just wrote to a
   database an agent built, behind a gate another agent enforced, in a design a third
   agent chose, while I was talking."
4. Land the close (slide 10 speaker notes).

**Fallback:** if the live app's form errors, switch to the **golden backup** app (already
running on another port / window) and submit there — identical behavior. If all live
tooling is down, show `backup/orchestra-final.png` and describe the flow; the narrative
still closes.

---

## Switching to the golden backup (the master fallback)

Do this calmly and *without apology* — the end state is identical, so the story is intact.

1. The golden `orchestra-site` is already running (pre-flight) on a second port/window.
2. Switch the browser to it. It has the waitlist feature complete and the counter live.
3. Continue the runbook from wherever you were — Beat 4 works against it verbatim.
4. One honest line if asked: "There's always a finished reference ready — that's how you
   run a live demo responsibly. What you watched the team do *is* this result."

---

## Timing summary

| Segment | Slides | Target | Team is doing |
|---|---|---|---|
| Kickoff (live) | 0 | ~2 min | start — Wave 1 fans out |
| Problem + pillars + team + async/sync | 1–4 | ~15 min | Wave 1 → **barrier** → Wave 2 starts |
| Design tooling + tmux | 5–6 | ~9 min | Wave 2 (Frontend ∥ Backend) → **barrier** |
| Quality gate | 7 | ~3 min | QA → PASS → Reviewer |
| Plugins + why-it-matters | 8–9 | ~6 min | Reviewer returns clean |
| Finale (live email) | 10 | ~2 min | done — submit on stage |
| **Total** | | **~37 min** + Q&A | |

> Pacing reality: the slides set the clock, not the team. If the team is ahead, you're
> narrating completed work (great). If behind, keep presenting — and switch to the golden
> backup before the finale if Wave 2 hasn't converged by slide 9.

---

## Stage discipline

- One sentence of *why* before every beat; let the orchestrator narrate the keystrokes.
- The orchestrator's async/sync announcements are the demo — **pause on each one and point
  at the panes.** Don't talk over them.
- Keep one eye on the tmux panes between slides; tie each slide to "what the team is doing
  right now."
- If a tool hangs past ~20s: name the fallback for that beat, use it, keep moving.
- It's fine — good, even — to mention the golden backup exists. Running a live demo with a
  net is the professional move, not a confession.
