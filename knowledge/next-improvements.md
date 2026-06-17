# Next improvements — the loop's working queue

> Reframed loop mandate (docs/GOAL.md): every iteration raises **visual + exciting + educational**.
> Execute top-down AFTER the current Reviewer gate clears (idle-during-review). Re-prioritize each loop.

## P1 — do next (highest leverage)

1. **Tame the home length (VISUAL/UX).** The home is ~16k px desktop / ~30k px mobile — an
   exhausting single scroll. Options (pick, don't stack): (a) split the deepest content to routes —
   move the **message thread + build timeline → `/process` («как мы это строили»)**, keep a teaser
   on home; (b) add a **sticky in-page section nav / progress rail** so it's navigable; (c) make the
   educational «под капотом» section a `/under-the-hood` route with a home teaser. Recommend (a)+(b).
   → frontend. Acceptance: home desktop < ~9k px, every section reachable, no content lost.

2. **One viewport-scale Cyrillic hero moment (VISUAL).** A single huge Unbounded word per key page,
   scroll-transformed (weight/scale) — 2026's dominant editorial-award move; assets already loaded.
   → frontend. Low effort, high "wow".

3. **v1→v2 before/after (EXCITING + honest).** A draggable clip-path slider of the scrapped dark v1
   vs the current hero (v1 lives on `archive/v1-build`). Turns our failure into a feature; pairs with
   the mistakes section. → frontend (needs a v1 screenshot — Lead can capture from the archive branch).

## P2 — strong

4. **Film polish (VISUAL/EXCITING).** Add ONE 3D beat (the org-graph in `@remotion/three` — needs
   `three`/`@remotion/three` install) and/or a CC0 ambient bed + tiny SFX (struck-fork = QA), captions
   stay burned in. Keep it modular. → chronicler (+ Lead installs three).

5. **Avatar "tuning-up" signature (VISUAL).** Baton beats 1-2-3 → on the 3, the other six fire in role
   order — a coordinated set moment on `/agents` or the org chart. → frontend (svg-animation skill).

6. **«Скопировать» snippets (EDUCATIONAL).** In the reproduce-it section, make the key config copyable:
   the `settings.json` `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` block, a sample `.claude/agents/*.md`,
   the spawn prompt. People leave able to paste-and-go. → frontend.

7. **Film↔section deep-links (EXCITING).** Section gets «▶ смотреть в фильме 00:34» that routes to
   `/film` and seeks the Player. → frontend + chronicler (expose a seek param).

## P3 — easter eggs / polish

8. Hidden terminal (`~`/`/`) → in-page overlay (NOT native alert) `whoami → "сайт, который построил себя"`.
9. Footer build signature: real git short-hash + date.
10. Variable-font weight-on-scroll on headings (Unbounded is variable; LCP win).
11. Reduced-motion full audit + a static mp4 poster for `/film` (needs `@remotion/renderer`).

## Notes
- Always back up before a risky step (3D install, route-split). Each P1/P2 → its own commit + tag.
- Keep the design-brief bar; never regress what the human already loves.
