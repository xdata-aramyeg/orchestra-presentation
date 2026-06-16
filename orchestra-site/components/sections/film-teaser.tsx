import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IslandLink } from "@/components/ui/island-link";
import { Reveal } from "@/components/motion/reveal";

/**
 * Compact film teaser on the home — a static poster-style still (warm paper,
 * line-art frame, a single vermilion play accent) that routes to /film. The
 * heavy @remotion/player lives on /film, not here. Scroll-revealed; the poster
 * is static, so it's reduced-motion safe by construction.
 */
export function FilmTeaser() {
  return (
    <Section alt>
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Poster — a line-art "screen" still in the film's look */}
        <Reveal>
          <div className="rounded-[1.75rem] border border-line bg-gradient-to-b from-shell to-paper-alt p-2 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_18px_40px_-28px_rgba(26,23,20,0.35)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-line bg-paper-alt shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
              {/* film perforations down each edge */}
              <div className="absolute inset-y-0 left-0 flex flex-col justify-around py-4 pl-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2 rounded-[3px] border border-line bg-paper"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="absolute inset-y-0 right-0 flex flex-col justify-around py-4 pr-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2 rounded-[3px] border border-line bg-paper"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* centred play emblem — line-art ring, single vermilion triangle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="h-20 w-20"
                  role="img"
                  aria-label="Кадр из фильма со значком воспроизведения"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth="3"
                  />
                  <path
                    d="M44 38 L64 50 L44 62 Z"
                    fill="var(--color-vermilion)"
                  />
                </svg>
              </div>

              {/* caption */}
              <span className="absolute bottom-3.5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                Хроника · ~75 сек
              </span>
            </div>
          </div>
        </Reveal>

        {/* Copy + CTA */}
        <div>
          <Reveal>
            <Eyebrow>Хроника</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl">
              Посмотрите, как этот сайт собрал сам себя.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              ~75 секунд о том, как семь агентов пришли к этой странице — честно,
              с провальным v1 и сбросом к чистому листу. Снято Хроникёром на
              Remotion.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9">
              <IslandLink href="/film">Смотреть фильм</IslandLink>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
