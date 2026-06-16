"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowClockwise } from "@phosphor-icons/react";
import { Section } from "@/components/ui/section";
import { SectionMarker } from "@/components/ui/section-marker";
import { UnderHoodCallout } from "@/components/under-the-hood/callout";
import { THREAD, type Bubble } from "@/content/thread";

const EASE = [0.32, 0.72, 0, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const bubbleVariant: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

/** A teammate is anyone who is not the human or the Lead. */
function tone(b: Bubble): "human" | "lead" | "team" {
  if (b.from === "Человек") return "human";
  if (b.from === "Маэстро") return "lead";
  return "team";
}

function BubbleRow({ b }: { b: Bubble }) {
  const t = tone(b);
  const right = b.side === "right";

  // Three visual tiers: the human is dark ink (blunt feedback lands), the Lead
  // is vermilion (the conductor), teammates are light bezel cards.
  const shell =
    t === "human"
      ? "bg-ink text-paper border-ink"
      : t === "lead"
        ? "bg-vermilion text-paper border-vermilion"
        : "bg-card text-ink border-line";

  const meta = t === "team" ? "text-ink-muted" : "text-paper/70";

  // Always a motion.li: under the animated <motion.ol> parent it staggers in;
  // under the static <ol> (reduced motion) it simply renders settled.
  return (
    <motion.li
      variants={bubbleVariant}
      className={`flex flex-col ${right ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-[1.25rem] border p-4 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_12px_30px_-24px_rgba(26,23,20,0.35)] sm:max-w-[34rem] sm:p-5 ${shell} ${
          right ? "rounded-tr-md" : "rounded-tl-md"
        }`}
      >
        <p className={`flex items-baseline gap-2 font-mono text-[11px] ${meta}`}>
          <span className="font-semibold tracking-wide uppercase">{b.from}</span>
          <span className="opacity-70">· {b.role}</span>
        </p>
        <p className="mt-2 leading-relaxed">{b.text}</p>
      </div>
    </motion.li>
  );
}

/**
 * "Послушайте, как переговаривается команда" — the real exchange, replayed as a
 * chat thread. Bubbles stagger in on scroll; a replay pill re-runs the stagger.
 * Reduced motion renders every bubble immediately and hides the replay control.
 */
export function MessageThread() {
  const reduceMotion = useReducedMotion();
  const [replayKey, setReplayKey] = useState(0);
  const animate = !reduceMotion;

  return (
    <Section id="thread">
      <div className="max-w-3xl">
        <SectionMarker index="03" label="В реальном времени" />
        <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Послушайте, как переговаривается команда.
        </h2>
        <p className="mt-7 text-lg leading-relaxed text-ink-soft">
          Это не реконструкция. Настоящий обмен репликами этой сборки: резкая
          обратная связь человека, барьеры лида, вердикты QA — и честный разворот
          от FAIL к PASS. Справа — человек и Маэстро (лид), слева — тиммейты.
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          15 реплик · от «оркестрируй, а не кодь» до «чисто»
        </p>
        {animate && (
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors duration-200 hover:border-vermilion/50 hover:text-vermilion active:scale-[0.97]"
          >
            <ArrowClockwise
              weight="light"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45"
              aria-hidden="true"
            />
            Повторить
          </button>
        )}
      </div>

      {animate ? (
        <motion.ol
          key={replayKey}
          data-reveal=""
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-8 flex flex-col gap-4"
        >
          {THREAD.map((b) => (
            <BubbleRow key={b.n} b={b} />
          ))}
        </motion.ol>
      ) : (
        <ol className="mt-8 flex flex-col gap-4">
          {THREAD.map((b) => (
            <BubbleRow key={b.n} b={b} />
          ))}
        </ol>
      )}

      <UnderHoodCallout id="thread" />
    </Section>
  );
}
