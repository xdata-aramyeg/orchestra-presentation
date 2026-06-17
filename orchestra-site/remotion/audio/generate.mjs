/**
 * generate.mjs — the Orchestra film's ORIGINAL score, synthesised from scratch.
 *
 * 100% original, license-free, zero third-party audio. Raw additive synthesis →
 * 16-bit PCM mono WAV at 22.05 kHz (small files). Reproducible:
 *
 *     node remotion/audio/generate.mjs
 *
 * It writes into ../../public/audio/ (referenced from Remotion via staticFile).
 *
 * ── THE BED IS THROUGH-COMPOSED (no loop) ───────────────────────────────────
 * bed.wav is ONE continuous 78s piece that SCORES THE ACTUAL SCENES — its
 * texture changes at every scene boundary so the music follows the narrative
 * instead of repeating a short sample. The film is 2340 frames @ 30fps = 78s.
 * Section map (seconds; cumulative from theme.ts SCENES):
 *
 *   0–5    Бриф            sparse — a low drone fades in, one or two felt notes
 *   5–12   Команда         additive layering: six entrances build a pentatonic
 *   12–17  Структура 3D    spacious/awe: open fifths + high shimmering bells
 *   17–23  Партитура       the MAIN THEME is stated (C–E–G–A–G–E motif)
 *   23–30  Две волны       steady pulse, TWO interleaving voices (mid + high)
 *   30–37  Барьер          held sus tension → resolves to C as the barrier SFX
 *   37–46  Гейт QA         thin/attentive: the fork (C5) is answered, devs idle
 *   46–52  Ревью           calm, contemplative restatement of the theme
 *   52–57  Ошибка          a wrong note — the music stumbles, drops out
 *   57–63  Сброс           stripped to a clean low drone + single notes
 *   63–69  Переопределение theme returns, confident, additive rebuild
 *   69–75  Сайт собирает   warm build to a modest peak
 *   75–78  Этот фильм…     clean C-major resolve (with the resolve SFX), settle
 *
 * SFX (one-shots pinned to beats via <Sequence> in FilmAudio.tsx) are kept
 * diegetic and unchanged:
 *   sfx-open.wav     ~1.8s soft rising felt-piano dyad — the film begins.
 *   sfx-barrier.wav  ~0.5s soft woody thunk/seal — the BARRIER holds & releases.
 *   sfx-qa-fork.wav  ~2.8s struck tuning-fork ding (Камертон) — the QA gate.
 *   sfx-resolve.wav  ~3.5s gentle resolving C-major chord — site/film resolves.
 *
 * Musical direction: warm, hopeful, a little playful — quiet title-sequence, not
 * cinematic-trailer. Everything sits UNDER the kinetic type (Remotion lowers it
 * further via <Audio volume>). Key: C major / C-pentatonic.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "..", "public", "audio");
mkdirSync(OUT, { recursive: true });

const SR = 22050; // 22.05 kHz mono — small, plenty for this material
const TAU = Math.PI * 2;

// ── note frequencies (equal temperament, A4 = 440) ──────────────────────────
const C3 = 130.81, F3 = 174.61, G3 = 196.0, A3 = 220.0, Bb3 = 233.08;
const C4 = 261.63, Db4 = 277.18, D4 = 293.66, E4 = 329.63, F4 = 349.23;
const Fs4 = 369.99, G4 = 392.0, A4 = 440.0, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880.0;

// ── tiny WAV writer (PCM 16-bit mono) ───────────────────────────────────────
function writeWav(name, samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32); // block align
  buf.writeUInt16LE(16, 34); // bits/sample
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  const path = join(OUT, name);
  writeFileSync(path, buf);
  return { name, bytes: buf.length };
}

// ── instrument voices (additive, all pure functions of t) ───────────────────

/** Soft felt-piano: warm harmonics, gentle attack, exponential decay. */
function feltPiano(buf, startT, dur, freq, amp, decay = 2.2) {
  const n0 = Math.floor(startT * SR);
  const n1 = Math.min(buf.length, Math.floor((startT + dur) * SR));
  const attack = 0.014;
  const H = [
    [1, 1.0],
    [2, 0.26],
    [3, 0.11],
    [4, 0.05],
  ];
  for (let n = n0; n < n1; n++) {
    const t = (n - n0) / SR;
    const env = (1 - Math.exp(-t / attack)) * Math.exp(-t * decay);
    let s = 0;
    for (const [h, a] of H) s += a * Math.sin(TAU * freq * h * t);
    buf[n] += amp * env * s;
  }
}

/** Felt-piano chord: a small stagger (spread) gives a human roll. */
function pianoChord(buf, t0, dur, freqs, amp, decay = 1.2, spread = 0.045) {
  freqs.forEach((f, i) => feltPiano(buf, t0 + i * spread, dur, f, amp, decay));
}

/** Marimba: quick wooden attack, fast decay, inharmonic upper partials. */
function marimba(buf, startT, dur, freq, amp) {
  const n0 = Math.floor(startT * SR);
  const n1 = Math.min(buf.length, Math.floor((startT + dur) * SR));
  const attack = 0.004;
  for (let n = n0; n < n1; n++) {
    const t = (n - n0) / SR;
    const env = (1 - Math.exp(-t / attack)) * Math.exp(-t * 5.5);
    const s =
      Math.sin(TAU * freq * t) +
      0.32 * Math.sin(TAU * freq * 3.9 * t) * Math.exp(-t * 8) +
      0.1 * Math.sin(TAU * freq * 9.2 * t) * Math.exp(-t * 13);
    buf[n] += amp * env * s;
  }
}

/**
 * Sustained drone/pad tone with independent fade-in / fade-out (linear ramps),
 * optional slow vibrato. Used to lay continuous harmony per section; sections
 * overlap their fades to crossfade harmony with no seam (and no loop).
 */
function drone(buf, startT, dur, freq, amp, opts = {}) {
  const { fadeIn = 0.8, fadeOut = 1.2, vib = 0, vibRate = 0.18, harm = 0.0 } = opts;
  const n0 = Math.floor(startT * SR);
  const n1 = Math.min(buf.length, Math.floor((startT + dur) * SR));
  for (let n = n0; n < n1; n++) {
    const t = (n - n0) / SR;
    const rem = dur - t;
    const env = Math.min(1, t / fadeIn) * Math.min(1, rem / Math.max(1e-4, fadeOut));
    const f = freq * (1 + vib * Math.sin(TAU * vibRate * t));
    let s = Math.sin(TAU * f * t);
    if (harm) s += harm * Math.sin(TAU * f * 2 * t);
    buf[n] += amp * Math.max(0, env) * s;
  }
}

/** Soft bell/chime: long shimmering decay with slightly inharmonic partials. */
function bell(buf, startT, dur, freq, amp) {
  const n0 = Math.floor(startT * SR);
  const n1 = Math.min(buf.length, Math.floor((startT + dur) * SR));
  const attack = 0.02;
  for (let n = n0; n < n1; n++) {
    const t = (n - n0) / SR;
    const env = (1 - Math.exp(-t / attack)) * Math.exp(-t * 1.1);
    const s =
      Math.sin(TAU * freq * t) +
      0.4 * Math.sin(TAU * freq * 2.01 * t) * Math.exp(-t * 2) +
      0.15 * Math.sin(TAU * freq * 3.0 * t) * Math.exp(-t * 3);
    buf[n] += amp * env * s;
  }
}

// ── gentle master conditioning ──────────────────────────────────────────────
function softClip(buf) {
  for (let n = 0; n < buf.length; n++) buf[n] = Math.tanh(buf[n]);
}
function normalize(buf, peak) {
  let max = 0;
  for (let n = 0; n < buf.length; n++) max = Math.max(max, Math.abs(buf[n]));
  if (max < 1e-9) return;
  const g = peak / max;
  for (let n = 0; n < buf.length; n++) buf[n] *= g;
}

// ════════════════════════════════════════════════════════════════════════════
// bed.wav — ONE through-composed 78s piece (no loop). Each section below scores
// the matching scene; sections overlap their drone fades so harmony crossfades.
// ════════════════════════════════════════════════════════════════════════════
function buildBed() {
  const LEN = 78; // seconds — matches DURATION_IN_FRAMES (2340) / FPS (30)
  const buf = new Float32Array(Math.round(LEN * SR));

  // The recurring "Orchestra theme" — a C-pentatonic motif reused (stated at
  // Партитура, recalled calmly at Ревью, rebuilt confidently at Переопределение).
  const THEME = [C4, E4, G4, A4, G4, E4, C5];

  // ── 1) Бриф 0–5 — sparse: a low drone wakes, one or two felt notes ────────
  drone(buf, 0, 6.0, C3, 0.05, { fadeIn: 1.6, fadeOut: 1.4 });
  feltPiano(buf, 0.5, 3.2, C4, 0.10, 0.9);
  feltPiano(buf, 2.9, 2.4, E4, 0.075, 1.0);

  // ── 2) Команда 5–12 — additive: six entrances build a pentatonic stack ────
  drone(buf, 5.0, 8.0, G3, 0.035, { fadeIn: 1.2, fadeOut: 1.4 }); // adds the 5th
  drone(buf, 6.6, 6.4, E4, 0.022, { fadeIn: 1.6, fadeOut: 1.4 }); // adds the 3rd
  const team = [
    [5.2, C4, 0.05], [6.0, E4, 0.055], [7.1, G4, 0.06],
    [8.2, A4, 0.065], [9.4, C5, 0.07], [10.6, D5, 0.075],
  ];
  for (const [t0, f, a] of team) marimba(buf, t0, 0.9, f, a);
  pianoChord(buf, 10.9, 2.2, [C4, E4, G4], 0.05, 1.1); // the team is assembled

  // ── 3) Структура 3D 12–17 — spacious/awe: open fifths + high bells ────────
  drone(buf, 12.0, 5.4, C3, 0.05, { fadeIn: 1.4, fadeOut: 1.6 });
  drone(buf, 12.0, 5.4, G3, 0.04, { fadeIn: 1.6, fadeOut: 1.6 }); // open 5th
  drone(buf, 12.6, 4.6, C4, 0.028, { fadeIn: 1.8, fadeOut: 1.4 });
  bell(buf, 13.0, 3.2, E5, 0.05);
  bell(buf, 14.8, 2.6, G5, 0.04);
  bell(buf, 16.1, 1.8, C5, 0.04);

  // ── 4) Партитура 17–23 — STATE THE THEME (marimba lead + felt echoes) ─────
  drone(buf, 17.0, 6.2, C3, 0.045, { fadeIn: 1.2, fadeOut: 1.4 });
  drone(buf, 17.0, 6.2, G3, 0.03, { fadeIn: 1.4, fadeOut: 1.4 });
  THEME.forEach((f, i) => marimba(buf, 17.2 + i * 0.62, 0.85, f, 0.06));
  feltPiano(buf, 19.3, 2.0, C4, 0.05, 1.2); // soft harmonic underpin
  pianoChord(buf, 21.4, 2.0, [C4, E4, G4], 0.05, 1.1);

  // ── 5) Две волны 23–30 — steady pulse, TWO interleaving voices ────────────
  drone(buf, 23.0, 7.4, C3, 0.04, { fadeIn: 1.0, fadeOut: 1.2 });
  drone(buf, 23.0, 7.0, E4, 0.02, { fadeIn: 1.6, fadeOut: 1.2 });
  const voiceA = [C4, E4, G4, E4]; // wave 1 — mid register, on the beat
  const voiceB = [C5, A4, G4, C5]; // wave 2 — high register, off the beat
  let k = 0;
  for (let t = 23.0; t < 29.6; t += 0.6, k++) {
    marimba(buf, t, 0.7, voiceA[k % voiceA.length], 0.05); // on-beat
    marimba(buf, t + 0.3, 0.6, voiceB[k % voiceB.length], 0.042); // off-beat
  }

  // ── 6) Барьер 30–37 — held sus tension → resolves to C at the barrier SFX ─
  // the pulse stops (a hold). A suspended cluster (no 3rd) crescendos, with a
  // faint F#4 beating against G to add tension, then RESOLVES to C major @34.7.
  drone(buf, 30.0, 4.9, G3, 0.045, { fadeIn: 1.4, fadeOut: 0.4 });
  drone(buf, 30.0, 4.9, D4, 0.04, { fadeIn: 1.6, fadeOut: 0.4 });
  drone(buf, 30.4, 4.5, G4, 0.035, { fadeIn: 2.0, fadeOut: 0.4 });
  drone(buf, 30.6, 4.3, A4, 0.03, { fadeIn: 2.2, fadeOut: 0.4 });
  drone(buf, 31.2, 3.6, B4, 0.024, { fadeIn: 3.2, fadeOut: 0.3 }); // rising tension
  drone(buf, 31.6, 3.2, Fs4, 0.012, { fadeIn: 3.0, fadeOut: 0.25 }); // faint beat
  // resolution lands with the barrier SFX (~34.7s):
  pianoChord(buf, 34.7, 2.3, [C3, C4, E4, G4], 0.09, 0.75, 0.03);
  drone(buf, 34.7, 2.3, C3, 0.045, { fadeIn: 0.05, fadeOut: 1.2 });
  drone(buf, 34.8, 2.2, G3, 0.03, { fadeIn: 0.1, fadeOut: 1.2 });

  // ── 7) Гейт QA 37–46 — thin/attentive: the fork (C5) answered, devs idle ──
  // a low hum holds (idle), the struck fork @38.3 is ANSWERED by a C5 bell, then
  // a few careful, sparse notes; a cautious pulse only resumes near the gate's
  // end as the verdict passes toward Ревью.
  drone(buf, 37.0, 9.0, C3, 0.03, { fadeIn: 1.2, fadeOut: 1.6 }); // idle hum
  bell(buf, 38.6, 3.0, C5, 0.05); // music answers the camertone (~C5)
  marimba(buf, 39.8, 0.9, E5, 0.04);
  marimba(buf, 41.0, 0.9, G4, 0.038);
  marimba(buf, 42.3, 0.9, C5, 0.036);
  bell(buf, 43.0, 2.4, G4, 0.03);
  // cautious pulse resumes, leaning into the verdict:
  marimba(buf, 44.2, 0.8, C4, 0.04);
  marimba(buf, 45.0, 0.8, E4, 0.045);
  marimba(buf, 45.6, 0.7, G4, 0.05);

  // ── 8) Ревью 46–52 — calm, contemplative restatement of the theme ─────────
  drone(buf, 46.0, 6.2, C3, 0.04, { fadeIn: 1.0, fadeOut: 1.4 });
  drone(buf, 46.0, 6.2, G3, 0.026, { fadeIn: 1.4, fadeOut: 1.4 });
  const review = [C4, E4, G4, A4, G4];
  review.forEach((f, i) => feltPiano(buf, 46.6 + i * 1.0, 2.0, f, 0.06, 1.4));
  marimba(buf, 49.2, 0.8, E5, 0.03); // a single bright accent

  // ── 9) Ошибка 52–57 — a WRONG note: the music stumbles & drops out ────────
  feltPiano(buf, 52.1, 1.6, Db4, 0.10, 0.9); // the clash (b9 against C)
  feltPiano(buf, 52.2, 1.4, Fs4, 0.06, 0.9); // tritone, sour
  drone(buf, 52.0, 1.6, Bb3, 0.03, { fadeIn: 0.1, fadeOut: 0.6 });
  // ...then near-silence (the falter), and two hesitant, uncertain notes:
  marimba(buf, 54.6, 0.9, D4, 0.04);
  marimba(buf, 55.7, 0.9, E4, 0.038);

  // ── 10) Сброс 57–63 — stripped to a clean low drone + single notes ────────
  drone(buf, 57.0, 6.2, C3, 0.045, { fadeIn: 1.8, fadeOut: 1.4 }); // clean slate
  feltPiano(buf, 58.0, 2.6, C4, 0.08, 1.0);
  feltPiano(buf, 60.6, 2.2, E4, 0.07, 1.1);

  // ── 11) Переопределение 63–69 — theme returns, confident, additive ────────
  drone(buf, 63.0, 6.4, C3, 0.045, { fadeIn: 1.0, fadeOut: 1.2 });
  drone(buf, 63.5, 5.6, G3, 0.03, { fadeIn: 1.4, fadeOut: 1.2 });
  drone(buf, 64.6, 4.4, E4, 0.022, { fadeIn: 1.8, fadeOut: 1.2 });
  const redefine = [
    [63.2, C4, 0.05], [63.9, E4, 0.055], [64.6, G4, 0.06],
    [65.5, A4, 0.065], [66.2, G4, 0.06], [66.9, C5, 0.07], [67.6, E5, 0.072],
  ];
  for (const [t0, f, a] of redefine) marimba(buf, t0, 0.85, f, a);
  pianoChord(buf, 68.0, 2.0, [C4, E4, G4], 0.06, 1.1);

  // ── 12) Сайт собирает 69–75 — warm build to a modest peak ─────────────────
  drone(buf, 69.0, 6.4, C3, 0.05, { fadeIn: 0.8, fadeOut: 1.2 });
  drone(buf, 69.0, 6.4, G3, 0.04, { fadeIn: 1.0, fadeOut: 1.2 });
  drone(buf, 69.2, 6.0, E4, 0.03, { fadeIn: 1.2, fadeOut: 1.2 });
  drone(buf, 69.4, 5.6, C4, 0.028, { fadeIn: 1.2, fadeOut: 1.2 });
  drone(buf, 70.2, 4.6, C5, 0.02, { fadeIn: 1.6, fadeOut: 1.2 });
  const buildPat = [C4, E4, G4, A4, C5, A4, G4, E4];
  let j = 0;
  for (let t = 69.0; t < 74.6; t += 0.5, j++) {
    const a = 0.045 + 0.035 * ((t - 69.0) / 5.6); // grow toward the peak
    marimba(buf, t, 0.6, buildPat[j % buildPat.length], a);
  }
  pianoChord(buf, 70.0, 2.2, [C4, E4, G4], 0.055, 1.1);
  pianoChord(buf, 72.0, 2.0, [G3, C4, E4, G4], 0.06, 1.1);
  pianoChord(buf, 73.6, 1.8, [C4, E4, G4, C5], 0.07, 1.0); // modest peak

  // ── 13) Этот фильм… 75–78 — clean C-major resolve (+ resolve SFX), settle ─
  pianoChord(buf, 75.0, 2.6, [C3, C4, E4, G4, C5], 0.08, 0.6, 0.035);
  drone(buf, 75.0, 3.0, C3, 0.05, { fadeIn: 0.1, fadeOut: 2.6 });
  drone(buf, 75.1, 2.9, G3, 0.03, { fadeIn: 0.2, fadeOut: 2.6 });
  feltPiano(buf, 76.5, 1.5, C5, 0.05, 1.2); // a last soft chime with the SFX

  softClip(buf);
  normalize(buf, 0.62); // headroom; Remotion lowers further to ~0.3 in FilmAudio
  return writeWav("bed.wav", buf);
}

// ════════════════════════════════════════════════════════════════════════════
// SFX — diegetic one-shots, unchanged. Pinned to story beats in FilmAudio.tsx.
// ════════════════════════════════════════════════════════════════════════════

// sfx-open.wav — soft rising felt-piano dyad (the film begins)
function buildOpen() {
  const buf = new Float32Array(Math.round(1.8 * SR));
  feltPiano(buf, 0.0, 1.8, G3, 0.32, 1.5);
  feltPiano(buf, 0.18, 1.6, C4, 0.34, 1.5);
  feltPiano(buf, 0.18, 1.6, E4, 0.18, 1.5);
  softClip(buf);
  normalize(buf, 0.72);
  return writeWav("sfx-open.wav", buf);
}

// sfx-barrier.wav — soft woody thunk / seal (the barrier holds & releases)
function buildBarrier() {
  const buf = new Float32Array(Math.round(0.5 * SR));
  for (let n = 0; n < buf.length; n++) {
    const t = n / SR;
    const body = Math.sin(TAU * 72 * t) * Math.exp(-t * 13);
    const knock = 0.5 * Math.sin(TAU * 144 * t) * Math.exp(-t * 22);
    let seed = 0.12345;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280 - 0.5;
    const click = t < 0.005 ? 0.4 * rnd() * (1 - t / 0.005) : 0;
    buf[n] = body + knock + click;
  }
  softClip(buf);
  normalize(buf, 0.62);
  return writeWav("sfx-barrier.wav", buf);
}

// sfx-qa-fork.wav — struck tuning-fork ding (Камертон)
function buildFork() {
  const buf = new Float32Array(Math.round(2.8 * SR));
  const f0 = 528.0; // bright, clear fork (~C5)
  const attack = 0.003;
  for (let n = 0; n < buf.length; n++) {
    const t = n / SR;
    const env = (1 - Math.exp(-t / attack)) * Math.exp(-t * 1.4);
    const s =
      Math.sin(TAU * f0 * t) +
      0.85 * Math.sin(TAU * (f0 + 0.7) * t) +
      0.12 * Math.sin(TAU * f0 * 2 * t) * Math.exp(-t * 3);
    buf[n] = env * s;
  }
  softClip(buf);
  normalize(buf, 0.7);
  return writeWav("sfx-qa-fork.wav", buf);
}

// sfx-resolve.wav — gentle resolving C-major chord (site / film resolves)
function buildResolve() {
  const buf = new Float32Array(Math.round(3.5 * SR));
  const chord = [C4, E4, G4, C5];
  chord.forEach((f, i) => feltPiano(buf, i * 0.06, 3.4, f, 0.22, 0.95));
  feltPiano(buf, 0.0, 3.4, C3, 0.12, 0.8);
  softClip(buf);
  normalize(buf, 0.72);
  return writeWav("sfx-resolve.wav", buf);
}

// ── run ──────────────────────────────────────────────────────────────────────
const results = [buildBed(), buildOpen(), buildBarrier(), buildFork(), buildResolve()];
for (const r of results) {
  console.log(`${r.name.padEnd(18)} ${(r.bytes / 1024).toFixed(1)} KB`);
}
