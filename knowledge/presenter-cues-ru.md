# Presenter-mode cue cards (RU) — printable fallback

> The content behind on-screen **presenter mode**: one cue per beat of the live
> walk-through (`docs/DEMO-DAY.md`). The canonical, typed data lives in
> `orchestra-site/content/presenter-cues.ts` (`PRESENTER_CUES`). This table is the
> human-readable mirror — print it as a paper fallback, or read it if the on-screen
> cues fail on stage.
>
> **SAY** = the line to say out loud. **DROP** = the insider fact to drop (a real,
> accurate Claude Code mechanic or a real team story — grounded in
> `docs/agent-teams.md` and `knowledge/course-corrections/*`). Visitor/presenter copy
> is Russian; code/keys stay English.

## Routes & anchors

- Beats 1–10, 13–14 are on `/`; beat 11 on `/agents`; beat 12 on `/film`.
- **Confirmed DOM anchors** (verified via grep of `components/sections/*`):
  `teams` · `how` · `flow` (org chart) · `thread` · `tools` · `mistakes` · `under-the-hood`.
- **No real anchor** (presenter UI falls back to manual ← / → advance): hero, the
  «ОРКЕСТР» `CyrillicMoment`, the `/agents` index, `/film`, the terminal, and the
  footer waitlist — none expose an `id`, so their cues leave `anchor` undefined.

## The cues

| # | Section | SAY | DROP (insider fact) | Action |
|---|---------|-----|---------------------|--------|
| 1 | Hero — страница, которая построила себя | Всё, что вы видите, — отчёт команды о самой себе: спланировали, собрали, протестировали и проверили семь ИИ-агентов параллельно. | Команды агентов — экспериментальная функция Claude Code, по умолчанию выключена. Один флаг: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, нужен v2.1.32+. | Покажите строку статистики (7 · 2 · 1 · 6) |
| 2 | Как работают команды агентов `#teams` | Это не один ассистент с подзадачами, а несколько полноценных Claude Code, каждый в своём окне. | Субагенты живут в одной сессии и только возвращают результат вызвавшему — между собой молчат. Тиммейты пишут друг другу через мейлбокс (SendMessage) и сами разбирают общий список задач. | Откройте «под капотом» на секции |
| 3 | Наша структура — две волны `#how` | Качество не от старания, а от разделения: никто не проверяет собственную работу. Две волны, барьеры — и одно правило. | idle-during-QA: пока QA тестирует, фронтенд и бэкенд намеренно простаивают — иначе вердикт PASS/FAIL теряет смысл. Захват задач защищён блокировкой файла. | Наведите на узел оргграфа (`#flow`) |
| 4 | Послушайте, как переговаривается команда `#thread` | Настоящая переписка лида, тиммейтов и человека — без монтажа. Нажмите «повторить». | Сообщения доставляются автоматически, без опроса; простаивающий тиммейт сам уведомляет лида. «Это ужасно. Оркеструй, а не кодь» — реальная реплика человека лиду. | Нажмите ▶ повторить |
| 5 | Скиллы `#tools` | Чем мы это делали — по списку. Сначала скиллы: каждый агент опирался на готовые навыки. | Поля `skills`/`mcpServers` во frontmatter роли на тиммейта НЕ применяются — он грузит их из настроек проекта/пользователя. Из роли honored только `tools` и `model`, тело дописывается в системный промпт. | Откройте «под капотом» на инструментах |
| 6 | MCP-серверы `#tools` | MCP — мосты к внешним системам. Четыре сервера сделали всю чёрную работу. | Figma — мост дизайн↔код (и упёрся в per-seat rate limit); 21st magic генерировал UI; claude-in-chrome + computer use дал QA настоящий браузер; Playwright — E2E. | Назовите четыре сервера на экране |
| 7 | Плагины `#tools` | Плагины — упакованные наборы агентов, скиллов и MCP, ставятся разом. | ui-ux-pro-max — дизайн-интеллект; everything-claude-code — агенты ревью/планирования/паттернов/TDD; figma, playwright, claude-in-chrome подключают свои MCP одним плагином. | Покажите перечень плагинов |
| 8 | Лучшая часть — где мы облажались `#mistakes` | Лучшая часть — места, где мы облажались. Шесть ошибок, каждая как «ошибка → урок». | Реальный журнал PM (`knowledge/course-corrections/`): лид кодил руками, роль QA размыта, тёмный «AI-slop», лимит Figma, полный сброс v1. Из ошибок выросли правила. | Прокрутите до вермиллионного pull-statement |
| 9 | ОРКЕСТР | Ничего не нажимайте — медленно проскролльте, смотрите, как слово дышит. | Один variable-font (Unbounded): ось `wght` анимируется от тонкого к жирному в центре экрана — чистый CSS-трансформ по скроллу. При reduced-motion статично. | Скролльте через «ОРКЕСТР» медленно |
| 10 | Под капотом · Повторите сами `#under-the-hood` | Как повторить самим: живые карточки и копируемые сниппеты конфига. | «Скопировать» на флаге `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Дисциплину закрепляют хуки: `TaskCompleted` (exit 2) не даёт закрыть задачу, `TeammateIdle` (exit 2) не отпускает в простой. | Нажмите «Скопировать» на сниппете |
| 11 | Семь агентов оркестра (`/agents`) | Семь персонажей. Нажмите «Сыграть» — настраиваются, как перед концертом. Кликните в любого. | Персонаж = роль в `.claude/agents/*.md`: `tools`+`model` honored, тело в системный промпт. SendMessage и задачи доступны всегда. Рецензент read-only by design. | «Сыграть», затем откройте Маэстро |
| 12 | Фильм — как сайт собрал сам себя (`/film`) | ~75 секунд о том, как сайт собрал сам себя — с провальным v1 и сбросом. Досмотрите до 3D-оркестра. | Remotion (каждый кадр детерминирован) + GSAP + react-three-fiber (3D-оргграф) + Lottie; встроен через `@remotion/player`, poster-first, 0 ошибок в консоли. | play → досмотреть до 3D-оргграфа |
| 13 | Скрытый терминал (easter egg) | Нажмите backtick — откроется скрытый терминал. Спросите его, кто он. | Резолвер команд — чистая функция (легко тестировать). `whoami` → «сайт, который построил себя»; `stack` печатает скиллы/MCP/команды; `open film` → `/film`. | Нажмите `` ` ``, введите `whoami`, затем `stack` |
| 14 | Финал — лист ожидания | Оставьте настоящий email — счётчик живой. Потом покажите хеш сборки в подвале. | Форма — настоящий backend на SQLite (better-sqlite3) + zod на границе; ввод нормализуется (trim+lowercase), дубли закрыты уникальным индексом, ошибки безопасные. | Отправьте email → покажите build-hash |

## Pillars covered

- **agent-teams:** beats 1, 2, 3, 4, 10, 11, 13
- **skills:** beat 5 · **mcp:** beat 6 · **plugins:** beat 7
