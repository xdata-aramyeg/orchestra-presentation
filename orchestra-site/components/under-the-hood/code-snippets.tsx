"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FileCode } from "@phosphor-icons/react";
import { REPRODUCE_STEPS, type CodeBlock, type ReproduceStep } from "@/content/reproduce-steps";
import { CopyButton } from "@/components/under-the-hood/copy-button";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * «Повторите сами» — REPRODUCE_STEPS rendered as a premium stepped recipe: a
 * numbered vertical spine (Шаг 1 → 5), each step carrying its title, blurb and
 * paste-and-go block(s). Single-block steps render a code card; the 6-role step
 * collapses into a segmented agent picker with a «Скопировать все» payload.
 * Every code surface wraps within its own bezel — never the page (375px-safe).
 */
export function CodeSnippets() {
  return (
    <ol className="mt-10 space-y-0">
      {REPRODUCE_STEPS.map((step, i) => (
        <StepRow
          key={step.id}
          step={step}
          isLast={i === REPRODUCE_STEPS.length - 1}
        />
      ))}
    </ol>
  );
}

function StepRow({ step, isLast }: { step: ReproduceStep; isLast: boolean }) {
  return (
    <li className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-6">
      {/* Spine: numbered node + connecting hairline to the next step */}
      <div className="flex flex-col items-center">
        <StepNode n={step.n} />
        {!isLast && (
          <span
            aria-hidden="true"
            className="mt-2 w-px flex-1 bg-gradient-to-b from-line to-line/40"
          />
        )}
      </div>

      {/* Content */}
      <div className={`min-w-0 ${isLast ? "pb-2" : "pb-12 sm:pb-14"}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
          Шаг {step.n}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
          {step.title}
        </h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
          {step.blurb}
        </p>

        <div className="mt-5">
          {step.blocks.length > 1 ? (
            <AgentBlocks blocks={step.blocks} />
          ) : (
            <CodeBlockCard block={step.blocks[0]} />
          )}
        </div>
      </div>
    </li>
  );
}

function StepNode({ n }: { n: number }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card font-display text-sm font-bold text-vermilion shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(26,23,20,0.08),0_10px_22px_-14px_rgba(26,23,20,0.45)] sm:h-12 sm:w-12 sm:text-lg">
      {n}
    </span>
  );
}

/** Resolve a tasteful lang/filename chip for a code surface header. */
function ChipLabel({ block }: { block: CodeBlock }) {
  if (block.filename) {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-vermilion">
        <FileCode weight="light" className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{block.filename}</span>
      </span>
    );
  }
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
      {block.lang === "text" ? "промпт" : block.lang}
    </span>
  );
}

/** Code surfaces preserve newlines + indentation but WRAP long lines so a long
 * prompt or description never forces horizontal scroll on the page. */
const CODE_SURFACE =
  "min-w-0 max-w-full overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-[12.5px] leading-relaxed text-ink [overflow-wrap:anywhere] [scrollbar-width:thin]";

function CodeBlockCard({ block }: { block: CodeBlock }) {
  const target = block.filename ?? block.label ?? "блок";
  return (
    <div className="w-full min-w-0 max-w-full rounded-[1.5rem] border border-line bg-gradient-to-b from-shell to-paper-alt p-1.5 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_18px_40px_-30px_rgba(26,23,20,0.35)]">
      <div className="flex min-w-0 flex-col overflow-hidden rounded-[1.1rem] border border-line bg-card shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(26,23,20,0.05)]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <ChipLabel block={block} />
          <CopyButton text={block.code} ariaLabel={`Скопировать: ${target}`} />
        </div>
        <pre className={CODE_SURFACE}>
          <code>{block.code}</code>
        </pre>
      </div>
    </div>
  );
}

/** Short pill label for the agent tab: handle (mono) + Russian role name. */
function tabParts(label?: string) {
  if (!label) return { handle: "", name: "" };
  const [handle, name] = label.split("·").map((s) => s.trim());
  return { handle: handle ?? "", name: name ?? "" };
}

/**
 * Step 3 — six role files presented compactly: a wrap-safe segmented control
 * picks one agent by its label, the active block animates in, and a single
 * «Скопировать все» concatenates every role file into one clipboard payload.
 */
function AgentBlocks({ blocks }: { blocks: readonly CodeBlock[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = blocks[active];

  const allText = blocks
    .map((b) => `# ${b.filename ?? b.label ?? ""}\n\n${b.code}`)
    .join("\n\n\n");

  return (
    <div className="min-w-0">
      {/* Segmented agent picker — wraps on narrow viewports, never overflows */}
      <div role="tablist" aria-label="Роли команды" className="flex flex-wrap gap-2">
        {blocks.map((b, i) => {
          const { handle, name } = tabParts(b.label);
          const selected = i === active;
          return (
            <button
              key={b.filename ?? b.label ?? i}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors duration-200 active:scale-[0.98] ${
                selected
                  ? "border-vermilion/40 bg-vermilion-soft/55 text-ink"
                  : "border-line bg-paper text-ink-soft hover:border-vermilion/40 hover:text-ink"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-vermilion">
                {handle}
              </span>
              <span className="font-medium">{name}</span>
            </button>
          );
        })}
      </div>

      {/* Count + copy-all */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] tracking-[0.04em] text-ink-muted">
          {active + 1} / {blocks.length}
        </span>
        <CopyButton
          text={allText}
          label="Скопировать все"
          ariaLabel="Скопировать все шесть ролей одним блоком"
        />
      </div>

      {/* Active role file */}
      <div className="mt-3 min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <CodeBlockCard block={current} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
