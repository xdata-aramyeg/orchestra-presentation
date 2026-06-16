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
      className={`rounded-[1.75rem] border p-2 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_18px_40px_-28px_rgba(26,23,20,0.35)] ${
        accent
          ? "border-vermilion/30 bg-gradient-to-b from-vermilion-soft/55 to-vermilion-soft/25"
          : "border-line bg-gradient-to-b from-shell to-paper-alt"
      } ${className ?? ""}`}
    >
      <div
        className={`h-full rounded-[1.25rem] border border-line bg-card p-5 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(26,23,20,0.05),0_1px_1px_rgba(26,23,20,0.03)] sm:p-6 ${innerClassName ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}
