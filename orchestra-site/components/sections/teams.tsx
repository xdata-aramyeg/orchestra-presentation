import {
  ListChecks,
  ChatsCircle,
  IdentificationCard,
} from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BezelCard } from "@/components/ui/bezel-card";
import { Reveal } from "@/components/motion/reveal";

const PILLARS = [
  {
    icon: ListChecks,
    title: "Общий список задач",
    body: "Задачи с зависимостями. Завершил одну — разблокировал следующую. Захват задачи защищён блокировкой файла, чтобы двое не взялись за одно.",
  },
  {
    icon: ChatsCircle,
    title: "Прямая связь",
    body: "Тиммейты пишут друг другу напрямую. Фронтенд и бэкенд договариваются о контракте API, не пробрасывая всё через лида.",
  },
  {
    icon: IdentificationCard,
    title: "Роли как определения",
    body: "Каждая роль — это переиспользуемое определение (.claude/agents/*.md): свой набор инструментов и своя модель. Одно описание — и субагент, и тиммейт.",
  },
] as const;

/** §1.2 — how agent teams work in Claude Code. */
export function TeamsSection() {
  return (
    <Section id="teams" alt>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Контекст</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Команда агентов — это не один ассистент. Это несколько.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:pt-4">
          <p className="text-lg leading-relaxed text-ink-soft">
            Команда агентов координирует сразу несколько экземпляров Claude
            Code. Одна сессия становится «лидом» (lead): она раскладывает работу
            на части, раздаёт задачи и собирает результат. Остальные —
            «тиммейты»: у каждого свой контекст, свои инструменты, и они общаются
            друг с другом напрямую, а не только с лидом.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        <Reveal>
          <BezelCard className="h-full" innerClassName="h-full">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
              Субагенты
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Живут внутри одной сессии. Отдают результат вызвавшему и молчат
              между собой. Хороши, когда важен только итог.
            </p>
          </BezelCard>
        </Reveal>
        <Reveal delay={0.08}>
          <BezelCard accent className="h-full" innerClassName="h-full">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-vermilion">
              Команда агентов
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Каждый — полноценный Claude Code в своём окне. Общий список задач,
              который они сами разбирают, и почтовый ящик для переписки. Хороши,
              когда работу нужно обсуждать и вести параллельно.
            </p>
          </BezelCard>
        </Reveal>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <Reveal key={pillar.title} delay={i * 0.08}>
            <BezelCard className="h-full" innerClassName="h-full">
              <pillar.icon
                weight="light"
                className="h-7 w-7 text-vermilion"
                aria-hidden="true"
              />
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                {pillar.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {pillar.body}
              </p>
            </BezelCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-10 max-w-2xl font-mono text-[13px] leading-relaxed text-ink-muted">
          Команды агентов — экспериментальная функция Claude Code, по умолчанию
          выключена. Нужна версия v2.1.32+ и флаг
          CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1.
        </p>
      </Reveal>
    </Section>
  );
}
