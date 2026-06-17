# QA Test Cases — Orchestra Launch Landing Page

> Owner: **QA** (Orchestra team). Source: acceptance criteria AC1–AC10 (team-brief §3) +
> API contract (team-brief §4). These are **browser-based** test cases executed via the
> **Chrome MCP + computer use** against the running app. They verify **observable behavior**
> (rendered text, counter values, console, network), never code internals.
>
> **Status:** written during productive idle (feature not yet built). **Do not execute yet** —
> run only after the Lead confirms the "feature complete" barrier (page renders + both
> endpoints respond). This is the only document QA writes; QA never edits app code.

---

## Environment & setup

- **App under test:** Next.js app in `orchestra-site/`, started with `npm run dev`
  (default `http://localhost:3000`). Confirm actual port from the Lead/dev at run time.
- **Endpoints (frozen contract, team-brief §4):**
  - `POST /api/waitlist` → `201 { position, count }` / `400 { error }` / `409 { error, already:true }`
  - `GET  /api/waitlist/count` → `200 { count }`
- **Data store:** SQLite (`better-sqlite3`). Tests assume a **known baseline count** — record it
  at the start of each run via `GET /api/waitlist/count` so increments can be checked relatively
  (do not assume the DB starts empty).
- **Tools:** `navigate`, `read_page` / `get_page_text`, `computer` (click/type), `find`,
  `read_console_messages`; optionally `gif_creator` for evidence of the happy path and
  high-risk dedupe cases.
- **Test email convention:** use unique, timestamped addresses to avoid collisions with prior
  runs, e.g. `qa+<runid>-<n>@orchestra.test`. Reserve one fixed address per dedupe/case where a
  duplicate is required (note it in the step).

### Counter-consistency invariant (applies throughout)
At **all** times the on-screen live counter, the `count` field in any `POST` response, and the
value from `GET /api/waitlist/count` must be **mutually equal** and equal to the real DB row
count. Any drift between these three is a **FAIL** (flag against AC2/AC3 and the relevant case).

---

## Test cases

### TC1 — Valid new email returns success with position (AC1)
**Maps to:** AC1 · **Priority:** P0 (happy path)
**Preconditions:** App loaded; record baseline count `C0` from `GET /api/waitlist/count`.
**Steps:**
1. `navigate` to the app root URL.
2. `read_page` and confirm the waitlist email field (placeholder `you@company.com`) and the
   **"Join the waitlist"** button are visible.
3. Click the email field and type a unique valid email, e.g. `qa+run-tc1@orchestra.test`.
4. Click **"Join the waitlist"**.
**Expected observable result:**
- The UI replaces/augments the form with the success message **"You're #N on the list"**, where
  `N` is a **positive integer** (the backend-assigned position).
- No error text appears; no console errors (`read_console_messages`).
- `N` is consistent with a 1-based position in the list (for a fresh DB, the first signup shows
  `#1`; otherwise `N == C0 + 1`).

---

### TC2 — Live counter increments on successful join (AC2)
**Maps to:** AC2 · **Priority:** P0
**Preconditions:** App loaded; note the on-screen counter value `K0` ("{count} builders already
in line.") before submitting.
**Steps:**
1. `navigate` to the app root; read and record the displayed counter `K0`.
2. Submit a unique valid email (as in TC1).
3. After the success state renders, `read_page` and read the counter again → `K1`.
4. Call `GET /api/waitlist/count` (via browser `navigate` to the endpoint or network read) → `Capi`.
**Expected observable result:**
- `K1 == K0 + 1`.
- `K1 == Capi` and `K1 == count` from the POST response (counter-consistency invariant).
- The counter updates **without a full manual page reload** (refresh-on-submit per design).

---

### TC3 — Counter shows real count on page load (AC3)
**Maps to:** AC3 · **Priority:** P0
**Preconditions:** Know the current real count `Capi` from `GET /api/waitlist/count`.
**Steps:**
1. Call `GET /api/waitlist/count`, record `Capi`.
2. `navigate` to the app root (fresh load).
3. `read_page` and read the live-counter number shown in "{count} builders already in line."
**Expected observable result:**
- The on-load counter equals `Capi` (not a hardcoded placeholder like `0`, `100`, `1234`).
- Re-loading after a known successful join reflects the new total (cross-check with TC2).

---

### TC4 — Invalid email is rejected with a clear message (AC4)
**Maps to:** AC4 · **Priority:** P0 (edge)
**Preconditions:** App loaded; record baseline count `C0`.
**Steps (repeat for each malformed value):** test inputs `foo`, `foo@`, `a@b`, `@b.com`, `a b@c.com`.
1. `navigate` to the app root.
2. Type the malformed email into the field.
3. Click **"Join the waitlist"**.
4. `read_page`; if a request was sent, observe its status (network read).
**Expected observable result:**
- A clear, human-readable error appears (e.g. **"Enter a valid email address"**) — no success
  message, no "#N".
- The live counter is **unchanged** (still `C0`); `GET /api/waitlist/count` still returns `C0`.
- If the request reaches the server it responds **`400 { error }`**; error body is short and
  user-facing (no stack trace) — see TC9.
- No uncaught console errors; the page does not crash.

---

### TC5 — Duplicate email handled gracefully (AC5) — HIGH RISK
**Maps to:** AC5 · **Priority:** P0 (edge, dedupe)
**Preconditions:** App loaded. Ensure a known email `dup@orchestra.test` is **already** on the
list (submit it once first if needed; record count `C1` after that first insert).
**Steps:**
1. `navigate` to the app root.
2. Type `dup@orchestra.test` (the already-joined address).
3. Click **"Join the waitlist"**.
4. `read_page`; read the counter; call `GET /api/waitlist/count`.
**Expected observable result:**
- A **friendly** message appears (e.g. **"You're already on the list — hang tight."**) — not a
  hard error, not a crash, not a raw exception.
- The counter is **unchanged** vs. `C1` (no double-count); `GET /api/waitlist/count` still `C1`.
- The underlying request responds **`409 { error, already: true }`** (network read).
- No second row created (verify via counter; persistence/DB cross-check in TC10).

---

### TC6 — Empty submission blocked (AC6)
**Maps to:** AC6 · **Priority:** P0 (edge)
**Preconditions:** App loaded; record baseline count `C0`.
**Steps:**
1. `navigate` to the app root.
2. Leave the email field **empty** (do not type anything).
3. Click **"Join the waitlist"**.
4. Also test: type spaces only `"   "` then submit.
**Expected observable result:**
- Submission is **prevented client-side** (e.g. inline validation / disabled action) — no success
  state, no "#N".
- The counter is unchanged (`C0`); `GET /api/waitlist/count` still `C0`.
- If any request reaches the server it returns **`400`** and **no row is added**.
- No console errors; the page remains usable (can still type and submit a valid email after).

---

### TC7 — Double-submit is safe (AC7) — HIGH RISK
**Maps to:** AC7 · **Priority:** P0 (edge, idempotency)
**Preconditions:** App loaded; record baseline count `C0`. Use a fresh unique email
`qa+run-tc7@orchestra.test`.
**Steps:**
1. `navigate` to the app root.
2. Type the fresh unique email.
3. **Rapidly trigger submit twice**: click **"Join the waitlist"** and immediately click again
   (and/or press **Enter** twice in quick succession) before the first response renders.
4. Observe the button state during the in-flight request.
5. After settling, `read_page`, read the counter, and call `GET /api/waitlist/count`.
**Expected observable result:**
- The button is **disabled / shows a loading state** while the request is in flight (request is
  de-duped), so the second click/Enter does **not** fire a second insert.
- Exactly **one** signup is recorded: counter increases by **exactly 1** (`C0 + 1`), not 2.
- Final state is identical to a single submit: one **"You're #N on the list"**, `count` consistent
  across UI / POST / `GET count`.
- If a second request did go out, it returns **`409 already:true`** (not a second `201`), and the
  counter still reflects only one new row.

---

### TC8 — Whitespace / case treated as same person (AC8) — HIGH RISK
**Maps to:** AC8 · **Priority:** P0 (edge, normalization)
**Preconditions:** App loaded. First submit a clean address `case@orchestra.test`, record the
resulting count `C1`.
**Steps:**
1. `navigate` to the app root.
2. Submit a variant of the same address that differs only by **case and surrounding whitespace**,
   e.g. `"  CASE@Orchestra.COM "` for base `case@orchestra.com` (use matching domain to your TC8
   base address) — i.e. type `  CASE@Orchestra.test ` for base `case@orchestra.test`.
3. `read_page`; read counter; call `GET /api/waitlist/count`.
**Expected observable result:**
- Treated as the **same person**: the friendly already-on-the-list message appears (or a no-op
  success that does **not** add a row) — **no duplicate row**.
- Counter unchanged vs. `C1`; `GET /api/waitlist/count` still `C1`.
- The duplicate request responds **`409 already:true`** (normalization = trim + lowercase before
  compare), confirming server-side normalization, not just client-side.

---

### TC9 — Error responses are safe (no leaks) (AC9)
**Maps to:** AC9 · **Priority:** P1
**Preconditions:** App loaded. Reuse the error-producing flows from TC4 (`400`) and TC5/TC8 (`409`).
**Steps:**
1. Trigger a `400` (TC4 malformed email) and a `409` (TC5 duplicate).
2. For each, inspect: the **on-screen** message, the **response body** (network read), and the
   **console** (`read_console_messages`).
**Expected observable result:**
- On-screen and response-body messages are **short and user-facing** (e.g. "Enter a valid email
  address", "You're already on the list").
- **No stack traces, file paths, SQL text, internal table/column names, or framework internals**
  appear anywhere visible (UI, response body, or console).
- Console shows no unhandled exceptions leaking internals.

---

### TC10 — Joined email persists across server restart (AC10)
**Maps to:** AC10 · **Priority:** P1 (requires Lead/Backend coordination to restart the server)
**Preconditions:** App loaded; a known email `persist@orchestra.test` successfully joined; record
count `Cbefore` and the position shown.
**Steps:**
1. Join `persist@orchestra.test` (valid, new). Record `Cbefore` from `GET /api/waitlist/count`.
2. **Ask the Lead to restart the dev server** (stop `npm run dev`, start again) — QA does not edit
   code or manage the process itself; coordinate the restart.
3. After restart, `navigate` to the app root again.
4. Call `GET /api/waitlist/count` → `Cafter`. Read the on-load counter.
5. Attempt to re-join `persist@orchestra.test`.
**Expected observable result:**
- `Cafter == Cbefore` — the count survived the restart (SQLite-backed, not in-memory).
- On-load counter equals `Cafter` (AC3 still holds after restart).
- Re-joining `persist@orchestra.test` returns the **`409 already:true`** friendly state — the row
  is still present, proving persistence.

---

## High-risk focus (per team-brief §3)

> The dedupe path is the most likely place for the counter to drift. Give these extra scrutiny and
> capture GIF/console evidence.

- **TC5 (duplicate) + TC7 (double-submit) + TC8 (whitespace/case)** — together these exercise the
  dedupe path from three angles (existing row, race, normalization). For **each**, the hard check
  is: **counter does not increment** and the three count sources (UI / POST `count` / `GET count`)
  stay equal.
- **TC2 + TC3 consistency** — the live counter must always equal the real DB count, on load and
  after every successful or rejected submit.
- **Combined drift probe (run after TC5/TC7/TC8):** re-read `GET /api/waitlist/count` and the
  on-screen counter and confirm they still match the number of genuinely distinct emails added
  during the run. Any mismatch = FAIL.

---

## Execution checklist (the QA run follows this order)

1. **Confirm barrier:** Lead signals "feature complete" (page renders + both endpoints respond).
   Do not start before this.
2. **Tab context:** call `tabs_context_mcp`, then create a **new tab** for testing.
3. **Baseline:** `GET /api/waitlist/count` → record `C0`. Load the page; verify hero copy, email
   field, button, and live counter render (sanity check of §2 copy presence).
4. **Happy path:** TC1 → TC2 → TC3 (start `gif_creator` for TC1–TC2).
5. **Validation edges:** TC4 (invalid) → TC6 (empty).
6. **Dedupe (HIGH RISK):** TC5 (duplicate) → TC8 (whitespace/case) → TC7 (double-submit). Capture
   GIF + console for each.
7. **Safety:** TC9 (no leaks) using the bodies/console from steps 5–6.
8. **Persistence:** TC10 (coordinate server restart with the Lead).
9. **Drift probe:** re-check counter-consistency invariant across UI / POST / `GET count`.
10. **Console sweep:** `read_console_messages` for any uncaught errors throughout.
11. **Verdict:** report **PASS / FAIL / PASS WITH RISKS** per case, with evidence (what was done,
    what was observed, screenshots/GIF/console). FAIL → exact repro steps + actual observed result.

### Evidence to attach
- Page-text reads showing the success/error/duplicate messages and the counter values.
- Network statuses (`201` / `400` / `409` / `200`) for the relevant submits.
- Console output (clean or the exact errors).
- GIFs for TC1–TC2 (happy path) and TC5/TC7/TC8 (dedupe).

---

# Wave 2 — Six-change test plan (avatars, role-first cards, presenter mode, reproduce-it, film audio, cross-cutting)

> Written during QA idle (browser blocked on multi-browser selection gate). Source: Lead's
> wave brief. App under test: prod build at **http://localhost:4000**. Execute once a single
> Chrome is selected. Console policy: 0 ERRORS allowed; the single Remotion **license WARNING**
> is expected/benign (not a fail). Responsive checks at **375px** width.

## W1 — Avatars distinct (/agents)
- **W1.1** Load /agents, scroll fully so all 7 cards animate in. Each of the 7 avatars reads as a
  DISTINCT character: own muted hue AND own frame shape (deep-ink, ochre, slate-blue, clay, sage,
  plum-grey, graphite). Vermilion appears ONLY as the moving/live accent, not a base avatar hue.
  Expected: 7 visually distinguishable avatars, not one uniform set. Evidence: zoomed screenshot.
- **W1.2** Click «Сыграть» (play/tuning-up). Expected: conducted choreography animates all 7;
  0 console errors during/after. Evidence: before/after screenshot + console read.

## W2 — Role-first card hierarchy (/agents, /agents/maestro, home teaser /)
- **W2.1** /agents: each card leads with ROLE as headline (ЛИД/ОРКЕСТРАТОР, PM/АНАЛИТИК, FRONTEND,
  BACKEND, QA, REVIEWER, MOTION/ВИДЕО); poetic name («Маэстро», «Сценограф»…) is a smaller subtitle.
  Scroll to reveal all 7. Evidence: screenshots of each card.
- **W2.2** /agents/maestro: detail header is role-first (role headline, name subtitle).
- **W2.3** Home / team teaser: same role-first hierarchy.

## W3 — Presenter mode (/present + P hotkey)
- **W3.1** /present: step ALL 14 cues via → and ←, then Space, then on-screen Prev/Next. Each cue
  shows: section label, ГОВОРИТЕ (SAY) line, 💡 (DROP) insider fact, counter «BEAT n / 14». Progress
  rail advances. Russian throughout. Evidence: screenshots at beats 1, ~7, 14.
- **W3.2** Home /: press `P` → presenter HUD overlay opens; ←→ advance; Esc and P close it.
- **W3.3** Focus guard: focus the waitlist email input, type, press `P` → HUD must NOT open (only
  fires when not in an input). Evidence: screenshot showing typed "p" in field, no overlay.
- **W3.4** Collision: on home press backtick (`) → hidden terminal opens normally; P does not
  interfere with terminal. Evidence: screenshots.

## W4 — Reproduce-it recipe (home «Повторите сами» / «под капотом»)
- **W4.1** 5 numbered steps render: (1) settings.local.json, (2) RU instruction to research
  agent-teams docs + save docs/agent-teams.md, (3) 7 agent role blocks (tabs/accordion), (4)
  orchestrator GOAL + DOES/DOES-NOT spec, (5) first-wave spawn prompt.
- **W4.2** Click several «Скопировать» + «Скопировать все» → feedback flips to «Скопировано ✓».
  Verify via button state. Deep clipboard assertion optional.
- **W4.3** At 375px: no horizontal overflow inside code blocks (scrollWidth <= clientWidth on the
  page; code blocks scroll internally, not the page).

## W5 — Film audio (/film) — KEY NEW
- **W5.1** Load /film. Nothing plays on load — Player is poster-first; any <audio>/<video> element
  paused=true, currentTime=0. Evidence: JS read of media element state.
- **W5.2** Click play → playback starts; verify programmatically: media element paused=false and
  currentTime advances over ~2s. 0 console errors during playback. Bed loops; SFX wired to QA-fork
  beat, barrier beat, resolve/end. Evidence: two JS reads of currentTime (t0 < t1) + console read.
- **W5.3** NOTE in report: subjective audio QUALITY (mix, loop seam, SFX timing feel) needs the
  HUMAN's ears — QA verifies playback STATE only, not fidelity.

## W6 — Cross-cutting
- **W6.1** Console 0 ERRORS on /, /agents, /present, /film (license WARNING exempt). Evidence:
  console read per route.
- **W6.2** 0 horizontal overflow at 375px on /, /agents, /present, and the reproduce-it section.
  Verify document.documentElement.scrollWidth <= window.innerWidth per route. Evidence: JS reads.

### Wave-2 execution order
tabs_context → select single Chrome → new tab → /agents (W1,W2) → /agents/maestro (W2.2) →
/ (W2.3, W3.2-3.4, W4) → /present (W3.1) → /film (W5) → 375px sweep (W6.2) → console sweep (W6.1).
