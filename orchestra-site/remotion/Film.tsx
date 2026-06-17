import { AbsoluteFill, Series } from "remotion";
import { COLORS } from "./theme";
import { GrainOverlay } from "./components/GrainOverlay";
import { FilmAudio } from "./components/FilmAudio";
import { Brief } from "./scenes/Brief";
import { Team } from "./scenes/Team";
import { OrgGraph3D } from "./scenes/OrgGraph3D";
import { Score } from "./scenes/Score";
import { TwoWaves } from "./scenes/TwoWaves";
import { Barrier } from "./scenes/Barrier";
import { QaGate } from "./scenes/QaGate";
import { Review } from "./scenes/Review";
import { Mistake } from "./scenes/Mistake";
import { Reset } from "./scenes/Reset";
import { Redefine } from "./scenes/Redefine";
import { SiteAssembles } from "./scenes/SiteAssembles";
import { FilmToo } from "./scenes/FilmToo";

/**
 * The full ~78s film — a back-to-back <Series> of the 13 storyboard beats
 * (incl. the one 3D structure beat, OrgGraph3D). Durations are the single source
 * of truth in theme.ts (SCENES); kept inline here so the Series reads as the
 * timeline. Sum === 2340 frames === DURATION_IN_FRAMES.
 */
export const Film = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
    <Series>
      <Series.Sequence durationInFrames={150}><Brief /></Series.Sequence>
      <Series.Sequence durationInFrames={210}><Team /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><OrgGraph3D /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><Score /></Series.Sequence>
      <Series.Sequence durationInFrames={210}><TwoWaves /></Series.Sequence>
      <Series.Sequence durationInFrames={210}><Barrier /></Series.Sequence>
      <Series.Sequence durationInFrames={270}><QaGate /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><Review /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Mistake /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><Reset /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><Redefine /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><SiteAssembles /></Series.Sequence>
      <Series.Sequence durationInFrames={90}><FilmToo /></Series.Sequence>
    </Series>
    <FilmAudio />
    <GrainOverlay />
  </AbsoluteFill>
);
