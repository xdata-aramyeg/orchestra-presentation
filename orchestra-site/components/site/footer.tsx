import Link from "next/link";
import { FollowForm } from "@/components/follow/follow-form";

const FOOTER_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/goal", label: "Цель" },
  { href: "/agents", label: "Команда" },
] as const;

/**
 * Site footer. Carries the self-referential closing lines plus a small, honest
 * "follow the project" capture — framed as a live artifact the Backend agent
 * (Машинист) actually built, not a product pitch.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-alt">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-xl">
            <p className="font-display text-2xl leading-tight text-ink sm:text-3xl">
              Эту страницу спланировала, построила, протестировала и проверила
              команда из семи агентов Claude Code — работая параллельно.
            </p>
            <p className="mt-5 text-ink-soft">
              Сделано на Opus · Next.js · с настоящими ошибками по пути.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vermilion">
              Живой артефакт · сборка Машиниста
            </p>
            <p className="mt-3 mb-4 text-sm text-ink-soft">
              Хотите узнать о запуске? Эта форма — настоящий backend на SQLite,
              который собрал бэкенд-агент. Оставьте email — и следите за проектом.
            </p>
            <FollowForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-soft transition-colors duration-200 hover:text-vermilion"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span
              className="hidden items-center gap-1.5 font-mono text-[11px] text-ink-muted sm:inline-flex"
              aria-hidden="true"
            >
              нажмите
              <kbd className="rounded border border-line bg-card px-1.5 py-0.5 text-ink-soft">
                `
              </kbd>
            </span>
            <p className="font-mono text-xs text-ink-muted">
              © 2026 Orchestra. Самореферентная презентация, а не продукт.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
