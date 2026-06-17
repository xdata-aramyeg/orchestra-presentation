import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";

/**
 * The film's ORIGINAL score, wired into the timeline. All assets are synthesised
 * by remotion/audio/generate.mjs (100% original, license-free) and live in
 * public/audio. Nothing here uses a realtime clock — every level is a pure
 * function of the frame, so the live <Player> and the mp4 render stay in sync.
 *
 * The bed is ONE through-composed 78s piece (NOT looped) — its texture changes
 * at every scene boundary so the music follows the narrative instead of
 * repeating a short sample. It plays at low volume so it sits UNDER the kinetic
 * type. See generate.mjs for the full section→second map of the composition.
 *
 * The SFX are diegetic one-shots pinned to the real story beats via
 * <Sequence from={frame}> (see Film.tsx scene offsets, 30fps):
 *
 *   sfx-open    @ 8     Brief — the film begins
 *   sfx-barrier @ 1040  Barrier holds & both checks light / release
 *   sfx-qa-fork @ 1150  QA gate — Камертон strikes the fork
 *   sfx-resolve @ 2296  FilmToo — the Orchestra wordmark resolves
 *
 * Audio never autoplays-with-sound: the <Player> is poster-first / click-to-play,
 * so sound only starts after a user gesture.
 */

const BED_VOLUME = 0.32;

/** Beat → absolute start frame. Derived from theme.ts SCENES cumulative offsets. */
const SFX = [
  { id: "open", src: "audio/sfx-open.wav", from: 8, volume: 0.4 },
  { id: "barrier", src: "audio/sfx-barrier.wav", from: 1040, volume: 0.5 },
  { id: "fork", src: "audio/sfx-qa-fork.wav", from: 1150, volume: 0.55 },
  { id: "resolve", src: "audio/sfx-resolve.wav", from: 2296, volume: 0.6 },
] as const;

export const FilmAudio = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <>
      <Audio
        src={staticFile("audio/bed.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 45, durationInFrames - 60, durationInFrames],
            [0, BED_VOLUME, BED_VOLUME, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {SFX.map((s) => (
        <Sequence key={s.id} from={s.from} name={`sfx:${s.id}`}>
          <Audio src={staticFile(s.src)} volume={s.volume} />
        </Sequence>
      ))}
    </>
  );
};
