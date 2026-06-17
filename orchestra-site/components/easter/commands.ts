/**
 * Pure command resolver for the hidden in-page terminal. No DOM, no side
 * effects — it maps a raw input string to a typed result the component renders
 * (or acts on). Keeping this pure makes the easter egg trivially testable and
 * keeps the component focused on UI + a11y.
 */

export type CommandResult =
  | { kind: "lines"; lines: readonly string[] }
  | { kind: "clear" }
  | { kind: "navigate"; href: string; lines: readonly string[] };

export const ROSTER = [
  "Маэстро",
  "Либреттист",
  "Сценограф",
  "Машинист",
  "Камертон",
  "Рецензент",
  "Хроникёр",
] as const;

const HELP_LINES = [
  "whoami        — кто построил этот сайт",
  "team · agents — состав команды (7 агентов)",
  "stack         — скиллы, MCP, команды агентов",
  "open film     — перейти к фильму",
  "open goal     — перейти к цели",
  "clear         — очистить вывод",
  "help          — этот список",
] as const;

const STACK_LINES = [
  "skills : ui-ux-pro-max, frontend/backend-patterns, remotion, svg-animation…",
  "mcp    : Figma, 21st magic, Chrome + computer-use, Playwright",
  "teams  : команды агентов Claude Code — параллельно, с барьерами качества",
] as const;

/**
 * Resolve a raw command line into a typed result. Unknown commands return a
 * friendly Russian hint. Navigation targets carry a confirmation line so the
 * transcript reads sensibly before the route changes.
 */
export function resolveCommand(raw: string): CommandResult {
  const input = raw.trim();
  if (!input) return { kind: "lines", lines: [] };

  const lower = input.toLowerCase();

  switch (lower) {
    case "whoami":
      return { kind: "lines", lines: ["сайт, который построил себя"] };

    case "team":
    case "agents":
      return { kind: "lines", lines: [ROSTER.join(" · ")] };

    case "stack":
      return { kind: "lines", lines: STACK_LINES };

    case "help":
    case "?":
      return { kind: "lines", lines: HELP_LINES };

    case "clear":
    case "cls":
      return { kind: "clear" };

    case "open film":
    case "film":
      return {
        kind: "navigate",
        href: "/film",
        lines: ["открываю /film…"],
      };

    case "open goal":
    case "goal":
      return {
        kind: "navigate",
        href: "/goal",
        lines: ["открываю /goal…"],
      };

    default:
      return {
        kind: "lines",
        lines: [`команда не найдена: ${input} — наберите help`],
      };
  }
}

export const BANNER_LINES = [
  "Orchestra // скрытый терминал",
  'наберите "help" — или попробуйте: team · stack · open film',
] as const;
