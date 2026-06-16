# Agent Teams in Claude Code — Talk Outline & Speaker Notes

**Audience:** mixed engineering + non-engineering.
**Duration:** ~35–40 min talk + 10 min Q&A (timings per slide below).
**Through-line:** one product — the **Orchestra** dashboard — carries the whole talk.
We *show* an agent team by building the dashboard that *visualizes* an agent team.

**The four pillars** (state them up front, return to each): **Skills · MCP · Plugins · Agent Teams.**

> Speaker tip: every time you switch pillars, point back to the Orchestra mockup on
> screen. The single artifact is what makes four abstract features feel like one story.

---

## Slide 0 — Title (1 min)
**Visual:** the Prompt-2 hero (node graph, terracotta orchestrator).
**Say:** "Most people use AI like a vending machine — one prompt, one answer. Today
I'll show you how we run it like a *team*, with a lead, specialists, and built-in
quality control. And we'll do it live."
**Don't:** explain architecture yet. Just promise the payoff.

---

## Slide 1 — The problem with one giant agent (2 min)
**Visual:** a single overloaded robot juggling everything.
**Say (non-eng framing):** "When one assistant does research, coding, testing, and
review all in one conversation, it does each one a little worse — and it grades its
own homework. Would you ship code that was only ever reviewed by the person who
wrote it?"
**Land the thesis:** *Quality doesn't come from a bigger model. It comes from
separation of concerns + independent review.*

---

## Slide 2 — The four pillars in one sentence each (3 min)
Keep this fast and concrete — one line, one mental image each.

- **Skills** — "Reusable playbooks. You teach Claude *how* you do something once, and
  it does it that way every time." (e.g. our `/spin-up-orchestra` skill.)
- **MCP** — "A universal adapter. It lets Claude reach into real tools — Figma, Jira,
  the browser, your database — instead of just talking about them."
- **Plugins** — "Bundles. A plugin packages skills + agents + MCP connections so a
  whole capability installs in one step and your team shares it."
- **Agent Teams** — "Many Claudes working together under an orchestrator, in
  parallel, with checkpoints. The thing we're demoing."

> For the mixed room: "Skills = how-to, MCP = hands, Plugins = the toolbox you share,
> Agent Teams = the org chart."

---

## Slide 3 — Meet the Orchestra team (3 min)
**Visual:** the Prompt-1 dashboard mockup (or the live left-rail roster).
Walk the five roles and the *one failure each one catches* — this is the quality story:

| Role | Catches |
|------|---------|
| Orchestrator | wrong sequencing / no coordination |
| Researcher / BA | "we built the wrong thing" |
| Developer | (produces the change) |
| QA | "it doesn't actually work" |
| Reviewer (read-only) | "works, but unsafe / unmaintainable" |

**Punchline:** "The Reviewer literally *cannot edit code* — so it can't quietly fix a
problem and hide it. Read-only is a feature."

---

## Slide 4 — Async vs. Sync: the core idea (4 min) ⭐
This is the intellectual centerpiece. Use the swimlane in the mockup.

- **Async (parallel):** "Research and scaffolding don't depend on each other — so they
  run at the *same time*. Five minutes of work in two minutes of clock time."
- **Sync (barrier):** "But the Reviewer must NOT start until QA has *passed*. The
  orchestrator stops, verifies, and only then moves on." Point at the dashed
  **"checkpoint — wait for all"** line. "The picture and the behavior are the same."

**Non-eng analogy:** "It's a kitchen. Starters and dessert prep happen in parallel.
But you don't plate until the head chef checks the dish. The orchestrator is the
head chef — knowing what waits is the whole skill."

---

## Slide 5 — DEMO 1: Design with taste (4 min)
**Do, don't tell.**
1. Show the **Claude Design** prompt (mention: it's "taste-calibrated" — one locked
   accent, real type, no AI-purple slop). Generate the Orchestra dashboard live.
2. "Notice it came back *intentional*, not templated. That's because we gave it a
   *design read* and locked the palette — that's the taste skill at work."
**Backup:** have a pre-generated image ready in case live gen is slow.

---

## Slide 6 — DEMO 2: MCP — design becomes real (4 min)
**The 'wow' moment.**
1. Copy the design into **Figma** (Figma MCP). Show Claude *reading design context* —
   pulling real colors, spacing, and variables straight out of the file.
2. "This isn't a screenshot guess. Claude is reading the actual design tokens through
   MCP — the same terracotta, the same spacing — and can turn them into code."
**Point made:** MCP = Claude with hands in your real tools.

---

## Slide 7 — DEMO 3: Skills + Agents scaffold the team (5 min)
1. Show the files: `AGENTS.md`, `.claude/agents/*.md`, the `/spin-up-orchestra` skill.
   "A whole team is just markdown — roles, tools, and a charter."
2. Run **`/spin-up-orchestra`**. One command assembles orchestrator + 4 specialists.
3. "The automation pillar: a skill that builds a team with quality gates baked in.
   Anyone on the team can run this and get the same disciplined workflow."

---

## Slide 8 — DEMO 4: tmux — watch the team work (5 min) ⭐
**The visual spectacle.**
1. `bash scripts/tmux-orchestra.sh` → the control-room layout (orchestrator + 3
   watcher panes).
2. Give the orchestrator the goal: *"Rebuild the Orchestra dashboard from the Figma
   file — research references, scaffold, implement from the tokens, test, review."*
3. Narrate the panes: "Researcher and Developer are running **in parallel** —
   different panes, at the same time. Now watch — QA is *waiting*. The orchestrator
   hit a **sync barrier**: it won't let the Reviewer touch the branch until QA says
   PASS." Point at the panes as it happens.
**This is the slide people will remember.** Slow down and let it breathe.

---

## Slide 9 — Plugins: package & share it (2 min)
**Say:** "Everything you just saw — the agents, the skill, the MCP connections — packs
into a **plugin**. One install and your whole team has the Orchestra workflow.
Capabilities stop being one person's setup and become org infrastructure."
**Tie-off:** the four pillars compose: Skills + Agents + MCP, shipped as a Plugin,
run as a Team.

---

## Slide 10 — Why this matters (business framing) (2 min)
For the non-eng half of the room:
- **Quality is structural, not hopeful** — independent review is built into the
  process, not left to chance.
- **Speed from parallelism** — independent work runs concurrently (the "3.2× parallel
  efficiency" metric on the dashboard isn't decoration).
- **Repeatable** — a skill means the *best* version of a workflow runs every time,
  for everyone, not just the expert who designed it.
- **Shareable** — plugins turn individual setups into team standards.

---

## Slide 11 — Close + call to action (1 min)
**Say:** "We didn't make the model smarter today. We gave it an org chart, real tools,
shared playbooks, and a quality gate — and that's where the leverage is. Start with
one skill and two agents. Add the gate. Grow the team."
**Visual:** back to the hero node-graph. End on the artifact you opened with.

---

## Appendix — Q&A prep (likely questions)
- *"Isn't this just more expensive?"* — Yes, more tokens; but parallelism cuts clock
  time and the review gate cuts rework/bugs. Use cheaper models for high-frequency
  workers, the strong model for orchestrator + reviewer.
- *"Can agents talk to each other directly?"* — Yes — `SendMessage` continues a
  specific running agent with its context intact; the orchestrator routes.
- *"What stops it running forever?"* — The barriers. The orchestrator waits on
  explicit conditions and reports state; humans stay in the loop at each gate.
- *"Do I need all five roles?"* — No. Start with Developer + Reviewer (the gate).
  Add QA, Researcher, Orchestrator as the work justifies it.
- *"Is the dashboard real or a mockup?"* — Be honest: the mockup is the design target;
  the live demo rebuilds it. That honesty *is* the demo.
