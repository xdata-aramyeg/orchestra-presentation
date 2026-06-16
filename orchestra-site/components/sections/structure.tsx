import { PauseCircle, Minus } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/ui/section";
import { SectionMarker } from "@/components/ui/section-marker";
import { Reveal } from "@/components/motion/reveal";
import { OrgChart } from "@/components/sections/org-chart";
import { UnderHoodCallout } from "@/components/under-the-hood/callout";

const STEPS = [
  {
    n: "01",
    title: "Волна 1 — Исследование и план",
    body: "PM/Аналитик пишет эпик и задачи: критерии приёмки, зависимости, замороженный контракт API. Пока спецификации ясны, QA уже пишет тест-кейсы.",
  },
  {
    n: "02",
    title: "Волна 2 — Сборка параллельно",
    body: "Фронтенд и бэкенд строят одновременно, но в разных файлах против общего контракта. Никаких конфликтов — связывает их только договорённость, а она уже зафиксирована.",
  },
  {
    n: "03",
    title: "Барьер: фича готова",
    body: "Лид не пускает дальше, пока страница реально не отрисовалась, а API не ответил. Барьер держит лид; вперёд он не забегает.",
  },
  {
    n: "04",
    title: "Гейт QA",
    body: "Тестировщик гоняет живое приложение в настоящем браузере через Chrome MCP и сам выносит вердикт PASS/FAIL с доказательствами.",
  },
  {
    n: "05",
    title: "Гейт ревью",
    body: "Только после PASS читает Ревьюер — read-only. Нашёл CRITICAL/HIGH — задача возвращается разработчику, потом повторный QA, потом повторное ревью.",
  },
] as const;

const RULES = [
  "Лид никогда не пишет код фичи. Он раскладывает, маршрутизирует и держит барьеры.",
  "QA только тестирует; пишет максимум тест-кейсы. Правки кода — всегда обратно к автору.",
  "Ревьюер только читает — и только после PASS. У него вообще нет прав на правку.",
  "Никаких конфликтов файлов: UI — у фронтенда, API/БД — у бэкенда.",
  "Лид ждёт тиммейтов. Он держит каждый барьер и проверяет, прежде чем идти дальше.",
] as const;

/** §1.3 — our structure: two waves, barriers, and the idle-during-QA rule. */
export function StructureSection() {
  return (
    <Section id="how">
      <div className="max-w-3xl">
        <Reveal>
          <SectionMarker index="02" label="Дисциплина" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Две волны, барьеры между ними и одно правило, которое всё держит.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-7 text-lg leading-relaxed text-ink-soft">
            Качество здесь — не от того, что агенты «старались». Оно от
            разделения ответственности: ни один агент не проверяет собственную
            работу. Мы разложили это на две волны с жёсткими барьерами между
            фазами.
          </p>
        </Reveal>
      </div>

      {/* Flow as a vertical editorial timeline */}
      <ol className="mt-8 border-t border-line">
        {STEPS.map((step, i) => (
          <Reveal as="li" key={step.n} delay={i * 0.05}>
            <div className="grid gap-2 border-b border-line py-5 md:grid-cols-[auto_1fr] md:gap-12">
              <span className="font-mono text-sm text-vermilion md:pt-1">
                {step.n}
              </span>
              <div className="max-w-3xl">
                <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      {/* Highlighted idle-during-QA block — the key idea (bespoke dark bezel) */}
      <Reveal delay={0.05}>
        <div className="mt-10 rounded-[1.75rem] border border-vermilion/30 bg-vermilion-soft/35 p-2 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_18px_40px_-28px_rgba(26,23,20,0.4)]">
          <div className="rounded-[1.25rem] bg-ink p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
              <PauseCircle
                weight="light"
                className="h-10 w-10 shrink-0 text-vermilion"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-display text-2xl leading-tight font-bold text-paper sm:text-3xl">
                  Пока QA тестирует — разработчики простаивают. Намеренно.
                </h3>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-paper/70">
                  Это не лень и не ожидание — это правило. Если фронтенд или
                  бэкенд правят код во время теста, вердикт QA теряет смысл:
                  проверяли уже не то, что в репозитории. Поэтому во время гейта
                  QA лид не даёт разработчикам задач, а они сами ничего не
                  разбирают. Под тестом ничего не меняется — и поэтому PASS/FAIL
                  что-то значит. Удержанный барьер и есть то, что делает вердикт
                  настоящим.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Non-negotiables */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[0.6fr_1fr] lg:gap-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
            Правила дисциплины · non-negotiables
          </p>
        </Reveal>
        <ul className="space-y-4">
          {RULES.map((rule, i) => (
            <Reveal as="li" key={rule} delay={i * 0.05}>
              <div className="flex gap-4 border-b border-line pb-4">
                <Minus
                  weight="bold"
                  className="mt-1 h-4 w-4 shrink-0 text-vermilion"
                  aria-hidden="true"
                />
                <p className="leading-relaxed text-ink-soft">{rule}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* The signature moment — the interactive two-wave flow diagram */}
      <OrgChart />

      <UnderHoodCallout id="how" />
    </Section>
  );
}
