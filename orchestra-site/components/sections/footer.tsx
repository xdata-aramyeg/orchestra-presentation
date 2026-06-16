import { BrandMark } from "../ui/brand-mark";

/** Footer — tagline, self-referential note, and legal line. Static. */
export function Footer() {
  return (
    <footer className="border-t border-edge/60 px-5 py-14 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <BrandMark />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              A self-referential demo: this page was planned, built, tested, and
              reviewed by a team of AI agents working in parallel.
            </p>
          </div>
          <p className="font-display text-base text-muted md:text-right">
            Orchestra — conduct a team of AI agents.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-edge/60 pt-6 text-sm text-muted/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Orchestra. A fictional product, for demonstration.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
