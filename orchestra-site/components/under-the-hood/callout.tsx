"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { CALLOUTS } from "@/content/under-the-hood";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * The opt-in "под капотом" layer: a tiny mono toggle that expands to the
 * teaching nugget for its section. Excitement stays primary — this is collapsed
 * by default. Open/close animates height+opacity; reduced motion shows/hides
 * instantly (no height tween).
 */
export function UnderHoodCallout({ id }: { id: string }) {
  const data = CALLOUTS[id];
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  if (!data) return null;

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft transition-colors duration-200 hover:border-vermilion/50 hover:text-vermilion"
      >
        под капотом
        <CaretDown
          weight="bold"
          className={`h-3 w-3 text-vermilion transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={
              reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }
            }
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-[1.25rem] border border-line bg-gradient-to-b from-shell to-paper-alt p-1.5">
              <div className="rounded-[1rem] border border-line bg-card p-5 shadow-[inset_0_1px_0_rgba(255,255,255,1)] sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
                  Под капотом
                </p>
                <p className="mt-2.5 leading-relaxed text-ink-soft">
                  {data.underHood}
                </p>
                {data.repeat && (
                  <div className="mt-5 border-t border-line pt-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
                      Повторите сами
                    </p>
                    <p className="mt-2.5 leading-relaxed text-ink">
                      {data.repeat}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
