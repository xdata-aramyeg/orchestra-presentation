"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.32, 0.72, 0, 1] as const;

type NodeData = {
  slug: string;
  handle: string;
  role: string;
  owns: string;
};

const NODES: Record<string, NodeData> = {
  maestro: {
    slug: "maestro",
    handle: "Маэстро",
    role: "Лид · Оркестратор",
    owns: "Дирижирует · держит барьеры · кода фичи не пишет",
  },
  librettist: {
    slug: "librettist",
    handle: "Либреттист",
    role: "PM · Аналитик",
    owns: "Волна 1 — эпики, задачи, замороженный контракт API",
  },
  scenographer: {
    slug: "scenographer",
    handle: "Сценограф",
    role: "Frontend",
    owns: "UI · app/ · components/",
  },
  machinist: {
    slug: "machinist",
    handle: "Машинист",
    role: "Backend",
    owns: "API / БД · lib/ · app/api/",
  },
  diapason: {
    slug: "diapason",
    handle: "Камертон",
    role: "QA",
    owns: "Живой браузер · вердикт PASS / FAIL · кода не правит",
  },
  reviewer: {
    slug: "reviewer",
    handle: "Рецензент",
    role: "Reviewer",
    owns: "Только чтение · запускается после PASS",
  },
};

type ActiveState = {
  active: string | null;
  set: (slug: string | null) => void;
};

function FlowNode({
  node,
  state,
  wide = false,
}: {
  node: NodeData;
  state: ActiveState;
  wide?: boolean;
}) {
  const isActive = state.active === node.slug;
  const isDimmed = state.active !== null && !isActive;

  return (
    <Link
      href={`/agents/${node.slug}`}
      onMouseEnter={() => state.set(node.slug)}
      onMouseLeave={() => state.set(null)}
      onFocus={() => state.set(node.slug)}
      onBlur={() => state.set(null)}
      aria-label={`${node.handle} — ${node.role}`}
      className={`group block rounded-[1.25rem] border bg-card p-4 transition-[opacity,transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        wide ? "text-center" : ""
      } ${
        isActive
          ? "-translate-y-0.5 border-vermilion shadow-[0_18px_40px_-24px_rgba(197,72,47,0.5)]"
          : "border-line shadow-[inset_0_1px_0_rgba(255,255,255,1)]"
      } ${isDimmed ? "opacity-40" : "opacity-100"}`}
    >
      <span className="block font-display text-lg font-semibold tracking-tight text-ink">
        {node.handle}
      </span>
      <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        {node.role}
      </span>
      <span
        className={`mt-3 block font-mono text-[11px] leading-relaxed transition-colors duration-300 ${
          isActive ? "text-vermilion" : "text-ink-soft"
        }`}
      >
        {node.owns}
      </span>
    </Link>
  );
}

// Connector strip height in px — the SVG carries an explicit height attribute
// (not a percentage), so the element is exactly this tall with no chance of a
// default-sized SVG opening a void.
const FLOW_H = 34;

/** A connecting flow strip drawn with an animated SVG path on scroll. */
function Flow({
  variant,
  label,
}: {
  variant: "down" | "split" | "merge";
  label?: string;
}) {
  const reduceMotion = useReducedMotion();

  const paths =
    variant === "split"
      ? ["M50,0 C50,18 25,16 25,34", "M50,0 C50,18 75,16 75,34"]
      : variant === "merge"
        ? ["M25,0 C25,18 50,16 50,34", "M75,0 C75,18 50,16 50,34"]
        : ["M50,0 L50,34"];

  return (
    <div className="relative w-full" style={{ height: FLOW_H }}>
      <svg
        className="block text-vermilion/55"
        width="100%"
        height={FLOW_H}
        viewBox={`0 0 100 ${FLOW_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {paths.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
            whileInView={
              reduceMotion ? undefined : { pathLength: 1, opacity: 1 }
            }
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
          />
        ))}
      </svg>
      {label && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-paper px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * The signature moment: an interactive two-wave flow of the team. Hovering (or
 * focusing) any node highlights what it owns and dims the rest; every node links
 * to its character page. The connecting paths draw themselves on scroll. Fully
 * keyboard-navigable; the path animation respects prefers-reduced-motion.
 */
export function OrgChart() {
  const [active, setActive] = useState<string | null>(null);
  const state: ActiveState = { active, set: setActive };

  return (
    <div className="mt-12 border-t border-line pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Те же две волны — как поток.
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          Наведите на узел · кликните, чтобы открыть агента
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        {/* Conductor */}
        <FlowNode node={NODES.maestro} state={state} wide />
        <Flow variant="down" />

        {/* Wave 1 — plan */}
        <FlowNode node={NODES.librettist} state={state} wide />
        <Flow variant="split" label="Волна 2" />

        {/* Wave 2 — parallel build, different files */}
        <div className="grid grid-cols-2 gap-4">
          <FlowNode node={NODES.scenographer} state={state} />
          <FlowNode node={NODES.machinist} state={state} />
        </div>
        <p className="mt-3 text-center font-mono text-[11px] text-ink-muted">
          параллельно · разные файлы · против общего контракта
        </p>
        <Flow variant="merge" />

        {/* Barrier */}
        <div className="rounded-full border border-dashed border-vermilion/50 bg-vermilion-soft/25 px-5 py-3 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-vermilion">
            Барьер · фича готова
          </span>
          <p className="mt-1 text-sm text-ink-soft">
            Лид не пускает дальше, пока страница не отрисуется, а API не ответит.
          </p>
        </div>
        <Flow variant="down" />

        {/* QA gate + idle band */}
        <FlowNode node={NODES.diapason} state={state} wide />
        <div className="mt-3 rounded-xl bg-ink px-4 py-2.5 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-vermilion">
            idle-during-QA
          </span>
          <span className="ml-2 text-[13px] text-paper/70">
            пока QA тестирует — Сценограф и Машинист простаивают
          </span>
        </div>
        <Flow variant="down" label="PASS" />

        {/* Review gate */}
        <FlowNode node={NODES.reviewer} state={state} wide />
      </div>
    </div>
  );
}
