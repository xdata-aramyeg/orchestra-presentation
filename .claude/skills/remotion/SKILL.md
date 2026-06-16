---
name: remotion
description: Build videos programmatically with Remotion (React/TS). Covers project structure, the frame-deterministic animation model (useCurrentFrame / interpolate / spring), Sequence/Series composition, audio, embedding a composition LIVE in a Next.js 16 App Router page via @remotion/player (no server render), and the @remotion/renderer / CLI mp4 fallback. Use when building or embedding a Remotion film.
---

# Remotion — make videos in React

Remotion renders video by drawing **one React frame per video frame**. Nothing animates by
itself: every visual is a **pure function of the current frame number**. Scrub to frame 42 and
you get exactly the same pixels every time — that determinism is what makes rendering and the
scrubbable `<Player>` possible. Internalise this and everything else follows.

> Version note (verify at build time): Remotion is on **v4** (latest `4.0.451`, June 2026).
> v4 supports **React 19** (Next 16's React). For correct ref types use **≥ 4.0.236**.
> **Pin every `remotion` + `@remotion/*` package to the SAME exact version, no `^`** — mismatched
> versions are the #1 cause of cryptic errors.

## When to use this skill
- Building a Remotion composition (the film itself).
- Embedding a composition live in a React/Next.js page (`@remotion/player`).
- Producing an mp4 fallback (`@remotion/renderer` / `@remotion/cli`).
- Anytime you need frame-deterministic motion. For the enhancer libraries (GSAP, Three.js,
  Lottie) inside Remotion, read the **motion-graphics** skill too.

## Install (pin versions identically)
```bash
# core (always)
npm i remotion@4.0.451 @remotion/player@4.0.451
# build / render tooling (dev)
npm i -D @remotion/cli@4.0.451 @remotion/bundler@4.0.451 @remotion/renderer@4.0.451
# enhancers, only if used — see motion-graphics skill
npm i @remotion/three@4.0.451 @remotion/lottie@4.0.451
npm i three @react-three/fiber @react-three/drei @types/three gsap
```
`@remotion/player` is browser-only and safe to ship to the client. `@remotion/renderer`/`bundler`
pull in Webpack + headless Chrome + FFmpeg — **server/CLI only, never import them into client or
into a Next API route's bundle** (see Fallback render below).

## Core mental model — the 4 hooks/utilities you actually use

```tsx
import {useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, AbsoluteFill} from 'remotion';
```

- **`useCurrentFrame()`** → the integer frame being drawn (0-based, resets inside a `<Sequence>`).
- **`useVideoConfig()`** → `{fps, durationInFrames, width, height}` of the current composition.
- **`interpolate(frame, [inFrames], [outValues], opts)`** → map a frame range to any value range.
  Always clamp, or values shoot past the range:
  ```tsx
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  ```
- **`spring({frame, fps, config})`** → natural physical easing (0→1 by default). Deterministic.
  ```tsx
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 200}}); // critically-damped, no overshoot
  ```

Rule: **never** use `setTimeout`, `requestAnimationFrame`, `Date.now()`, `Math.random()` (without
a seed), CSS transitions/animations, or any library's own clock to animate. They desync from the
frame and render as stutter or empty frames. Derive everything from `frame`.

## Composition structure (many small files)

```
remotion/
  index.ts              # registerRoot(RemotionRoot)
  Root.tsx              # <Composition> registry — declares every film + its fps/size/duration
  Film.tsx              # top-level timeline: <Series>/<Sequence> of scenes
  scenes/
    Brief.tsx  TwoWaves.tsx  Barrier.tsx  QaGate.tsx  Mistakes.tsx ...
  components/           # reusable bits (Avatar, Eyebrow, GrainOverlay, Caption)
  theme.ts              # the site tokens (paper, ink, vermilion, fonts, fps)
```

**Root.tsx** — the registry. Each `<Composition>` is a named, independently-renderable video:
```tsx
import {Composition} from 'remotion';
import {Film} from './Film';

export const RemotionRoot = () => (
  <Composition
    id="OrchestraFilm"
    component={Film}
    durationInFrames={30 * 75}   // 75s at 30fps
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{}}
  />
);
```
`index.ts`:
```ts
import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';
registerRoot(RemotionRoot);
```

### Timing scenes — `<Sequence>` / `<Series>`
`<Sequence from={f} durationInFrames={d}>` time-shifts children so their `useCurrentFrame()`
starts at 0 when the sequence begins — write each scene as if it starts at frame 0.
```tsx
import {AbsoluteFill, Sequence, Series} from 'remotion';

export const Film = () => (
  <AbsoluteFill style={{backgroundColor: '#FBFAF7'}}>
    <Series>
      <Series.Sequence durationInFrames={120}><Brief /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><TwoWaves /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Barrier /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
```
`<Series>` lays scenes back-to-back automatically (no manual `from=` math). Use bare `<Sequence>`
when you need overlap. `<AbsoluteFill>` is a `position:absolute; inset:0; flex` layer — stack them
for z-ordered scenes.

## Audio
```tsx
import {Audio, staticFile, useVideoConfig, interpolate, useCurrentFrame} from 'remotion';

const frame = useCurrentFrame();
const {durationInFrames} = useVideoConfig();
const volume = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0],
  {extrapolateLeft: 'clamp'}); // fade out last second
<Audio src={staticFile('score.mp3')} volume={volume} />
```
Put media in `public/` and reference with `staticFile('name.ext')`. Trim with `startFrom`/`endAt`.
Duration of the composition is fixed by `<Composition durationInFrames>`, not by the audio length.

## Embedding LIVE in Next.js 16 App Router — `@remotion/player` (recommended)

`<Player>` plays the composition **in the browser, no server render**. It must be a **client
component** (`"use client"`) and **lazy-loaded** so its JS never lands in the server bundle.

`remotion/Film.tsx` is shared verbatim between the Player and the renderer — author once.

`app/film/player.tsx` (client island):
```tsx
'use client';
import {Player} from '@remotion/player';
import {Film} from '@/remotion/Film';

export default function FilmPlayer() {
  return (
    <Player
      component={Film}
      durationInFrames={30 * 75}
      fps={30}
      compositionWidth={1920}
      compositionHeight={1080}
      style={{width: '100%', aspectRatio: '16 / 9', borderRadius: '2rem'}}
      controls
      loop={false}
      autoPlay={false}              // respect reduced-motion: keep false, click-to-play
      clickToPlay
      doubleClickToFullscreen
      renderLoading={() => <div className="film-poster" />}   // poster while JS loads
    />
  );
}
```

`app/film/page.tsx` (server component — lazy-load the island so the Player never SSRs):
```tsx
import dynamic from 'next/dynamic';
const FilmPlayer = dynamic(() => import('./player'), {
  ssr: false,                       // Player is browser-only
  loading: () => <div className="film-poster" aria-label="Загрузка фильма" />,
});
export default function FilmPage() {
  return <main><FilmPlayer /></main>;
}
```

Useful props: `component` **or** `lazyComponent` (pass one, never both — `lazyComponent`
code-splits the comp itself: `lazyComponent={() => import('@/remotion/Film')}`), `inputProps`
(props forwarded to the comp), `controls`, `loop`, `autoPlay`, `clickToPlay`,
`spaceKeyToPlayPause`, `initiallyMuted`, `renderLoading`, `renderPoster`, `errorFallback`.

Imperative control via a `ref` (`PlayerRef`): `.play() .pause() .toggle() .seekTo(frame)
.getCurrentFrame() .isPlaying() .mute()/.unmute() .requestFullscreen()`; subscribe with
`.addEventListener('play'|'pause'|'ended'|'frameupdate'|'error', cb)`. Use this to wire a custom
play button or to start playback only on intersection.

### Gotchas (Player / Next)
- **Always** `ssr:false` + lazy. The Player touches `window`; SSR-ing it throws.
- The Player measures its container — give it a sized wrapper (`width`/`aspectRatio`), or it
  collapses to 0 height.
- Fonts/assets used inside the composition must be loaded on the page too (e.g. the same
  `next/font` family) or use `@remotion/fonts` / `delayRender` font loading inside the comp.
- `compositionWidth/Height` are the *render* dimensions; `style.width` scales the display. Keep
  the aspect ratio equal or it letterboxes.

## Fallback render → mp4 (`@remotion/renderer` / CLI)

Keep a server-rendered mp4 as a poster-friendly fallback for reduced-motion users, social embeds,
or when JS is disabled.

**CLI (simplest, offline build step):**
```bash
npx remotion render remotion/index.ts OrchestraFilm out/orchestra-film.mp4 \
  --codec=h264 --crf=18
# still frame for a poster:
npx remotion still remotion/index.ts OrchestraFilm public/film-poster.jpg --frame=60
```
Add to `package.json`: `"render:film": "remotion render remotion/index.ts OrchestraFilm public/orchestra-film.mp4"`.

**Programmatic** (CI / a script — NOT inside a Next API route, because `@remotion/bundler` bundles
Webpack and you can't Webpack-bundle Webpack — pre-bundle in a standalone node script):
```ts
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';

const serveUrl = await bundle({entryPoint: './remotion/index.ts'});
const comp = await selectComposition({serveUrl, id: 'OrchestraFilm'});
await renderMedia({composition: comp, serveUrl, codec: 'h264',
  outputLocation: 'public/orchestra-film.mp4'});
```
In `next.config`: `serverExternalPackages: ['@remotion/renderer']` so Next doesn't try to bundle
the native binaries. Rendering needs FFmpeg + headless Chromium (downloaded by Remotion) — fine on
a build machine, heavy/slow for on-demand serverless; prefer a **prebuilt mp4 committed/CI-built**.

## Player vs pre-render — which to ship
- **Player (live)** — interactive, scrubbable, tiny artifact (just JS), trivially restyled each
  iteration, no render farm. Cost: runs on the visitor's CPU/GPU; heavy 3D scenes can stutter on
  low-end devices. **Recommended primary** for this site (short film, design-driven, iterating).
- **Pre-render (mp4)** — guaranteed smooth, works with reduced-motion/no-JS, cache-friendly. Cost:
  a build step, a multi-MB file, not interactive. **Recommended as the fallback/poster**, not the
  primary.
- Best of both: ship the **Player** behind a poster + click-to-play, and keep a **prebuilt mp4 +
  still poster** for the reduced-motion / no-JS path.

## Minimal end-to-end snippet (one scene)
```tsx
// remotion/scenes/Brief.tsx
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

export const Brief = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});
  const y = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#FBFAF7', justifyContent: 'center', alignItems: 'center'}}>
      <h1 style={{transform: `translateY(${y}px)`, opacity, color: '#1A1714',
        fontFamily: 'Unbounded', fontSize: 96}}>
        Команда собирается
      </h1>
    </AbsoluteFill>
  );
};
```

## Checklist before handing off
- [ ] All `remotion`/`@remotion/*` pinned to one exact version.
- [ ] Every animated value derived from `useCurrentFrame()` (no realtime clocks).
- [ ] `interpolate` calls clamp both extrapolations unless intentional.
- [ ] Player island is `'use client'` + lazy-loaded with `ssr:false` + a poster `renderLoading`.
- [ ] Reduced-motion path: poster/mp4 instead of autoplaying the live Player.
- [ ] Composition fonts/assets available to the page; `staticFile()` for anything in `public/`.
- [ ] mp4 + still poster render command exists and runs.
