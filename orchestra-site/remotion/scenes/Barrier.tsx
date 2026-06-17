"use client";

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";
import { useGsapTimeline } from "../components/useGsapTimeline";

/**
 * Scene 5 — Барьер держит. Both tracks push into a glowing vertical gate and
 * *compress* against it (wind-up). The gate throbs under pressure while it holds;
 * two checks (страница / API) light up; only then does the gate release — drops
 * away — and the tracks surge through with an overshoot settle.
 *
 * The pressure-hold-release is multi-element timeline choreography → GSAP seek.
 */
export const Barrier = () => {
  const frame = useCurrentFrame();

  // checks are frame-driven SVG stroke-draws (timed to the gate's hold)
  const checkPage = ramp(frame, 92, 124);
  const checkApi = ramp(frame, 116, 148);
  const bothLit = Math.min(checkPage, checkApi);

  const root = useGsapTimeline((tl) => {
    // tracks push in and compress against the gate (back ease = slight squeeze)
    tl.fromTo(
      ".track-l",
      { x: -260, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.95, ease: "back.out(2)" },
      0.25,
    )
      .fromTo(
        ".track-r",
        { x: 260, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.95, ease: "back.out(2)" },
        0.25,
      )
      // the gate throbs while it holds the pressure (a few calm cycles)
      .fromTo(
        ".gate",
        { scaleY: 0.7, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
        0.1,
      )
      .to(
        ".gate",
        {
          scaleX: 1.9,
          duration: 0.7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 3, // even # of legs → returns to scaleX:1 before release
        },
        1.4,
      )
      // RELEASE: gate drops away, tracks surge through with an overshoot settle
      .to(".gate", { y: 540, opacity: 0, duration: 0.7, ease: "power3.in" }, 5.0)
      .to(".track-l", { x: 150, duration: 0.8, ease: "back.out(1.4)" }, 5.05)
      .to(".track-r", { x: -150, duration: 0.8, ease: "back.out(1.4)" }, 5.05);
  });

  return (
    <AbsoluteFill ref={root} style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={5} label="Барьер держит" />

      {/* the conductor holds the gate */}
      <div style={{ position: "absolute", left: 960, top: 200, transform: "translateX(-50%)" }}>
        <Avatar slug="maestro" enter={ramp(frame, 4, 30)} accent={ramp(frame, 30, 70)} size={170} />
      </div>

      {/* the two approaching tracks (GSAP owns transform → no CSS centering) */}
      <div className="track-l" style={{ position: "absolute", left: 420, top: 528, opacity: 0 }}>
        <TrackTag>FE готов</TrackTag>
      </div>
      <div className="track-r" style={{ position: "absolute", left: 1280, top: 528, opacity: 0 }}>
        <TrackTag>BE готов</TrackTag>
      </div>

      {/* the gate (GSAP-controlled transform/opacity) */}
      <div
        className="gate"
        style={{
          position: "absolute",
          left: 956,
          top: 360,
          width: 6,
          height: 360,
          background: COLORS.vermilion,
          boxShadow: `0 0 26px 8px ${COLORS.vermilion}`,
          borderRadius: 4,
          transformOrigin: "center top",
          opacity: 0,
        }}
      />

      {/* two checks (frame-driven) */}
      <div style={{ position: "absolute", left: 960, top: 408, transform: "translateX(-50%)", display: "flex", gap: 60 }}>
        <Check label="страница" v={checkPage} />
        <Check label="API" v={checkApi} />
      </div>

      <Caption from={155} kicker="Барьер" accent={bothLit > 0.9}>
        Барьер: фича готова. Дальше — только когда и страница, и API живы.
      </Caption>
    </AbsoluteFill>
  );
};

const TrackTag = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: 220,
      height: 64,
      borderRadius: 12,
      border: `2px solid ${COLORS.line}`,
      background: COLORS.card,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONTS.mono,
      fontSize: 24,
      color: COLORS.inkSoft,
    }}
  >
    {children}
  </div>
);

const Check = ({ label, v }: { label: string; v: number }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 + 0.6 * v }}>
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle cx={28} cy={28} r={24} fill="none" stroke={COLORS.line} strokeWidth={4} />
      <path
        d="M16 29 L25 39 L41 19"
        fill="none"
        stroke={COLORS.vermilion}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 - 100 * v}
      />
    </svg>
    <span style={{ fontFamily: FONTS.mono, fontSize: 20, color: COLORS.inkMuted }}>{label}</span>
  </div>
);
