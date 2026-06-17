import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { MessageBubble } from "../components/MessageBubble";
import { ramp } from "../components/util";

const CODE_LINES = [
  "const fix = () => {",
  "  // лид сам правит файл…",
  "  patch(ui, api)",
  "}",
];

/**
 * Scene 8 — Ошибка: лид сам кодил. A dimmed flashback: the Maestro grabs a tool
 * and writes code himself (the dark "AI-slop" palette). Then the real correction
 * arrives as a diegetic message bubble from Человек — recreated from the actual
 * thread — and the frame shudders as it lands.
 */
export const Mistake = () => {
  const frame = useCurrentFrame();

  const dim = interpolate(frame, [0, 24], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const msg = ramp(frame, 44, 64); // the message slides in
  // deterministic shudder as the message lands
  const shudderAmt = interpolate(frame, [42, 50, 64], [0, 13, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dx = (random(`x${frame}`) - 0.5) * shudderAmt;
  const dy = (random(`y${frame}`) - 0.5) * shudderAmt;

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.slop, transform: `translate(${dx}px, ${dy}px)` }}
    >
      <Eyebrow index={8} label="Ошибка: лид сам кодил" dark />

      {/* the maestro, dimmed, doing the wrong thing */}
      <div
        style={{
          position: "absolute",
          left: 230,
          top: 250,
          opacity: dim,
          filter: "grayscale(0.4)",
        }}
      >
        <Avatar slug="maestro" enter={1} accent={ramp(frame, 6, 30)} size={180} still />
      </div>

      {/* the code he shouldn't be writing */}
      <div style={{ position: "absolute", left: 520, top: 268, opacity: dim }}>
        {CODE_LINES.map((l, i) => (
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

      {/* the real correction, as diegetic thread footage */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 560,
          transform: "translateX(-50%)",
        }}
      >
        <MessageBubble
          author="Человек"
          meta="лид-фидбэк"
          enter={msg}
          dark
          width={1180}
        >
          Я вижу, как ты сам пишешь код.{" "}
          <span style={{ color: COLORS.vermilion, fontWeight: 700 }}>
            Это ужасно.
          </span>{" "}
          Оркестрируй, а не кодь.
        </MessageBubble>
      </div>
    </AbsoluteFill>
  );
};
