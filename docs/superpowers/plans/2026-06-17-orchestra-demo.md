# Orchestra Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full "golden" Orchestra demo — a vibrant, animated launch landing page for a fictional agent-orchestration product with a working SQLite-backed waitlist — plus the 7-agent team scaffold, a reveal.js deck, and rewritten talk docs.

**Architecture:** One Next.js (App Router) full-stack app. Landing page built from a ui-ux-pro-max-chosen design direction and 21st.dev magic MCP components, animated with Motion. Waitlist persisted in local SQLite via better-sqlite3, validated with zod. Supporting deliverables (agent files, reveal deck, docs) are independent and can be built in parallel.

**Tech Stack:** Next.js 14+ (App Router, TS) · Tailwind · shadcn/ui · motion/react · better-sqlite3 · zod · reveal.js (deck) · vitest (API tests).

## Global Constraints

- App lives in `orchestra-site/`; agents in `orchestra-team/`; deck in `presentation/slides/`.
- Design direction is **chosen by ui-ux-pro-max**, not hardcoded. Vibrant, animation-rich, not a flat dashboard.
- Components generated via **magic MCP**; icons/logos via magic `logo_search`.
- Waitlist: parameterized SQLite queries only; email validated with zod; dedup on email.
- Immutable patterns, small focused files (<400 lines), errors handled at boundaries, no `console.log` in committed code, no hardcoded secrets.
- No git repo present → use **checkpoints** (working app at each task) instead of commits. Offer `git init` separately.
- The finished app is the **golden backup**; do not delete it when wiring the live-extend path.

---

### Task 1: Design direction (ui-ux-pro-max)

**Files:** Create `orchestra-site/DESIGN.md` (the chosen direction — palette, type, motion, layout).

**Interfaces:**
- Produces: a concrete design system (style family, color tokens, font pairing, motion language, section layouts) consumed by Tasks 3–4 and the deck (Task 8).

- [ ] **Step 1:** Invoke the `ui-ux-pro-max` skill with the brief: "launch landing page for a developer-facing agent-orchestration product 'Orchestra'; vibrant, energetic, animation-forward, premium, avoid AI-slop; needs hero with email capture + live waitlist counter, feature trio, how-it-works, logo strip, footer."
- [ ] **Step 2:** Capture its output (style, palette hexes, font pairing, motion guidance, per-section layout) into `orchestra-site/DESIGN.md`.
- [ ] **Step 3 (checkpoint):** Confirm DESIGN.md has concrete hex values, named fonts, and a motion list — no "TBD".

### Task 2: Scaffold the Next.js app

**Files:** Create `orchestra-site/` (Next.js App Router, TS, Tailwind), `package.json`, `tailwind.config`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (placeholder).

- [ ] **Step 1:** `npx create-next-app@latest orchestra-site --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*"` (non-interactive flags).
- [ ] **Step 2:** Add deps: `npm i better-sqlite3 zod motion` and `npm i -D @types/better-sqlite3 vitest`.
- [ ] **Step 3:** Apply the DESIGN.md palette/fonts into `tailwind.config` + `globals.css` (CSS variables, font imports via `next/font`).
- [ ] **Step 4 (checkpoint):** `npm run dev` serves a blank styled page at localhost:3000 with the chosen background + fonts.

### Task 3: Landing page sections (magic MCP + Motion)

**Files:** Create `app/page.tsx`, `components/hero.tsx`, `components/features.tsx`, `components/how-it-works.tsx`, `components/logo-strip.tsx`, `components/waitlist-form.tsx`, `components/footer.tsx`.

**Interfaces:**
- Consumes: DESIGN.md (Task 1) tokens.
- Produces: `<WaitlistForm />` which POSTs to `/api/waitlist` (Task 5) and reads count from `/api/waitlist/count`.

- [ ] **Step 1:** Use magic MCP (`21st_magic_component_builder`) to generate the hero (animated, with email capture + a live counter slot), feature trio, how-it-works, and footer; `logo_search` for the logo strip.
- [ ] **Step 2:** Wire components into `app/page.tsx` in order; add Motion scroll-reveals + hover physics per DESIGN.md motion list.
- [ ] **Step 3:** Build `waitlist-form.tsx` as a client component with local state (idle/submitting/success/error) — but stub the fetch until Task 5.
- [ ] **Step 4 (checkpoint):** Page renders all sections, animates on scroll, looks vibrant (screenshot to verify).

### Task 4: Figma design artifact (consolidated, for the MCP beat)

**Files:** none local (Figma file).

- [ ] **Step 1:** Create one Figma file "Orchestra Launch"; in **one consolidated `use_figma` script**, create the token variables from DESIGN.md (avoid many small calls — we hit the rate limit before).
- [ ] **Step 2:** In a second consolidated script, lay out a hero frame using those tokens.
- [ ] **Step 3 (checkpoint):** `get_variable_defs` returns the tokens (this is the live "Claude reads the design back" moment). If rate-limited, the saved screenshot is the backup.

### Task 5: Waitlist backend (TDD — the one piece with real logic)

**Files:** Create `lib/schema.ts` (zod), `lib/db.ts` (better-sqlite3), `app/api/waitlist/route.ts`, `app/api/waitlist/count/route.ts`, `tests/waitlist.test.ts`.

**Interfaces:**
- Produces: `POST /api/waitlist {email}` → `{ position }` (201) | `{ error }` (400/409); `GET /api/waitlist/count` → `{ count }`.
- `lib/schema.ts` exports `waitlistSchema = z.object({ email: z.string().email() })`.
- `lib/db.ts` exports `addEmail(email: string): { position: number }` and `getCount(): number`, using parameterized statements; table `waitlist(id INTEGER PK, email TEXT UNIQUE NOT NULL, created_at TEXT)`.

- [ ] **Step 1: Write the failing test** (`tests/waitlist.test.ts`):
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { addEmail, getCount, _resetForTests } from '@/lib/db'

describe('waitlist db', () => {
  beforeEach(() => _resetForTests())
  it('adds an email and returns position 1', () => {
    expect(addEmail('a@b.com')).toEqual({ position: 1 })
    expect(getCount()).toBe(1)
  })
  it('dedups the same email (throws DUP)', () => {
    addEmail('a@b.com')
    expect(() => addEmail('a@b.com')).toThrow('DUP')
  })
  it('increments position for new emails', () => {
    addEmail('a@b.com')
    expect(addEmail('c@d.com')).toEqual({ position: 2 })
  })
})
```
- [ ] **Step 2: Run test, verify FAIL** — `npx vitest run tests/waitlist.test.ts` → fails (module not found).
- [ ] **Step 3: Implement `lib/db.ts`** with an in-memory SQLite for tests (`:memory:` when `NODE_ENV==='test'`, file otherwise), `addEmail` catching UNIQUE violation and throwing `Error('DUP')`, `getCount`, and `_resetForTests`.
- [ ] **Step 4: Run test, verify PASS.**
- [ ] **Step 5:** Implement `lib/schema.ts` and the two route handlers: POST validates with zod (400 on invalid), calls `addEmail` (409 on DUP), returns `{ position }`; GET returns `{ count }`. Errors return safe messages (no stack leak).
- [ ] **Step 6 (checkpoint):** `curl` POST a valid email → 201 `{position:1}`; POST again → 409; GET count → `{count:1}`.

### Task 6: Wire form ↔ backend + live counter

**Files:** Modify `components/waitlist-form.tsx`, `components/hero.tsx`.

- [ ] **Step 1:** Replace the form stub with a real `fetch('/api/waitlist', {POST})`; show success ("You're #N on the list") and error states.
- [ ] **Step 2:** Hero counter fetches `/api/waitlist/count` on mount and animates the number (Motion count-up).
- [ ] **Step 3 (checkpoint):** Submit in the browser → row persists, counter increments on refresh. This is the finale flow.

### Task 7: Agent team scaffold (parallelizable)

**Files:** Modify `orchestra-team/AGENTS.md`; create `.claude/agents/designer.md`, `frontend.md`, `backend.md`; update `developer.md`→split note, `qa.md` (Playwright), `.claude/skills/spin-up-orchestra/SKILL.md` (wire ui-ux-pro-max + magic + Figma), `scripts/tmux-orchestra.sh` (7 panes / 2 waves), `docs/agent-teams-spec.md` (2-wave DAG).

- [ ] **Step 1:** Write `designer.md` (ui-ux-pro-max + Figma MCP), `frontend.md` (magic MCP + Figma read), `backend.md` (API+SQLite+zod) in real subagent format.
- [ ] **Step 2:** Update `AGENTS.md` roster table + the 2-wave async/sync DAG.
- [ ] **Step 3:** Update the skill + tmux script + spec doc for 7 roles and Wave1∥Wave2 + gates.
- [ ] **Step 4 (checkpoint):** `bash scripts/tmux-orchestra.sh` builds a 7-pane layout; `kill` tears down.

### Task 8: reveal.js deck (parallelizable)

**Files:** Create `presentation/slides/index.html`, `presentation/slides/theme.css`.

- [ ] **Step 1:** Self-contained reveal.js via CDN; theme.css adopts the DESIGN.md palette.
- [ ] **Step 2:** Slides per spec §6 (opening, pillars, async/sync, design tooling, tmux, plugins/business, finale), each with a presenter note for "what the team is doing now."
- [ ] **Step 3 (checkpoint):** Open `index.html` → deck renders, arrow-key navigation works, matches product palette.

### Task 9: Rewrite talk docs (parallelizable)

**Files:** Modify `presentation/01-TALK-OUTLINE.md`, `02-DEMO-RUNBOOK.md`, `03-DESIGN-PROMPTS.md`, root `README.md`.

- [ ] **Step 1:** Rewrite outline for the 2-wave choreography (kickoff → Wave1 + slides → sync → Wave2 + slides → gate → finale).
- [ ] **Step 2:** Rewrite runbook: pre-flight, kickoff script, per-wave narration, sync points, the golden-backup switch, per-beat fallbacks.
- [ ] **Step 3:** Repurpose design-prompts doc as the ui-ux-pro-max + magic + Figma flow.
- [ ] **Step 4 (checkpoint):** README index reflects new structure (orchestra-site, slides, 7 agents).

### Task 10: Golden backup + final verification

- [ ] **Step 1:** Full run-through: `npm run build` succeeds; dev server serves; submit email works end-to-end.
- [ ] **Step 2:** Snapshot the working app state as the golden backup (note the run command in README).
- [ ] **Step 3 (checkpoint):** Everything in §9 success criteria of the spec is demonstrably true.

## Self-Review

- **Spec coverage:** product (T2,3,5,6) ✓ · team (T7) ✓ · choreography docs (T9) ✓ · design tooling ui-ux-pro-max/Figma/magic (T1,3,4) ✓ · deck (T8) ✓ · golden backup (T10) ✓ · vibrant/animated (T1,3) ✓.
- **Placeholders:** none — testable logic (waitlist) has full test+impl; visual tasks reference DESIGN.md concrete tokens.
- **Type consistency:** `addEmail`/`getCount`/`_resetForTests`, `waitlistSchema`, route shapes `{position}`/`{count}` used consistently across T5/T6.
