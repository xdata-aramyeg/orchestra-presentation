import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Quotes } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/ui/section";
import { BezelCard } from "@/components/ui/bezel-card";
import { IslandLink } from "@/components/ui/island-link";
import { Reveal } from "@/components/motion/reveal";
import { AGENTS, getAgent } from "@/content/agents";

type PageParams = { params: Promise<{ slug: string }> };

// Only the six known slugs are valid routes; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return AGENTS.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return { title: "Агент не найден — Orchestra" };
  return {
    title: `${agent.handle} — ${agent.role} · Orchestra`,
    description: agent.tagline,
  };
}

const META_ROWS = [
  { label: "Модель", key: "model" as const },
  { label: "Инструменты", key: "tools" as const },
  { label: "Скиллы / подход", key: "skills" as const },
];

export default async function AgentPage({ params }: PageParams) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  return (
    <article>
      {/* Header */}
      <section className="bg-paper px-4 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-20">
        <div className="mx-auto w-full max-w-[1000px]">
          <Reveal>
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 font-mono text-[13px] text-ink-soft transition-colors duration-200 hover:text-vermilion"
            >
              <ArrowLeft weight="light" className="h-4 w-4" aria-hidden="true" />
              Все агенты
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-12 font-mono text-sm text-vermilion">
              {agent.index}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              {agent.handle}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 font-mono text-sm uppercase tracking-[0.18em] text-ink-muted">
              {agent.role}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Meta + character */}
      <Section alt className="!py-20 sm:!py-24">
        <div className="mx-auto grid max-w-[1000px] gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <BezelCard innerClassName="sm:p-8">
              <dl className="divide-y divide-line">
                {META_ROWS.map((row) => (
                  <div key={row.label} className="py-5 first:pt-0 last:pb-0">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
                      {row.label}
                    </dt>
                    <dd className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                      {agent[row.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </BezelCard>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Характер
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-5 text-xl leading-relaxed text-ink sm:text-2xl">
                {agent.character}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* What it did */}
      <Section className="!py-20 sm:!py-24">
        <div className="mx-auto max-w-[1000px]">
          <div className="grid gap-10 lg:grid-cols-[0.5fr_1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Что сделал на этом сайте
              </h2>
            </Reveal>
            <ul className="space-y-5">
              {agent.did.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 0.05}>
                  <div className="flex gap-4 border-b border-line pb-5">
                    <span className="font-mono text-xs text-vermilion">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="leading-relaxed text-ink-soft">{item}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Quote */}
      <Section alt className="!py-20 sm:!py-24">
        <div className="mx-auto max-w-[1000px]">
          <Reveal>
            <BezelCard accent innerClassName="sm:p-12">
              <Quotes
                weight="fill"
                className="h-8 w-8 text-vermilion"
                aria-hidden="true"
              />
              <blockquote className="mt-6 font-display text-2xl leading-snug font-medium text-ink sm:text-3xl">
                «{agent.quote}»
              </blockquote>
              <p className="mt-8 font-mono text-[13px] text-ink-muted">
                Связанные ошибки: {agent.relatedMistakes}
              </p>
            </BezelCard>
          </Reveal>
        </div>
      </Section>

      <Section className="!pt-4 !pb-28">
        <div className="mx-auto flex max-w-[1000px] justify-start">
          <IslandLink href="/agents" variant="ghost">
            Все агенты
          </IslandLink>
        </div>
      </Section>
    </article>
  );
}
