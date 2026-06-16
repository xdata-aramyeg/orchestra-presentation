# Research — round 2 (NEW ideas only)

> Recurring research/improvement pass for the Orchestra self-referential site. **Everything
> already DONE or already decided is deliberately excluded** — see `research-ideas.md` (round 1),
> `enhancements-round2.md`, `avatars-concept.md`, `film-script-ru.md`. This file is *only* new,
> concrete, high-impact moves, prioritized P1/P2/P3, each with a one-line "how we'd build it".
>
> Stack reminder: Next.js + Tailwind + Motion; film = Remotion (+ `@remotion/player`, GSAP,
> r3f, Lottie); skills already in repo: **remotion**, **motion-graphics**, **svg-animation**.
> Brief is locked: warm paper `#FBFAF7`/`#F3F0E9`, ink `#1A1714`, one vermilion `#C5482F`,
> Unbounded / Onest / JetBrains Mono, film-grain, restrained motion.

---

## TL;DR — the prioritized master list

**P1 (do next, highest impact):**
1. Film: **kinetic-type cold-open** built on `@remotion/paths` `evolvePath` + per-char `interpolate` (§1.1)
2. Film: **diegetic UI footage** — the film shows the *actual* message thread / org chart / mistakes animating, not abstract shapes (§1.2)
3. Film: **sound = sparse SFX + one ambient bed, captions always on** (silent-safe) (§1.3)
4. Avatars: **`@remotion/paths` `evolvePath` parity** so the SVG emblems animate *inside the film* the same way they draw on the site (§2.1)
5. Avatars: **secondary-motion pass** (overshoot/settle, anticipation, follow-through) on the existing 6 (§2.2)

**P2 (clearly worth it):**
6. Film: **poster-still + click-to-play** Player embed, `prefers-reduced-motion` default-paused (§1.4)
7. Film: **data-driven captions** — narration/timeline pulled from the same JSON the site uses (§1.5)
8. Avatars: **shared "tuning-up" choreography** — the 6 emblems animate as one staged sequence (§2.3)
9. Site: **scrollytelling "one section, one big Cyrillic word"** pinned beat (§3.1)
10. Site: **chapter-scrubber / film + site cross-link** (§3.2)
11. Design: **variable-font scroll/weight interaction on the hero display** (§4.1)

**P3 (cheap delight / nice-to-have):**
12. Film: **end-card with live build-hash + render timestamp** baked into the composition (§1.6)
13. Avatars: **idle micro-variation via `@remotion/noise`** so loops never feel mechanical (§2.4)
14. Site: **"render this page as a frame" easter egg** (§3.3)
15. Design: **annotated-margin footnotes that animate in on scroll** (§4.2)

> Pending-but-not-yet-built from earlier rounds (NOT re-listed here, still worth doing in their
> own right): v1→v2 before/after slider, easter-egg terminal, build-hash footer, toolbelt
> filtering, breathing grain. Dedup confirmed — nothing below overlaps them except where noted.

---

## 1. The film — creative treatment (~60–90s, self-referential)

The script already exists (`film-script-ru.md`, 12 scenes / 75s). These are *treatment & craft*
moves that make it read **premium, not corporate** — and that are concretely Remotion-buildable.

### The premium-vs-corporate principle (the thing to internalize)
Corporate motion = everything moves at once, easy easings, stock "uplifting" music, logo-spin
finale. Premium motion = **restraint + one hero device + type doing the heavy lifting + sound
that breathes**. The 2025 title-sequence consensus is explicit: the strongest sequences are
*typographic and minimal* (nods to Alien/Psycho), tone over spectacle. Our brief already bans
the slop; the film must obey the same discipline as the site — **one signature move per scene**,
ink-on-paper, single vermilion accent, generous holds (80%+ calm, like the avatar loops).

### 1.1 — P1: Kinetic-type cold-open driven by `evolvePath`
Open scene 1 ("Бриф") as pure kinetic typography: the one task-line *writes itself* (stroke-draw),
then the six empty пульты label themselves one char at a time. This is the single most on-brand
opening for a type-led editorial film and it's cheap in Remotion.
*How we'd build it:* `@remotion/paths` `evolvePath(progress)` → `{strokeDasharray, strokeDashoffset}`
on the headline path; per-character reveal via `useCurrentFrame()` + `interpolate()` driving
opacity + `translateY`, staggered by index. No After Effects, fully deterministic.

### 1.2 — P1: Diegetic UI footage (show the real artifacts, not abstractions)
The most powerful self-referential beat: instead of metaphor-only shapes, have the film *zoom into
the actual site* — the real message thread bubbles popping in, the org-chart lanes lighting, a
mistake "headstone" engraving. Data-driven dev videos land because the data is *real*; ours can be
literally the same components. Mix: metaphor (baton/fork/gear) for emotion, real UI for proof.
*How we'd build it:* render the existing React section components inside a Remotion `<Sequence>`
(they're already client components), drive their reveal off `useCurrentFrame` instead of
`whileInView`; frame them as "screen-in-screen" on the paper canvas.

### 1.3 — P1: Sound design — sparse SFX + one ambient bed, captions always on
Don't score it like an ad. Use **one low ambient pad** (CC0) under the whole film at low gain,
plus a tiny SFX vocabulary mapped to the real events: a soft *tick* on each task-line, a single
*struck-fork ring* for the QA scene (matches Камертон literally), a *paper settle* on the reset,
a *stamp* on review. Everything must read **silent** too — burn captions in (we already have RU
narration per scene), so autoplay-muted and `prefers-reduced-motion` both work.
*How we'd build it:* `<Audio>` for the bed + per-event `<Audio>` one-shots inside their
`<Sequence>`; source CC0 from **Pixabay Music** / **Mixkit** (no attribution). Captions = a
caption track component reading the script JSON (see §1.5). Keep a fully-muted poster path.

### 1.4 — P2: Poster-still + click-to-play, reduced-motion default-paused
Don't autoplay a 75s composition on route load. Show a designed **poster frame** (the final
"Orchestra" end-card or scene-11 layout) with a vermilion play pill; mount `@remotion/player`
on click. Under `prefers-reduced-motion`, default to the poster + a "play anyway" affordance.
*How we'd build it:* lazy-import `@remotion/player` (`next/dynamic`, `ssr:false`); poster = a
static `<Img>`/SVG; gate autoplay on `useReducedMotion()`.

### 1.5 — P2: Data-driven captions/timeline from the shared JSON
The film's captions, scene labels, and timeline beats should read from the *same* data the site
uses for the message thread + build timeline (`thread-and-timeline-ru.md`). One source of truth →
the film can never drift from the site's claims, and editing the script edits the film.
*How we'd build it:* export the thread/timeline as a typed JSON in `content/`; both the site
sections and the Remotion caption component import it. Remotion's parametric-render model is built
for exactly this (data-driven compositions).

### 1.6 — P3: End-card with live build-hash + render timestamp
The final frame stamps the real git short-hash and the render date — the film's own "receipt,"
mirroring the proposed footer build-hash. Reinforces honesty: this exact film was rendered from
this exact commit.
*How we'd build it:* pass `gitHash`/`builtAt` as Remotion input props at render time
(`--props`), render into the end-card with `useCurrentFrame` hold.

**Film references:**
- Art of the Title — the canonical library; study the *typographic-minimal* sequences (Alien/Psycho lineage). https://www.artofthetitle.com/
- PRINT — Lola Landekic's favorite title sequences (curated, tone-over-spectacle picks). https://www.printmag.com/design-culture/lola-landekics-favorite-opening-title-sequences-of-2023/
- Remotion `evolvePath()` — the stroke-draw primitive for the cold-open + avatars. https://www.remotion.dev/docs/paths/evolve-path
- Remotion 4.0 data-driven / parameterized rendering — for §1.5. https://www.remotion.dev/blog/4-0
- Pixabay Music (CC0, no attribution) + Mixkit ambient — for §1.3. https://pixabay.com/music/ · https://mixkit.co/free-stock-music/ambient/

---

## 2. Avatar polish — elevate the 6 SVG line-art emblems

The 6 are built and integrated (gallery is source of truth). These push them from "good" to
"crafted," and crucially **unify them across site + film**.

### 2.1 — P1: `evolvePath` parity so emblems draw identically in the film
Right now the emblems use co-located CSS keyframes (site) — but the film runs on frames. Port the
stroke-draw to `@remotion/paths` `evolvePath(progress)` so each emblem can *draw itself* on the
film timeline with the exact same geometry. One geometry, two drivers (CSS on site, frame in film).
*How we'd build it:* keep the SVG path data in `tokens.ts`; site keyframes stay; the film imports
the same `d` strings and feeds `evolvePath(interpolate(frame,...))`. The **svg-animation** +
**motion-graphics** skills cover both drivers.

### 2.2 — P1: Secondary-motion pass (the thing that reads "expensive")
Add the 12-principles micro-detail the current loops lack: **anticipation** (baton dips back
before the upbeat), **overshoot + settle** (frame snaps past register then eases back — already
hinted, push it), **follow-through** (fork prongs decay asymmetrically; gear teeth carry a hair of
inertia after the detent). This is what separates premium line-art from icon-pack motion.
*How we'd build it:* replace single eased tweens with 2–3-keyframe damped curves
(`cubic-bezier(0.32,0.72,0,1)` + a small overshoot keyframe); keep `transform`/`opacity` only;
`prefers-reduced-motion` still freezes to the resolved pose.

### 2.3 — P2: Shared "tuning-up" choreography across the row
When the 6 appear together (team teaser, `/agents` index, org chart), don't fire them
independently — choreograph a single **staged sequence**: Маэстро's baton beats 1-2-3, and *on the
3* the other five fire in role order, like an orchestra tuning to the А. One conductor cue, five
responses. Memorable, on-theme, and a true "signature scroll moment" candidate.
*How we'd build it:* a parent `whileInView` orchestrator passing a `delay` per child (Motion
stagger / `staggerChildren`); the baton's beat-3 frame = t0 for the others.

### 2.4 — P3: Idle micro-variation via noise so loops never feel mechanical
The risk with a fixed-period loop is the eye catches the repeat. Add ±sub-pixel positional drift
driven by Perlin noise so each cycle differs slightly (breathing, not looping).
*How we'd build it:* `@remotion/noise` `noise2D(seed, frame*k)` for the film; a tiny JS noise
function for the site idle (still `transform`-only, still reduced-motion-gated).

**Avatar references:**
- supermemory `svg-animations` SKILL — concrete stroke-choreography + easing tokens patterns. https://github.com/supermemoryai/skills/blob/main/svg-animations/SKILL.md
- CSS-Tricks — How SVG line animation works (dasharray/dashoffset fundamentals). https://css-tricks.com/svg-line-animation-works/
- portalZINE — 2025 SVG line-drawing solutions / Vivus alternatives (modern approaches survey). https://portalzine.de/svg-line-drawing-animation-solutions-vivus-js-alternatives-modern-approaches/
- Remotion `@remotion/paths` overview (evolvePath, translatePath, warpPath). https://www.remotion.dev/docs/paths/

---

## 3. Site additions still worth doing (deduped against pending list)

Pending-not-built (keep): v1→v2 slider, easter-egg terminal, build-hash footer, toolbelt
filtering, breathing grain. **New** high-impact ones below.

### 3.1 — P2: Scrollytelling "one giant Cyrillic word" pinned beat — worth it
2026's dominant award-winning move is oversized expressive type *as the hero element*, sometimes
clipped by the viewport edge. We have Unbounded + the warm canvas; we lack one truly viewport-
scale type moment. Pin one section, let a single huge Cyrillic word ("ОРКЕСТР" / "БАРЬЕР" /
"ЧЕСТНО") fill the screen and transform on scroll. One per page, max — restraint.
*How we'd build it:* a sticky/pinned section + `useScroll`-driven `clamp` on font-size/letter-
spacing/weight; `text-[clamp(...)]` baseline; reduced-motion → static large word. **High value,
low effort** — leans entirely on assets we already have.

### 3.2 — P2: Film ↔ site cross-link (chapter scrubber) — worth it
Each film scene maps 1:1 to a site section (brief → hero, two-waves → flow diagram, mistakes →
graveyard). Expose that: a chapter strip under the player that jumps the composition to a scene,
*and* each site section gets a tiny "▶ смотреть в фильме (00:34)" link that deep-links the player.
Ties the two signature artifacts together instead of leaving the film as an island.
*How we'd build it:* `@remotion/player` ref `.seekTo(frame)`; a `chapters` array (label→frame)
shared with the section components; section links push `?t=` and seek on mount.

### 3.3 — P3: "Render this page as a frame" easter egg — nice-to-have
A wink that fuses site + film: a hidden control that snapshots the current section into a
film-styled frame (paper + grain + vermilion timestamp) the visitor can download. Pure delight,
reinforces "the site and the film are the same material."
*How we'd build it:* `html-to-image`/canvas of the section node → overlay the grain + a baked
caption; download as PNG. Keep it keyboard-summoned, no native dialogs (a11y/QA rule).

> Considered and **rejected** as low-ROI for this brief: live cursor-presence/multiplayer,
> AI chatbot "ask the team," confetti/particle effects — all read as generic SaaS, fight the
> editorial calm, and aren't honest self-reference. Skip.

**Site references:**
- The Pudding / NYT / Reuters scrollytelling — the bar for scroll-driven editorial. https://pudding.cool/
- Awwwards editorial inspiration (oversized clipped type as hero). https://www.awwwards.com/inspiration/editorial-layout
- Figma — 2026 web design trends (expressive type, variable fonts). https://www.figma.com/resource-library/web-design-trends/

---

## 4. Design & business — fresh 2026 moves + ROI refinements

### 4.1 — P2 (design): Variable-font scroll/weight interaction on the display
2026 trend that's *new* vs. our round-1 notes: variable fonts driven by interaction — weight/width
responding to scroll position or hover. Unbounded is variable. One restrained use (a heading that
gains weight as it enters, or a word whose axis tracks scroll) reads current and craftsy, and cuts
font payload 60–80% (real LCP win) vs. shipping multiple static weights.
*How we'd build it:* load Unbounded as one variable file; animate `font-variation-settings`
(`'wght'`) via `useScroll`/`whileInView`; reduced-motion → fixed weight.

### 4.2 — P3 (design): Animated margin footnotes / field-notes annotations
Our "engineering field-notes" aesthetic can gain a literal device: mono footnote markers in the
margin that draw a hairline connector + reveal the note on scroll-in — like an annotated proof.
Deepens the case-study feel without new color or noise.
*How we'd build it:* a `<Footnote>` component, absolutely-positioned in the margin gutter;
`whileInView` draws the connector (`evolvePath`-style dashoffset) + fades the note.

### 4.3 — business/narrative refinements (fold into copy + the talk)
The 2026 data has **sharpened** since round 1 — and it cuts *our way*, because honesty is the play:
- **Token cost is non-linear**: ~3× task complexity can mean up to ~27× token spend; naive ROI
  models assume linear and are wrong. *Our line:* "We don't pretend it's cheap — token cost grows
  faster than the task. The win has to come from somewhere real: fewer review cycles, fewer resets."
- **Gross→net compression**: 30–45% gross productivity gains routinely compress to **8–15% net**
  after rework/governance/failure loops. *Our line:* "The honest number isn't the demo number.
  Structure — gates, ownership, idle-during-QA — is what protects the net from the rework tax."
- **Multi-agent burns 5–30× (up to 200k–1M tokens/task)** vs. single-chat. *Our line, owning it:*
  "Six agents cost more tokens than one. We chose it anyway — and here's the discipline that makes
  the trade pay." (Ties straight to the gates story.)
- **The 2027 cliff**: analysts expect 40%+ of agentic projects paused by end-2027 on unclear value
  / cost / weak controls. *Our framing:* the site *is* the controls — a worked example of the
  structure that keeps a team out of that 40%.
- Keep round-1's review-bottleneck + 17%-collaboration-gap framing; these new numbers **layer on
  top** as the cost-honesty half of the argument.

> Anti-pattern to keep banning (now reinforced by 2026 trend writing): AI-slop dark/neon look reads
> as *dated*, not premium. Warm/tactile is the 2026 premium signal — we're already correct; don't
> drift.

**Design & business references:**
- Fontfabric / Figma — 2026 type & web trends (variable fonts as interface). https://www.figma.com/resource-library/web-design-trends/
- NStarX — "Hidden economics of AI coding agents" (non-linear token cost, net-vs-gross). https://nstarxinc.com/blog/the-hidden-economics-of-ai-coding-agents/
- Keyhole — AI software development cost 2026 (enterprise TCO/ROI). https://keyholesoftware.com/ai-software-development-cost-2026/
- Creative Bloq — texture/warmth 2026 trends (premium = tactile, validates the brief). https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026

---

## Guardrails (unchanged, restated so they aren't lost)
One signature move per scene/section. Everything real — no fabricated making-of. Captions/silent-
safe film. `prefers-reduced-motion` everywhere (film default-paused, avatars freeze to resolved
pose, counters snap). Contrast ≥4.5:1. Verify Cyrillic renders in any new font axis use. Don't
oversell ROI — the honesty *is* the persuasion.
