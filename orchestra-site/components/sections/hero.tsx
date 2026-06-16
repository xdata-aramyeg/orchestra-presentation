import { Eyebrow } from "@/components/ui/eyebrow";
import { IslandLink } from "@/components/ui/island-link";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { UnderHoodCallout } from "@/components/under-the-hood/callout";

const STATS = [
  { value: 7, label: "агентов на Opus" },
  { value: 2, label: "волны со строгими барьерами" },
  { value: 1, label: "правило держит всё — idle-during-QA" },
  { value: 6, label: "честных ошибки внутри" },
] as const;

/**
 * Hero — left-aligned editorial opening on warm paper. No centered-over-mesh
 * cliché: a confident Cyrillic display headline, a measured subhead, two CTAs,
 * and a mono stat strip with count-ups.
 */
export function Hero() {
  return (
    <section className="bg-paper px-4 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <Eyebrow>Презентация, которая документирует саму себя</Eyebrow>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-7 max-w-[18ch] font-display text-[2.6rem] leading-[1.04] font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Эту страницу построила команда ИИ-агентов.{" "}
            <span className="text-vermilion">Вот как — и где мы ошиблись.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            Семь агентов Claude Code на Opus: оркестратор, аналитик, фронтенд,
            бэкенд, тестировщик, ревьюер и хроникёр. Они работали параллельно,
            передавали работу через барьеры качества — и не дали ни одному
            агенту проверять собственную работу. Этот сайт — их отчёт о самих
            себе.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <IslandLink href="/agents">Познакомиться с командой</IslandLink>
            <IslandLink href="/goal" variant="ghost">
              Читать цель
            </IslandLink>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 font-mono text-[13px] text-ink-muted">
            Без приукрашивания. Ошибки — внутри, не спрятаны.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-4xl font-bold text-ink sm:text-5xl">
                  <CountUp value={stat.value} />
                </dt>
                <dd className="mt-3 max-w-[22ch] text-sm leading-snug text-ink-muted">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <UnderHoodCallout id="hero" />
      </div>
    </section>
  );
}
