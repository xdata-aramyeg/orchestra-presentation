import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Quotes,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/ui/section";
import { BezelCard } from "@/components/ui/bezel-card";
import { Reveal } from "@/components/motion/reveal";
import { AgentAvatar, type AvatarSlug } from "@/components/avatars";
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

  const idx = AGENTS.findIndex((a) => a.slug === agent.slug);
  const prev = AGENTS[(idx - 1 + AGENTS.length) % AGENTS.length];
  const next = AGENTS[(idx + 1) % AGENTS.length];

  return (
    <article>
      {/* Header */}
      <section className="bg-paper px-4 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-14">
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

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <div>
              <Reveal delay={0.05}>
                <p className="font-mono text-sm text-vermilion">
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
            <Reveal delay={0.1}>
              <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-[1.75rem] border border-line bg-gradient-to-b from-shell to-paper-alt p-2 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_18px_40px_-28px_rgba(26,23,20,0.35)]">
                <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] border border-line bg-card shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                  <AgentAvatar
                    slug={agent.slug as AvatarSlug}
                    size={132}
                    play="auto"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Meta + character */}
      <Section alt>
        <div className="mx-auto grid max-w-[1000px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <BezelCard>
              <dl className="divide-y divide-line">
                {META_ROWS.map((row) => (
                  <div key={row.label} className="py-4 first:pt-0 last:pb-0">
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
      <Section>
        <div className="mx-auto max-w-[1000px]">
          <div className="grid gap-8 lg:grid-cols-[0.5fr_1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Что сделал на этом сайте
              </h2>
            </Reveal>
            <ul className="space-y-4">
              {agent.did.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 0.05}>
                  <div className="flex gap-4 border-b border-line pb-4">
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

      {/* Quote + linked mistakes */}
      <Section alt>
        <div className="mx-auto max-w-[1000px]">
          <Reveal>
            <BezelCard accent>
              <Quotes
                weight="fill"
                className="h-8 w-8 text-vermilion"
                aria-hidden="true"
              />
              <blockquote className="mt-5 font-display text-2xl leading-snug font-medium text-ink sm:text-3xl">
                «{agent.quote}»
              </blockquote>
            </BezelCard>
          </Reveal>

          <Reveal delay={0.05}>
            <Link
              href="/#mistakes"
              className="group mt-4 flex items-start gap-4 rounded-[1.25rem] border border-line bg-card p-6 transition-colors duration-200 hover:border-vermilion/50"
            >
              <Warning
                weight="light"
                className="mt-0.5 h-6 w-6 shrink-0 text-vermilion"
                aria-hidden="true"
              />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  Ошибки, к которым причастен
                </p>
                <p className="mt-2 leading-relaxed text-ink">
                  {agent.relatedMistakes}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[13px] text-vermilion">
                  Все ошибки
                  <ArrowRight
                    weight="light"
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Prev / next agent — fills the foot with real navigation */}
      <Section className="!py-12 sm:!py-16">
        <div className="mx-auto grid max-w-[1000px] gap-4 sm:grid-cols-2">
          <Link
            href={`/agents/${prev.slug}`}
            className="group flex items-center gap-4 rounded-[1.25rem] border border-line bg-card p-5 transition-colors duration-200 hover:border-vermilion/50"
          >
            <ArrowLeft
              weight="light"
              className="h-5 w-5 shrink-0 text-ink-muted transition-colors duration-200 group-hover:text-vermilion"
              aria-hidden="true"
            />
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                Предыдущий
              </span>
              <span className="mt-0.5 block font-display text-lg font-semibold text-ink">
                {prev.handle}
              </span>
            </span>
          </Link>

          <Link
            href={`/agents/${next.slug}`}
            className="group flex items-center justify-end gap-4 rounded-[1.25rem] border border-line bg-card p-5 text-right transition-colors duration-200 hover:border-vermilion/50"
          >
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                Следующий
              </span>
              <span className="mt-0.5 block font-display text-lg font-semibold text-ink">
                {next.handle}
              </span>
            </span>
            <ArrowRight
              weight="light"
              className="h-5 w-5 shrink-0 text-ink-muted transition-colors duration-200 group-hover:text-vermilion"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Section>
    </article>
  );
}
