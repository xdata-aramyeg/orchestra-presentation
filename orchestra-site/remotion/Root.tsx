import { Composition } from "remotion";
import { Film } from "./Film";
import { DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT } from "./theme";

/**
 * The composition registry. One named, independently-renderable film. Shared
 * verbatim between the live <Player> (app/film) and the mp4 render path (CLI).
 */
export const RemotionRoot = () => (
  <Composition
    id="OrchestraFilm"
    component={Film}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
