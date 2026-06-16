import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

/**
 * Scene 4 — Две волны параллельно. The stage splits into two tracks: left the
 * Scenographer stacks UI blocks, right the Machinist stacks API/DB rows. They
 * advance in lockstep but never cross the divider — different files.
 */
export const TwoWaves = () => {
  const frame = useCurrentFrame();
  const divider = ramp(frame, 10, 50);

  const uiBlocks = ["hero", "как работают команды", "структура", "агенты"];
  const apiRows = ["POST /waitlist", "zod schema", "SQLite · dedupe", "11/11 PASS"];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={4} label="Две волны параллельно" />

      {/* central divider */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 140,
          bottom: 220,
          width: 2,
          background: COLORS.lineStrong,
          transform: `scaleY(${divider})`,
          transformOrigin: "top",
        }}
      />

      {/* LEFT — Frontend */}
      <div style={{ position: "absolute", left: 150, top: 150 }}>
        <Avatar slug="scenographer" enter={ramp(frame, 6, 34)} accent={ramp(frame, 24, 56)} size={150} caption="Frontend" />
      </div>
      <div style={{ position: "absolute", left: 150, top: 380, width: 660, display: "flex", flexDirection: "column", gap: 22 }}>
        {uiBlocks.map((b, i) => {
          const start = 50 + i * 30;
          const a = ramp(frame, start, start + 26);
          return (
            <div
              key={b}
              style={{
                height: 78,
                borderRadius: 12,
                border: `2px solid ${COLORS.line}`,
                background: COLORS.card,
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                opacity: a,
                transform: `translateX(${(1 - a) * -40}px)`,
                fontFamily: FONTS.sans,
                fontSize: 28,
                color: COLORS.inkSoft,
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: 4, background: COLORS.vermilion, marginRight: 18, opacity: 0.8 }} />
              {b}
            </div>
          );
        })}
      </div>

      {/* RIGHT — Backend */}
      <div style={{ position: "absolute", left: 1620, top: 150 }}>
        <Avatar slug="machinist" enter={ramp(frame, 6, 34)} accent={ramp(frame, 24, 56)} size={150} caption="Backend" />
      </div>
      <div style={{ position: "absolute", left: 1110, top: 380, width: 660, display: "flex", flexDirection: "column", gap: 22 }}>
        {apiRows.map((b, i) => {
          const start = 50 + i * 30;
          const a = ramp(frame, start, start + 26);
          return (
            <div
              key={b}
              style={{
                height: 78,
                borderRadius: 12,
                border: `2px solid ${COLORS.line}`,
                background: COLORS.card,
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                opacity: a,
                transform: `translateX(${(1 - a) * 40}px)`,
                fontFamily: FONTS.mono,
                fontSize: 26,
                color: COLORS.inkSoft,
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: 4, background: COLORS.vermilion, marginRight: 18, opacity: 0.8 }} />
              {b}
            </div>
          );
        })}
      </div>

      <Caption from={150}>
        Волна 2: фронтенд и бэкенд строят одновременно. Разные файлы, общий контракт.
      </Caption>
    </AbsoluteFill>
  );
};
