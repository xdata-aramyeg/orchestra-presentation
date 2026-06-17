import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { lin, ramp, overshoot, typewriter } from "../components/util";

const LINE_1 = "Построить сайт о том, как";
const LINE_2 = "работает команда агентов.";
const FULL = LINE_1 + " " + LINE_2;

/**
 * Scene 1 — Бриф. Kinetic-type cold open: the brief lands on a fresh sheet — a
 * vermilion margin rule draws down, a mono «ЗАДАЧА 01» label snaps in, then one
 * task line writes itself in two display lines while six empty pulpits stroke in
 * faintly across the stage floor (the orchestra waiting to be filled).
 */
export const Brief = () => {
  const frame = useCurrentFrame();

  // the sheet's left margin rule draws down first (anticipates the writing)
  const rule = ramp(frame, 6, 34);
  // the «ЗАДАЧА» tab snaps in with a small overshoot
  const tab = overshoot(frame, 18, 40);
  // the line writes after the label lands
  const typed = typewriter(FULL, lin(frame, 40, 116));
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const writing = typed.length < FULL.length;

  // split the typed text back into the two display lines
  const onLine1 = typed.slice(0, Math.min(typed.length, LINE_1.length));
  const onLine2 =
    typed.length > LINE_1.length ? typed.slice(LINE_1.length + 1) : "";

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={1} label="Бриф" />

      {/* six empty pulpits stroke in along the stage floor */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 6 }, (_, i) => {
          const t = i / 5;
          const x = 360 + t * 1200;
          const y = 812 + Math.sin((t - 0.5) * Math.PI) * -54;
          const draw = ramp(frame, 56 + i * 7, 86 + i * 7);
          return (
            <g key={i} opacity={0.18 * draw} transform={`translate(0 ${(1 - draw) * 10})`}>
              <rect x={x - 66} y={y} width={132} height={9} rx={4} fill={COLORS.ink} />
              <rect
                x={x - 44}
                y={y + 9}
                width={88}
                height={64}
                rx={6}
                fill="none"
                stroke={COLORS.ink}
                strokeWidth={4}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100 - 100 * draw}
              />
            </g>
          );
        })}
      </svg>

      {/* the brief sheet, centred */}
      <div
        style={{
          position: "absolute",
          left: 360,
          right: 360,
          top: 318,
          display: "flex",
          gap: 56,
        }}
      >
        {/* vermilion margin rule */}
        <div
          style={{
            width: 5,
            borderRadius: 3,
            background: COLORS.vermilion,
            transformOrigin: "top",
            transform: `scaleY(${rule})`,
            alignSelf: "stretch",
          }}
        />

        <div style={{ flex: 1 }}>
          {/* «ЗАДАЧА 01» tab */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: 14,
              opacity: tab,
              transform: `translateX(${(1 - tab) * -28}px)`,
              marginBottom: 34,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 24,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: COLORS.vermilion,
                fontWeight: 600,
              }}
            >
              Задача
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 20,
                letterSpacing: "0.16em",
                color: COLORS.inkMuted,
              }}
            >
              01 · бриф
            </span>
          </div>

          {/* the task, writing itself across two display lines */}
          <h1
            style={{
              margin: 0,
              fontFamily: FONTS.display,
              fontSize: 78,
              lineHeight: 1.12,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: COLORS.ink,
            }}
          >
            {onLine1}
            {writing && onLine2.length === 0 ? (
              <Caret on={caretOn} />
            ) : null}
            <br />
            {onLine2}
            {writing && onLine2.length > 0 ? <Caret on={caretOn} /> : null}
          </h1>
        </div>
      </div>

      <Caption from={122} kicker="Хроника">
        Всё началось с одной строки.
      </Caption>
    </AbsoluteFill>
  );
};

const Caret = ({ on }: { on: boolean }) => (
  <span
    style={{
      display: "inline-block",
      width: 6,
      height: "0.78em",
      marginLeft: 10,
      marginBottom: "-0.06em",
      background: COLORS.vermilion,
      opacity: on ? 1 : 0,
      borderRadius: 2,
    }}
  />
);
