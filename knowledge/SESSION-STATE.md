# Session State — resume here after compaction

> Working-state handoff for the Lead (main session). The repo is the source of truth; this file
> is the "where we are / how to continue" pointer. Last updated mid-session, pre-compaction.

## What this project is
A **self-referential Russian presentation website** built by a Claude Code **agent team**, that
documents its own making (a live tutorial on Skills · MCP · Plugins · Agent Teams). Full overview:
**`README.md`**. North star: **`docs/GOAL.md`** (three dials: visual · exciting · educational).

## Current status — COMPLETE & VERIFIED, in measured-polish/hold mode
The site (`orchestra-site/`, Next 16 + Tailwind v4 + Motion + Remotion + better-sqlite3 + zod) is
fully built and gate-verified. All 6 routes serve 200: `/`, `/goal`, `/agents`, `/agents/[slug]`,
`/film`, plus `/api/waitlist`. Features: editorial home (org chart, "watch the agents talk" thread,
timeline, mistakes, educational «под капотом» + «Повторите сами» + copyable snippets, section-nav,
the «ОРКЕСТР» weight-on-scroll moment, build-hash footer), 7 animated avatars + a "tuning-up"
choreography, the ~75s Remotion film (kinetic type, diegetic UI, a 3D org-graph beat), hidden
terminal (press `` ` ``), live waitlist. Presenter guide: **`docs/DEMO-DAY.md`**.

## How to run / verify
```bash
cd orchestra-site && npm run build && PORT=4000 npm run start   # → localhost:4000 (use build+start, not dev, for the real footer hash)
```
Server is launched as a background bash task (ID changes per restart — relaunch if down).
Reset waitlist for a clean counter: `rm -f orchestra-site/waitlist.db*`.

## Verification discipline (KEEP DOING THIS for any change)
Before committing ANY site change: `npm run build` clean + load the route(s) and confirm
**0 console errors** + **0 horizontal overflow at 375px** (scroll the whole page; classic bug =
a `grid` missing its `grid-cols-1` base, or long mono tokens without `min-w-0`/`break-words`).
Commit each feature separately + tag + refresh the bundle. Back up (tag) before risky steps.

## The team & how the Lead works
- Lead = main session — **orchestrates, never writes feature code**; spawns teammates via the
  registered subagent types: `frontend`, `backend`, `qa`, `reviewer`, `chronicler`, `pm` (all Opus).
- Roles: `.claude/agents/*.md`. Agreement: `CLAUDE.md`. KB: `knowledge/` (+ `course-corrections/`).
- ⚠️ **Teammate idle-notifications don't relay the agent's verdict text** — the Lead verifies
  results itself (build + screenshots + console/overflow checks) rather than waiting for a report.
- Two-wave async/sync model, barriers, idle-during-QA. Reference: `docs/agent-teams.md`.

## Open / optional (nothing required)
- **Site width:** content is capped at ~1200px (`components/ui/section.tsx:23` `max-w-[1200px]` +
  `app/globals.css` `--container-editorial: 1200px`). User asked why it looked narrow; **they say
  it's fine now — no change unless they ask.** If they want wider: bump both to ~1400px and/or
  full-bleed the hero/org-chart/film/«ОРКЕСТР» sections (text columns stay readable).
- Remaining optional flourishes (NOT started, only if asked): CC0 ambient audio track for the film.
- We are intentionally **holding** — no new risky features; act on specific user direction.

## The /loop (self-paced)
Recurring "research + improve the presentation (visual/exciting/educational)" loop, dynamic mode
(2.5h has a decimal → self-paced). Re-armed each tick via ScheduleWakeup (~30-min heartbeat while
holding). The verbatim prompt is in the ScheduleWakeup call. The user re-issues `/loop` manually too.

## Backups (nothing is at risk)
Milestone **tags** (`git tag`): `verified-milestone-film`, `milestone-film3d`, `milestone-terminal`,
`milestone-choreo`, `milestone-varfont`, `loved-*`, `pre-3d-backup`, etc. **Branches:**
`backup/loved-design`, `backup/loved-milestone`, `archive/v1-build` (scrapped dark v1). **Portable
bundles on disk:** `../AgentTeams-verified.bundle` (+ others). Restore: `git clone <bundle>`.
