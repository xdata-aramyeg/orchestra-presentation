# Research — concrete ideas for our self-referential agent-team site

> Prepared by the research teammate for the Orchestra site (Russian, light editorial,
> self-referential "making-of"). Everything here is scoped to OUR site, OUR stack
> (Next.js + Tailwind + Motion), and OUR locked design brief. Prioritized, stealable, buildable.

---

## A. Top recommendations for OUR site (prioritized)

Ordered by impact × ease. P1 = build first, P2 = strong, P3 = nice easter eggs.

### P1 — these carry the whole concept

1. **"Watch the agents talk" — a replayable message-thread scroll** *(the signature moment)*
   The single most on-theme device for a self-referential team site: show the *real*
   Lead↔teammate mailbox messages as a chat thread that reveals one bubble at a time as you
   scroll. Left-aligned = teammates, right-aligned = Lead; mono handles (`@frontend`,
   `@qa`), terracotta accent on the Lead. End each thread on a real outcome ("QA: FAIL —
   contrast 3.1:1" → "Frontend: fixed → 4.8:1").
   *How we'd build it:* a `<MessageThread>` fed by a JSON array of `{from, role, text, ts}`;
   reveal with Motion `whileInView` + stagger, or an IntersectionObserver per bubble. A
   "▶ replay" pill re-runs the stagger. Pull copy from the actual course-corrections.

2. **"This section was built by agent X" byline / provenance ribbon**
   Every major section gets a tiny mono footer chip: `сверстал @frontend · проверил @qa ·
   ревью @reviewer`. Makes the self-reference literal and continuous, not a one-off page.
   *How we'd build it:* a `<Byline agents={[...]} />` component (eyebrow-tag styling already
   in the brief). Data-driven so it's one line per section.

3. **"Кладбище ошибок" — an honest Mistakes Graveyard**
   Brief already mandates the mistakes content; give it a *form*. Each mistake = a "headstone"
   double-bezel card: the mistake (Lead hand-coded; QA scope ambiguous; v1 "looked so bad";
   the full reset; Figma rate-limit) → the lesson → the rule it became. Honesty is our
   strongest trust signal (see §C). Slight desaturation / "engraved" inset on these cards.
   *How we'd build it:* map over `knowledge/course-corrections/`; `<MistakeCard problem
   lesson rule />`. Reduced-motion-safe fade-up.

4. **Interactive org chart / two-wave flow diagram**
   The 2-wave async→barrier→QA→Reviewer flow is the structural story. Make it an SVG diagram
   where hovering a node (Lead, PM, Frontend, Backend, QA, Reviewer) highlights its lane,
   its files-owned, and dims the rest — and the "BARRIER" and "idle-during-QA" bands are
   visually called out.
   *How we'd build it:* inline SVG + Motion on `hover`/`whileInView`; nodes link to the
   `/agents/[role]` character pages. Animate the flow path drawing on scroll (stroke-dashoffset).

5. **Live build timeline / changelog (the "building in public" beat)** — *steal from Linear*
   A vertical, dated timeline of the build itself: "Wave 1 — Frontend+Backend в параллели",
   "Барьер: feature complete", "QA: FAIL ×2", "Reset v1 → v2". Reads as a changelog, proves
   the process happened. Linear's lesson: tight cadence + plain confident voice + one
   screenshot per entry = feels alive and trustworthy.
   *How we'd build it:* timeline from a `commits`/`events` JSON (can seed from real git log);
   sticky date rail, entries fade-up. Optionally generate entries from `git log` at build time.

### P2 — high polish, clearly worth it

6. **v1 → v2 before/after of the scrapped design** *(turn the failure into a feature)*
   We literally reset v1 because it "looked so bad." Show it. A draggable before/after slider
   (or a tasteful toggle) of v1 vs v2 of the same hero. This is catnip for a design-literate
   talk audience and doubles as proof of the iterate-on-screenshots loop.
   *How we'd build it:* clip-path reveal slider (pointer-drag), two static screenshots; or a
   two-state Motion crossfade. Keep v1 archived (it's on `archive/v1-build`).

7. **Animated numeric "proof" counters tied to real numbers**
   Brief allows numeric counters. Use them for *our* stats: agents (6), waves (2), QA cycles,
   mistakes logged, skills/MCPs/plugins used. On a mixed eng+leadership audience, quantified
   self-reference lands (see §C ROI framing).
   *How we'd build it:* `useInView` + a count-up tween (`cubic-bezier(0.32,0.72,0,1)`),
   respect `prefers-reduced-motion` (snap to final value).

8. **Skills/MCP/plugins as a "toolbelt" filterable wall**
   The brief wants skills/MCPs/plugins named with what each did. Make it a tactile wall of
   mono-labeled chips grouped by kind (Skill / MCP / Plugin), each expanding to "что делал на
   этом сайте." Filter by which agent used it → ties back to the org chart.
   *How we'd build it:* data array → `<ToolChip>` grid; expand on click (Motion layout
   animation); category filter via simple state.

9. **Character cards with a "real work done here" log**
   Each `/agents/[role]` page: role, model (Opus), tools, personality, AND a short evidence
   list of what it actually did on THIS site (linking to the timeline/threads). Double-bezel
   card per brief; mono handle; one terracotta accent line. Give each agent a one-line
   epigraph in its own voice.
   *How we'd build it:* MDX or a typed `agents` data file → shared `<AgentCard>` + detail layout.

### P3 — easter eggs (cheap, memorable, optional)

10. **Hidden terminal / `?` console easter egg**
    A keyboard-summoned (press `~` or `/`) faux-terminal that prints the team roster, the
    operating-agreement rules, or `whoami` → "you're reading a site that built itself." Great
    live-demo punchline.
    *How we'd build it:* a hidden fixed overlay, keydown listener, a tiny command map. Keep it
    `prefers-reduced-motion` and a11y-friendly (focus trap, Esc to close). **Do not** trigger
    native `alert/confirm` (breaks browser-automation QA).

11. **"Сделано командой агентов" footer signature + build hash**
    Footer states the meta-fact plainly and stamps the real git short-hash + build date — the
    ultimate "this is honest" detail.
    *How we'd build it:* inject `process.env` git hash at build; static date.

12. **Cursor/scroll "grain breathes" micro-detail**
    The mandated film-grain overlay can subtly animate (very slow opacity drift) so the paper
    feels alive without being flashy.
    *How we'd build it:* animated SVG `feTurbulence` noise or a 2-frame grain swap at low fps;
    `opacity ~0.03`, `pointer-events:none`, disabled under reduced-motion.

---

## B. Design moves that read high-end editorial in 2025–2026 (tied to our stack)

The 2026 trend signal is unambiguous and *exactly* our brief: **texture, warmth, tactile
"handmade" editorial** over sterile flat AI-look. Concrete, on-brief moves:

- **Typography as the interface.** 2026 editorial leans on oversized, confident display type
  as the primary visual — not imagery. We already chose Unbounded (Cyrillic). Push it: very
  large headline weights, tight leading on display, generous on body (1.6). Let a single huge
  Cyrillic word carry a section. *(next/font/google + Tailwind `text-[clamp(...)]`.)*
- **Scanned-paper grain + film noise** for a printed feel — already locked. Trend confirms a
  subtle CSS grain filter / animated SVG noise over a solid warm background is *the* premium
  tactile move right now. Keep it at `opacity 0.03`, fixed, pointer-events-none.
- **Warm, earth-toned palette = trust.** Our `#FBFAF7 / #F3F0E9 / #1A1714` + single vermilion
  `#C5482F` is bang on the "warmer, grounded, human, trustworthy" 2026 direction. Resist any
  second bright color.
- **Cut-and-paste / collage asymmetry** — "slight messiness suggests effort and personality
  rather than automation." For a site about *automation* this is a deliberate, ironic win:
  use editorial splits, off-grid pull-quotes, rotated tape/label motifs on cards. *(Tailwind
  `rotate-[-2deg]`, asymmetric grid, negative margins.)*
- **Field-notes aesthetic:** margin annotations, mono "footnotes," hairline rules, eyebrow
  tags, numbered sections (01 / 02 / 03). Makes the case-study feel like an engineer's
  notebook. *(All static Tailwind; the eyebrow + double-bezel patterns are in the brief.)*
- **Scroll choreography, restrained:** heavy fade-up + slight blur (brief), staggered lists,
  SVG path-draw on the flow diagram, count-up numbers. One signature scroll moment (the
  message thread) rather than effects everywhere. Custom cubic-bezier only; honor
  `prefers-reduced-motion`. *(Motion `whileInView`, `useInView`.)*
- **Double-bezel cards as a system,** not decoration: agent cards, mistake headstones, tool
  chips, timeline entries all share the outer-shell/inner-core treatment → one cohesive
  material language across the site.

---

## C. Business / narrative framing for a mixed eng + leadership audience

Use real, current numbers — they make the talk credible and the self-reference land.

**The numbers worth quoting (2025 data):**
- Healthy ROI on AI coding tooling: **~2.5–3.5× average, 4–6× top quartile** — *but only when
  real token/usage cost is included.* (Frame our token cost honestly → builds trust.)
- **~70%** of agent users report agents reduced task time / raised productivity; only **~17%**
  say agents improved *team collaboration* — i.e. the hard part isn't individual speed, it's
  **coordination**. Our whole site is an answer to that 17% gap: a *structured* team with
  barriers and gates.
- The bottleneck has shifted: AI makes code **bigger and faster but buggier**, moving the
  constraint to **review**. Top-quartile orgs win by pairing velocity with **stronger review
  standards / quality gates**. → This is the entire justification for our QA→Reviewer gate and
  idle-during-QA rule.

**Story beats that make the talk memorable (map to site sections):**
1. **"The site you're looking at built itself."** Open on the meta-fact. Hook = the demo *is*
   the proof. (hero + footer build-hash)
2. **The problem: speed without structure = mess.** Cite the 17% collaboration gap / review
   bottleneck. (intro)
3. **The model: a team, not a megaprompt.** Lead orchestrates; specialists own files;
   separation of concerns prevents conflicts. (org chart)
4. **The discipline: parallelism *with* gates.** Two waves in parallel → barrier → QA →
   Reviewer. Parallelism gives speed; gates protect quality. (flow diagram + timeline)
5. **The honesty: here's where we screwed up.** Mistakes graveyard + v1→v2. Showing failure is
   the strongest trust move — counter-signals to an audience tired of AI hype. (mistakes)
6. **The receipts.** Counters, tool wall, "built by agent X" bylines. Quantified + attributed.

**How to frame the value (one-liners for the copy):**
- *Parallelism* → "Frontend and Backend worked the same hour on different files — wall-clock,
  not sum-of-tasks."
- *Quality gates* → "Nothing ships past QA; the Reviewer can't edit, so it can't hide a bug by
  fixing it." (our actual rule — great line)
- *Separation of concerns* → "Six narrow roles beat one omniscient prompt: no file conflicts,
  clear ownership, honest review."
- *ROI vs token cost* → "Yes it spends more tokens. The win is fewer review cycles and fewer
  regressions — where the 4–6× actually comes from."
- *Trust via self-reference* → "We didn't make a demo of a product. We made the product
  document its own construction, mistakes included."

---

## D. References worth stealing from

1. **Linear public changelog** — cadence, plain confident voice, one screenshot per entry,
   "building in public" as a growth/trust engine. Model for our build timeline (§A5).
   https://lastrelease.io/blog/how-linear-uses-a-public-changelog
2. **Creative Bloq — "Texture, warmth and tactile rebellion: 2026 graphic design trends"** —
   validates grain/paper/collage/warmth direction; good language for the design rationale.
   https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026
3. **Fontfabric — Top 10 Design & Typography Trends 2026** — "typography as the interface,"
   oversized expressive type; supports our Unbounded-led display system.
   https://www.fontfabric.com/blog/10-design-trends-shaping-the-visual-typographic-landscape-in-2026/
4. **Awwwards — Editorial layout inspiration** — reference wall for asymmetric editorial grids,
   pull-quotes, field-notes layouts.
   https://www.awwwards.com/inspiration/editorial-layout
5. **GSAP forum — "Animated chat conversation using ScrollTrigger"** — proven pattern for the
   scroll-revealed message thread (§A1); we'd port the idea to Motion's `whileInView`.
   https://gsap.com/community/forums/topic/42862-animated-chat-conversation-using-scrolltrigger/
6. **AI Coding Assistant ROI (Index.dev) + Faros AI productivity-paradox report** — the 2.5–6×
   ROI and review-bottleneck numbers for §C.
   https://www.index.dev/blog/ai-coding-assistants-roi-productivity ·
   https://www.faros.ai/blog/ai-software-engineering

---

## E. Risks & anti-patterns to avoid

- **AI-slop is the failure mode the brief already bans** — no OLED-black, neon/purple glow,
  radial "AI orb" mesh, centered-hero-over-gradient, glassmorphism-everywhere. The 2026 trend
  *agrees*: warm/tactile is now the premium signal; the dark-neon look reads as cheap/dated.
- **Effects everywhere ≠ premium.** Pick ONE signature scroll moment (the message thread).
  Everything else = restrained fade-up. Over-animation kills the editorial calm.
- **Don't fake the self-reference.** Every byline, timeline entry, and message bubble must map
  to something that *actually happened* (real course-corrections, real git log). A fabricated
  "making-of" is the one thing that would destroy the trust the whole concept is built on.
- **Easter-egg terminal must not trigger native `alert/confirm/prompt`** — it blocks the
  Chrome-MCP automation QA uses, and is an a11y trap. Use an in-page overlay with focus trap +
  Esc.
- **Accessibility on the tactile stuff:** grain at `opacity 0.03` + `pointer-events:none`;
  every animation gated on `prefers-reduced-motion`; counters snap to final value when reduced;
  contrast ≥ 4.5:1 on ink-over-paper (QA already flagged a contrast miss once — keep it green).
- **Cyrillic font verification is non-optional.** Confirm Unbounded / Onest / JetBrains Mono
  actually render Cyrillic glyphs before shipping (brief calls this out; it's a real trap with
  variable Google fonts).
- **Don't oversell ROI.** Quote token cost honestly; the *honesty* is the persuasion. A
  leadership audience distrusts uncaveated "10× productivity" claims (the data shows the
  paradox: speed up, quality risk up).
