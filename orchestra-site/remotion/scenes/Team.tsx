import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { type AvatarSlug } from "../components/avatarGeometry";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

type Seat = { slug: AvatarSlug; role: string; x: number; y: number };

// Маэстро centre + the five in a shallow arc around him.
const SEATS: Seat[] = [
  { slug: "maestro", role: "Лид", x: 960, y: 360 },
  { slug: "librettist", role: "PM", x: 480, y: 470 },
  { slug: "scenographer", role: "Frontend", x: 720, y: 540 },
  { slug: "machinist", role: "Backend", x: 1200, y: 540 },
  { slug: "diapason", role: "QA", x: 1440, y: 470 },
  { slug: "reviewer", role: "Reviewer", x: 960, y: 600 },
];

/**
 * Scene 2 — Команда собирается. Six avatars take their pulpits one by one,
 * each tagged with role + an "Opus" badge.
 */
export const Team = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={2} label="Команда собирается" />

      {SEATS.map((s, i) => {
        const start = 14 + i * 26;
        const enter = ramp(frame, start, start + 34);
        const accent = ramp(frame, start + 20, start + 50);
        const size = s.slug === "maestro" ? 240 : 190;
        return (
          <div
            key={s.slug}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar slug={s.slug} enter={enter} accent={accent} size={size} phase={i * 13} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: enter,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  letterSpacing: "0.06em",
                  color: COLORS.inkSoft,
                  textTransform: "uppercase",
                }}
              >
                {s.role}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 16,
                  padding: "3px 10px",
                  borderRadius: 999,
                  border: `1.5px solid ${COLORS.vermilion}`,
                  color: COLORS.vermilion,
                  letterSpacing: "0.08em",
                }}
              >
                Opus
              </span>
            </div>
          </div>
        );
      })}

      <Caption from={150} kicker="Шесть ролей">
        Шесть агентов. Шесть ролей. Все — на Opus.
      </Caption>
    </AbsoluteFill>
  );
};
