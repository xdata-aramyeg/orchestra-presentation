import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp, lin, typewriter } from "../components/util";

const ROWS = [
  { label: "ЭПИК", text: "Самореферентный сайт о работе команды" },
  { label: "ЗАДАЧИ", text: "Лендинг · агенты · хроника · фильм" },
  { label: "КОНТРАКТ", text: "API заморожен · общий для FE и BE" },
];

/**
 * Scene 3 — Партитура. Либреттист writes; the score rows (эпик → задачи →
 * контракт) type in; lines reach toward Frontend & Backend.
 */
export const Score = () => {
  const frame = useCurrentFrame();
  const penAccent = ramp(frame, 10, 46);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paperAlt }}>
      <Eyebrow index={3} label="Партитура" />

      {/* the librettist, writing, left */}
      <div style={{ position: "absolute", left: 300, top: 360 }}>
        <Avatar slug="librettist" enter={ramp(frame, 4, 30)} accent={penAccent} size={220} />
      </div>

      {/* the score panel */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 300,
          width: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {ROWS.map((r, i) => {
          const start = 40 + i * 36;
          const appear = ramp(frame, start, start + 24);
          const typed = typewriter(r.text, lin(frame, start + 6, start + 44));
          return (
            <div
              key={r.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: appear,
                transform: `translateX(${(1 - appear) * 30}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  color: COLORS.vermilion,
                  width: 150,
                  letterSpacing: "0.1em",
                }}
              >
                {r.label}
              </span>
              <span
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 34,
                  color: COLORS.ink,
                  fontWeight: 500,
                }}
              >
                {typed}
              </span>
            </div>
          );
        })}

        {/* contract lines reaching to FE & BE */}
        <svg width={1000} height={120} style={{ marginTop: 10 }}>
          <line
            x1={150}
            y1={20}
            x2={150 + 760 * ramp(frame, 130, 170)}
            y2={20}
            stroke={COLORS.lineStrong}
            strokeWidth={3}
          />
          <line
            x1={150}
            y1={70}
            x2={150 + 760 * ramp(frame, 140, 178)}
            y2={70}
            stroke={COLORS.lineStrong}
            strokeWidth={3}
          />
          <text
            x={920}
            y={26}
            fontFamily="var(--font-jetbrains)"
            fontSize={20}
            fill={COLORS.inkMuted}
            opacity={ramp(frame, 165, 178)}
          >
            FE
          </text>
          <text
            x={920}
            y={76}
            fontFamily="var(--font-jetbrains)"
            fontSize={20}
            fill={COLORS.inkMuted}
            opacity={ramp(frame, 172, 180)}
          >
            BE
          </text>
        </svg>
      </div>

      <Caption from={120} kicker="Сначала — план">
        Сначала — план: эпик, задачи, контракт.
      </Caption>
    </AbsoluteFill>
  );
};
