import { GitBranch, Rocket, ShieldCheck, type LucideIcon } from "lucide-react";
import { Reveal } from "../motion/reveal";

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
  glow: string;
};

const FEATURES: Feature[] = [
  {
    icon: GitBranch,
    title: "Run agents in parallel",
    body: "Frontend, backend, tests, and docs move at once instead of one ticket at a time. Wall-clock time collapses to your slowest task, not the sum of all of them.",
    glow: "from-indigo/25",
  },
  {
    icon: ShieldCheck,
    title: "Quality gates, not vibes",
    body: "Every phase clears a barrier before the next begins. An independent agent tests the work and a separate reviewer reads it — no agent grades its own homework.",
    glow: "from-fuchsia/25",
  },
  {
    icon: Rocket,
    title: "Ship faster, with receipts",
    body: "Parallel build, gated review, and a clear audit trail mean you merge with confidence and a record of who did what, when.",
    glow: "from-cyan/25",
  },
];

/** Three real benefits, revealed with a staggered scroll entrance. */
export function Features() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-28"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          One prompt. A whole crew.
        </h2>
        <p className="mt-4 text-lg text-muted">
          Orchestra is built around three promises — the ones that make
          multi-agent worth it.
        </p>
      </Reveal>

      <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Reveal as="li" key={feature.title} delay={index * 0.1}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-edge bg-surface/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-edge-strong">
                <div
                  className={`pointer-events-none absolute -inset-px -z-10 bg-gradient-to-b ${feature.glow} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  aria-hidden="true"
                />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-edge bg-elevated">
                  <Icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {feature.body}
                </p>
              </article>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
