import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { ramp } from "../components/util";

/**
 * Scene 8 — Ошибка: лид сам кодил. A dimmed flashback: the Maestro grabs a tool
 * and writes code himself. Человек's line slams in as big type; the frame
 * shudders (seeded, deterministic jitter).
 */
export const Mistake = () => {
  const frame = useCurrentFrame();

  const dim = interpolate(frame, [0, 24], [1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hit = ramp(frame, 40, 52); // the line lands
  // deterministic shudder around the hit
  const shudderAmt = interpolate(frame, [38, 44, 56], [0, 14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dx = (random(`x${frame}`) - 0.5) * shudderAmt;
  const dy = (random(`y${frame}`) - 0.5) * shudderAmt;

  const codeLines = ["const fix = () => {", "  // лид сам правит файл…", "  patch(ui, api)", "}"];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.slop, transform: `translate(${dx}px, ${dy}px)` }}>
      <Eyebrow index={8} label="Ошибка: лид сам кодил" dark />

      {/* the maestro, dimmed, doing the wrong thing */}
      <div style={{ position: "absolute", left: 260, top: 360, opacity: dim, filter: "grayscale(0.4)" }}>
        <Avatar slug="maestro" enter={1} accent={ramp(frame, 6, 30)} size={200} />
      </div>

      {/* the code he shouldn't be writing */}
      <div style={{ position: "absolute", left: 560, top: 360, opacity: dim }}>
        {codeLines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 30,
              color: COLORS.slopInk,
              opacity: ramp(frame, 8 + i * 6, 24 + i * 6),
              lineHeight: 1.7,
            }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* Человек's line, big, slamming in */}
      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          top: 640,
          opacity: hit,
          transform: `scale(${0.94 + 0.06 * hit})`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONTS.display,
            fontSize: 56,
            lineHeight: 1.25,
            fontWeight: 700,
            color: COLORS.paper,
            textAlign: "center",
          }}
        >
          «Я вижу, как ты сам пишешь код.{" "}
          <span style={{ color: COLORS.vermilion }}>Это ужасно.</span> Оркеструй, а не кодь.»
        </p>
        <p style={{ marginTop: 22, textAlign: "center", fontFamily: FONTS.mono, fontSize: 24, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", opacity: ramp(frame, 70, 90) }}>
          — Человек
        </p>
      </div>
    </AbsoluteFill>
  );
};
