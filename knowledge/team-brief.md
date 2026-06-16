# Team Brief — Orchestra Launch Landing Page

> Living source of truth for the current build. Owned by the PM. Frontend + Backend build
> in parallel against the **API contract** below; QA tests against the **acceptance criteria**.

---

## 1. Epic

**Goal.** Ship a self-referential, vibrant **launch landing page for "Orchestra"** — a fictional
AI agent-orchestration product whose pitch is *"conduct a team of AI agents."* The page sells the
idea and captures demand through a **real, SQLite-backed waitlist**: a visitor enters their email,
gets told their place in line ("You're #N on the list"), and sees a **live counter** of how many
builders are already waiting. The page is itself a demo of the product's promise — it was built by
a team of orchestrated agents, and it says so.

**Value prop.** Stop babysitting one AI agent at a time. Orchestra lets you run a whole team of
specialist agents in parallel — plan, build, test, review — with quality gates between each phase,
so you ship faster *and* trust what ships.

**Target audience.** Developers and engineering teams already using AI coding assistants who want
to move from single-agent pair-programming to **multi-agent orchestration** — tech leads, indie
builders, and small product teams who feel the ceiling of one-agent-at-a-time.

---

## 2. Copy (real — use verbatim or lightly tuned; no lorem)

### Hero
- **Eyebrow:** Now forming the first section.
- **Headline:** **Conduct a team of AI agents.**
- **Subhead:** Orchestra turns one assistant into a coordinated crew — agents that plan, build,
  test, and review in parallel, with quality gates between every phase. Ship faster, trust what ships.
- **Primary CTA (button):** Join the waitlist
- **Email field placeholder:** you@company.com
- **Success state:** You're **#{N}** on the list.
- **Micro-trust line (under field):** No spam. One launch email. Unsubscribe anytime.
- **Live counter:** **{count}** builders already in line.

### Feature trio (three real benefits)
1. **Run agents in parallel** — Frontend, backend, tests, and docs move at once instead of one
   ticket at a time. Wall-clock time collapses to your slowest task, not the sum of all of them.
2. **Quality gates, not vibes** — Every phase clears a barrier before the next begins. An
   independent agent tests the work and a separate reviewer reads it — no agent grades its own homework.
3. **Ship faster, with receipts** — Parallel build, gated review, and a clear audit trail mean you
   merge with confidence and a record of who did what, when.

### How it works (3 steps)
1. **Describe the work.** Hand Orchestra a goal. It decomposes the work into an epic and small,
   self-contained tasks with clear owners.
2. **The team builds in parallel.** Specialist agents claim tasks and work side by side — no
   collisions, no waiting in line.
3. **Gates keep it honest.** QA tests the running result; a read-only reviewer signs off. Only
   clean, verified work reaches you.

### Logo strip
- **Caption:** Built by an orchestrated team of agents — the same way you'll build with Orchestra.
  *(Logo strip shows the section roles: Plan · Build · Test · Review · Ship.)*

### Footer
- **Tagline:** Orchestra — conduct a team of AI agents.
- **Line:** A self-referential demo: this page was planned, built, tested, and reviewed by a team
  of AI agents working in parallel.
- **Legal:** © 2026 Orchestra. A fictional product, for demonstration. · Privacy · Terms

---

## 3. Acceptance criteria (testable — for QA)

### Happy path
- **AC1.** Entering a valid, new email and submitting returns success: the UI shows **"You're #N
  on the list"** where N is a positive integer (the position assigned by the backend).
- **AC2.** On a successful join, the **live counter increments** to reflect the new total (matches
  the `count` returned by the API and `GET /api/waitlist/count`).
- **AC3.** On page load the live counter shows the current real count from `GET /api/waitlist/count`
  (not a hardcoded number).

### Edge cases
- **AC4. Invalid email rejected.** Submitting a malformed email (e.g. `foo`, `foo@`, `a@b`) is
  blocked with a clear, human-readable message (e.g. "Enter a valid email address"). No row is added;
  counter unchanged. API responds `400`.
- **AC5. Duplicate email handled gracefully.** Submitting an email already on the list does **not**
  create a second row and does **not** error out hard — the user sees a friendly message
  (e.g. "You're already on the list — hang tight."). API responds `409 { already: true }`.
  Counter does not double-count.
- **AC6. Empty submission blocked.** Submitting with an empty field is prevented client-side and,
  if it reaches the server, returns `400`. No row added.
- **AC7. Double-submit safe.** Rapidly clicking submit twice (or pressing Enter twice) does not
  create duplicate rows or inflate the counter; the button is disabled / request de-duped while in
  flight. Final state is identical to a single submit.
- **AC8. Whitespace / case.** Emails are trimmed and compared case-insensitively so `A@b.com ` and
  `a@b.com` are treated as the same person (no duplicate row).
- **AC9. Safe errors.** Error responses never leak stack traces or internal details; messages are
  short and user-facing.
- **AC10. Persistence.** A joined email survives a server restart (SQLite-backed, not in-memory).

**QA should pay special attention to:** AC5 + AC7 + AC8 together (the dedupe path is the most
likely place for the counter to drift) and AC3/AC2 consistency (counter must always equal the DB count).

---

## 4. API contract (frozen — Frontend + Backend build against this in parallel)

Both endpoints live under `/api/waitlist` (Next.js App Router Route Handlers). JSON in, JSON out.

### `POST /api/waitlist`
- **Request body:** `{ "email": string }`
- **Success — `201 Created`:** `{ "position": number, "count": number }`
  - `position` = this email's 1-based place in line; `count` = total on the list after the insert.
- **Invalid input — `400 Bad Request`:** `{ "error": string }`
  - Triggered by: missing/empty email, malformed email (fails zod `.email()`).
- **Duplicate — `409 Conflict`:** `{ "error": string, "already": true }`
  - Email already present (after trim + lowercase). Body still safe to display.

### `GET /api/waitlist/count`
- **Success — `200 OK`:** `{ "count": number }` — current total on the waitlist.

**Shared rules (both roles honor):**
- Validate with **zod** at the boundary; normalize email (trim + lowercase) before insert/compare.
- **Parameterized SQL only**; unique index on the normalized email so the DB enforces dedupe too.
- Errors are caught and returned as safe `{ error }` — never raw exceptions.
- Frontend treats the contract as fixed: render `position`/`count` on `201`, the friendly
  already-in-line state on `409`, and the field-level error on `400`.

---

## 5. Task list (split by owner)

Both tracks build **in parallel** against the contract in §4. No shared files: Backend owns
`app/api/**`, the DB module, and validation; Frontend owns `app/page.tsx`, components, and styles.
The **only** coupling is the contract — agreed above, so neither blocks the other.

### Backend (owns API / DB / validation)
- **B1 — SQLite store + schema.** `better-sqlite3` waitlist table (`id`, `email`, `created_at`),
  **unique index on normalized email**, helper module. *AC:* table created on boot; insert + count
  helpers return correct values; survives restart (AC10). *Dep:* none.
- **B2 — Validation schema.** zod schema for `{ email }`; normalize (trim + lowercase). *AC:* valid
  email passes; `foo`, `foo@`, empty fail (AC4, AC6, AC8). *Dep:* none.
- **B3 — `POST /api/waitlist`.** Route Handler: validate → normalize → insert → return
  `201 { position, count }`. *AC:* AC1, AC2 shape correct. *Dep:* B1, B2.
- **B4 — Duplicate + error handling.** Catch unique-constraint / pre-check → `409 { error, already:true }`;
  validation failure → `400 { error }`; all errors safe (AC9). *AC:* AC4, AC5, AC8 satisfied; no double-count.
  *Dep:* B3.
- **B5 — `GET /api/waitlist/count`.** Route Handler returning `{ count }` from the DB. *AC:* AC3 — equals
  real row count. *Dep:* B1.
- **B6 — Idempotency / concurrency safety.** Ensure rapid double-POST of same email can't create two
  rows (unique index + transaction). *AC:* AC7 at the data layer. *Dep:* B1, B3.

### Frontend (owns UI / components / page)
- **F1 — Page scaffold + design tokens.** Hero, feature trio, how-it-works, logo strip, footer
  laid out per §2 copy. Direction chosen via `ui-ux-pro-max`; tokens recorded once. *AC:* all §2 copy
  present; responsive; respects `prefers-reduced-motion`. *Dep:* none (uses static copy).
- **F2 — Waitlist form component.** Email input + "Join the waitlist" button, client-side empty/format
  guard. *AC:* AC6 client guard; accessible labels. *Dep:* contract (§4).
- **F3 — Submit + success state.** POST to `/api/waitlist`; on `201` render "You're #N on the list".
  *AC:* AC1. *Dep:* F2, contract; pairs with B3.
- **F4 — Error + duplicate states.** Render `400` field message and the friendly `409` already-in-line
  message; never crash on error. *AC:* AC4, AC5, AC9 (UI side). *Dep:* F2, contract; pairs with B4.
- **F5 — Live counter.** Fetch `GET /api/waitlist/count` on load; increment/refresh on successful join.
  *AC:* AC2, AC3. *Dep:* F3, contract; pairs with B5.
- **F6 — Double-submit guard + polish.** Disable button / de-dupe request while in flight; Motion
  transitions on success and counter; SVG icons (Lucide), no emoji. *AC:* AC7 (UI side). *Dep:* F3.

**Sequencing note for the Lead:** B1/B2 and F1 have no dependencies — start them immediately.
The barrier is **feature complete** (page renders *and* both endpoints respond) before QA runs.
During QA, Frontend + Backend stay **idle**.

**Open questions (none blocking):**
- Counter live-refresh: poll vs. refresh-on-submit only? Default to **refresh-on-submit + on-load fetch**
  (no polling) unless Frontend's design calls for more. Flag to Lead if changed.
- Position semantics on duplicate: a `409` returns no new position by contract; UI shows the
  already-in-line message rather than a stale "#N". Confirmed in §4.

---

### References (light scan — informed the copy)
- *Waitlist Landing Page: Examples & Best Practices* (Moosend) — hero leads with early-access value;
  email field + CTA in the hero to cut steps to sign up.
- *Waitlist Landing Page Examples: 25 That Convert* (Flowjam) — structure beats budget; clear headline,
  single CTA, and social proof (our live counter) drive 8–20% conversion.
- *AI Agent Orchestration Patterns* (Microsoft Azure Architecture Center) — "concurrent orchestration":
  multiple agents run on the same goal in parallel, each from its own specialization — the core of our pitch.
