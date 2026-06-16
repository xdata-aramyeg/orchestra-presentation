import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { lin, ramp, typewriter } from "../components/util";

const TASK = "Задача: построить сайт о том, как работает команда агентов.";

/**
 * Scene 1 — Бриф. Kinetic-type cold open: one task line writes itself on a
 * blank sheet while six empty desks (the orchestra's pulpits) fade up around it.
 */
export const Brief = () => {
  const frame = useCurrentFrame();
  const typed = typewriter(TASK, lin(frame, 18, 96));
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const deskOpacity = ramp(frame, 40, 120) * 0.22;

  // six empty pulpits in a shallow arc, low on the stage
  const desks = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5;
    const x = 360 + t * 1200;
    const y = 760 + Math.sin((t - 0.5) * Math.PI) * -60;
    return { x, y };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={1} label="Бриф" />

      {/* empty desks */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, opacity: deskOpacity }}
      >
        {desks.map((d, i) => (
          <g key={i}>
            <rect
              x={d.x - 70}
              y={d.y}
              width={140}
              height={10}
              rx={5}
              fill={COLORS.ink}
            />
            <rect
              x={d.x - 48}
              y={d.y + 10}
              width={96}
              height={70}
              rx={6}
              fill="none"
              stroke={COLORS.ink}
              strokeWidth={4}
            />
          </g>
        ))}
      </svg>

      {/* the task line, typing itself */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 220px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: FONTS.mono,
            fontSize: 52,
            lineHeight: 1.45,
            fontWeight: 500,
            color: COLORS.ink,
            maxWidth: 1280,
            textAlign: "center",
          }}
        >
          {typed}
          <span
            style={{
              color: COLORS.vermilion,
              opacity: caretOn && typed.length < TASK.length + 1 ? 1 : 0,
            }}
          >
            ▍
          </span>
        </h1>
      </div>

      <Caption from={104} kicker="Хроника">
        Всё началось с одной строки.
      </Caption>
    </AbsoluteFill>
  );
};
