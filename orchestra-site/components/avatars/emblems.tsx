import { type ReactNode } from "react";

export type AvatarSlug =
  | "maestro"
  | "librettist"
  | "scenographer"
  | "machinist"
  | "diapason"
  | "reviewer"
  | "chronicler";

type Emblem = {
  /** Russian aria-label describing the action (the avatar's accessible name) */
  label: string;
  /** inner SVG geometry for a 0 0 200 200 viewBox */
  body: ReactNode;
};

/**
 * The seven agent emblems — ink line-art with a single vermilion accent each,
 * ported verbatim from knowledge/avatar-gallery.html. Animation lives in
 * avatars.css (class hooks below); this module is pure geometry.
 *
 * Every stroked element carries pathLength="1" so the entrance stroke-draw
 * (.av-in) can animate stroke-dashoffset 1 → 0 without measuring real lengths.
 */
export const EMBLEMS: Record<AvatarSlug, Emblem> = {
  // Маэстро — a conductor's baton (handle-grip + shaft) over a tidy row of
  // three beats that fire 1‑2‑3. Optically centred in the diamond frame; the
  // baton is the bold hero diagonal, the beats read as "beating time".
  maestro: {
    label: "Маэстро: дирижёрская палочка отбивает такт раз-два-три",
    body: (
      <>
        <g className="mae-baton">
          <circle className="av-line" pathLength={1} cx="74" cy="120" r="7.5" />
          <path className="av-line" pathLength={1} d="M80 114 L134 62" />
        </g>
        <circle className="av-line av-faint" pathLength={1} cx="80" cy="140" r="4.6" />
        <circle className="av-line av-faint" pathLength={1} cx="100" cy="140" r="4.6" />
        <circle className="av-line av-faint" pathLength={1} cx="120" cy="140" r="4.6" />
        <circle className="av-accfill mae-d1" cx="80" cy="140" r="4.6" />
        <circle className="av-accfill mae-d2" cx="100" cy="140" r="4.6" />
        <circle className="av-accfill mae-d3" cx="120" cy="140" r="4.6" />
      </>
    ),
  },
  // Либреттист — a nib pen drawing an underline; recomposed centred so the pen
  // and its stroke sit in the arch's optical centre.
  librettist: {
    label: "Либреттист: перо проводит подчёркивающую линию",
    body: (
      <>
        <path className="av-line av-faint" pathLength={1} d="M58 128 L142 128" />
        <path className="av-line av-acc lib-ul" pathLength={1} d="M58 128 L142 128" />
        <g className="lib-pen">
          <path className="av-line" pathLength={1} d="M112 120 L78 78" />
          <path className="av-line" pathLength={1} d="M112 120 L121 131 L106 126" />
        </g>
      </>
    ),
  },
  // Сценограф — a STAGE, not a second square: a floor line, a spotlight cone
  // from above and a single spotlit performer (the vermilion accent). The whole
  // scene drives in and registers (scn-frame) inside the rounded-square frame.
  scenographer: {
    label: "Сценограф: сцена въезжает в кадр — луч прожектора находит солиста",
    body: (
      <>
        <g className="scn-frame">
          <path className="av-line av-faint" pathLength={1} d="M100 60 L72 136" />
          <path className="av-line av-faint" pathLength={1} d="M100 60 L128 136" />
          <path className="av-line" pathLength={1} d="M56 138 L144 138" />
          <path className="av-line av-faint" pathLength={1} d="M80 138 Q100 148 120 138" />
          <circle className="av-accfill" cx="100" cy="128" r="6.5" />
        </g>
      </>
    ),
  },
  // Машинист — a gear meshed with a terminal window whose caret blinks. Both
  // recomposed smaller and balanced around centre so neither runs off the
  // octagon's edge.
  machinist: {
    label:
      "Машинист: шестерёнка проворачивается, в терминале мигает каретка",
    body: (
      <>
        <g className="mac-gear">
          <circle className="av-line" pathLength={1} cx="78" cy="80" r="22" />
          <circle className="av-line" pathLength={1} cx="78" cy="80" r="5.5" />
          <path className="av-line" pathLength={1} d="M100 80 L108 80" />
          <path className="av-line" pathLength={1} d="M93.6 95.6 L99.2 101.2" />
          <path className="av-line" pathLength={1} d="M78 102 L78 110" />
          <path className="av-line" pathLength={1} d="M62.4 95.6 L56.8 101.2" />
          <path className="av-line" pathLength={1} d="M56 80 L48 80" />
          <path className="av-line" pathLength={1} d="M62.4 64.4 L56.8 58.8" />
          <path className="av-line" pathLength={1} d="M78 58 L78 50" />
          <path className="av-line" pathLength={1} d="M93.6 64.4 L99.2 58.8" />
        </g>
        <rect className="av-line" pathLength={1} x="100" y="104" width="54" height="40" rx="6" />
        <path className="av-line av-faint" pathLength={1} d="M112 118 L142 118" />
        <path className="av-line av-faint" pathLength={1} d="M112 130 L134 130" />
        <path className="av-line av-acc mac-caret" pathLength={1} d="M142 124 L142 136" />
      </>
    ),
  },
  // Камертон — a tuning fork struck: the tines ring, waves spread, and a ✓ lands
  // ("in tune"). Recomposed centred and a touch smaller for the shield.
  diapason: {
    label:
      "Камертон: камертон звенит, расходятся волны, появляется галочка в строю",
    body: (
      <>
        <g transform="translate(100 60)">
          <circle className="kam-ripple kam-r1" cx="0" cy="0" r="28" />
          <circle className="kam-ripple kam-r2" cx="0" cy="0" r="28" />
          <circle className="kam-ripple kam-r3" cx="0" cy="0" r="28" />
        </g>
        <path className="av-line kam-pL" pathLength={1} d="M86 62 L86 116" />
        <path className="av-line kam-pR" pathLength={1} d="M114 62 L114 116" />
        <path
          className="av-line"
          pathLength={1}
          d="M86 116 Q86 134 100 134 Q114 134 114 116"
        />
        <path className="av-line" pathLength={1} d="M100 134 L100 150" />
        <path className="av-line" pathLength={1} d="M90 150 L110 150" />
        <path className="av-line av-acc kam-check" pathLength={1} d="M120 138 L128 148 L146 126" />
      </>
    ),
  },
  // Рецензент — a magnifier sweeps the lines of text and stamps a ✓. Recomposed
  // centred so the lens, the lines and the mark form one balanced reading.
  reviewer: {
    label: "Рецензент: лупа проходит по строкам, в конце ставится галочка",
    body: (
      <>
        <path className="av-line av-faint" pathLength={1} d="M58 78 L142 78" />
        <path className="av-line av-faint" pathLength={1} d="M58 98 L134 98" />
        <path className="av-line av-faint" pathLength={1} d="M58 118 L138 118" />
        <g className="rev-glass">
          <circle className="av-line" pathLength={1} cx="66" cy="72" r="18" />
          <path className="av-line" pathLength={1} d="M79 85 L94 100" />
        </g>
        <path className="av-line av-acc rev-check" pathLength={1} d="M122 130 L132 142 L152 120" />
      </>
    ),
  },
  // Хроникёр — a clapperboard that winds open and claps on the beat. Recomposed
  // up into the hexagon's optical centre.
  chronicler: {
    label: "Хроникёр: кинохлопушка щёлкает, отмечая дубль",
    body: (
      <>
        {/* slate body */}
        <rect className="av-line" pathLength={1} x="48" y="82" width="104" height="58" rx="6" />
        <path className="av-line av-faint" pathLength={1} d="M62 100 L138 100" />
        <path className="av-line av-faint" pathLength={1} d="M62 114 L128 114" />
        <path className="av-line av-faint" pathLength={1} d="M62 128 L118 128" />
        {/* hinged clapper stick; the vermilion teeth are the one live accent */}
        <g className="chr-stick">
          <rect className="av-line" pathLength={1} x="48" y="70" width="104" height="13" rx="3" />
          <path
            className="av-line av-acc"
            pathLength={1}
            d="M62 83 L70 70 M80 83 L88 70 M98 83 L106 70 M116 83 L124 70 M134 83 L142 70"
          />
        </g>
      </>
    ),
  },
};

/**
 * Per-agent frame silhouettes — a family of geometric containers (one elegant
 * shape each) in the 0 0 200 200 viewBox. Together with the per-agent hue
 * (avatars.css `--av-ink`) they make the seven avatars distinguishable at a
 * glance. Each silhouette is sized to comfortably enclose its own emblem's
 * geometry (verified against each emblem's extents), so adding the frame never
 * clips the line-art and never touches the emblem geometry / animation pivots.
 * Frames are decorative (aria-hidden on the wrapping <g> in AgentAvatar);
 * styling + entrance live in avatars.css under `.av-frame`.
 */
export const FRAMES: Record<AvatarSlug, ReactNode> = {
  // Maestro — a diamond (the conductor's focal gem). Geometry is baked straight
  // into the path (vertices inside 0..200, soft corners via the .av-frame
  // stroke-linejoin) — NO transform attribute, so the shared .av-frame
  // transform-origin + scale entrance animate from the true viewBox centre
  // instead of being displaced by a composed rotate(). Comfortably nests the
  // optically-centred baton + beat-row.
  maestro: (
    <path className="av-frame" d="M100 14 L186 100 L100 186 L14 100 Z" />
  ),
  // Librettist — an arch / manuscript page: rounded top, settled flat bottom.
  librettist: (
    <path
      className="av-frame"
      d="M6 100 A94 94 0 0 1 194 100 L194 184 Q194 192 186 192 L14 192 Q6 192 6 184 Z"
    />
  ),
  // Scenographer — a rounded square: the stage / screen frame.
  scenographer: (
    <rect className="av-frame" x="6" y="6" width="188" height="188" rx="34" />
  ),
  // Machinist — an octagon: a bolt / machined housing.
  machinist: (
    <path className="av-frame" d="M48 6 L152 6 L194 48 L194 152 L152 194 L48 194 L6 152 L6 48 Z" />
  ),
  // Камертон (Diapason) — a shield: the quality / approval mark.
  diapason: (
    <path
      className="av-frame"
      d="M16 28 Q16 16 28 16 L172 16 Q184 16 184 28 L184 96 Q184 150 100 190 Q16 150 16 96 Z"
    />
  ),
  // Reviewer — a circle: the reading lens / medallion.
  reviewer: <circle className="av-frame" cx="100" cy="100" r="94" />,
  // Chronicler — a flat-top hexagon: a film cell.
  chronicler: (
    <path className="av-frame" d="M53 12 L147 12 L194 100 L147 188 L53 188 L6 100 Z" />
  ),
};
