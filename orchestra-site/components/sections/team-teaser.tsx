import { Section } from "@/components/ui/section";
import { SectionMarker } from "@/components/ui/section-marker";
import { IslandLink } from "@/components/ui/island-link";
import { Reveal } from "@/components/motion/reveal";
import { AGENTS } from "@/content/agents";

/** §1.6 — the team teaser at the bottom of the home page. */
export function TeamTeaser() {
  return (
    <Section alt>
      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div>
          <Reveal>
            <SectionMarker index="05" label="Действующие лица" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Шесть агентов. Шесть ролей. Ни один не делал чужую работу.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
              Маэстро дирижирует, но не играет. Либреттист пишет партитуру, но не
              выходит на сцену. Сценограф строит то, что видит зритель; Машинист
              — то, что скрыто за кулисами. Камертон проверяет, держит ли всё
              строй. Рецензент читает финальную партитуру и ставит подпись — но
              не переписывает ни ноты.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10">
              <IslandLink href="/agents">Открыть страницы агентов</IslandLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ul className="border-t border-line">
            {AGENTS.map((agent) => (
              <li
                key={agent.slug}
                className="flex items-baseline gap-4 border-b border-line py-4"
              >
                <span className="font-mono text-xs text-vermilion">
                  {agent.index}
                </span>
                <span className="font-display text-lg font-semibold text-ink">
                  {agent.handle}
                </span>
                <span className="ml-auto font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
                  {agent.role}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
