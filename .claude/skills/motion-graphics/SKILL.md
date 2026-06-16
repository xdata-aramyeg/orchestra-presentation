---
name: motion-graphics
description: Use GSAP, Three.js (@remotion/three / react-three-fiber + drei), and Lottie (@remotion/lottie) INSIDE Remotion. Covers the frame-deterministic caveat that breaks naive use of realtime libraries, the paused-timeline-seek pattern for GSAP, ThreeCanvas + useCurrentFrame for 3D, the <Lottie> component, and a when-to-reach-for-each decision guide. Read after the remotion skill.
---

# Motion graphics inside Remotion — GSAP, Three.js, Lottie

These three libraries make a Remotion film richer — **but each ships its own realtime clock**, and
Remotion is frame-deterministic (one React render per video frame; scrubbing must reproduce exact
pixels). A library left to "play itself" runs at wall-clock speed: in the live `<Player>` it may
look fine, but when **rendered** Remotion captures only a few frames during the entrance and empty
frames after — stutter, or nothing. **The fix is always the same idea: drive the library from
`useCurrentFrame()`, never from its own ticker.** This skill shows how, per library.

> Read the **remotion** skill first. Pin `@remotion/three` / `@remotion/lottie` to the SAME exact
> version as `remotion` (`4.0.451`, June 2026).

## Decision guide — is the library worth it?
| Need | Reach for | Why / caveat |
|---|---|---|
| Counters, fades, slides, simple staggers, springs | **plain Remotion** (`interpolate`/`spring`) | Already deterministic, zero deps. Don't add a library for these. |
| Complex *choreography* — many overlapping tweens, labels, stagger grids, text-split | **GSAP** (seek pattern) | Best timeline ergonomics. Must be seeked per frame (below). |
| Real **3D / spatial** beats — camera moves, depth, materials, a rotating org-graph | **@remotion/three** (r3f + drei) | True 3D. GPU cost; keep scenes light for the live Player. |
| A polished **vector motion** asset from a designer/After Effects | **@remotion/lottie** | Drop-in JSON. Heavy/opaque; don't hand-build complex motion as Lottie. |
| Premium **SVG line-art** (our 6 avatars) | see **svg-animation** skill | Often the lightest, most on-brand option. |

Default to plain Remotion. Add a library only where it earns its weight.

---

## GSAP inside Remotion — the paused-timeline-seek pattern

GSAP's ticker races wall-clock time, so you must **build a paused timeline once and seek it to the
current frame every render**. The timeline becomes a pure function of `frame`.

Key: build the timeline with `{paused: true}`, target real DOM refs, memoise it so it's built
once, then `timeline.seek(frame / fps)` (timeline is authored in **seconds**) — or
`timeline.progress(frame / durationInFrames)` to map the whole comp 0→1. Do the seek in a layout
effect so it lands before paint.

```tsx
'use client';
import {useRef, useMemo, useLayoutEffect} from 'react';
import {useCurrentFrame, useVideoConfig, AbsoluteFill} from 'remotion';
import gsap from 'gsap';

export const GsapScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Build the timeline ONCE (paused). Targets resolve from the ref subtree.
  useMemo(() => {
    // built inside a layout effect below to ensure DOM exists
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t = gsap.timeline({paused: true});
      t.from('.title', {y: 60, opacity: 0, duration: 0.6, ease: 'power3.out'})
       .from('.line', {scaleX: 0, transformOrigin: 'left', stagger: 0.08, duration: 0.5}, '-=0.2');
      tl.current = t;
    }, root);
    return () => ctx.revert();
  }, []);

  // Seek the paused timeline to the exact video time each render → deterministic.
  useLayoutEffect(() => {
    tl.current?.seek(frame / fps);
  }, [frame, fps]);

  return (
    <AbsoluteFill ref={root} style={{backgroundColor: '#FBFAF7'}}>
      <h1 className="title" style={{fontFamily: 'Unbounded', color: '#1A1714'}}>Две волны</h1>
      <div className="line" style={{height: 2, background: '#C5482F'}} />
      <div className="line" style={{height: 2, background: '#C5482F'}} />
    </AbsoluteFill>
  );
};
```
**GSAP gotchas in Remotion**
- **Never call `tl.play()`** or leave the timeline unpaused — that hands control back to the ticker
  and breaks rendering. Only ever `seek()`.
- Build once (in a layout effect / `gsap.context`), seek on every `frame` change. Rebuilding the
  timeline per frame is slow and can flash.
- Plugins that measure the DOM (SplitText) need fonts loaded first — gate with `delayRender()`
  until `document.fonts.ready`.
- `gsap.context(..., root)` + `ctx.revert()` scopes selectors and cleans up (important: the Player
  mounts/unmounts the scene as you scrub).
- For most simple cases you don't need GSAP at all — `interpolate`/`spring` is lighter. Reach for
  GSAP only when the *choreography* is the hard part.

---

## Three.js / 3D — `@remotion/three` (react-three-fiber + drei)

`<ThreeCanvas>` is r3f's `<Canvas>` wired to Remotion's frame clock. **Do NOT use r3f's
`useFrame()`** (its own rAF loop) — drive every transform from `useCurrentFrame()` declaratively,
so scrubbing/rendering stays deterministic.

```bash
npm i @remotion/three@4.0.451 three @react-three/fiber @react-three/drei @types/three
```
```tsx
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

export const ThreeScene = () => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 6], fov: 50}}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 3, 5]} />
      <Knot />
    </ThreeCanvas>
  );
};

const Knot = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rotation = (frame / fps) * 0.6;                 // time-based, deterministic
  const scale = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <mesh rotation={[rotation, rotation * 1.3, 0]} scale={scale}>
      <torusKnotGeometry args={[1, 0.3, 160, 24]} />
      <meshStandardMaterial color="#C5482F" roughness={0.4} />
    </mesh>
  );
};
```
**Three gotchas**
- `width`/`height` are required on `<ThreeCanvas>` — pass from `useVideoConfig()`.
- Any `<Sequence>` placed *inside* the canvas must use `layout="none"` (no div wrapper in WebGL).
- drei helpers that animate internally (e.g. `<Float>`, `OrbitControls` auto-rotate) reintroduce a
  realtime clock — avoid them or freeze their motion; derive movement from `frame` instead. Static
  drei helpers (`<RoundedBox>`, `<Text3D>`, `<Environment>`, loaders like `useGLTF`) are fine.
- `useVideoTexture()` maps a Remotion `<Video>`/`<OffthreadVideo>` onto a material if you need
  footage on a 3D surface.
- 3D is the heaviest cost in the live Player. Keep poly counts/lights modest, one canvas, and
  reduced-motion users get the mp4 poster instead.

---

## Lottie — `@remotion/lottie`

Plays an After-Effects/Lottie JSON, synced to the Remotion frame. Load the JSON via
`staticFile()` + `fetch`, gated by `delayRender()` so the render waits for it.

```tsx
import {useEffect, useState} from 'react';
import {Lottie, LottieAnimationData} from '@remotion/lottie';
import {delayRender, continueRender, staticFile, cancelRender} from 'remotion';

export const LottieScene = () => {
  const [handle] = useState(() => delayRender('Loading Lottie'));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile('badge.json'))
      .then((res) => res.json())
      .then((json) => { setData(json); continueRender(handle); })
      .catch((e) => cancelRender(e));
  }, [handle]);

  if (!data) return null;
  return <Lottie animationData={data} loop playbackRate={1} />;
};
```
**Lottie gotchas**
- `animationData` must be a **stable reference** — memoise it; a new object identity re-initialises
  the animation and flickers.
- `delayRender`/`continueRender` is mandatory for the render path (so the mp4 waits for the fetch);
  `cancelRender` on failure surfaces the error instead of hanging.
- `getLottieMetadata(json)` returns `{durationInFrames, fps, width, height}` — use it to size the
  `<Composition>`/`<Sequence>` to the asset so it doesn't clip.
- Lottie is great for a *finished* designed asset; it's a poor tool for motion you'd otherwise
  hand-build — you can't easily restyle it to the vermilion accent. For our line-art avatars,
  prefer the **svg-animation** approach over exporting them as Lottie.

---

## Cross-cutting rules
- **One clock to rule them all: `useCurrentFrame()`.** Every library is seeked/derived from it.
- Anything async (fonts, JSON, GLTF) must be wrapped in `delayRender()/continueRender()` or the
  render captures incomplete frames.
- Keep the live-Player GPU budget sane: one Three canvas, modest Lottie, GSAP only where needed.
  Reduced-motion / low-end → serve the prebuilt mp4 poster (see remotion skill).
- Reuse the site tokens (paper `#FBFAF7`, ink `#1A1714`, vermilion `#C5482F`, Unbounded/Onest/
  JetBrains Mono) in every scene so the film matches the page.
