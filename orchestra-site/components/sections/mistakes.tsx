import { Section } from "@/components/ui/section";
import { SectionMarker } from "@/components/ui/section-marker";
import { Reveal } from "@/components/motion/reveal";
import { MistakeCard, type Mistake } from "./mistake-card";

const MISTAKES: readonly Mistake[] = [
  {
    n: "01",
    title: "Лид начал писать код руками",
    what: "Лид взялся сам набирать код приложения вместо того, чтобы раздать его разработчикам. Человек сказал прямо: «это ужасно — ты должен оркестрировать, а не кодить».",
    lesson:
      "Лид раскладывает, маршрутизирует и держит барьеры — и только. Если тянет «просто пофиксить», это сигнал назначить разработчика. Иначе исчезает разделение ответственности, ради которого и существует команда.",
  },
  {
    n: "02",
    title: "Роль QA была размыта",
    what: "Было непонятно, что именно делает QA, — и возник риск, что тестировщик полезет «помогать» и начнёт править код.",
    lesson:
      "QA тестирует живое приложение в настоящем браузере через Chrome MCP и выносит PASS/FAIL с доказательствами. Кода он не трогает; всё, что он пишет, — тест-кейсы. Вердикт независим только тогда, когда тестировщик вне кода.",
  },
  {
    n: "03",
    title: "Первый дашборд в Figma выглядел плохо — и упёрся в лимит",
    what: "Первый дизайн-подход через Figma «выглядел настолько плохо», что его не спасти, — а вдобавок мы упёрлись в per-seat rate limit Figma MCP и встали.",
    lesson:
      "Внешние MCP имеют лимиты — это часть планирования, а не сюрприз. И плохой дизайн надо называть плохим рано, а не полировать обречённое.",
  },
  {
    n: "04",
    title: "Первый сайт был тёмным «ИИ-слопом»",
    what: "Первая версия сайта вышла тёмной, безвкусной — типичный «AI-slop»: неоновое свечение, фиолетовые градиенты по чёрному, центрированный герой поверх «сетки». Стыдно показывать.",
    lesson:
      "Светлая, редакторская, дорогая по вкусу подача — и никакого слопа. Мы итерируем: собрать → скриншот → критика → улучшить — пока не станет действительно хорошо. Мы не миримся с «сойдёт».",
  },
  {
    n: "05",
    title: "Полный сброс к чистому листу",
    what: "Накопилось столько неверных решений, что чинить по кусочкам было дороже, чем начать заново. Мы заархивировали v1 и сбросились к чистому листу.",
    lesson:
      "Иногда честнее обнулиться и переопределить команду, чем тащить мёртвый код. Сброс — это не поражение, а решение.",
  },
  {
    n: "06",
    title: "«idle-during-QA» мы поняли не сразу",
    what: "Сначала было неочевидно, что разработчики должны простаивать, пока идёт тест. Осознание пришло как отдельный урок.",
    lesson:
      "Пока QA тестирует, фронтенд и бэкенд простаивают — ничего не меняется под тестом. Удержанный барьер и есть то, что делает PASS/FAIL осмысленным.",
  },
];

/** §1.5 — the mistakes we made, honestly. The best part. */
export function MistakesSection() {
  return (
    <Section id="mistakes">
      <div className="max-w-3xl">
        <Reveal>
          <SectionMarker index="04" label="Честно" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Лучшая часть — это места, где мы облажались.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-7 text-lg leading-relaxed text-ink-soft">
            Презентация про команды агентов обязана показать команду честно — с
            провалами, а не только с парадным фасадом. Вот реальные ошибки этой
            сборки. Каждая записана как «ошибка → урок», потому что именно из них
            и сложились наши правила.
          </p>
        </Reveal>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MISTAKES.map((mistake, i) => (
          <Reveal key={mistake.n} delay={(i % 3) * 0.08}>
            <MistakeCard mistake={mistake} />
          </Reveal>
        ))}
      </div>

      {/* Off-grid accent statement — the section's punctuation mark */}
      <Reveal delay={0.05}>
        <div className="mt-10 overflow-hidden rounded-[1.75rem] bg-vermilion px-7 py-10 sm:px-12 sm:py-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/70">
            Вывод
          </p>
          <p className="mt-5 max-w-4xl font-display text-2xl leading-[1.15] font-bold text-paper sm:text-4xl lg:text-5xl">
            Эти шесть ошибок — не сноски. Это и есть правила, по которым команда
            теперь живёт.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
