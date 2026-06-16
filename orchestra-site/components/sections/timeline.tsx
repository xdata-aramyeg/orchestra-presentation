import { Section } from "@/components/ui/section";
import { SectionMarker } from "@/components/ui/section-marker";
import { Reveal } from "@/components/motion/reveal";
import { TIMELINE } from "@/content/timeline";

/**
 * "Хронология сборки" — how we actually got here, in order. A sticky heading
 * rail on the left; entries fade up on scroll. Steps that produced a recorded
 * lesson carry a vermilion marker and an "ошибка → урок" tag. Dry, honest tone.
 */
export function Timeline() {
  return (
    <Section id="timeline" alt>
      <div className="grid gap-10 lg:grid-cols-[0.5fr_1fr] lg:gap-16">
        {/* Sticky rail / heading */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionMarker index="05" label="Как мы сюда пришли" />
          <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl">
            Хронология сборки.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
            Двенадцать шагов — по порядку, без приукрашивания. Половина из них
            помечена «ошибка → урок»: именно из них и сложились правила команды.
          </p>
        </div>

        {/* Entries on a vertical rail */}
        <ol className="relative ml-1 border-l border-line">
          {TIMELINE.map((entry, i) => (
            <Reveal as="li" key={entry.n} delay={(i % 4) * 0.05}>
              <div className="relative pb-10 pl-8 last:pb-0">
                <span
                  className={`absolute top-1 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-paper-alt ${
                    entry.mistake ? "bg-vermilion" : "bg-ink"
                  }`}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="tabular font-mono text-xs text-vermilion">
                    {String(entry.n).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
                    {entry.label}
                  </h3>
                  {entry.mistake && (
                    <span className="rounded-full border border-vermilion/30 bg-vermilion-soft/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-vermilion">
                      ошибка → урок
                    </span>
                  )}
                </div>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  {entry.what}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  {entry.outcome}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
