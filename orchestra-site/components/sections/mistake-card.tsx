import { BezelCard } from "@/components/ui/bezel-card";

export type Mistake = {
  n: string;
  title: string;
  what: string;
  lesson: string;
};

/**
 * A single "ошибка → урок" card. The honesty is the point — the mistake is
 * stated plainly, then the lesson it produced.
 */
export function MistakeCard({ mistake }: { mistake: Mistake }) {
  return (
    <BezelCard className="h-full" innerClassName="flex h-full flex-col">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-vermilion">{mistake.n}</span>
        <h3 className="font-display text-xl leading-snug font-semibold text-ink">
          {mistake.title}
        </h3>
      </div>

      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Что случилось
        </p>
        <p className="mt-2 leading-relaxed text-ink-soft">{mistake.what}</p>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
          Урок
        </p>
        <p className="mt-2 leading-relaxed text-ink">{mistake.lesson}</p>
      </div>
    </BezelCard>
  );
}
