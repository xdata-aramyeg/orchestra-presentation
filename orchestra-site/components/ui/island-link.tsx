import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type IslandLinkProps = {
  href: string;
  children: ReactNode;
  /** primary = vermilion fill; ghost = ink hairline on paper */
  variant?: "primary" | "ghost";
  className?: string;
};

/**
 * Island button rendered as a link: a fully-rounded pill with generous padding
 * whose trailing arrow lives in its own nested circle ("button-in-button").
 * Presses settle with a subtle scale. Used for the page's few real CTAs.
 */
export function IslandLink({
  href,
  children,
  variant = "primary",
  className,
}: IslandLinkProps) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pr-2 pl-6 font-medium transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
        isPrimary
          ? "bg-vermilion text-paper hover:bg-ink"
          : "border border-line-strong bg-card text-ink hover:border-ink"
      } ${className ?? ""}`}
    >
      <span className="text-[15px]">{children}</span>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 ${
          isPrimary ? "bg-paper/20 text-paper" : "bg-vermilion text-paper"
        }`}
        aria-hidden="true"
      >
        <ArrowRight weight="light" className="h-4 w-4" />
      </span>
    </Link>
  );
}
