/**
 * Film design tokens — mirror the site's design language so the film matches
 * the page it lives on. Sourced from app/globals.css (the single source of
 * truth for the palette) and app/layout.tsx (the next/font CSS variables).
 *
 * The Player renders inside the live page DOM, so the `--font-*` CSS variables
 * defined on :root are available here — we reference them by var() rather than
 * hardcoding hashed family names.
 */
export const FPS = 30;
export const DURATION_IN_FRAMES = 2340; // 78s @ 30fps (+ the 3D structure beat)
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLORS = {
  paper: "#FBFAF7",
  paperAlt: "#F3F0E9",
  card: "#FFFEFB",
  shell: "#F1EDE4",
  ink: "#1A1714",
  inkSoft: "#3B3A36",
  inkMuted: "#6F6A61",
  vermilion: "#C5482F",
  vermilionSoft: "#E9D8D0",
  line: "rgba(26, 23, 20, 0.12)",
  lineStrong: "rgba(26, 23, 20, 0.22)",
  /** The deliberate "AI-slop" dark used ONLY to dramatise the failed v1. */
  slop: "#0E0B14",
  slopInk: "#5B4E8C",
} as const;

export const FONTS = {
  display: "var(--font-unbounded), ui-sans-serif, system-ui, sans-serif",
  sans: "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--font-jetbrains), ui-monospace, monospace",
} as const;

/** The site's editorial easing, as a cubic-bezier array for interpolate(). */
export const EASE = [0.32, 0.72, 0, 1] as const;

/** Ink line-art stroke shared by every avatar/diegetic element. */
export const STROKE = {
  width: 5,
  linecap: "round" as const,
  linejoin: "round" as const,
};

/**
 * Scene timing table — the single source of truth for the Series layout.
 * Frames are absolute (for reference against the script); `dur` is what the
 * <Series.Sequence> consumes. Sum of dur === DURATION_IN_FRAMES.
 */
export const SCENES = [
  { id: "brief", label: "Бриф", dur: 150 },
  { id: "team", label: "Команда собирается", dur: 210 },
  { id: "orgGraph3d", label: "Структура в пространстве", dur: 150 },
  { id: "score", label: "Партитура", dur: 180 },
  { id: "twoWaves", label: "Две волны параллельно", dur: 210 },
  { id: "barrier", label: "Барьер держит", dur: 210 },
  { id: "qaGate", label: "Гейт QA", dur: 270 },
  { id: "review", label: "Ревью — только читать", dur: 180 },
  { id: "mistake", label: "Ошибка: лид сам кодил", dur: 150 },
  { id: "reset", label: "Сброс", dur: 180 },
  { id: "redefine", label: "Переопределение", dur: 180 },
  { id: "site", label: "Сайт собирает сам себя", dur: 180 },
  { id: "filmToo", label: "Этот фильм — тоже команда", dur: 90 },
] as const;
