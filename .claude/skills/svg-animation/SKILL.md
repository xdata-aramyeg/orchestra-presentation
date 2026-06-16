---
name: svg-animation
description: Author and animate premium SVG line-art (the technique behind the 6 Orchestra agent avatars). Covers the four animation methods (CSS keyframes, SMIL, Motion whileInView, GSAP DrawSVG-style stroke), stroke-dasharray / pathLength stroke-drawing, transform-box / transform-origin pivots in user units, reduced-motion, and a per-method when-to-use. Reference knowledge/avatars-concept.md.
---

# SVG line-art animation — characterful, on-brand, accessible

The Orchestra avatars are **ink line-art emblems** (single 5px stroke, one vermilion `#C5482F`
accent element that moves) on warm paper. This skill is how to author and animate them so they
read as "alive but calm" (~80% idle), stay `transform`/`opacity`-only, and freeze gracefully under
reduced-motion. The source of truth for geometry/poses is **`knowledge/avatars-concept.md`** (and
the built `knowledge/avatar-gallery.html`). This skill is the *technique*.

## The shared system (lock once)
- `viewBox="0 0 200 200"`, figure centred.
- `fill:none; stroke:#1A1714; stroke-width:5; stroke-linecap:round; stroke-linejoin:round`.
  Faint guides = same ink at `opacity:.22`.
- **Exactly one vermilion `#C5482F` element per emblem** — the thing that animates.
- Loops 7–9s, ~80%+ calm; custom curve `cubic-bezier(0.32,0.72,0,1)`; never `linear`/`ease-in-out`.
- `role="img"` + Russian `aria-label`; decorative ripples `aria-hidden`.
- `prefers-reduced-motion: reduce` → freeze to the resolved "done" pose.

## The two core SVG techniques

### 1. Stroke-drawing ("DrawSVG") — animate a line *drawing itself*
Set the dash length to the path length, then animate `stroke-dashoffset` from full → 0.
```css
.underline {
  stroke: #C5482F;
  stroke-dasharray: 100;     /* ≈ path length; use pathLength to normalise (below) */
  stroke-dashoffset: 100;    /* fully hidden */
  animation: draw 7s cubic-bezier(0.32,0.72,0,1) infinite;
}
@keyframes draw {
  0%, 10%   { stroke-dashoffset: 100; }
  50%, 100% { stroke-dashoffset: 0; }   /* drawn, then holds (calm tail) */
}
```
**Normalise with `pathLength`** so you never have to measure: set `pathLength="100"` on the
`<path>`, then `stroke-dasharray:100` always means "the whole path", regardless of real geometry.
```html
<path d="M52 142 L150 142" pathLength="100"
      style="stroke:#C5482F;stroke-dasharray:100;stroke-dashoffset:100" />
```
Use for: the pen underline, QA check, reviewer check — anything that should look *written/stamped*.

### 2. Pivoted transforms — rotate/translate a part around the right point
SVG transform origins are tricky. Two reliable recipes:
- **Rotation about a point in user units** (baton swing, gear turn): use
  `transform-box: view-box` + `transform-origin: <x>px <y>px` in **viewBox coordinates**.
  ```css
  .baton { transform-box: view-box; transform-origin: 62px 152px;
           animation: swing 7s cubic-bezier(0.32,0.72,0,1) infinite; }
  @keyframes swing {
    0%,7% {transform: rotate(-6deg);} 12%{transform: rotate(6deg);}
    18%{transform: rotate(-4deg);} 24%,100%{transform: rotate(7deg);} /* settles, rests */
  }
  ```
- **Translation / scale that's origin-independent** (pen slide, frame snap, fork prongs, magnifier
  sweep, ripples): use `transform-box: fill-box` (origin = the element's own box), so
  `transform-origin: center`/`left` behaves intuitively.
  ```css
  .frame { transform-box: fill-box; animation: snap 8s cubic-bezier(0.32,0.72,0,1) infinite; }
  @keyframes snap {
    0%{transform: translateX(-128px); opacity:0;}
    20%{transform: translateX(7px); opacity:1;}    /* overshoot */
    28%,100%{transform: translateX(0);}             /* snap to register, hold */
  }
  ```
Animate **`transform`/`opacity` only** (compositor-friendly). Never animate `x`/`cx`/`d`/`width`.

## The four animation METHODS — when to use each

| Method | Best for | Pros | Cons |
|---|---|---|---|
| **CSS keyframes** (co-located) | the looping idle/action on each avatar | zero JS, GPU-friendly, trivially reduced-motion-safe, no library | no scroll/viewport trigger; awkward for complex sequencing |
| **SMIL** (`<animate>`/`<animateTransform>` in the SVG) | self-contained, portable emblems | lives inside the SVG, loops natively, no CSS needed | clunky syntax, harder to gate on reduced-motion, less ergonomic than CSS |
| **Motion `whileInView`** (already a site dep) | fire the action ONCE when the card scrolls in; stagger a row | declarative, `useReducedMotion()` built in, viewport trigger, stagger | JS cost; for *continuous* loops CSS is lighter |
| **GSAP DrawSVG-style** | precise multi-step stroke choreography, many coordinated parts | best timeline control, plugins | heavy dep; overkill for our simple loops; only if CSS can't express it |

**Recommendation for the avatars:** **CSS keyframes** for the looped idle/action (the prototype
proves this needs no library), **Motion `whileInView`** only where you want the action to *fire on
scroll-in* (org-chart nodes, teaser rows — stagger across the row) and to read
`useReducedMotion()`. SMIL and GSAP are not needed here; reach for GSAP only if a future emblem
needs choreography CSS can't express.

### Motion `whileInView` one-shot (React)
```tsx
'use client';
import {motion, useReducedMotion} from 'motion/react';

export const PenUnderline = () => {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Перо проводит черту">
      <line x1="52" y1="142" x2="150" y2="142" stroke="#1A1714" opacity={0.22} strokeWidth={5}/>
      <motion.path d="M52 142 L150 142" pathLength={1}
        stroke="#C5482F" strokeWidth={5} strokeLinecap="round" fill="none"
        initial={{pathLength: reduce ? 1 : 0}}
        whileInView={{pathLength: 1}}
        viewport={{once: true, margin: '-15%'}}
        transition={{duration: reduce ? 0 : 0.8, ease: [0.32, 0.72, 0, 1]}} />
    </svg>
  );
};
```
(Motion supports animating `pathLength` directly — it sets dasharray/offset for you with
`pathLength={1}` normalised 0→1.)

## Reduced motion — non-negotiable
Every emblem must settle to its **resolved "done" pose** when motion is off — still characterful,
just static. Two paths, use both:
```css
@media (prefers-reduced-motion: reduce) {
  .baton, .frame, .underline, .ripple { animation: none !important; }
  .underline { stroke-dashoffset: 0; }          /* drawn */
  .frame { transform: translateX(0); opacity: 1; } /* in register */
  .baton { transform: rotate(7deg); }            /* resting pose */
}
```
In React, prefer `useReducedMotion()` to force `play="static"` (see the `<AgentAvatar>` API in
`avatars-concept.md`). Never make motion the only carrier of meaning — the handle/role text always
sits beside the emblem.

## Avatars within the Remotion film
The same SVGs animate beautifully in the film — but inside Remotion you must drop CSS keyframes /
Motion / SMIL (all realtime clocks) and **drive the stroke-draw and transforms from
`useCurrentFrame()`** instead (see the **remotion** + **motion-graphics** skills):
```tsx
const frame = useCurrentFrame();
const draw = interpolate(frame, [10, 40], [100, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
<path d="..." pathLength={100} style={{strokeDasharray: 100, strokeDashoffset: draw, stroke:'#C5482F'}} />
```
So author the geometry once; swap the *driver* (CSS loop on the site, `frame` interpolation in the
film). Keep emblem geometry in a shared, framework-agnostic source where practical.

## Checklist
- [ ] One vermilion element per emblem; everything else ink line-art.
- [ ] `transform`/`opacity` only; pivots use `transform-box` + user-unit `transform-origin`.
- [ ] Stroke-draws use `pathLength` normalisation (no manual length measuring).
- [ ] Loop ≥7s with a calm hold; custom cubic-bezier, never linear.
- [ ] Reduced-motion freezes to the resolved pose; `role="img"` + Russian `aria-label`.
- [ ] In the film, animation is frame-derived (no CSS/Motion/SMIL clocks).
