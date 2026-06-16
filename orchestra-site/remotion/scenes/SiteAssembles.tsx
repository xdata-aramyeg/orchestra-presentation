import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

/**
 * Scene 11 — Сайт собирает сам себя. Score rows, tracks and checks resolve into
 * the real site layout — a browser frame "types" itself into the page you're on.
 */
export const SiteAssembles = () => {
  const frame = useCurrentFrame();

  const chrome = ramp(frame, 6, 36);

  const blocks = [
    { label: "Orchestra — сайт, который собрал сам себя", kind: "hero", h: 120 },
    { label: "Как работают команды агентов", kind: "row", h: 70 },
    { label: "Структура · две волны · барьер", kind: "row", h: 70 },
    { label: "Ошибки и сбросы — честно", kind: "row", h: 70 },
    { label: "Шесть агентов · страницы ролей", kind: "grid", h: 90 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paperAlt }}>
      <Eyebrow index={11} label="Сайт собирает сам себя" />

      {/* a browser chrome that scales in */}
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 150,
          width: 1200,
          opacity: chrome,
          transform: `scale(${0.96 + 0.04 * chrome})`,
          transformOrigin: "top center",
          borderRadius: 18,
          border: `2px solid ${COLORS.lineStrong}`,
          background: COLORS.card,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(26,23,20,0.12)",
        }}
      >
        {/* top bar */}
        <div style={{ height: 48, background: COLORS.shell, display: "flex", alignItems: "center", padding: "0 20px", gap: 10 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: COLORS.line }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: COLORS.line }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: COLORS.vermilion, opacity: 0.7 }} />
          <span style={{ marginLeft: 18, fontFamily: FONTS.mono, fontSize: 18, color: COLORS.inkMuted }}>orchestra — /</span>
        </div>

        {/* the page blocks typing in */}
        <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 22 }}>
          {blocks.map((b, i) => {
            const start = 36 + i * 24;
            const a = ramp(frame, start, start + 22);
            const w = interpolate(a, [0, 1], [0, 100]);
            return (
              <div key={i} style={{ opacity: a }}>
                <div
                  style={{
                    height: b.h,
                    borderRadius: 12,
                    background: b.kind === "hero" ? COLORS.vermilionSoft : COLORS.paper,
                    border: `2px solid ${COLORS.line}`,
                    width: `${w}%`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 28px",
                    fontFamily: b.kind === "hero" ? FONTS.display : FONTS.sans,
                    fontSize: b.kind === "hero" ? 34 : 26,
                    fontWeight: b.kind === "hero" ? 700 : 500,
                    color: COLORS.ink,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Caption from={150}>
        Эту страницу спланировала, построила, протестировала и проверила команда из шести агентов.
      </Caption>
    </AbsoluteFill>
  );
};
