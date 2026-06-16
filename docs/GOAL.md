# GOAL — the north star

> The single source of truth for *what we're building and why*. The Lead and PM keep this
> sharp; every teammate reads it before working. Iterate until this is genuinely, visibly true.

## What we're building

A **self-referential presentation website** — built by this very Claude Code agent team —
that tells the story of **how an agentic team works in Claude Code**. The site is the
presentation. It is NOT a fake product; it is an honest, well-told case study of *itself*.

## It must show (the content)

1. **The goal** — a dedicated **`/goal`** page stating this very goal, plainly.
2. **How Claude Code agent teams work** — lead + teammates, shared task list, mailbox,
   subagent-definition roles; async vs. sync; barriers. (Grounded in `docs/agent-teams.md`.)
3. **The agents we actually used** — a **character page per agent**: Lead/Orchestrator, PM,
   Frontend, Backend, QA, Reviewer. Each with role, model (Opus), tools, personality, and the
   real work it did on *this* site.
4. **The structure we used** — the 2-wave async/sync flow, the feature-complete barrier, the
   **idle-during-QA** rule, the QA→Reviewer gate.
5. **The skills, MCPs, and plugins used along the way** — name them and what each did:
   skills (brainstorming, writing-plans, ui-ux-pro-max, frontend/backend-patterns,
   security-review, the taste skills, presentation skills), MCPs (Figma, 21st magic,
   Chrome/claude-in-chrome, Playwright), plugins (ui-ux-pro-max, everything-claude-code, figma).
6. **The mistakes we made** — honestly. Sourced from `knowledge/course-corrections/`:
   the Lead hand-coded (bad), QA scope was ambiguous, the first design "looked so bad," the
   full reset, the Figma rate-limit. Mistakes → lessons. This honesty is the best part.

## The mandate — three dials (the loop's real purpose)

This is a **presentation to the team/company**. Every iteration must push ALL THREE:

0. **Visually excellent (top priority, never "done")** — the craft bar keeps rising:
   the light-editorial system, typography, the avatars, motion, the film. Each loop
   should make it look *better*, not just add features. Hold the design-brief bar
   (warm paper, Cyrillic premium type, double-bezel, restrained premium motion); never
   regress it; keep reaching for the $150k-agency / award feel.
1. **Exciting** — it must grab and hold attention. Memorable, alive, a little playful;
   one signature moment per section (the message thread, the org chart, the avatars,
   the film). Not a wall of text; a thing people *want* to scroll.
2. **Educational about Claude Code's intricate usage** — the audience should leave
   actually knowing *how* to do this: the real mechanics, named and accurate —
   **skills** (and how we used ui-ux-pro-max, frontend/backend-patterns, the taste
   skills, remotion, svg-animation…), **MCP** (Figma, 21st magic, Chrome/computer-use,
   Playwright — what each did), **plugins**, and **agent teams** (the lead+teammates
   model, subagent-definition roles, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`,
   SendMessage/mailbox, the shared task list, barriers, idle-during-QA, hooks). Teach
   through the story, with honest "под капотом" detail — enough that a viewer could
   reproduce it.

The loop continuously raises both dials. Research only serves this; the output of each
loop iteration is a concrete improvement to excitement and/or teaching value — not a memo.

## Non-negotiables

- **Language: Russian.** All visitor-facing copy is in Russian. (Code, comments, docs stay English.)
- **Design: light, editorial, high-end, tasteful.** NOT dark. NOT generic AI-slop (no neon
  glow, no purple gradients on black, no centered-hero-over-mesh). Think a beautifully typeset
  engineering case study / editorial feature with real personality and craft. Use the taste +
  high-end-visual-design skills to get there.
- **Self-referential and honest** — it documents its own making, mistakes included.
- **Quality bar:** it should look like something a great design studio shipped. We iterate
  (build → screenshot → critique → improve) until it clears that bar. We do not settle.

## Routes (initial)

- `/` — the story (hero → how teams work → structure → skills/MCP/plugins → mistakes → agents).
- `/goal` — this goal, stated plainly (in Russian).
- `/agents` and `/agents/[role]` — the six character pages.

## How we iterate

Lead (orchestrator) + PM refine the concept; Frontend rebuilds the design to the taste bar;
Backend keeps any interactive proof (e.g. a small "leave a note" backed by SQLite, reframed as
"the backend agent's contribution"); QA tests; Reviewer reviews. The Lead reviews real
screenshots each round and pushes until it's genuinely good — not mediocre.
