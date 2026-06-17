"use client";

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";
import { useGsapTimeline } from "../components/useGsapTimeline";

const UI_BLOCKS = ["hero", "как работают команды", "структура", "агенты"];
const API_ROWS = ["POST /waitlist", "zod schema", "SQLite · dedupe", "11/11 PASS"];

/**
 * Scene 4 — Две волны параллельно. The stage splits into two tracks: left the
 * Scenographer stacks UI blocks, right the Machinist stacks API/DB rows. They
 * advance in *lockstep* — each pair lands together and a faint tie-line snaps
 * across the divider (the shared, frozen contract) — but never cross it.
 *
 * The lockstep stagger + overshoot landings + tie-line snaps are exactly the
 * "choreography is the hard part" case the GSAP seek pattern is for.
 */
export const TwoWaves = () => {
  const frame = useCurrentFrame();

  const root = useGsapTimeline((tl) => {
    // wind-up: the divider draws down with a hair of overshoot
    tl.fromTo(
      ".divider",
      { scaleY: 0 },
      { scaleY: 1, duration: 0.7, ease: "power3.out" },
      0.2,
    );

    // four pairs advance together, row by row, snapping into register
    UI_BLOCKS.forEach((_, i) => {
      const at = 1.3 + i * 0.5;
      tl.fromTo(
        `.left-${i}`,
        { xPercent: -55, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.66, ease: "back.out(1.5)" },
        at,
      )
        .fromTo(
          `.right-${i}`,
          { xPercent: 55, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 0.66, ease: "back.out(1.5)" },
          at, // identical time → lockstep
        )
        // the contract tie-line snaps across just after the pair lands
        .fromTo(
          `.tie-${i}`,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.32, ease: "power2.out" },
          at + 0.34,
        )
        .to(`.tie-${i}`, { opacity: 0.32, duration: 0.5 }, at + 0.7);
    });
  });

  return (
    <AbsoluteFill ref={root} style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={4} label="Две волны параллельно" />

      {/* central divider (GSAP-controlled) */}
      <div
        className="divider"
        style={{
          position: "absolute",
          left: 959,
          top: 150,
          bottom: 230,
          width: 2,
          background: COLORS.lineStrong,
          transformOrigin: "top",
          transform: "scaleY(0)", // initial hide → no pre-seek flash in the live Player
        }}
      />

      {/* LEFT — Frontend */}
      <div style={{ position: "absolute", left: 150, top: 150 }}>
        <Avatar
          slug="scenographer"
          enter={ramp(frame, 6, 34)}
          accent={ramp(frame, 24, 56)}
          size={150}
          caption="Frontend"
          phase={0}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 372,
          width: 660,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {UI_BLOCKS.map((b, i) => (
          <div
            key={b}
            className={`left-${i}`}
            style={{ opacity: 0, ...rowStyle(FONTS.sans, 28) }}
          >
            <span style={dotStyle} />
            {b}
          </div>
        ))}
      </div>

      {/* RIGHT — Backend */}
      <div style={{ position: "absolute", left: 1620, top: 150 }}>
        <Avatar
          slug="machinist"
          enter={ramp(frame, 6, 34)}
          accent={ramp(frame, 24, 56)}
          size={150}
          caption="Backend"
          phase={18}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 372,
          width: 660,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {API_ROWS.map((b, i) => (
          <div
            key={b}
            className={`right-${i}`}
            style={{ opacity: 0, justifyContent: "flex-end", ...rowStyle(FONTS.mono, 26) }}
          >
            {b}
            <span style={{ ...dotStyle, marginRight: 0, marginLeft: 18 }} />
          </div>
        ))}
      </div>

      {/* the four contract tie-lines across the divider */}
      {UI_BLOCKS.map((_, i) => (
        <div
          key={i}
          className={`tie-${i}`}
          style={{
            position: "absolute",
            left: 810,
            top: 372 + i * 100 + 39,
            width: 300,
            height: 2,
            background: COLORS.vermilion,
            opacity: 0,
            transformOrigin: "center",
          }}
        />
      ))}

      <Caption from={150}>
        Волна 2: фронтенд и бэкенд строят одновременно. Разные файлы, общий контракт.
      </Caption>
    </AbsoluteFill>
  );
};

const dotStyle = {
  width: 14,
  height: 14,
  borderRadius: 4,
  background: COLORS.vermilion,
  marginRight: 18,
  opacity: 0.85,
} as const;

const rowStyle = (font: string, fontSize: number) =>
  ({
    height: 78,
    borderRadius: 12,
    border: `2px solid ${COLORS.line}`,
    background: COLORS.card,
    display: "flex",
    alignItems: "center",
    padding: "0 26px",
    fontFamily: font,
    fontSize,
    color: COLORS.inkSoft,
  }) as const;
