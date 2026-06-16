import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { type AvatarSlug } from "../components/avatarGeometry";
import { Eyebrow } from "../components/Eyebrow";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

type Card = { slug: AvatarSlug; rule: string };

const CARDS: Card[] = [
  { slug: "maestro", rule: "Лид не кодит" },
  { slug: "librettist", rule: "PM пишет план" },
  { slug: "scenographer", rule: "FE — только UI" },
  { slug: "machinist", rule: "BE — только API" },
  { slug: "diapason", rule: "QA только тестирует" },
  { slug: "reviewer", rule: "Reviewer только читает" },
];

/**
 * Scene 10 — Переопределение. On the clean sheet the six roles re-light, each
 * now carrying the rule it earned. The light editorial palette settles in.
 */
export const Redefine = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Eyebrow index={10} label="Переопределение команды" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 30,
          padding: "200px 200px 280px",
        }}
      >
        {CARDS.map((c, i) => {
          const start = 12 + i * 18;
          const enter = ramp(frame, start, start + 30);
          const accent = ramp(frame, start + 16, start + 46);
          return (
            <div
              key={c.slug}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                borderRadius: 18,
                border: `2px solid ${COLORS.line}`,
                background: COLORS.card,
                opacity: enter,
                transform: `translateY(${(1 - enter) * 30}px)`,
              }}
            >
              <Avatar slug={c.slug} enter={enter} accent={accent} size={130} />
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 24,
                  color: COLORS.vermilion,
                  letterSpacing: "0.04em",
                  textAlign: "center",
                }}
              >
                {c.rule}
              </span>
            </div>
          );
        })}
      </div>

      <Caption from={150}>
        Переопределили команду: 6 ролей, правила качества, светлый дизайн.
      </Caption>
    </AbsoluteFill>
  );
};
