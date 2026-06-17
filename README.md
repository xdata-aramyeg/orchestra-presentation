# Orchestra — a self-referential presentation built by a Claude Code agent team

A **Russian-language presentation website that documents its own making.** A team of Claude
Code agents — a lead/orchestrator plus PM, frontend, backend, QA, reviewer, and a video
"chronicler" — designed, built, tested, reviewed, and filmed this site, and the site tells
that story honestly (mistakes included). It's a live tutorial on **Skills · MCP · Plugins ·
Agent Teams**.

> The premise: *the page you're looking at built itself* — and it shows you how.

## Run it

```bash
cd orchestra-site
npm install
npm run build          # build (not dev) so the real git hash bakes into the footer
PORT=4000 npm run start # → http://localhost:4000
```

Then walk it top to bottom, or jump to: `/goal`, `/agents`, `/film`. Press **`` ` ``** anywhere
for the hidden terminal. Full presenter guide: **[`docs/DEMO-DAY.md`](docs/DEMO-DAY.md)**.

## What's in the site (`orchestra-site/`)
Next.js 16 · TypeScript · Tailwind v4 · Motion · Remotion (`@remotion/player` + `@remotion/three`)
· better-sqlite3 · zod. Light-editorial, warm-paper design (Unbounded / Onest / JetBrains Mono).

- **`/`** — the story: hero → how teams work → two-wave structure (idle-during-QA) → interactive
  **org chart** → **"watch the agents talk"** thread → skills/MCP/plugins → honest **mistakes** →
  build **timeline** → educational **«под капотом» + «Повторите сами»** (with copyable config) →
  film teaser → footer (real build hash). Sticky section-nav; the «ОРКЕСТР» weight-on-scroll moment.
- **`/agents`** + **`/agents/[slug]`** — seven animated SVG avatars + a conducted "tuning-up"
  choreography; a character page per agent.
- **`/film`** — a ~75s self-referential Remotion film (kinetic type, diegetic UI, a **3D** org-graph beat).
- **`/goal`** — the goal, stated plainly.
- **`/api/waitlist`** — a real SQLite-backed waitlist (the live finale).

## The team & how it worked
- **Roles:** [`.claude/agents/`](.claude/agents) — `pm`, `frontend`, `backend`, `qa`, `reviewer`,
  `chronicler` (the Lead is the main session). All on Opus.
- **Operating agreement:** [`CLAUDE.md`](CLAUDE.md) — the workflow + the discipline rules
  (lead never codes · two async waves · barriers · **idle-during-QA** · QA→Reviewer gate).
- **Knowledge base:** [`knowledge/`](knowledge) — `conventions.md`, `workflow-discipline.md`,
  and **`course-corrections/`** (the lessons that kept the team on track), plus all the planning
  and content artifacts (brief, design brief, film script, research, educational layer…).
- **The feature itself:** [`docs/agent-teams.md`](docs/agent-teams.md) — a faithful reference for
  Claude Code agent teams (the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` flag, subagent-role files,
  mailbox/`SendMessage`, the shared task list, barriers, hooks, limits).

## Docs
| File | What |
|------|------|
| [`docs/GOAL.md`](docs/GOAL.md) | The north star — the three dials (visual · exciting · educational) |
| [`docs/DEMO-DAY.md`](docs/DEMO-DAY.md) | Presenter runbook — launch, the 12-beat walk-through, fallbacks |
| [`docs/agent-teams.md`](docs/agent-teams.md) | Claude Code agent-teams reference |
| [`CLAUDE.md`](CLAUDE.md) | The team's operating agreement (read by lead + every teammate) |

## The four pillars, mapped to the repo
- **Skills** — `ui-ux-pro-max`, `frontend-design`, `frontend/backend-patterns`, `security-review`,
  `remotion`, `motion-graphics`, `svg-animation`, the taste skills, `brainstorming`, `writing-plans`.
- **MCP** — Figma (design↔tokens), 21st.dev magic (components), Chrome/claude-in-chrome + computer-use
  (QA drove a real browser), Playwright.
- **Plugins** — bundle skills + agents + MCP; shared via project/user settings.
- **Agent Teams** — `.claude/agents/*` + `CLAUDE.md` + the lead's two-wave async/sync control.

## Safety / restore
Every milestone is a git **tag** (`git tag`), with **branches** (`backup/loved-design`,
`archive/v1-build`, …) and portable **bundles** on disk (`../AgentTeams-*.bundle`). Restore with
`git clone ../AgentTeams-verified.bundle restored`. Nothing is unbacked.

---
*Made by a team of AI agents — including the mistakes. The footer stamps the real commit hash of
whatever build you're viewing.*
