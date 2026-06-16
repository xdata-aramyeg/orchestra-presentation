# Remotion Film — build plan (for the `chronicler` teammate)

> R&D output: dependency set, project layout, the Next.js 16 embedding approach, the mp4 fallback,
> a feasibility/perf note, and a crisp build sequence. **No app code was touched and nothing was
> installed** (Frontend is editing the app). This is the plan the Хроникёр follows next loop.
> Companion skills (read first): `.claude/skills/remotion/`, `.claude/skills/motion-graphics/`,
> `.claude/skills/svg-animation/`.

## Verified facts (June 2026)
- **Remotion v4**, latest **`4.0.451`**. v4 supports **React 19**; ref types correct since
  **≥ 4.0.236**. Site runs **Next 16.2.9 + React 19.2.4** → compatible. ✅
- **`@remotion/player`** embeds a composition **live in the browser, no server render** — must be a
  **client component**, lazy-loaded with `ssr:false`.
- **`@remotion/three`** (`<ThreeCanvas>`) wires r3f to the frame clock; you must use
  `useCurrentFrame()`, not r3f `useFrame()`.
- **`@remotion/lottie`** (`<Lottie animationData>`) plays Lottie JSON synced to the frame; load via
  `staticFile()` + `fetch` gated by `delayRender()`.
- **GSAP** has its own realtime ticker → must be used via the **paused-timeline + `seek(frame/fps)`**
  pattern, or the rendered mp4 stutters.
- **`@remotion/renderer`/`@remotion/bundler`** = server/CLI only (Webpack + headless Chrome +
  FFmpeg). Cannot be bundled inside a Next API route.

## Dependency set (pin ALL `remotion`/`@remotion/*` to the SAME exact version — no `^`)
```jsonc
// runtime (ship to client)
"remotion": "4.0.451",
"@remotion/player": "4.0.451",
// enhancers — add only the ones the storyboard actually uses
"@remotion/three": "4.0.451",
"three": "^0.169.0", "@react-three/fiber": "^9", "@react-three/drei": "^9",
"@remotion/lottie": "4.0.451",
"gsap": "^3.12",
// dev / build only
"@remotion/cli": "4.0.451",
"@remotion/bundler": "4.0.451",
"@remotion/renderer": "4.0.451",
"@types/three": "^0.169.0"
```
> Frontend installs these in one pass (NOT during this R&D pass). Verify the exact patch with
> `npm view remotion version` at install time and align every `@remotion/*` to it. Start with just
> `remotion` + `@remotion/player`; add `three`/`lottie`/`gsap` lazily when a scene needs them.

## Where it lives
```
orchestra-site/
  remotion/                 # ← Хроникёр owns this whole folder (composition source)
    index.ts                # registerRoot(RemotionRoot)
    Root.tsx                # <Composition id="OrchestraFilm" ...>
    Film.tsx                # <Series> of scenes (shared by Player AND renderer)
    theme.ts                # site tokens (paper/ink/vermilion + font names + fps)
    scenes/                 # one file per beat — Brief, TwoWaves, Barrier, QaGate, Review, Mistakes, Site
    components/             # Avatar, Eyebrow, Caption, GrainOverlay (reuse site SVG geometry)
  app/
    film/
      page.tsx              # server component — lazy-loads the Player island, renders poster
      player.tsx            # 'use client' — <Player component={Film} .../>
  public/
    orchestra-film.mp4      # prebuilt fallback (CI/build step)
    film-poster.jpg         # still for reduced-motion / loading
  remotion.config.ts        # render config (codec, image format)
  next.config.ts            # add: serverExternalPackages: ['@remotion/renderer']
```
Route: **`/film`** (label in nav: «Как это снято» / «Фильм»). Coordinate the route + nav link with
**Frontend**; Хроникёр owns `remotion/` and the two `app/film/*` files only.

## Next.js 16 embedding approach (recommended: live Player + poster, mp4 fallback)
1. `remotion/Film.tsx` is authored once and **shared** between Player and renderer.
2. `app/film/player.tsx` — `'use client'`, renders `<Player component={Film} durationInFrames fps
   compositionWidth={1920} compositionHeight={1080} controls clickToPlay autoPlay={false}
   renderLoading={poster} style={{width:'100%',aspectRatio:'16/9'}} />`.
3. `app/film/page.tsx` — server component, `dynamic(() => import('./player'), {ssr:false, loading:
   poster})` so the Player JS never SSRs and never bloats the server bundle.
4. **Poster-first**: show `film-poster.jpg` + a play button; start the Player on click (or on
   intersection). Keeps the heavy player JS/GPU work off initial load.
5. Fonts: the film must use the same families the page loads (`Unbounded`/`Onest`/`JetBrains Mono`
   via `next/font`) — either pass them in or load inside the comp with `delayRender` until
   `document.fonts.ready`, so the rendered mp4 isn't a fallback font.

## mp4 fallback (render path)
- Build step / CI (NOT an on-demand serverless route):
  ```bash
  npx remotion render remotion/index.ts OrchestraFilm public/orchestra-film.mp4 --codec=h264 --crf=18
  npx remotion still  remotion/index.ts OrchestraFilm public/film-poster.jpg --frame=60
  ```
  Add `"render:film"` + `"poster:film"` scripts to `package.json`.
- `next.config.ts`: `serverExternalPackages: ['@remotion/renderer']`.
- Serve the mp4 to `prefers-reduced-motion` users and the no-JS path; otherwise it's just the
  download/share artifact and the loading poster.

## Feasibility / performance notes
- **Live Player is the right primary** here: short film, design-driven, iterated each loop, tiny
  artifact (just JS), restyle without re-rendering. Its cost is the visitor's CPU/GPU.
- **Lazy-load** the Player (`ssr:false` + dynamic import) and gate behind a poster + click-to-play
  → zero player cost on first paint; respects reduced-motion.
- **GPU budget:** at most **one** `<ThreeCanvas>`, modest polys/lights; use 3D only for 1–2 spatial
  beats, plain Remotion for the rest. GSAP only where choreography is the hard part.
- **Reduced-motion / low-end / no-JS:** serve the **prebuilt mp4 + still poster** instead of the
  live Player. Never autoplay the live Player.
- Keep scenes modular (one file each) so iterations are cheap and a weak beat can be reworked
  without touching the rest. Reuse the avatar SVG geometry (frame-driven, per svg-animation skill).

## Build sequence (the Хроникёр follows this, AFTER the PM's storyboard exists)
1. **Wait for the storyboard/script** from the PM (don't invent the narrative). Pull real material:
   `knowledge/site-content-ru.md`, `knowledge/thread-and-timeline-ru.md`,
   `knowledge/course-corrections/`, the 6 avatars.
2. **Install** the pinned deps (Frontend/owner does it in a clean pass — not during others' edits).
3. **Skeleton**: `remotion/index.ts` + `Root.tsx` (`<Composition id="OrchestraFilm">`) +
   `theme.ts` (tokens/fps) + an empty `Film.tsx`. Verify in Remotion Studio (`npx remotion studio`).
4. **Scenes** one file at a time, plain Remotion first (`interpolate`/`spring`, `<Series>`): Brief →
   TwoWaves (parallel) → Barrier → QA gate (idle-during-QA) → Review → Mistakes/resets → the Site.
5. **Enhance selectively**: add a Three beat (e.g. the org-graph in 3D) and/or a GSAP-choreographed
   beat **only where it earns its weight** (seek pattern). Lottie only for a finished designed asset.
6. **Audio** (optional): score/VO via `<Audio>` with a frame-derived fade.
7. **Embed**: add `app/film/page.tsx` + `player.tsx` (lazy, poster-first) — coordinate route/nav
   with Frontend.
8. **Render fallback**: `render:film` + `poster:film`; wire reduced-motion to the mp4/poster.
9. **Handoff** per the chronicler role: what was built, how to preview (`/film` + `remotion
   studio`), runtime/length, strongest/weakest beats. **QA + Reviewer verify** — Хроникёр doesn't
   self-verify.

## Open questions for the Lead / PM
- Aspect/length: assume **1920×1080, ~60–90s, 30fps** unless the storyboard says otherwise.
- Is audio (score/VO) in scope, or silent-with-captions (safer, no licensing)?
- Nav placement + Russian label for the `/film` route.
