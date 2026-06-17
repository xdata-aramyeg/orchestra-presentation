import type { PresenterCue } from "@/content/presenter-cues";

/** Shared editorial easing — matches the rest of the site. */
export const PRESENTER_EASE = [0.32, 0.72, 0, 1] as const;

/** RU display labels for the pillar tag (keys stay English). */
const PILLAR_LABELS: Record<NonNullable<PresenterCue["pillar"]>, string> = {
  skills: "Скиллы",
  mcp: "MCP",
  plugins: "Плагины",
  "agent-teams": "Команды агентов",
};

export function pillarLabel(pillar: PresenterCue["pillar"]): string | null {
  return pillar ? PILLAR_LABELS[pillar] : null;
}

/** Where to be, formatted for a glance (e.g. "/  ·  #teams"). */
export function locationLabel(cue: PresenterCue): string {
  return cue.anchor ? `${cue.route} · #${cue.anchor}` : cue.route;
}

/** Pacing budget formatted in Russian, or null when absent. */
export function secondsLabel(seconds: PresenterCue["seconds"]): string | null {
  return typeof seconds === "number" ? `~${seconds} сек` : null;
}
