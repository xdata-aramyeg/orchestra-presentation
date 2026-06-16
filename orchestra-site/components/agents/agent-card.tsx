import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BezelCard } from "@/components/ui/bezel-card";
import { type Agent } from "@/content/agents";

/**
 * Double-bezel agent card linking to the character page. Carries the editorial
 * index marker, the Cyrillic handle, the role in mono, and a one-line tagline.
 */
export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="group block h-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
    >
      <BezelCard className="h-full" innerClassName="flex h-full flex-col">
        <div className="flex items-start justify-between">
          <span className="font-mono text-sm text-vermilion">
            {agent.index}
          </span>
          <ArrowUpRight
            weight="light"
            className="h-5 w-5 text-ink-muted transition-colors duration-200 group-hover:text-vermilion"
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight text-ink">
          {agent.handle}
        </h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
          {agent.role}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          {agent.tagline}
        </p>
      </BezelCard>
    </Link>
  );
}
