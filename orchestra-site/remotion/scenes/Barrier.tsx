import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

/**
 * Scene 5 — Барьер держит. Both tracks run into a glowing vertical gate. The
 * Maestro raises the baton; the gate holds until two checks (page renders / API
 * answers) light up — then it drops.
 */
export const Barrier = () => {
  const frame = useCurrentFrame();

  // tracks push toward the centre and stop at the gate
  const push = ramp(frame, 8, 60);
  const checkPage = ramp(frame, 90, 120);
  const checkApi = ramp(frame, 110, 140);
  const bothLit = Math.min(checkPage, checkApi);
  // gate glows while holding, then drops after both checks
  const glow = interpolate(frame, [40, 90], [0.15, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drop = ramp(frame, 150, 185);
  const gateY = interpolate(drop, [0, 1], [0, 520]);
  const gateOpacity = interpolate(drop, [0, 1], [1, 0]);

  const leftX = interpolate(push, [0, 1], [260, 760]);
  const rightX = interpolate(push, [0, 1], [1660, 1160]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={5} label="Барьер держит" />

      {/* the conductor holds the gate */}
      <div style={{ position: "absolute", left: 960, top: 200, transform: "translateX(-50%)" }}>
        <Avatar slug="maestro" enter={ramp(frame, 4, 30)} accent={ramp(frame, 30, 70)} size={170} />
      </div>

      {/* the two approaching tracks */}
      <div style={{ position: "absolute", left: leftX, top: 560, transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 220, height: 64, borderRadius: 12, border: `2px solid ${COLORS.line}`, background: COLORS.card, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONTS.mono, fontSize: 24, color: COLORS.inkSoft }}>
          FE готов
        </div>
      </div>
      <div style={{ position: "absolute", left: rightX, top: 560, transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 220, height: 64, borderRadius: 12, border: `2px solid ${COLORS.line}`, background: COLORS.card, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONTS.mono, fontSize: 24, color: COLORS.inkSoft }}>
          BE готов
        </div>
      </div>

      {/* the gate */}
      <div
        style={{
          position: "absolute",
          left: 958,
          top: 360 + gateY,
          width: 6,
          height: 360,
          background: COLORS.vermilion,
          opacity: gateOpacity,
          boxShadow: `0 0 ${30 * glow}px ${10 * glow}px ${COLORS.vermilion}`,
          borderRadius: 4,
        }}
      />

      {/* two checks */}
      <div style={{ position: "absolute", left: 960, top: 420, transform: "translateX(-50%)", display: "flex", gap: 60 }}>
        <Check label="страница" v={checkPage} />
        <Check label="API" v={checkApi} />
      </div>

      <Caption from={150} kicker="Барьер" accent={bothLit > 0.9}>
        Барьер: фича готова. Дальше — только когда и страница, и API живы.
      </Caption>
    </AbsoluteFill>
  );
};

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
