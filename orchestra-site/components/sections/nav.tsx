import Link from "next/link";
import { BrandMark } from "../ui/brand-mark";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#waitlist", label: "Waitlist" },
];

/**
 * Sticky top navigation. Static (no client state) — anchor links to in-page
 * sections plus a primary CTA that scrolls to the bottom waitlist form.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-edge/60 bg-base/70 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8"
        aria-label="Primary"
      >
        <Link href="#top" className="rounded-lg" aria-label="Orchestra home">
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#waitlist"
          className="inline-flex h-9 items-center rounded-lg border border-edge-strong bg-surface/60 px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-cyan/60 hover:bg-surface"
        >
          Join the waitlist
        </a>
      </nav>
    </header>
  );
}
