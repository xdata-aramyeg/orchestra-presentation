import { Reveal } from "../motion/reveal";
import { LiveCounter } from "../waitlist/live-counter";
import { WaitlistForm } from "../waitlist/waitlist-form";

/**
 * Closing call-to-action. A second waitlist form (shares the same provider, so
 * its count stays in sync with the hero) inside a glowing aurora-bordered panel.
 */
export function WaitlistCta() {
  return (
    <section id="waitlist" className="px-5 py-24 sm:px-8 sm:py-28">
      <Reveal className="mx-auto w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-edge bg-surface/50 px-6 py-14 text-center sm:px-12 sm:py-20">
          {/* aurora wash */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            aria-hidden="true"
          >
            <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-violet/30 blur-[110px]" />
            <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-cyan/25 blur-[110px]" />
          </div>

          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Get a seat before the <span className="text-aurora">downbeat.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            Join the waitlist and we&apos;ll email you once when the first
            section opens. No spam, ever.
          </p>

          <div className="mt-9 flex flex-col items-center">
            <WaitlistForm idPrefix="cta" />
            <div className="mt-7">
              <LiveCounter />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
