"use client";

import dynamic from "next/dynamic";
import { Film } from "@/remotion/Film";
import { DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT } from "@/remotion/theme";

/**
 * The live Remotion <Player>, lazy-loaded with ssr:false.
 *
 * Next 16 forbids `ssr:false` in Server Components, so the dynamic import lives
 * here inside a Client Component ("use client") — @remotion/player is
 * browser-only (touches `window`) and must never SSR. The page imports this
 * island normally; the Player chunk loads on the client only.
 *
 * Poster-first: autoPlay stays false (the paused frame 0 is the poster) →
 * reduced-motion-safe; the visitor presses play.
 */
const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  {
    ssr: false,
    loading: () => (
      <div
        aria-label="Загрузка фильма"
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          background: "var(--color-paper-alt)",
        }}
      />
    ),
  },
);

export default function FilmPlayer() {
  return (
    <Player
      component={Film}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      compositionWidth={WIDTH}
      compositionHeight={HEIGHT}
      style={{ width: "100%", aspectRatio: "16 / 9" }}
      controls
      loop={false}
      autoPlay={false}
      clickToPlay
      doubleClickToFullscreen
      spaceKeyToPlayOrPause
    />
  );
}
