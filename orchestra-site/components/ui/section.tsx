import { type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  id?: string;
  /** alternating warm-tint background for rhythm */
  alt?: boolean;
  className?: string;
};

/**
 * Section wrapper enforcing macro-whitespace and a centered editorial measure.
 * Collapses to a single comfortable column with generous horizontal padding.
 */
export function Section({ children, id, alt = false, className }: SectionProps) {
  return (
    <section
      id={id}
      className={`${alt ? "bg-paper-alt" : "bg-paper"} ${
        id ? "scroll-mt-24" : ""
      } py-24 sm:py-32 lg:py-40 ${className ?? ""}`}
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8">
        {children}
      </div>
    </section>
  );
}
