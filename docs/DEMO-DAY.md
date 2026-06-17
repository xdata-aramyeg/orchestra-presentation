# Demo Day — presenting the Orchestra site

The site **is** the presentation: a self-referential Russian website that documents how a
Claude Code agent team built it. Walk the audience through it live and narrate the four
pillars (**Skills · MCP · Plugins · Agent Teams**) against what they see on screen.

## Launch it (do this before you present)

```bash
cd orchestra-site
npm install            # first time only
npm run build          # IMPORTANT: build (not dev) so the real git hash bakes into the footer
PORT=4000 npm run start # → http://localhost:4000
```

- Use **`npm run start`** (production), not `npm run dev` — dev shows a `dev` fallback in the
  build-hash footer; the built server stamps the real commit hash + date.
- **Reset the waitlist** so the live counter starts clean for the finale:
  `rm -f orchestra-site/waitlist.db*` then restart. (Persists across restarts otherwise — that's AC10.)
- Bump terminal/browser font, dark-hide notifications, zoom the browser for the back row.

## The live walk-through (top to bottom)

1. **Hero** — «Эту страницу построила команда ИИ-агентов. Вот как — и где мы ошиблись.» Open on
   the meta-fact: *the page you're looking at built itself.* Point at the live stat row (7 agents · 2 waves · …).
2. **Как работают команды** — lead vs teammates; subagents that don't talk vs a team that shares a
   task list + mailbox. (Pillar: **Agent Teams**.)
3. **Наша структура** — the two waves, the **barrier**, the dark **idle-during-QA** callout. Then the
   **interactive org chart** — hover a node to highlight its lane/files; it links to that agent.
4. **«Послушайте, как переговаривается команда»** — the real Lead↔teammate↔human thread; hit **▶ повторить**.
   The blunt human lines («Это ужасно. Оркеструй, а не кодь.» / «выглядит ужасно… сделай лучше») are the point.
5. **Скиллы · MCP · плагины** — name them. Open a **«под капотом»** toggle on any section for the real
   mechanic. (Pillars: **Skills**, **MCP**, **Plugins**.)
6. **«Лучшая часть — места, где мы облажались»** — the honest mistakes + the vermilion pull-statement.
   Honesty is the strongest trust move.
7. **«ОРКЕСТР»** — scroll through it slowly; the weight *breathes* (variable-font on scroll).
8. **«Как это устроено / Повторите сами»** — the teaching cards + the **copyable config snippets**
   (click «Скопировать» on the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` flag — "paste-and-go").
9. **`/agents`** — the seven avatars; hit **«Сыграть»** to run the conducted "tuning-up" choreography.
   Click into a character page (e.g. **Маэстро**).
10. **`/film`** — play the ~75s self-referential film: kinetic cold-open → team assembles → two waves →
    barrier → QA rings the Камертон (devs idle) → review → reset → **the 3D org-graph beat** → the site
    builds itself → «Этот фильм тоже сделан командой.»
11. **Easter egg** — press **`` ` ``** (backtick) → the hidden terminal → type `whoami`
    («сайт, который построил себя»), `team`, `stack`, `open film`. Great audience moment.
12. **Finale** — submit a real email in the waitlist → «You're #N». Then point at the **footer build hash**:
    "that's the real commit of this exact build."

## Run the team LIVE on stage

The team is real (`.claude/agents/*.md` — pm, frontend, backend, qa, reviewer, chronicler;
agent-teams enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `.claude/settings.local.json`).
You can have it improve **this very site** during the talk.

### Setup (before you start the segment)
- In one terminal pane, run the site in **dev** so the audience sees edits appear live:
  `cd orchestra-site && npm run dev` (→ localhost:3000). Hot-reload shows each change instantly.
- In another pane, start Claude Code **from the repo root** (`AgentTeams/`, where `CLAUDE.md`
  + `.claude/agents` + the agent-teams flag live): run `claude`.
- (Optional, looks great) you're already in tmux from the «Повторите сами» section — the
  teammates split into their own panes so the audience watches them work in parallel.

### Quick version — the roll call + QA drives the live site (best for *showing the spawn*)
Fast, safe, no code touched — the team assembles, then QA demonstrates real browser control on the
**deployed** site. Paste verbatim:
> You are the Lead / orchestrator of the Orchestra agent team — read CLAUDE.md. We're live on stage.
> 1. Spawn all six teammates — pm, frontend, backend, qa, reviewer, chronicler — and have EACH send
>    back ONE short line introducing itself: its role, the files it owns, and one line of
>    personality, in Russian (our project voice).
> 2. Then have the **qa** teammate show real browser control on our LIVE site: using the Chrome MCP,
>    open https://orchestra-presentation.vercel.app , go to /agents and trigger the avatar «Сыграть»
>    choreography, then press the backtick key to open the hidden terminal and run `team`. Capture a
>    screenshot or short gif as evidence and report what it saw. READ-ONLY — do not submit the
>    waitlist or change anything.
> Do NOT touch any code. When QA is done, print a one-line roster + QA's verdict and stop.

In tmux you'll watch six panes spring open as they spawn, each reports in, then QA's pane drives a
real Chrome window on the live URL — the audience sees the agent *click through your deployed site*.
~1–2 min, no risk to code or the prod DB.

(Want the full-stack money shot instead? Tell QA to **submit a throwaway email to the live waitlist**
and read back "You're #N" — that proves browser → API → Supabase end-to-end. Then reset the counter
afterward: `truncate table public.waitlist restart identity;` via the Supabase MCP/SQL editor.)

### Full version — the team does real work (paste this verbatim)
> You are the Lead / orchestrator of the Orchestra agent team — read CLAUDE.md. We are LIVE in
> front of an audience; the goal is to *show* how the team works on this very website
> (`orchestra-site/`). Orchestrate — do NOT write feature code yourself.
>
> Run a short, safe, narrated loop:
> 1. Work on a throwaway branch `live-demo` so everything is reversible.
> 2. As Lead, pick ONE small, low-risk, self-contained VISUAL improvement (a micro-interaction,
>    a hover detail, a spacing/typography polish, a small accent). Do NOT touch the backend / API /
>    DB / waitlist, the Remotion film, or the build config.
> 3. Assign it to the `frontend` agent; narrate what's happening. Frontend stays in its own UI
>    files and must keep the build clean, 0 console errors, and 0 horizontal overflow at 375px.
> 4. BARRIER: when frontend reports done, it goes idle and `qa` tests the change in a real browser
>    and reports PASS/FAIL with evidence. Nothing else edits code while QA runs (idle-during-QA).
> 5. PASS → `reviewer` (read-only) reads the diff. FAIL → back to `frontend`, then re-QA.
> 6. Summarize what shipped in one line, then STOP and wait for me to say "next" before the next
>    improvement. Keep each cycle small and quick — this is a live demo, not a marathon.
>
> Begin now: announce the team, pick the first improvement, and assign it.

Say **"next"** to run another cycle. (Want it hands-off instead? add *"repeat 3 cycles without
pausing"* — but pausing reads better on stage so you can narrate each barrier.)

### Teardown (after the segment)
- Discard the demo work: `git checkout master && git branch -D live-demo`
  (or `git checkout -b keep-demo` first if you liked a change and want to keep it).
- See `docs/agent-teams.md` for the real mechanics; `knowledge/course-corrections/` for the lessons.

## Backups / restore (nothing is at risk)
- **Tags** (milestones): `verified-milestone-film`, `milestone-film3d`, `milestone-terminal`, … (`git tag`).
- **Branches:** `backup/loved-design`, `backup/loved-milestone`, `archive/v1-build` (the scrapped v1).
- **Portable bundles on disk:** `../AgentTeams-verified.bundle` (+ others) — restore with
  `git clone ../AgentTeams-verified.bundle restored && cd restored && git checkout <tag>`.
- Revert one feature: `git revert <hash>`; or hard-reset to a tag: `git reset --hard <tag>` (commit/stash first).

## If something breaks on stage
- The film/terminal/3D all degrade gracefully (poster-first Player, reduced-motion paths). If a
  live build slips, `git checkout verified-milestone-film` is a known-good fallback.
- Console should be **0 errors** on every route — if you see errors, you're on `dev`; rebuild + `start`.
