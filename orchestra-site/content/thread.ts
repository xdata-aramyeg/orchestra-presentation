/**
 * The real Человек ↔ Лид ↔ teammates exchange from this build — verbatim from
 * knowledge/thread-and-timeline-ru.md (15 bubbles). The bluntness of the human's
 * feedback (n1, n9) is the point and is left intact.
 *
 * side: "right" → Человек + Маэстро; "left" → all teammates.
 */

export type Bubble = {
  n: number;
  from: string;
  role: string;
  side: "left" | "right";
  text: string;
};

export const THREAD: readonly Bubble[] = [
  {
    n: 1,
    from: "Человек",
    role: "Человек",
    side: "right",
    text: "Я вижу, как ты сам пишешь код. Это ужасно. Оркестрируй, а не кодь.",
  },
  {
    n: 2,
    from: "Маэстро",
    role: "Лид",
    side: "right",
    text: "Принято. Руки убираю от кода. Раздаю работу: Волна 2 — Сценограф и Машинист параллельно, разные файлы, общий контракт.",
  },
  {
    n: 3,
    from: "Машинист",
    role: "Backend",
    side: "left",
    text: "Бэкенд готов. tsc чистый. 11/11 проверок БД — PASS: дедуп, регистр, позиция и счётчик сходятся.",
  },
  {
    n: 4,
    from: "Сценограф",
    role: "Frontend",
    side: "left",
    text: "Лендинг собран, вся копия на месте. Жду барьер — к коду больше не притрагиваюсь.",
  },
  {
    n: 5,
    from: "Маэстро",
    role: "Лид",
    side: "right",
    text: "Барьер: фича готова. Запускаю QA. Сценограф, Машинист — простаивайте. Ничего не меняем под тестом.",
  },
  {
    n: 6,
    from: "Камертон",
    role: "QA",
    side: "left",
    text: "Гоняю живой сайт в настоящем браузере через Chrome MCP. Вердикт: PASS, 9/10. AC10 (персистентность) подтвержу только после рестарта сервера.",
  },
  {
    n: 7,
    from: "Маэстро",
    role: "Лид",
    side: "right",
    text: "Рестартую сервер. Камертон, перепроверь AC10.",
  },
  {
    n: 8,
    from: "Камертон",
    role: "QA",
    side: "left",
    text: "Email пережил рестарт — данные в SQLite, не в памяти. AC10 — PASS. Итог 10/10.",
  },
  {
    n: 9,
    from: "Человек",
    role: "Человек",
    side: "right",
    text: "И что? Это просто описывает несуществующий продукт. И выглядит ужасно — тёмный AI-slop, позорно. Сделай лучше.",
  },
  {
    n: 10,
    from: "Маэстро",
    role: "Лид",
    side: "right",
    text: "Согласен. Сбрасываем всё в чистый лист, v1 — в архив. Переопределяем команду. Делаем self-referential презентацию на русском — про то, как мы её и собрали.",
  },
  {
    n: 11,
    from: "Либреттист",
    role: "PM",
    side: "left",
    text: "Записал в course-corrections: лид не кодит, роль QA — только тесты, idle-during-QA. Пишу новую цель и весь русский контент.",
  },
  {
    n: 12,
    from: "Сценограф",
    role: "Frontend",
    side: "left",
    text: "Новое направление: светлое, редакторское, как инженерный кейс. Никакого неона. Перестраиваю.",
  },
  {
    n: 13,
    from: "Камертон",
    role: "QA",
    side: "left",
    text: "Перепроверил доступность: контраст текста — 3.1:1. Это FAIL, ниже нормы. Возвращаю Сценографу.",
  },
  {
    n: 14,
    from: "Сценограф",
    role: "Frontend",
    side: "left",
    text: "Поднял до 4.8:1, токены поправил. Готово к ре-тесту.",
  },
  {
    n: 15,
    from: "Рецензент",
    role: "Reviewer",
    side: "left",
    text: "Читаю только после PASS. Корректность, безопасность, утечек ошибок нет. Править не могу — поэтому просто называю всё вслух. Чисто.",
  },
] as const;
