import {
  Blocks,
  FlaskConical,
  PencilRuler,
  ScanEye,
  Send,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "../motion/reveal";

type Role = { icon: LucideIcon; label: string };

/**
 * The "logo strip" — but instead of borrowed company logos, it marquees the
 * section roles that built this very page (Plan · Build · Test · Review · Ship),
 * reinforcing the self-referential pitch. CSS marquee, paused under
 * prefers-reduced-motion via the global reduced-motion rule.
 */
const ROLES: Role[] = [
  { icon: PencilRuler, label: "Plan" },
  { icon: Blocks, label: "Build" },
  { icon: FlaskConical, label: "Test" },
  { icon: ScanEye, label: "Review" },
  { icon: Send, label: "Ship" },
];

function RoleRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={ariaHidden || undefined}
    >
      {ROLES.map((role) => {
        const Icon = role.icon;
        return (
          <li
            key={role.label}
            className="flex items-center gap-2.5 text-muted"
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="font-display text-lg font-medium tracking-wide">
              {role.label}
            </span>
            <span className="text-edge-strong" aria-hidden="true">
              ·
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function RoleStrip() {
  return (
    <section className="border-y border-edge/60 bg-surface/30 py-12">
      <Reveal className="mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="text-sm text-muted">
          Built by an orchestrated team of agents — the same way you&apos;ll
          build with Orchestra.
        </p>
      </Reveal>

      <div
        className="relative mt-8 flex overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="animate-marquee flex min-w-full shrink-0 items-center">
          <RoleRow />
          <RoleRow ariaHidden />
        </div>
        <div
          className="animate-marquee flex min-w-full shrink-0 items-center"
          aria-hidden="true"
        >
          <RoleRow ariaHidden />
          <RoleRow ariaHidden />
        </div>
      </div>
    </section>
  );
}
