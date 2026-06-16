import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

/**
 * Scene 9 — Сброс. Человек's second line lands; the dark "AI-slop" v1 crumbles
 * into a clean white sheet. v1 is filed to archive/v1-build.
 */
export const Reset = () => {
  const frame = useCurrentFrame();

  const lineIn = ramp(frame, 6, 26);
  // the dark slop shatters into falling shards, then paper takes over
  const shatter = ramp(frame, 70, 120);
  const paper = ramp(frame, 95, 135);
  const archive = ramp(frame, 130, 160);

  // a grid of shards that fall away
  const cols = 12;
  const rows = 7;
  const shards = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const rowI = Math.floor(i / cols);
    const seed = random(`s${i}`);
    const local = Math.max(0, Math.min(1, (shatter - seed * 0.4) * 1.6));
    return {
      x: (col / cols) * 1920,
      y: (rowI / rows) * 1080,
      w: 1920 / cols + 1,
      h: 1080 / rows + 1,
      ty: local * (300 + seed * 500),
      rot: (seed - 0.5) * 40 * local,
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
              transform: `translateY(${s.ty}px) rotate(${s.rot}deg)`,
            }}
          />
        ))}
      </AbsoluteFill>

      <Eyebrow index={9} label="Сброс" dark={paper < 0.5} />

      {/* Человек's verdict */}
      <div style={{ position: "absolute", left: 160, right: 160, top: 300, opacity: lineIn * (1 - paper * 0.0) }}>
        <p
          style={{
            margin: 0,
            fontFamily: FONTS.display,
            fontSize: 52,
            lineHeight: 1.28,
            fontWeight: 700,
            color: paper > 0.5 ? COLORS.ink : COLORS.paper,
            textAlign: "center",
          }}
        >
          «Это просто описывает несуществующий продукт.{" "}
          <span style={{ color: COLORS.vermilion }}>Сделай лучше.</span>»
        </p>
      </div>

      {/* archive tag */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 720,
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
