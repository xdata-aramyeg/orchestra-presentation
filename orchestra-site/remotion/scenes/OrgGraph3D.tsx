"use client";

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { COLORS, FONTS } from "../theme";
import { Caption } from "../components/Caption";

/**
 * Scene 2·5 — Структура в пространстве (the one 3D beat).
 *
 * The flat org-chart "lifts into space": the 7 role nodes of the team take
 * positions in 3D — the two build waves (Frontend ∥ Backend) spread on X, the
 * Lead/PM/Хроникёр above, the QA gate + Reviewer below — connected by lines, with
 * a slow orbit reveal. A vermilion BARRIER ring sits between the build wave and
 * QA (idle-during-QA called out). Then the film returns to 2D.
 *
 * FRAME-DETERMINISTIC: every transform is derived from useCurrentFrame(). There
 * is NO r3f useFrame() and NO realtime clock. The whole constellation is rotated
 * in plain JS (not a three <group>) so the 2D HTML labels can be projected with
 * the *same* transform + the same pinhole camera → labels stay glued to nodes.
 *
 * Modular: this file is the entire beat. Revert = drop it from Film.tsx and
 * restore the trimmed durations. Keep it cheap: one <ThreeCanvas>, 7 small
 * spheres, thin line geometry, 2 lights, standard materials.
 */

// ── camera (must match the projection math below exactly) ────────────────────
const CAM_Z = 8.5;
const FOV = 45;

type Slug =
  | "maestro"
  | "librettist"
  | "chronicler"
  | "scenographer"
  | "machinist"
  | "diapason"
  | "reviewer";

type Node3 = {
  slug: Slug;
  label: string;
  pos: readonly [number, number, number];
  /** Entrance frame (spring scale-in). */
  start: number;
  /** The single vermilion accent node — the conductor. */
  accent?: boolean;
  /** Bigger sphere (the Lead). */
  r: number;
};

// Hierarchy on Y, the two waves spread on X, depth on Z.
const NODES: readonly Node3[] = [
  { slug: "maestro", label: "ЛИД", pos: [0, 2.25, 0], start: 10, accent: true, r: 0.34 },
  { slug: "librettist", label: "PM", pos: [-2.45, 1.0, 0.2], start: 22, r: 0.26 },
  { slug: "chronicler", label: "ХРОНИКЁР", pos: [2.45, 1.0, 0.2], start: 28, r: 0.26 },
  { slug: "scenographer", label: "FRONTEND", pos: [-2.55, -0.45, 0], start: 36, r: 0.28 },
  { slug: "machinist", label: "BACKEND", pos: [2.55, -0.45, 0], start: 36, r: 0.28 },
  { slug: "diapason", label: "QA", pos: [0, -1.75, 0], start: 60, r: 0.28 },
  { slug: "reviewer", label: "REVIEWER", pos: [0, -2.9, -0.1], start: 80, r: 0.26 },
] as const;

type EdgeKind = "org" | "contract" | "flow";
type Edge = { a: Slug; b: Slug; kind: EdgeKind; start: number };

// org = ink reporting lines; contract = the shared frozen API (vermilion tie
// between the two waves); flow = the work flowing down THROUGH the barrier to
// QA, then to Reviewer (vermilion active path).
const EDGES: readonly Edge[] = [
  { a: "maestro", b: "librettist", kind: "org", start: 26 },
  { a: "maestro", b: "chronicler", kind: "org", start: 30 },
  { a: "maestro", b: "scenographer", kind: "org", start: 40 },
  { a: "maestro", b: "machinist", kind: "org", start: 40 },
  { a: "scenographer", b: "machinist", kind: "contract", start: 56 },
  { a: "scenographer", b: "diapason", kind: "flow", start: 94 },
  { a: "machinist", b: "diapason", kind: "flow", start: 94 },
  { a: "diapason", b: "reviewer", kind: "flow", start: 110 },
] as const;

const BARRIER_Y = -0.95;
const BARRIER_R = 3.15;

const POS = Object.fromEntries(NODES.map((n) => [n.slug, n.pos])) as Record<
  Slug,
  readonly [number, number, number]
>;

// ── deterministic math (shared by the 3D meshes AND the 2D label projection) ──

type Vec3 = [number, number, number];

/** Static X tilt + animated Y orbit, both pure functions of the frame. */
const orbit = (frame: number) => {
  const ry = interpolate(frame, [0, 150], [-0.5, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return { rx: 0.17, ry };
};

/** Rotate a point around X then Y (the constellation's own transform). */
const rotate = ([x, y, z]: readonly [number, number, number], rx: number, ry: number): Vec3 => {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y1 = y * cx - z * sx;
  const z1 = y * sx + z * cx;
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x2 = x * cy + z1 * sy;
  const z2 = -x * sy + z1 * cy;
  return [x2, y1, z2];
};

/** Pinhole projection matching ThreeCanvas camera at (0,0,CAM_Z), looking -Z. */
const project = (
  [x, y, z]: Vec3,
  width: number,
  height: number,
): { sx: number; sy: number; depth: number } => {
  const depth = CAM_Z - z;
  const t = Math.tan((FOV * Math.PI) / 360);
  const aspect = width / height;
  const ndcX = x / (depth * t * aspect);
  const ndcY = y / (depth * t);
  return {
    sx: (ndcX * 0.5 + 0.5) * width,
    sy: (0.5 - ndcY * 0.5) * height,
    depth,
  };
};

const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const edgeColor = (kind: EdgeKind) =>
  kind === "org" ? COLORS.ink : COLORS.vermilion;

// ── the 3D scene (inside ThreeCanvas; r3f intrinsic elements) ─────────────────

const Constellation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rx, ry } = orbit(frame);

  // barrier ring as a rotated circle of points → a clean line loop "gate".
  const barrierScale = spring({
    frame: frame - 66,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const ringPositions = new Float32Array(
    Array.from({ length: 65 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2;
      const r = BARRIER_R * Math.max(0.001, barrierScale);
      return rotate([Math.cos(a) * r, BARRIER_Y, Math.sin(a) * r], rx, ry);
    }).flat(),
  );

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 8]} intensity={1.3} />

      {/* edges (drawn first so spheres sit on top) */}
      {EDGES.map((e) => {
        const grow = interpolate(frame, [e.start, e.start + 24], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
        if (grow <= 0) return null;
        const a = rotate(POS[e.a], rx, ry);
        const b = rotate(POS[e.b], rx, ry);
        const end = lerp(a, b, grow);
        const positions = new Float32Array([...a, ...end]);
        const opacity = interpolate(grow, [0, 0.18], [0, 0.85], {
          extrapolateRight: "clamp",
        });
        return (
          <lineSegments key={`${e.a}-${e.b}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[positions, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={edgeColor(e.kind)}
              transparent
              opacity={opacity}
            />
          </lineSegments>
        );
      })}

      {/* the vermilion BARRIER ring */}
      {barrierScale > 0.01 ? (
        <lineLoop>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ringPositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={COLORS.vermilion}
            transparent
            opacity={interpolate(frame, [66, 88], [0, 0.9], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        </lineLoop>
      ) : null}

      {/* the 7 role nodes */}
      {NODES.map((n) => {
        const enter = spring({
          frame: frame - n.start,
          fps,
          config: { damping: 14, stiffness: 110 },
        });
        if (enter <= 0) return null;
        const [x, y, z] = rotate(n.pos, rx, ry);
        return (
          <mesh key={n.slug} position={[x, y, z]} scale={enter}>
            <sphereGeometry args={[n.r, 28, 28]} />
            <meshStandardMaterial
              color={n.accent ? COLORS.vermilion : COLORS.ink}
              roughness={0.55}
              metalness={0.05}
            />
          </mesh>
        );
      })}
    </>
  );
};

// ── 2D overlay: projected node labels + barrier callout + caption ─────────────

const Overlay = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { rx, ry } = orbit(frame);

  const headerOpacity = interpolate(frame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // barrier callout, projected onto the front of the ring
  const barrierPt = project(rotate([0, BARRIER_Y, BARRIER_R], rx, ry), width, height);
  const barrierOpacity =
    interpolate(frame, [74, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, [122, 140], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* chapter header (no numeric index — this is a spatial interlude) */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 100,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: headerOpacity,
        }}
      >
        <span
          style={{ width: 12, height: 12, borderRadius: 999, background: COLORS.vermilion }}
        />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: COLORS.inkMuted,
          }}
        >
          Структура в пространстве
        </span>
      </div>

      {/* node labels, glued to the projected sphere centres */}
      {NODES.map((n) => {
        const enter = interpolate(frame, [n.start + 4, n.start + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (enter <= 0.01) return null;
        const { sx, sy, depth } = project(rotate(n.pos, rx, ry), width, height);
        const depthScale = interpolate(depth, [6.5, 11], [1.12, 0.86], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={n.slug}
            style={{
              position: "absolute",
              left: sx,
              top: sy - 58 * depthScale,
              transform: "translate(-50%, -100%)",
              opacity: enter * interpolate(depth, [7, 11], [1, 0.7], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              fontFamily: FONTS.mono,
              fontSize: 22 * depthScale,
              letterSpacing: "0.08em",
              color: n.accent ? COLORS.vermilion : COLORS.inkSoft,
              fontWeight: n.accent ? 600 : 500,
              whiteSpace: "nowrap",
            }}
          >
            {n.label}
          </div>
        );
      })}

      {/* the BARRIER callout */}
      <div
        style={{
          position: "absolute",
          left: barrierPt.sx,
          top: barrierPt.sy,
          transform: "translate(-50%, 14px)",
          opacity: barrierOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 24,
            letterSpacing: "0.22em",
            color: COLORS.vermilion,
            fontWeight: 600,
          }}
        >
          БАРЬЕР
        </span>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 17,
            letterSpacing: "0.06em",
            color: COLORS.inkMuted,
          }}
        >
          QA слушает — волны ждут
        </span>
      </div>

      <Caption from={102} kicker="Оргграф · в 3D">
        Семь ролей, одна партитура: две волны строят параллельно, а барьер держит
        — пока QA слушает.
      </Caption>
    </AbsoluteFill>
  );
};

export const OrgGraph3D = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, CAM_Z], fov: FOV }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Constellation />
      </ThreeCanvas>
      <Overlay />
    </AbsoluteFill>
  );
};
