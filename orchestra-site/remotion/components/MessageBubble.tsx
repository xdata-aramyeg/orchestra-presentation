import { type ReactNode } from "react";
import { COLORS, FONTS } from "../theme";

type MessageBubbleProps = {
  /** Sender handle shown above the bubble (e.g. «Человек»). */
  author: string;
  /** Small mono meta to the right of the author (role / timestamp). */
  meta?: string;
  /** Bubble body — pass spans to colour key clauses vermilion. */
  children: ReactNode;
  /** Entrance progress 0→1 (drives slide + opacity from the scene's frame). */
  enter: number;
  /** Dark scene variant (the failed-v1 flashback) vs paper. */
  dark?: boolean;
  /** px width of the bubble. */
  width?: number;
};

/**
 * A diegetic chat bubble — the film recreating the *real* message thread
 * (knowledge/thread-and-timeline-ru.md) frame-by-frame, designed and on-palette
 * rather than paraphrased as floating type. The avatar dot + handle + tail read
 * as captured footage of the conversation that actually steered the build.
 */
export const MessageBubble = ({
  author,
  meta,
  children,
  enter,
  dark = false,
  width = 760,
}: MessageBubbleProps) => {
  const e = Math.max(0, Math.min(1, enter));
  const surface = dark ? "rgba(255,255,255,0.06)" : COLORS.card;
  const border = dark ? "rgba(255,255,255,0.16)" : COLORS.line;
  const handle = dark ? "rgba(255,255,255,0.78)" : COLORS.inkSoft;
  const metaCol = dark ? "rgba(255,255,255,0.42)" : COLORS.inkMuted;
  const body = dark ? COLORS.paper : COLORS.ink;

  return (
    <div
      style={{
        width,
        opacity: e,
        transform: `translateY(${(1 - e) * 26}px)`,
      }}
    >
      {/* sender row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          marginLeft: 6,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            background: COLORS.vermilion,
          }}
        />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 21,
            letterSpacing: "0.04em",
            color: handle,
          }}
        >
          {author}
        </span>
        {meta ? (
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 17,
              letterSpacing: "0.08em",
              color: metaCol,
            }}
          >
            {meta}
          </span>
        ) : null}
      </div>

      {/* bubble with a small tail on the top-left */}
      <div
        style={{
          position: "relative",
          background: surface,
          border: `2px solid ${border}`,
          borderRadius: 22,
          borderTopLeftRadius: 6,
          padding: "26px 32px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONTS.sans,
            fontSize: 38,
            lineHeight: 1.32,
            fontWeight: 500,
            color: body,
          }}
        >
          {children}
        </p>
      </div>
    </div>
  );
};
