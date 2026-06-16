import { type ReactNode } from "react";

type BezelCardProps = {
  children: ReactNode;
  className?: string;
  /** className applied to the inner core (override fill/padding) */
  innerClassName?: string;
  /** subtle accent variant — tints the shell toward vermilion */
  accent?: boolean;
};

/**
 * Double-bezel card: an outer shell (warm tint, hairline ring, small padding,
 * large radius) wrapping an inner core with its own fill, an inset highlight,
 * and a concentric smaller radius. No flat cards on the paper background.
 */
export function BezelCard({
  children,
  className,
  innerClassName,
  accent = false,
}: BezelCardProps) {
  return (
    <div
      className={`rounded-[2rem] border p-1.5 ${
        accent
          ? "border-vermilion/25 bg-vermilion-soft/35"
          : "border-line bg-shell"
      } ${className ?? ""}`}
    >
      <div
        className={`h-full rounded-[1.5rem] border border-line bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-8 ${innerClassName ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}
