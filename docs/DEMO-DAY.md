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

## (Optional) Run the team live
If you want to show the agents *working*, the team is real: `orchestra-team/`-style roles are
in `.claude/agents/*.md` (pm, frontend, backend, qa, reviewer, chronicler), agent-teams enabled
via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `.claude/settings.local.json`. Knowledge +
course-corrections live in `knowledge/`. See `docs/agent-teams.md` for the real mechanics.

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
