import { Section } from "@/components/ui/section";
import { SectionMarker } from "@/components/ui/section-marker";
import { BezelCard } from "@/components/ui/bezel-card";
import { Reveal } from "@/components/motion/reveal";
import { CodeSnippets } from "@/components/under-the-hood/code-snippets";
import { DEEP_CARDS, QUICKSTART } from "@/content/under-the-hood";

/**
 * "Как это устроено / Повторите сами" (#under-the-hood) — the educational dial.
 * Six deep cards (что это → как использовали → повторите сами) + a 5-step
 * quickstart. Scannable and concrete, not a manual.
 */
export function UnderTheHood() {
  return (
    <Section id="under-the-hood">
      <div className="max-w-3xl">
        <Reveal>
          <SectionMarker index="07" label="Под капотом" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Как это устроено — и как повторить.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-7 text-lg leading-relaxed text-ink-soft">
            Этот сайт не только рассказывает историю, но и учит механике. Всё
            ниже — реальные приёмы Claude Code, которыми мы пользовались. Каждый
            блок заканчивается одним-двумя конкретными шагами, чтобы вы могли
            сделать так же.
          </p>
        </Reveal>
      </div>

      {/* Six deep cards */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {DEEP_CARDS.map((card, i) => (
          <Reveal key={card.n} delay={(i % 2) * 0.06} className="min-w-0">
            <BezelCard className="h-full min-w-0" innerClassName="flex h-full min-w-0 flex-col">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-vermilion">
                  {card.n}
                </span>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {card.title}
                </h3>
              </div>
              <dl className="mt-5 space-y-4">
                {card.rows.map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
                      {row.label}
                    </dt>
                    <dd className="mt-2 leading-relaxed text-ink-soft">
                      {row.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </BezelCard>
          </Reveal>
        ))}
      </div>

      {/* Copyable config snippets — paste-and-go */}
      <Reveal delay={0.05}>
        <p className="mt-14 font-mono text-xs uppercase tracking-[0.18em] text-vermilion">
          Скопируйте и вставьте
        </p>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
          Три кусочка конфигурации, с которых начинается команда: флаг,
          роль-субагент и обычная просьба на русском. Нажмите «Скопировать» —
          и вставьте к себе.
        </p>
      </Reveal>
      <CodeSnippets />

      {/* Quickstart */}
      <Reveal delay={0.05}>
        <div className="mt-10 rounded-[1.75rem] border border-vermilion/30 bg-gradient-to-b from-vermilion-soft/55 to-vermilion-soft/25 p-2 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_18px_40px_-28px_rgba(26,23,20,0.35)]">
          <div className="rounded-[1.25rem] border border-line bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,1)] sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-vermilion">
              Быстрый старт
            </p>
            <ol className="mt-6 space-y-4">
              {QUICKSTART.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="tabular mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vermilion font-mono text-xs font-semibold text-paper">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed text-ink-soft">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-10 font-display text-xl leading-snug text-ink sm:text-2xl">
          Всё, что вы видели на этой странице, собрано именно так.
        </p>
      </Reveal>
    </Section>
  );
}
