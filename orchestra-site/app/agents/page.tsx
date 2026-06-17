import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { AgentCard } from "@/components/agents/agent-card";
import { AGENTS } from "@/content/agents";

export const metadata: Metadata = {
  title: "Команда — Orchestra",
  description:
    "Команда из семи агентов Claude Code на Opus. Каждый знает свою партию и не лезет в чужую.",
};

export default function AgentsIndexPage() {
  return (
    <>
      <section className="bg-paper px-4 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-14">
        <div className="mx-auto w-full max-w-[1200px]">
          <Reveal>
            <Eyebrow>Действующие лица</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 max-w-[18ch] font-display text-[2.4rem] leading-[1.06] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Команда из семи агентов. Все — на Opus.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Метафора простая: это оркестр. Каждый агент знает свою партию и не
              лезет в чужую — именно поэтому целое звучит. Кликните любого, чтобы
              увидеть его роль, инструменты, характер и то, что он реально сделал
              на этом сайте.
            </p>
          </Reveal>
        </div>
      </section>

      <Section className="!pt-4">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, i) => (
            <Reveal key={agent.slug} delay={(i % 3) * 0.08}>
              <AgentCard agent={agent} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 font-mono text-[13px] leading-relaxed text-ink-muted [overflow-wrap:anywhere]">
            slug маршрутов: /agents/maestro · /agents/librettist ·
            /agents/scenographer · /agents/machinist · /agents/diapason ·
            /agents/reviewer · /agents/chronicler
          </p>
        </Reveal>
      </Section>
    </>
  );
}
