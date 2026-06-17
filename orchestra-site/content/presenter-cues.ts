/**
 * Presenter-mode cue cards — one card per beat of the live walk-through.
 *
 * The human presenter sees these on-screen while conducting the audience
 * through the site. Each cue maps to a beat of docs/DEMO-DAY.md: where to be
 * (route + optional anchor), the section, the line to SAY, and the insider
 * FACT to DROP (a real, accurate Claude Code mechanic or a real team story).
 *
 * Authoring notes (PM / Liberettist):
 * - All visitor/presenter-facing strings are Russian; code/keys/types stay English.
 * - `anchor` is set ONLY to a DOM id that actually exists on that route (verified
 *   by grepping components/sections/*). When no real id exists, `anchor` is left
 *   undefined and the presenter UI falls back to manual ← / → advance.
 * - `drop` lines are grounded in docs/agent-teams.md and knowledge/course-corrections/*.
 * - Data only — this file holds no app/UI logic. Treat as immutable.
 */

export type PresenterCue = {
  id: string; // kebab slug, e.g. "thread"
  beat: number; // 1..N, the order
  route: string; // "/", "/agents", "/film", "/goal" — where the presenter should be
  anchor?: string; // optional DOM id of the section this cue tracks (only if a real id exists)
  section: string; // RU label of the section
  say: string; // RU — the punchy line to SAY out loud (spoken register)
  drop: string; // RU — the insider FACT to drop (real, accurate, educational)
  action?: string; // RU — optional concrete on-screen action
  pillar?: "skills" | "mcp" | "plugins" | "agent-teams"; // which pillar this beat showcases
  seconds?: number; // rough pacing budget for this beat
};

export const PRESENTER_CUES = [
  {
    id: "hero",
    beat: 1,
    route: "/",
    // hero <section> has no id — fall back to manual advance.
    section: "Hero — страница, которая построила себя",
    say: "Всё, что вы видите, — это отчёт команды о самой себе. Эту страницу спланировали, собрали, протестировали и проверили семь ИИ-агентов, работая параллельно.",
    drop: "Команды агентов в Claude Code — экспериментальная функция, по умолчанию выключенная. Включается одним флагом окружения: CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1, и нужен Claude Code v2.1.32+.",
    action: "Покажите строку статистики: 7 агентов · 2 волны · 1 правило · 6 ошибок",
    pillar: "agent-teams",
    seconds: 30,
  },
  {
    id: "teams",
    beat: 2,
    route: "/",
    anchor: "teams",
    section: "Как работают команды агентов",
    say: "Команда агентов — это не один ассистент с подзадачами. Это несколько полноценных Claude Code, каждый в своём окне со своим контекстом.",
    drop: "Главное отличие от субагентов: субагенты живут внутри одной сессии и только возвращают результат вызвавшему — между собой они не общаются. Тиммейты же пишут друг другу напрямую через мейлбокс (SendMessage) и сами разбирают общий список задач.",
    action: "Откройте тумблер «под капотом» на этой секции",
    pillar: "agent-teams",
    seconds: 40,
  },
  {
    id: "structure",
    beat: 3,
    route: "/",
    anchor: "how",
    section: "Наша структура — две волны и барьеры",
    say: "Качество здесь не от того, что агенты старались, а от разделения: ни один агент не проверяет собственную работу. Две волны, жёсткие барьеры — и одно правило, которое всё держит.",
    drop: "Правило idle-during-QA: пока тестировщик гоняет сборку, фронтенд и бэкенд намеренно простаивают. Если под тестом править код — вердикт PASS/FAIL теряет смысл: проверяли уже не то, что в репозитории. А захват задач в общем списке защищён блокировкой файла, чтобы двое не взялись за одну.",
    action: "Наведите на узел оргграфа (секция #flow) — подсветятся его файлы и роль",
    pillar: "agent-teams",
    seconds: 50,
  },
  {
    id: "thread",
    beat: 4,
    route: "/",
    anchor: "thread",
    section: "Послушайте, как переговаривается команда",
    say: "Вот настоящая переписка лида, тиммейтов и человека — без монтажа. Нажмите «повторить» и послушайте, как человек правит курс прямо по ходу.",
    drop: "Сообщения между тиммейтами доставляются автоматически, без опроса; простаивающий тиммейт сам уведомляет лида. Самая резкая реплика здесь реальна: человек сказал лиду «Это ужасно. Оркеструй, а не кодь» — потому что лид начал писать код руками.",
    action: "Нажмите ▶ повторить",
    pillar: "agent-teams",
    seconds: 45,
  },
  {
    id: "skills",
    beat: 5,
    route: "/",
    anchor: "tools",
    section: "Скиллы",
    say: "Чем мы это делали — без магии, по списку. Сначала скиллы: каждый агент опирался на готовые навыки Claude Code, а не изобретал инструменты на ходу.",
    drop: "Тонкость, на которой спотыкаются все: поля skills и mcpServers во frontmatter роли (.claude/agents/*.md) на тиммейта НЕ применяются — он подгружает скиллы и MCP из настроек проекта/пользователя, как обычная сессия. Из определения роли honored только tools и model, а тело дописывается в системный промпт.",
    action: "Откройте «под капотом» на секции инструментов",
    pillar: "skills",
    seconds: 30,
  },
  {
    id: "mcp",
    beat: 6,
    route: "/",
    anchor: "tools",
    section: "MCP-серверы",
    say: "MCP — это мосты к внешним системам. Четыре сервера сделали всю чёрную работу, которую сам Claude Code не делает.",
    drop: "Каждый MCP сыграл свою партию: Figma — мост дизайн↔код (и именно он упёрся в per-seat rate limit), 21st magic генерировал UI-компоненты, claude-in-chrome + computer use дал QA настоящий браузер — клики, чтение страницы и консоли, gif-доказательства, а Playwright — воспроизводимые E2E-сценарии.",
    action: "Назовите четыре сервера, которые перечислены на экране",
    pillar: "mcp",
    seconds: 35,
  },
  {
    id: "plugins",
    beat: 7,
    route: "/",
    anchor: "tools",
    section: "Плагины",
    say: "И плагины — упакованные наборы агентов, скиллов и MCP, которые ставятся разом, а не по одному.",
    drop: "Плагины — это переиспользуемые комплекты: ui-ux-pro-max принёс дизайн-интеллект (50+ стилей, палитры, шрифтовые пары), everything-claude-code — агентов ревью, планирования, паттернов и TDD, а figma, playwright и claude-in-chrome подключили свои MCP-серверы одним плагином.",
    action: "Покажите перечень плагинов под MCP",
    pillar: "plugins",
    seconds: 25,
  },
  {
    id: "mistakes",
    beat: 8,
    route: "/",
    anchor: "mistakes",
    section: "Лучшая часть — места, где мы облажались",
    say: "Лучшая часть презентации про команду — это места, где мы облажались. Шесть честных ошибок, и каждая записана как «ошибка → урок».",
    drop: "Это не приём «честности ради честности» — это реальный журнал. PM ведёт course-corrections в knowledge/: лид кодил руками, роль QA была размыта, первый дизайн был тёмным «AI-slop», Figma упёрся в лимит, и был полный сброс v1 в архив. Из этих ошибок и выросли правила команды.",
    action: "Прокрутите карточки до вермиллионного pull-statement",
    seconds: 45,
  },
  {
    id: "orkestr",
    beat: 9,
    route: "/",
    // CyrillicMoment <section> has aria-label but no id — manual advance.
    section: "ОРКЕСТР",
    say: "Тут ничего не нужно нажимать. Просто медленно проскролльте — и смотрите, как слово дышит.",
    drop: "Это не картинка и не видео: один variable-font (Unbounded), у которого ось веса wght анимируется от тонкого к самому жирному в центре экрана — чистый CSS-трансформ по скроллу, без перерисовки текста. При prefers-reduced-motion слово остаётся статичным и тяжёлым.",
    action: "Скролльте через «ОРКЕСТР» медленно",
    seconds: 20,
  },
  {
    id: "under-the-hood",
    beat: 10,
    route: "/",
    anchor: "under-the-hood",
    section: "Под капотом · Повторите сами",
    say: "Теперь — как повторить это самим. Здесь живые обучающие карточки и копируемые сниппеты конфига: вставил и поехал.",
    drop: "Нажмите «Скопировать» на флаге CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Дисциплину можно закрепить и технически — хуками: TaskCompleted с кодом выхода 2 не даёт закрыть задачу и шлёт фидбэк, TeammateIdle с кодом 2 не отпускает тиммейта в простой. Роли держат барьеры социально, хуки — принудительно.",
    action: "Нажмите «Скопировать» на сниппете с флагом",
    pillar: "agent-teams",
    seconds: 40,
  },
  {
    id: "agents",
    beat: 11,
    route: "/agents",
    // index route — no per-section anchor needed; manual advance.
    section: "Семь агентов оркестра",
    say: "Семь персонажей оркестра. Нажмите «Сыграть» — и они настраиваются, как перед концертом. Потом кликните в любого.",
    drop: "Каждый персонаж — это реальное определение роли в .claude/agents/*.md: свой tools-allowlist и model honored, тело дописано в системный промпт. Команда-инструменты SendMessage и работа со списком задач доступны тиммейту всегда — даже если tools урезан. Маэстро дирижирует и не играет; Рецензент — read-only by design, чтобы не мог тихо переписать баг вместо того, чтобы назвать его.",
    action: "Нажмите «Сыграть», затем откройте карточку Маэстро",
    pillar: "agent-teams",
    seconds: 40,
  },
  {
    id: "film",
    beat: 12,
    route: "/film",
    section: "Фильм — как сайт собрал сам себя",
    say: "~75 секунд о том, как сайт собрал сам себя — честно, с провальным v1 и сбросом к чистому листу. Дайте досмотреть до 3D-оркестра.",
    drop: "Фильм собран Хроникёром на Remotion — каждый кадр детерминирован по своему номеру — плюс GSAP, react-three-fiber для 3D-сцен (оргграф в пространстве) и Lottie. Встроен в сайт через @remotion/player с poster-first плеером и 0 ошибок в консоли; деградирует мягко под reduced-motion.",
    action: "Нажмите play, досмотрите до 3D-оргграфа",
    seconds: 80,
  },
  {
    id: "terminal",
    beat: 13,
    route: "/",
    section: "Скрытый терминал (easter egg)",
    say: "Маленький сюрприз для зала. Нажмите backtick — откроется скрытый терминал. Спросите его, кто он.",
    drop: "Резолвер команд — чистая функция без побочных эффектов, поэтому easter-egg тривиально тестируется. whoami отвечает «сайт, который построил себя», stack печатает скиллы / MCP / команды агентов, open film уводит на /film.",
    action: "Нажмите ` и введите whoami, затем stack",
    pillar: "agent-teams",
    seconds: 35,
  },
  {
    id: "finale",
    beat: 14,
    route: "/",
    // waitlist lives in the footer — no id; scroll to footer manually.
    section: "Финал — лист ожидания",
    say: "Финал: оставьте настоящий email — счётчик живой, «вы #N». А потом посмотрите на хеш сборки в подвале: это реальный коммит именно этого билда.",
    drop: "Форма — не бутафория: это настоящий backend на SQLite (better-sqlite3) с валидацией zod на границе, который собрал бэкенд-агент. Ввод нормализуется (trim + lowercase), дубли закрыты уникальным индексом, а ошибки наружу — безопасные, без стек-трейсов.",
    action: "Отправьте email, затем покажите build-hash в подвале",
    seconds: 30,
  },
] as const satisfies readonly PresenterCue[];
