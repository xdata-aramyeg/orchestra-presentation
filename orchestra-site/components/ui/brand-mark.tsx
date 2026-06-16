/**
 * Orchestra wordmark + glyph. The glyph is five rising "voices" (agents) tuned
 * to a single downbeat — the conduct-a-team metaphor — painted in the brand
 * aurora gradient. SVG, never an emoji.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-edge bg-surface/80">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="orchestra-mark" x1="0" y1="20" x2="20" y2="0">
              <stop stopColor="#8b5cf6" />
              <stop offset="0.5" stopColor="#e64bd9" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <g
            stroke="url(#orchestra-mark)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="13" x2="3" y2="17" />
            <line x1="7" y1="9" x2="7" y2="17" />
            <line x1="11" y1="4" x2="11" y2="17" />
            <line x1="15" y1="7" x2="15" y2="17" />
            <line x1="19" y1="11" x2="19" y2="17" />
          </g>
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">
        Orchestra
      </span>
    </span>
  );
}
