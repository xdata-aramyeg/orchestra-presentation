# Agent Teams in Claude Code — Talk Outline & Speaker Notes

**Audience:** mixed engineering + non-engineering.
**Duration:** ~35–40 min talk + 10 min Q&A (per-slide timings below).
**Through-line:** the talk's *form mirrors its content.* We kick off a 7-agent team
**live**, then it builds in the background — async — while we talk through slides. The
orchestrator stops at **synchronous quality gates**. The audience *watches*
async-vs-sync happen instead of hearing about it described.

**What the team builds:** a vibrant, animated **launch landing page + a real
SQLite-backed waitlist** for a fictional product called **Orchestra** — an
agent-orchestration tool. Self-referential: AI agents ship the launch site for an
agent-team product. We finish by submitting an email **live on stage** and watching
the counter tick up.

**The four pillars** (state up front, return to each): **Skills · MCP · Plugins · Agent Teams.**

> **The spine — two async waves with sync barriers between them.** Keep this picture
> in your head; the slides are paced to it:
>
> ```
> Kickoff (stage) → Wave 1: Researcher ∥ Designer
>      ║ BARRIER (orchestrator waits for both)
>   → Wave 2: Frontend ∥ Backend
>      ║ BARRIER (feature complete)
>   → QA gate → (PASS) → Reviewer (read-only) → LIVE finale
> ```

> Speaker tip: the orchestrator narrates every "I'm fanning out" and "I'm waiting."
> That narration **is** the demo. Whenever you switch slides, glance at the tmux panes
> and tell the room what the team is doing *right now*.

---

## Slide 0 — Title + LIVE kickoff (2 min)
**Visual:** Orchestra wordmark on the animated aurora (deck theme matches the product).
**Do this first — it's the whole conceit:** read the ~15s spoken intro from
`KICKOFF-PROMPT.md`, then paste **The Prompt** into the orchestrator. The team starts
building *now*, in the background.
**Say:** "Most people use AI like a vending machine — one prompt, one answer. I'm going
to hand one brief to an orchestrator. It won't write the code itself — it splits the
work across a team, runs the independent parts in parallel, and stops to check quality
before moving on. Let's start them, and talk through what's happening while they work."
**Don't:** explain architecture yet. Start the team, promise the payoff.

> **MEANWHILE:** Wave 1 begins. Researcher and Designer fan out the moment you paste.

---

## Slide 1 — The problem with one giant agent (3 min)
**Visual:** a single overloaded robot juggling research, code, tests, review.
**Say (non-eng framing):** "When one assistant does research, coding, testing, and
review in one conversation, it does each a little worse — and it grades its own
homework. Would you ship code that was only ever reviewed by the person who wrote it?"
**Land the thesis:** *Quality doesn't come from a bigger model. It comes from
separation of concerns + independent review.*

> **MEANWHILE:** Researcher is pulling reference launch pages + writing acceptance
> criteria; Designer is locking the visual direction with ui-ux-pro-max.

---

## Slide 2 — The four pillars in one sentence each (3 min)
Fast and concrete — one line, one mental image each.

- **Skills** — "Reusable playbooks. You teach Claude *how* you do something once, and it
  does it that way every time." (e.g. our `/spin-up-orchestra` skill, and ui-ux-pro-max.)
- **MCP** — "A universal adapter. It lets Claude reach into real tools — Figma, the
  browser, a component generator, a database — instead of just talking about them."
- **Plugins** — "Bundles. A plugin packages skills + agents + MCP connections so a whole
  capability installs in one step and your team shares it."
- **Agent Teams** — "Many Claudes working together under an orchestrator, in parallel,
  with checkpoints. The thing building our site right now."

> For the mixed room: "Skills = how-to, MCP = hands, Plugins = the toolbox you share,
> Agent Teams = the org chart."
>
> **MEANWHILE:** Wave 1 still running. If the Designer's ui-ux-pro-max output lands while
> you're on this slide, flash it — "that palette appeared while I was talking."

---

## Slide 3 — Meet the Orchestra team (4 min)
**Visual:** the 7-role roster (or the live tmux left rail).
Walk the seven roles and the *one failure each one catches* — this is the quality story:

| Role | Model | Catches |
|------|-------|---------|
| Orchestrator | opus | wrong sequencing / no coordination |
| Researcher / BA | sonnet | "we built the wrong thing" |
| Designer | sonnet | "it looks like generic AI slop" |
| Frontend | sonnet | "the UI doesn't match the design" |
| Backend | sonnet | "the data doesn't actually persist" |
| QA | sonnet | "it doesn't actually work" |
| Reviewer (read-only) | opus | "works, but unsafe / unmaintainable" |

**Punchline:** "The Reviewer literally *cannot edit code* — it's read-only — so it can't
quietly fix a problem and hide it. Read-only is a feature."

> **MEANWHILE:** Wave 1 should be wrapping. Watch for the **first barrier** — the
> orchestrator announces it's *waiting for both* Researcher and Designer before Wave 2.

---

## Slide 4 — Async vs. Sync: the core idea (5 min) ⭐
The intellectual centerpiece — and you can point at it happening on the other screen.

- **Async (parallel):** "Research and design don't depend on each other — so they run at
  the *same time*. Two specialists, one stretch of clock time." Point at the two Wave 1
  panes (or, by now, the two Wave 2 panes).
- **Sync (barrier):** "But Frontend can't build a design that doesn't exist yet. The
  orchestrator *stops*, verifies both Wave 1 outputs are real, and only then fans out
  Wave 2. Same with the quality gate: the Reviewer never starts until QA passes."

**Non-eng analogy:** "It's a kitchen. Starters and dessert prep happen in parallel. But
you don't plate until the head chef checks the dish. The orchestrator is the head chef —
knowing *what waits* is the whole skill."

> **MEANWHILE:** ideally you cross the first barrier live on this slide — "see, it just
> said *waiting for both*, now it's fanning out Wave 2." Best-timed moment in the talk.

---

## Slide 5 — Design tooling: taste, on tap (4 min)
How the *look* got made — three tools, three jobs (mirrors `03-DESIGN-PROMPTS.md`).

1. **ui-ux-pro-max** (Designer) — "A skill that picks the whole design system: style
   family, palette, font pairing, motion language. Ours chose a vibrant aurora direction
   — deep indigo `#1E1B4B`, electric indigo `#6366F1`, an energetic orange CTA `#EA580C`,
   Space Grotesk headings. Not a hardcoded guess — a *designed* decision." (See DESIGN.md.)
2. **Figma MCP** — "The design *lives* in Figma. The Frontend reads the tokens back out
   through MCP — the actual hex values and spacing — so code matches design exactly. Not
   a screenshot guess."
3. **21st.dev magic MCP** — "A component generator. The Frontend asks for a polished,
   animated hero / form / feature trio and gets production shadcn + Tailwind back, fast."

**Land it:** "Three tools because design is three jobs — *decide*, *store*, *generate*.
That's the MCP pillar doing real work."

> **MEANWHILE:** Wave 2 — Frontend is calling magic MCP + reading Figma tokens; Backend
> is building the API. This slide narrates exactly what the Frontend pane is doing.

---

## Slide 6 — tmux: watch the team work (5 min) ⭐
**The visual spectacle.** Bring the tmux control room full-screen.

1. Seven panes: Orchestrator (you drive) + the six specialists, grouped by wave.
2. Narrate live: "Frontend and Backend — different panes, running at the *same time*.
   Async. Now watch — the orchestrator's about to hit the **feature-complete barrier**:
   it won't run QA until the page renders *and* the API responds."
3. Point at the panes as state changes. The audience can literally see parallel lanes and
   a waiting lane at once.

**This is the slide people remember.** Slow down, let it breathe, point with your hand.

> **MEANWHILE:** this slide *is* the meanwhile. If Wave 2 finished early, you're watching
> the **QA gate** — even better. If it's running long, narrate the parallelism and move on.

---

## Slide 7 — The quality gate: QA → Reviewer (3 min)
**Visual:** the gate diagram (QA → PASS → Reviewer; FAIL → back to Wave 2).
**Say:** "The feature's built. Now the gate. QA end-to-ends the signup flow and the edge
cases — invalid email, duplicate, empty field. *Only* on PASS does the orchestrator wake
the read-only Reviewer to check email validation, injection, error leakage. If QA fails,
it loops back to Frontend/Backend — nobody downstream wastes effort on broken work."
**Punchline:** "This ordering isn't politeness. It's structural. The gate is a barrier
the orchestrator enforces — quality you can't skip even if you're in a hurry."

> **MEANWHILE:** if the gate is running live, read the QA verdict off the pane. If it
> already passed, you're a step ahead — tee up the finale.

---

## Slide 8 — Plugins: package & share it (3 min)
**Say:** "Everything you've watched — the seven agents, the spin-up skill, the
ui-ux-pro-max + Figma + magic connections — packs into a **plugin**. One install and your
whole team has the Orchestra workflow. Capabilities stop being one person's setup and
become org infrastructure."
**Tie-off:** the four pillars compose — Skills + Agents + MCP, shipped as a Plugin, run as
a Team. "You don't rebuild this each time. You install it."

> **MEANWHILE:** Reviewer should be returning clean around here. Listen for the
> orchestrator's "it's live" — that's your cue into the finale.

---

## Slide 9 — Why this matters (business framing) (3 min)
For the non-eng half of the room:
- **Quality is structural, not hopeful** — independent review is built into the process via
  the QA→Reviewer barrier, not left to chance.
- **Speed from parallelism** — independent work (research∥design, frontend∥backend) runs
  concurrently. Two waves of two, not four things in a line.
- **Repeatable** — a skill means the *best* version of a workflow runs every time, for
  everyone, not just the expert who designed it.
- **Shareable** — plugins turn individual setups into team standards.

> **MEANWHILE:** confirm the live site is built and the Reviewer is clean. If anything
> slipped, this is your last graceful moment to switch to the **golden backup** before
> the finale (see runbook).

---

## Slide 10 — Finale: ship it, live (2 min)
**The payoff.** Bring up the finished Orchestra landing page — vibrant, the aurora hero
animating, the live counter showing "N builders in line."
1. Scroll it once so the room sees the motion the team built minutes ago.
2. **Type a real email into the waitlist form on stage and submit.** It hits the SQLite
   backend the Backend agent built; you get back "You're #N on the list."
3. Refresh — the live counter ticks up. "That number is real. It just wrote to a database
   an agent on this team built, behind a gate another agent enforced, in a design a third
   agent chose — while I was talking to you."
**Close:** "We didn't make the model smarter today. We gave it an org chart, real tools,
shared playbooks, and a quality gate — and that's where the leverage is. Start with one
skill and two agents. Add the gate. Grow the team."

---

## Appendix — Q&A prep (likely questions)
- *"Isn't this just more expensive?"* — Yes, more tokens; but parallelism cuts clock time
  and the review gate cuts rework/bugs. Cheaper models (sonnet) for the workers, the
  strong model (opus) for orchestrator + reviewer.
- *"Was the site really built live?"* — The team genuinely extends a pre-built base on
  stage; there's also a fully finished **golden backup** identical to the end state, in
  case timing slips. The honesty about the safety net *is* part of the talk.
- *"Can agents talk to each other directly?"* — Yes — `SendMessage` continues a specific
  running agent with its context intact; the orchestrator routes the handoffs.
- *"What stops it running forever?"* — The barriers. The orchestrator waits on explicit
  conditions (both Wave-1 outputs exist; QA returned PASS) and reports state; humans stay
  in the loop at each gate.
- *"Do I need all seven roles?"* — No. Start with Frontend + Reviewer (the gate). Add
  Backend, QA, Researcher, Designer, Orchestrator as the work justifies it.
- *"Why three design tools?"* — Because design is three jobs: decide the system
  (ui-ux-pro-max), store it as tokens (Figma), generate components from it (magic). Each
  pillar earns its place.
