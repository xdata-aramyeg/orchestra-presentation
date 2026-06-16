import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

/**
 * Scene 6 — Гейт QA. Камертон steps forward and strikes; ripples spread (a real
 * browser test). The devs freeze, grey out, tagged "idle". A verdict resolves:
 * PASS 9/10 → 10/10 after the server restart.
 */
export const QaGate = () => {
  const frame = useCurrentFrame();

  // three expanding ripples from the tuning fork strike
  const ripple = (phase: number) => {
    const local = (frame - 40 - phase * 22) / 70;
    if (local < 0) return { r: 0, o: 0 };
    const t = Math.min(1, local);
    return { r: 40 + t * 360, o: (1 - t) * 0.5 };
  };

  const verdict9 = ramp(frame, 120, 150);
  const restart = ramp(frame, 175, 200);
  const verdict10 = ramp(frame, 205, 235);
  const idle = ramp(frame, 60, 95); // devs fade to idle

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={6} label="Гейт QA" />

      {/* QA centre, striking */}
      <div style={{ position: "absolute", left: 960, top: 300, transform: "translate(-50%,-50%)" }}>
        <svg width={520} height={520} viewBox="0 0 520 520" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
          {[0, 1, 2].map((p) => {
            const { r, o } = ripple(p);
            return <circle key={p} cx={260} cy={210} r={r} fill="none" stroke={COLORS.vermilion} strokeWidth={3} opacity={o} />;
          })}
        </svg>
        <Avatar slug="diapason" enter={ramp(frame, 4, 30)} accent={ramp(frame, 40, 80)} size={220} />
      </div>

      {/* the two devs, idling */}
      <div style={{ position: "absolute", left: 280, top: 520 }}>
        <Avatar slug="scenographer" enter={1} accent={1} idle={idle > 0.5} size={130} caption="idle" />
      </div>
      <div style={{ position: "absolute", left: 1510, top: 520 }}>
        <Avatar slug="machinist" enter={1} accent={1} idle={idle > 0.5} size={130} caption="idle" />
      </div>

      {/* verdict chip */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 600,
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: verdict9,
        }}
      >
        <span style={{ fontFamily: FONTS.mono, fontSize: 30, letterSpacing: "0.1em", color: COLORS.vermilion }}>PASS</span>
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: 44,
            color: COLORS.ink,
            fontWeight: 700,
          }}
        >
          {verdict10 > 0.5 ? "10/10" : "9/10"}
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.inkMuted, opacity: restart }}>
          AC10 ✓ после рестарта
        </span>
      </div>

      <Caption from={150} kicker="idle-during-QA">
        Пока QA тестирует — разработчики простаивают. Под тестом ничего не меняется.
      </Caption>
    </AbsoluteFill>
  );
};
