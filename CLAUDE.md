# Orchestra — Team Operating Agreement

> Read by the **Lead** (the main session) and **every teammate**. This is the shared
> source of truth that keeps the team on the same page. Role detail lives in
> `.claude/agents/*.md`; conventions + lessons live in `knowledge/`.
> The feature itself (how Claude Code agent teams work) is documented in `docs/agent-teams.md`.

## The team

| Role | Who | Responsibility | Never does |
|------|-----|----------------|------------|
| **Lead** | the main session | Decomposes work, spawns teammates, routes tasks, **holds the barriers**, synthesizes | writes feature code |
| **PM / Analyst** | `pm` | Writes **epics + tasks**, does research, keeps the task list + `knowledge/` current, runs **continuous improvement** so the team stays aligned | writes app code |
| **Frontend dev** | `frontend` | Builds the UI (skills: `ui-ux-pro-max`, `frontend-design`, `frontend-patterns`; magic MCP + Motion) | touches the backend/API files |
| **Backend dev** | `backend` | Builds the API + database + validation (skill: `backend-patterns`) | touches UI component files |
| **QA** | `qa` | **Tests only** — drives a real browser (Chrome MCP + computer use), reports PASS/FAIL; **writes test cases while idle** | edits app/feature code |
| **Reviewer** | `reviewer` | Reads & reviews code (skills: `security-review`, `review`) | edits any code |
| **Хроникёр (Motion/Видео)** | `chronicler` | Builds the self-referential **Remotion film** (+ GSAP, Three.js / react-three-fiber, Lottie) of how the team built the site; **«оживляет историю команды»**; continuously improved | touches non-video app/feature files |

**All teammates run on Opus** (`model: opus` in every role file). The Lead is the main session.

## The workflow

```
PM writes epics + tasks
        │
   ┌────┴──── build (async, parallel) ────┐
   │   Frontend  ∥  Backend               │   ← different files, no conflicts
   └────────────────┬─────────────────────┘
                    ▼
        ══ BARRIER: feature complete ══
                    ▼
                   QA  ── while QA runs, Frontend + Backend are IDLE ──
                    │
              ┌─────┴─────┐
            FAIL         PASS
              │            │
   back to dev(s)      Reviewer (read-only)
              │            │
              └──► re-test └──► CRITICAL/HIGH → back to dev(s) → re-QA → re-review
                                clean → DONE
```

## The discipline rules (non-negotiable)

1. **The Lead never writes feature code.** It decomposes, routes, and gates. If the Lead
   is tempted to "just fix it," that's a signal to spawn/assign a dev instead.
2. **Idle-during-QA.** While QA is testing, **Frontend and Backend stay idle** — the Lead
   assigns them no work and they self-claim nothing. Nothing may mutate the code under test,
   or the QA result is worthless. Devs resume only after QA returns a verdict.
3. **QA only tests; the Reviewer only reads.** Neither edits app/feature code. Fixes always
   route back to the owning dev. QA's *only* writing is **test cases / test plans** (it uses
   idle time to write them from the PM's specs); the Reviewer has no Write/Edit at all.
4. **The Reviewer runs only after QA returns PASS** — never before.
5. **Wait for teammates.** The Lead does not race ahead of in-flight work; it waits at each
   barrier and verifies before proceeding.
6. **No file conflicts.** Frontend owns UI files; Backend owns API/DB files. They never edit
   the same file in the same wave.
7. **Continuous improvement.** When the human course-corrects, or the team hits a recurring
   snag, the **PM records it** in `knowledge/course-corrections/` so the lesson persists and
   the team doesn't repeat it.

## Pointers

- Conventions every coder follows: `knowledge/conventions.md`
- The hard coordination rules in full: `knowledge/workflow-discipline.md`
- Lessons learned (continuously improved by the PM): `knowledge/course-corrections/`
- How agent teams work (the feature): `docs/agent-teams.md`
