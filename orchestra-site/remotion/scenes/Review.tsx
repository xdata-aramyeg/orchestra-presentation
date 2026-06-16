import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

/**
 * Scene 7 — Ревью. The Reviewer's magnifier sweeps the score lines. No pencil in
 * hand — it highlights a line but never edits — then stamps "чисто".
 */
export const Review = () => {
  const frame = useCurrentFrame();
  const lines = ["barrier держит до двух галочек", "idle-during-QA соблюдён", "контракт API не менялся под тестом"];

  // magnifier sweeps top → bottom over the lines
  const sweep = ramp(frame, 30, 130);
  const glassY = interpolate(sweep, [0, 1], [0, 220]);
  const activeLine = Math.min(2, Math.floor(sweep * 3));
  const stamp = ramp(frame, 135, 165);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paperAlt }}>
      <Eyebrow index={7} label="Ревью — только читать" />

      <div style={{ position: "absolute", left: 260, top: 360 }}>
        <Avatar slug="reviewer" enter={ramp(frame, 4, 30)} accent={ramp(frame, 30, 70)} size={210} />
      </div>

      {/* the lines under review */}
      <div style={{ position: "absolute", left: 640, top: 360, width: 1000 }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              height: 76,
              display: "flex",
              alignItems: "center",
              fontFamily: FONTS.mono,
              fontSize: 30,
              color: i === activeLine && sweep < 1 ? COLORS.ink : COLORS.inkMuted,
              opacity: ramp(frame, 20 + i * 10, 50 + i * 10),
              borderLeft: `3px solid ${i === activeLine && sweep < 1 ? COLORS.vermilion : "transparent"}`,
              paddingLeft: 26,
              transition: "none",
            }}
          >
            {l}
          </div>
        ))}

        {/* the magnifier glass overlay (reads, never writes) */}
        <svg
          width={120}
          height={120}
          viewBox="0 0 120 120"
          style={{ position: "absolute", left: -60, top: glassY - 22, opacity: sweep < 1 ? 1 : 0 }}
        >
          <circle cx={50} cy={50} r={38} fill="none" stroke={COLORS.ink} strokeWidth={5} />
          <path d="M77 77 L100 100" stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" />
        </svg>

        {/* the stamp */}
        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: -40,
            transform: `rotate(-8deg) scale(${0.6 + 0.4 * stamp})`,
            opacity: stamp,
            border: `4px solid ${COLORS.vermilion}`,
            borderRadius: 10,
            padding: "10px 28px",
            color: COLORS.vermilion,
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: "0.04em",
          }}
        >
          ЧИСТО
        </div>
      </div>

      <Caption from={120}>
        Ревьюер читает — и только после PASS. Править не может — поэтому называет вслух.
      </Caption>
    </AbsoluteFill>
  );
};
