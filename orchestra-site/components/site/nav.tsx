import Link from "next/link";

const LINKS = [
  { href: "/agents", label: "Команда" },
  { href: "/goal", label: "Цель" },
  { href: "/film", label: "Фильм" },
  // In-page anchors: hidden on small screens so the pill never overflows
  // (they're still reachable by scrolling); shown from md up.
  { href: "/#how", label: "Как это работает", anchor: true },
  { href: "/#under-the-hood", label: "Под капотом", anchor: true },
] as const;

/**
 * Floating-pill navigation. A single rounded island that hovers over the paper
 * with a soft backdrop blur — not an edge-to-edge sticky bar.
 */
export function SiteNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="pointer-events-auto flex w-full max-w-[1100px] items-center justify-between gap-4 rounded-full border border-line bg-paper/80 py-2.5 pr-2.5 pl-5 backdrop-blur-md">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-base font-bold tracking-tight text-ink">
            Orchestra
          </span>
          <span className="mt-0.5 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted sm:block">
            Сайт, который построил сам себя
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-[13px] text-ink-soft transition-colors duration-200 hover:bg-shell hover:text-ink sm:text-sm ${
                "anchor" in link && link.anchor
                  ? "hidden md:inline-flex"
                  : "inline-flex"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
