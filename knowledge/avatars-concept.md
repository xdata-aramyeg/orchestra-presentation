# Avatars Concept — characterful "acting" avatars for the 6 agents

> Design-R&D exploration for the Orchestra site. **This is a recommendation + a working
> prototype, not a change to the live app.** Decision belongs to the Lead.
> Aesthetic target: warm-paper light editorial (see `knowledge/design-brief.md`) —
> vermilion `#C5482F`, Unbounded / Onest / JetBrains Mono, double-bezel, film-grain.

---

## 1. Capability check — what image generation do we actually have?

**Short answer: we cannot reliably generate raster (PNG/JPG) images in this environment.
Hand-author SVG.**

What I checked:

- **ToolSearch for image generation** ("generate image / diffusion / text-to-image / dalle /
  render png", several phrasings). **No text-to-image tool exists.** The only image-adjacent
  tools are: Figma (`get_screenshot`, `download_assets`, `upload_assets` — these move/export
  *existing* assets, they don't synthesize art), `claude-in-chrome` screenshot/upload,
  Playwright screenshots, and 21st.dev `magic` (generates **UI component code**, not artwork).
  None turn a prompt into an original raster image.
- **`.agents/skills/imagegen-frontend-web/SKILL.md`** and **`.agents/skills/brandkit/SKILL.md`**
  are **prompt-direction skills**, not generators. They are art-direction playbooks ("generate
  one horizontal image per section", "premium brand-guidelines board") that *presuppose* an
  underlying image surface — i.e. a chat client that can natively emit images. They contain no
  tool, API key, or endpoint. In Claude Code there is nothing for them to drive, so they cannot
  produce a PNG here. (They'd be useful only if a human ran them on a Claude.ai surface that
  renders images, then hand-exported the results into the repo — a manual, off-pipeline step.)

**Conclusion.** Treat "generate cohesive raster illustrations *from inside this team*" as **not
available**. That removes option (b) below as a self-serve path and makes **hand-authored SVG
line-art the correct primary direction** — which is also, independently, the best aesthetic fit.

---

## 2. Three candidate directions

### (a) Refined SVG line-art characters, animated via Motion — ✅ RECOMMENDED

Each agent = a small, ultra-light **line-art emblem** (2–5px stroke, ink `#1A1714`, vermilion
`#C5482F` for the one "live" accent element), built as an inline SVG React component and animated
on `transform`/`opacity` only. Not a face — an **instrument / object that performs the role**
(baton, pen, frame, gear, tuning-fork, magnifier). This is the editorial-illustration language
the brief already asks for ("ultra-light line icons only … no thick Lucide").

- **Pros:** Perfectly on-brand — same line-weight + vermilion accent as the rest of the site, so
  it can never look "cheap/cliché." Tiny payload (inline SVG, no image requests, no layout shift).
  Crisp at any DPR. Themeable from CSS vars. Animation is first-class (stroke-draw, transform
  oscillation, ripple) and trivially `prefers-reduced-motion`-safe. **Buildable entirely in-team
  today** — no external generation step. Proven by the prototype in §5.
- **Cons:** Hand-drawing 6 cohesive emblems is real illustration work (est. below). Line-art is
  "characterful" but restrained — it won't read as a cute mascot. (For *this* brief that's a
  feature, not a bug.)
- **Effort:** ~0.5 day to lock the shared visual system (stroke, sizing, the accent rule, the
  reduced-motion contract) + ~0.5–1 hr per agent for SVG + idle/action = **~1.5–2 dev-days total**
  for all six, polished.

### (b) Cohesive generated illustrations — ❌ NOT self-serve here (blocked by §1)

A set of six warm, textured editorial illustrations sharing one palette and one hand.

- **Pros:** Richest "characterful" read if executed well; could feel like a magazine's
  commissioned spot-illustrations.
- **Cons:** **We have no in-environment generator** (see §1), so this can't be produced by the
  team — it would require a human to generate art on another surface and hand-import it. Raster
  also fights the brief: hard to recolor to exact vermilion, risks AI-illustration "sheen" (the
  exact slop the brief bans), heavier payload, and animating a flat raster means faking motion
  (parallax layers / sprite swaps) rather than true vector motion.
- **If ever pursued (human-driven, off-pipeline) — art direction to keep it on-world:**
  > Single-weight **ink line illustration on warm paper `#FBFAF7`**, one **vermilion `#C5482F`**
  > spot accent per piece, NO shading/gradients/glow, generous negative space, slight
  > letterpress/print texture, editorial spot-illustration of a *single theatre instrument* per
  > agent (conductor's baton, fountain pen, stage frame, brass gear, tuning fork, magnifier).
  > Flat, calm, expensive. Banned: 3D, neon, drop-shadows, photoreal, gradient mesh.
  Even then, prefer exporting as **SVG** so it inherits the CSS accent var.
- **Effort:** N/A in-team; ~1 day of human round-tripping if forced.

### (c) Tasteful pixel-art avatars — ⚠️ charming, but high clash risk

8–16px sprites with a 2–3-step idle loop (the "second-read delight" play).

- **Pros:** Genuinely charming; nostalgic "characters"; tiny; easy to loop.
- **Cons:** Pixel art carries a **retro/gaming register that fights "premium editorial paper."**
  Done casually it reads as a template sticker — precisely the cheap look the brief forbids.
- **If chosen anyway, the only way to make it work:** treat pixels as a **deliberate
  "engineering field-notes" motif**, not decoration — restrict the sprite palette to the site
  tokens (ink + one vermilion pixel as the "live" pixel), render at a chunky integer scale with
  `image-rendering:pixelated`, frame each sprite inside the same double-bezel core, and confine
  it to ONE place (e.g. a tiny "now playing" indicator), never as the primary agent portrait.
  High-wire act; only attempt if a human explicitly wants the pixel charm.
- **Effort:** ~1.5 days incl. the careful framing needed to not look cheap; higher taste-risk.

### Recommendation → **(a) Refined SVG line-art, Motion-animated.**

It's the only option **buildable end-to-end by the team today**, it is **natively on-palette**
(same stroke + vermilion accent as everything else, so it cannot clash), it's the **lightest and
most accessible**, and it gives the cleanest path to the "do an action" idle/loop. Option (c) can
be held in reserve as a *single* playful easter-egg if the human wants a second-read wink; option
(b) only if a human hand-imports art from another surface.

---

## 3. The "action" per agent — idle + role-action (subtle, looped, reduced-motion-safe)

Shared rules: the figure is **ink line-art**; exactly **one element carries the vermilion
"live" accent** and is the thing that moves; idle is a near-still breath (≤4s, ≤2px), the action
is a short damped burst on a long loop (~6–8s) so it feels alive but never busy; everything is
`transform`/`opacity` only; `prefers-reduced-motion` freezes to the *resolved* "done" pose.

| Agent | Handle | Emblem | Idle | Role-action (the loop) |
|---|---|---|---|---|
| **Lead / Conductor** | Маэстро | conductor's **baton** + 3 faint beat-dots | baton tip breathes | baton sweeps a small arc on the beat; the 3 dots light vermilion **1-2-3** in time, then rest |
| **PM / Writer** | Либреттист | **fountain pen** over a ruled line | pen hovers, nib glints | nib draws one vermilion underline left→right (stroke-draw), lifts, line stays |
| **Frontend / Set-designer** | Сценограф | **stage frame** sliding into place | frame sits, faint inset highlight | a vermilion frame **slides in from the side and snaps** to register, tiny settle bounce |
| **Backend / Machinist** | Машинист | **gear** + a 1-line mini terminal | gear still; terminal caret blinks | gear turns 60° with detents; the vermilion **caret blinks** in the terminal slot |
| **QA / Tuning-fork** | Камертон | **tuning fork** | prongs barely breathe | fork is struck → prongs vibrate (damped), vermilion **ripples** radiate, a **✓ "in tune"** draws *(built — see §5)* |
| **Reviewer / Critic** | Рецензент | **magnifier** over text lines | magnifier rests on a line | magnifier **sweeps** across the lines; a vermilion **✓** stamps at the end, then resets |

Each maps 1:1 to the agent's character copy in `site-content-ru.md` (baton-not-instrument,
pen-writes-the-score, set vs. machinery, tuning the строй, the read-only critic's check).

---

## 4. Build plan (Next.js + Tailwind + Motion)

**Component shape (many small files, per coding-style):**
```
components/avatars/
  avatar-frame.tsx        // shared double-bezel + film-grain wrapper, size prop, aria-label
  use-reduced-motion.ts   // hook → resolved-pose flag (also honors a global toggle)
  tokens.ts               // ink / vermilion / stroke / timing exported once
  maestro.tsx  librettist.tsx  scenographer.tsx
  machinist.tsx  diapason.tsx   reviewer.tsx   // one inline-SVG component each
  index.ts                // <AgentAvatar slug="diapason" size="lg" play="auto" />
```
- **One emblem per file** (~60–120 lines of JSX+SVG), all consuming `tokens.ts` so the accent and
  stroke are defined once (immutability: components take props, hold no mutable state beyond a
  motion flag).
- **Animation:** prefer **CSS keyframes co-located in the component** for the looped idle/action
  (zero JS cost, GPU-friendly) — the prototype proves this needs no library. Use **Motion** only
  where we want **viewport-triggered** one-shots (`whileInView` to fire the action when the card
  scrolls in) and to read `useReducedMotion()`. Keep it `transform`/`opacity` exclusively.

**Where they appear:**
- **Character pages `/agents/[slug]`** — large avatar in the hero meta block; action plays on
  load + gently loops (primary showcase).
- **Org-chart nodes** (`components/sections/org-chart.tsx`) — small (40–48px) emblem inside each
  node, action fires `whileInView` / on node hover.
- **Team teaser (home)** & **`/agents` index cards** — medium emblem per card; stagger the
  actions on scroll-in so the row "tunes up" in sequence.

**Perf:** inline SVG = no extra requests, no CLS, no raster decode; animate compositor-only props;
one shared grain layer (already global). Negligible bytes per emblem.

**Accessibility:** each avatar `role="img"` + a Russian `aria-label` describing the action;
decorative ripples `aria-hidden`; `prefers-reduced-motion:reduce` (and an optional site toggle)
freezes every emblem to its resolved "done" pose — still characterful, just static. Never the only
carrier of meaning (the handle/role text always sits beside it).

---

## 5. Prototype — Камертон (the tuning-fork) ✅ BUILT

**File:** `knowledge/avatar-prototype-kamerton.html` — standalone, self-contained (inline SVG +
CSS, no build, no JS deps). **Open it in a browser.**

What it demonstrates:
- On-palette: warm paper `#FBFAF7`, alt-tint `#F3F0E9`, ink line-art `#1A1714`, **single vermilion
  `#C5482F` accent**, real **film-grain** overlay, **double-bezel** card, mono eyebrow tag — i.e.
  the avatar lives inside the site's own component language.
- The **action**: on an 8s loop the fork is "struck" — prongs vibrate in damped opposition,
  three **vermilion ripples** radiate from the tips, and a small **"in tune" ✓** draws in. ~88% of
  the loop is calm idle, so it reads as alive, not animated-for-the-sake-of-it.
- **`prefers-reduced-motion:reduce`** path included: all motion stops and it settles to a static
  "one quiet ring + ✓ shown" pose (toggle Reduce Motion in OS settings to verify).

This single file is enough for the Lead to judge whether the line-art direction clears the
editorial bar before any of it touches `orchestra-site/`.

---

## TL;DR for the Lead

- **Image generation is NOT available in-team** — no text-to-image tool; the imagegen/brandkit
  skills are direction-only and have nothing to drive here. So raster illustration would need a
  human, off-pipeline.
- **Recommended direction: refined SVG line-art, animated with CSS/Motion** — on-palette by
  construction, lightest, most accessible, fully buildable by the team now.
- **Each agent gets a role-instrument that performs its job** (baton beat, pen underline, frame
  snap, gear+caret, fork ring, magnifier sweep) — subtle, looped, reduced-motion-safe.
- **Proof:** `knowledge/avatar-prototype-kamerton.html` — open it; it's the Камертон fork ringing
  on warm paper in vermilion.
- **Est. to build all six, polished:** ~1.5–2 dev-days (Сценограф owns it; it's UI-only).
