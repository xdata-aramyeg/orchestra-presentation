import { ClipboardList, GitMerge, ShieldCheck, type LucideIcon } from "lucide-react";
import { Reveal } from "../motion/reveal";

type Step = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    icon: ClipboardList,
    title: "Describe the work.",
    body: "Hand Orchestra a goal. It decomposes the work into an epic and small, self-contained tasks with clear owners.",
  },
  {
    icon: GitMerge,
    title: "The team builds in parallel.",
    body: "Specialist agents claim tasks and work side by side — no collisions, no waiting in line.",
  },
  {
    icon: ShieldCheck,
    title: "Gates keep it honest.",
    body: "QA tests the running result; a read-only reviewer signs off. Only clean, verified work reaches you.",
  },
];

/** Three-step walkthrough with a connecting spine on desktop. */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-28"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How it works
        </h2>
        <p className="mt-4 text-lg text-muted">
          From a one-line goal to verified, shipped work — in three moves.
        </p>
      </Reveal>

      <ol className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
        {/* connecting spine (desktop) */}
        <div
          className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-violet/0 via-edge-strong to-cyan/0 md:block"
          aria-hidden="true"
        />
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <Reveal as="li" key={step.title} delay={index * 0.12}>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative flex items-center gap-3">
                  <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-edge bg-elevated">
                    <Icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-sm font-medium tracking-widest text-muted">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted md:max-w-none">
                  {step.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
