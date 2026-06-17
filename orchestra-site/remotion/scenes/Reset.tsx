import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { MessageBubble } from "../components/MessageBubble";
import { ramp } from "../components/util";

const COLS = 12;
const ROWS = 7;

/**
 * Scene 9 — Сброс. Человек's second correction lands as a diegetic bubble, then
 * the dark "AI-slop" v1 shatters under gravity into a clean white sheet and v1 is
 * filed to archive/v1-build. The shatter accelerates (squared = gravity) and each
 * shard drifts + tumbles on a seeded, deterministic path.
 */
export const Reset = () => {
  const frame = useCurrentFrame();

  const msgIn = ramp(frame, 6, 26);
  const msgOut = interpolate(frame, [66, 92], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shatter = ramp(frame, 70, 124);
  const paper = ramp(frame, 96, 136);
  const archive = ramp(frame, 132, 160);

  const shards = Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS;
    const rowI = Math.floor(i / COLS);
    const seed = random(`s${i}`);
    const drift = random(`d${i}`) - 0.5;
    // staggered release (top rows go first), then gravity-accelerated fall
    const local = Math.max(0, Math.min(1, (shatter - seed * 0.35) * 1.7));
    const g = local * local; // gravity
    return {
      x: (col / COLS) * 1920,
      y: (rowI / ROWS) * 1080,
      w: 1920 / COLS + 1,
      h: 1080 / ROWS + 1,
      ty: g * (340 + seed * 620),
      tx: drift * 120 * local,
      rot: drift * 54 * local,
      o: 1 - local,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      {/* paper layer underneath, fading up */}
      <AbsoluteFill style={{ backgroundColor: COLORS.paper, opacity: paper }} />

      {/* the dark slop shards on top */}
      <AbsoluteFill>
        {shards.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.w,
              height: s.h,
              background: COLORS.slop,
              opacity: s.o,
              transform: `translate(${s.tx}px, ${s.ty}px) rotate(${s.rot}deg)`,
            }}
          />
        ))}
      </AbsoluteFill>

      <Eyebrow index={9} label="Сброс" dark={paper < 0.5} />

      {/* Человек's verdict as diegetic thread footage */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 300,
          transform: "translateX(-50%)",
          opacity: msgOut,
        }}
      >
        <MessageBubble author="Человек" meta="пивот" enter={msgIn} dark width={1180}>
          Это просто описывает несуществующий продукт.{" "}
          <span style={{ color: COLORS.vermilion, fontWeight: 700 }}>
            Сделай лучше.
          </span>
        </MessageBubble>
      </div>

      {/* archive tag */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 700,
          transform: "translateX(-50%)",
          opacity: archive,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: FONTS.mono,
          fontSize: 26,
          color: COLORS.inkMuted,
          padding: "10px 24px",
          border: `2px dashed ${COLORS.lineStrong}`,
          borderRadius: 10,
        }}
      >
        <span style={{ color: COLORS.vermilion }}>archive/</span>v1-build
      </div>

      <Caption from={140}>Сброс — это решение, а не поражение.</Caption>
    </AbsoluteFill>
  );
};
