"use client";

/**
 * Animated aurora backdrop — three drifting, blurred colour blobs from the brand
 * spectrum over the midnight base, plus a faint dot-grid. Pure CSS animation
 * (keyframes in globals.css) so it stays cheap and is auto-disabled under
 * prefers-reduced-motion. Decorative only; hidden from assistive tech.
 */
export function Aurora() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.35) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)",
        }}
      />

      {/* drifting colour blobs */}
      <div
        className="aurora-blob absolute -top-24 left-[10%] h-[28rem] w-[28rem] rounded-full bg-violet/35 blur-[120px]"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="aurora-blob absolute -top-10 right-[8%] h-[24rem] w-[24rem] rounded-full bg-cyan/30 blur-[120px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="aurora-blob absolute top-32 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-fuchsia/25 blur-[130px]"
        style={{ animationDelay: "-12s" }}
      />

      {/* fade the backdrop into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base" />
    </div>
  );
}
