import { Aurora } from "../motion/aurora";
import { Reveal } from "../motion/reveal";
import { LiveCounter } from "../waitlist/live-counter";
import { WaitlistForm } from "../waitlist/waitlist-form";

/**
 * Hero. Aurora backdrop + a staggered on-load reveal of eyebrow → headline →
 * subhead → email capture → live counter. The email capture and counter are
 * the live, contract-backed pieces; everything else is static §2 copy.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32"
    >
      <Aurora />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <Reveal delay={0}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia" aria-hidden="true" />
            Now forming the first section.
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Conduct a team of <span className="text-aurora">AI agents.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
            Orchestra turns one assistant into a coordinated crew — agents that
            plan, build, test, and review in parallel, with quality gates
            between every phase. Ship faster, trust what ships.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-9 flex w-full flex-col items-center">
          <WaitlistForm idPrefix="hero" />
        </Reveal>

        <Reveal delay={0.32} className="mt-7">
          <LiveCounter />
        </Reveal>
      </div>
    </section>
  );
}
