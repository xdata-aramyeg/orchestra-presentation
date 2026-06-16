import { type ReactNode } from "react";

export type AvatarSlug =
  | "maestro"
  | "librettist"
  | "scenographer"
  | "machinist"
  | "diapason"
  | "reviewer";

type Emblem = {
  /** Russian aria-label describing the action (the avatar's accessible name) */
  label: string;
  /** inner SVG geometry for a 0 0 200 200 viewBox */
  body: ReactNode;
};

/**
 * The six agent emblems — ink line-art with a single vermilion accent each,
 * ported verbatim from knowledge/avatar-gallery.html. Animation lives in
 * avatars.css (class hooks below); this module is pure geometry.
 */
export const EMBLEMS: Record<AvatarSlug, Emblem> = {
  maestro: {
    label: "Маэстро: дирижёрская палочка отбивает такт раз-два-три",
    body: (
      <>
        <g className="mae-baton">
          <path className="av-line" d="M62 152 L132 74" />
        </g>
        <circle className="av-line av-faint" cx="80" cy="170" r="4" />
        <circle className="av-line av-faint" cx="100" cy="170" r="4" />
        <circle className="av-line av-faint" cx="120" cy="170" r="4" />
        <circle className="av-accfill mae-d1" cx="80" cy="170" r="4" />
        <circle className="av-accfill mae-d2" cx="100" cy="170" r="4" />
        <circle className="av-accfill mae-d3" cx="120" cy="170" r="4" />
      </>
    ),
  },
  librettist: {
    label: "Либреттист: перо проводит подчёркивающую линию",
    body: (
      <>
        <path className="av-line av-faint" d="M52 142 L150 142" />
        <path className="av-line av-acc lib-ul" d="M52 142 L150 142" />
        <g className="lib-pen">
          <path className="av-line" d="M58 132 L90 92" />
          <path className="av-line" d="M58 132 L51 143 L62 128" />
        </g>
      </>
    ),
  },
  scenographer: {
    label: "Сценограф: рамка сцены въезжает и встаёт в регистр",
    body: (
      <>
        <path className="av-line av-faint" d="M54 66 L54 54 L66 54" />
        <path className="av-line av-faint" d="M146 54 L158 54 L158 66" />
        <path className="av-line av-faint" d="M158 146 L158 158 L146 158" />
        <path className="av-line av-faint" d="M66 158 L54 158 L54 146" />
        <rect
          className="av-line av-acc scn-frame"
          x="62"
          y="62"
          width="88"
          height="88"
          rx="6"
        />
      </>
    ),
  },
  machinist: {
    label:
      "Машинист: шестерёнка проворачивается, в терминале мигает каретка",
    body: (
      <>
        <g className="mac-gear">
          <circle className="av-line" cx="78" cy="76" r="30" />
          <circle className="av-line" cx="78" cy="76" r="6" />
          <path className="av-line" d="M108 76 L116 76" />
          <path className="av-line" d="M99.2 97.2 L104.9 102.9" />
          <path className="av-line" d="M78 106 L78 114" />
          <path className="av-line" d="M56.8 97.2 L51.1 102.9" />
          <path className="av-line" d="M48 76 L40 76" />
          <path className="av-line" d="M56.8 54.8 L51.1 49.1" />
          <path className="av-line" d="M78 46 L78 38" />
          <path className="av-line" d="M99.2 54.8 L104.9 49.1" />
        </g>
        <rect className="av-line" x="116" y="120" width="64" height="44" rx="6" />
        <path className="av-line av-faint" d="M126 134 L150 134" />
        <path className="av-line av-faint" d="M126 146 L142 146" />
        <path className="av-line av-acc mac-caret" d="M150 140 L150 152" />
      </>
    ),
  },
  diapason: {
    label:
      "Камертон: камертон звенит, расходятся волны, появляется галочка в строю",
    body: (
      <>
        <g transform="translate(100 56)">
          <circle className="kam-ripple kam-r1" cx="0" cy="0" r="30" />
          <circle className="kam-ripple kam-r2" cx="0" cy="0" r="30" />
          <circle className="kam-ripple kam-r3" cx="0" cy="0" r="30" />
        </g>
        <path className="av-line kam-pL" d="M78 50 L78 118" />
        <path className="av-line kam-pR" d="M122 50 L122 118" />
        <path className="av-line" d="M78 118 Q78 140 100 140 Q122 140 122 118" />
        <path className="av-line" d="M100 140 L100 168" />
        <path className="av-line" d="M88 168 L112 168" />
        <path className="av-line av-acc kam-check" d="M150 64 L158 74 L176 50" />
      </>
    ),
  },
  reviewer: {
    label: "Рецензент: лупа проходит по строкам, в конце ставится галочка",
    body: (
      <>
        <path className="av-line av-faint" d="M52 70 L140 70" />
        <path className="av-line av-faint" d="M52 96 L132 96" />
        <path className="av-line av-faint" d="M52 122 L138 122" />
        <g className="rev-glass">
          <circle className="av-line" cx="64" cy="62" r="20" />
          <path className="av-line" d="M78 76 L92 90" />
        </g>
        <path className="av-line av-acc rev-check" d="M138 138 L148 150 L168 124" />
      </>
    ),
  },
};
