/**
 * GT3 RS performance mark — geometry generator.
 *
 * The signature is authored here as code, not traced from an image:
 * letters are built from centre-line skeletons (offset into outlines) or
 * explicit polygons, slanted, then every corner is rounded. Output:
 *   - src/components/brand/mark-geometry.ts  (paths for the animated component)
 *   - public/brand/gt3rs-performance-mark.svg (static file)
 *
 * Usage: node scripts/generate-mark.mjs [--preview out.png]
 *
 * This is an original concept mark for an independent study — not an
 * official Porsche logo.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const H = 100; // cap height
const W2 = 10; // half stroke weight (stroke = 20)
const SLANT = Math.tan((24 * Math.PI) / 180);
const BASE_Y = 30; // top margin inside the viewBox

// ── vector helpers ──────────────────────────────────────────────
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]);
const norm = (a) => mul(a, 1 / (len(a) || 1));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const leftNormal = (d) => [d[1], -d[0]]; // y-down screen space
const r2 = (n) => Math.round(n * 100) / 100;

/** Offsets an open centre-line polyline into a closed outline with mitred joins. */
function strokeOutline(points, radii) {
  const left = [];
  const right = [];
  const leftR = [];
  const rightR = [];
  const END_R = 2.5;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const dIn = i > 0 ? norm(sub(p, points[i - 1])) : null;
    const dOut = i < points.length - 1 ? norm(sub(points[i + 1], p)) : null;
    let offset;
    if (dIn && dOut) {
      const m = norm(add(leftNormal(dIn), leftNormal(dOut)));
      offset = mul(m, W2 / dot(m, leftNormal(dIn)));
      const rc = radii[i] ?? 0;
      const outer = rc + W2;
      const inner = Math.max(rc - W2, 1.5);
      const rightTurn = cross(dIn, dOut) > 0;
      leftR.push(rightTurn ? outer : inner);
      rightR.push(rightTurn ? inner : outer);
    } else {
      offset = mul(leftNormal(dIn ?? dOut), W2);
      leftR.push(END_R);
      rightR.push(END_R);
    }
    left.push(add(p, offset));
    right.push(sub(p, offset));
  }
  return { points: [...left, ...right.reverse()], radii: [...leftR, ...rightR.reverse()] };
}

/** Italic lean: shift x by height above the baseline. */
const slant = ([x, y]) => [x + (H - y) * SLANT, y];
const place =
  (dx) =>
  ([x, y]) => [x + dx, y + BASE_Y];

/** Closed polygon with per-vertex rounded corners (quadratic joins). */
function roundedPath(points, radii) {
  const n = points.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const cur = points[i];
    const next = points[(i + 1) % n];
    const toPrev = sub(prev, cur);
    const toNext = sub(next, cur);
    const r = Math.min(radii[i] ?? 0, len(toPrev) / 2, len(toNext) / 2);
    const a = add(cur, mul(norm(toPrev), r));
    const b = add(cur, mul(norm(toNext), r));
    d += i === 0 ? `M${r2(a[0])} ${r2(a[1])}` : `L${r2(a[0])} ${r2(a[1])}`;
    d += `Q${r2(cur[0])} ${r2(cur[1])} ${r2(b[0])} ${r2(b[1])}`;
  }
  return `${d}Z`;
}

function letterFromSkeleton(skeleton, radii, dx) {
  const outline = strokeOutline(skeleton, radii);
  const pts = outline.points.map(slant).map(place(dx));
  return roundedPath(pts, outline.radii);
}

function letterFromPolygon(polygon, radii, dx) {
  const pts = polygon.map(slant).map(place(dx));
  return roundedPath(pts, radii);
}

// ── letterforms (upright design space: x →, y ↓, cap height 100) ──
const T = W2 * 2;
const c = W2; // centre-line inset

// G — wide bowl, terminal bar turning back inward.
const G = (dx) =>
  letterFromSkeleton(
    [
      [178, c],
      [c, c],
      [c, H - c],
      [168, H - c],
      [168, 52],
      [96, 52],
    ],
    [0, 40, 40, 18, 4, 0],
    dx,
  );

// T — long cross-bar, offset stem.
const Tl = (dx) =>
  letterFromPolygon(
    [
      [0, 0],
      [158, 0],
      [158, T],
      [92, T],
      [92, H],
      [70, H],
      [70, T],
      [0, T],
    ],
    [2, 6, 2, 4, 2, 2, 4, 2],
    dx,
  );

// 3 — flat top, waisted middle bar, full lower bowl.
const Three = (dx) => {
  const w = 150;
  return letterFromPolygon(
    [
      [0, 0],
      [w, 0],
      [w, 42],
      [w - 9, 50],
      [w, 58],
      [w, H],
      [0, H],
      [0, H - T],
      [w - T, H - T],
      [w - T, 60],
      [44, 60],
      [44, 40],
      [w - T, 40],
      [w - T, T],
      [0, T],
    ],
    [2, 34, 6, 4, 6, 34, 2, 2, 14, 4, 2, 2, 4, 14, 2],
    dx,
  );
};

// R — open bowl, leg sweeping out from the middle bar.
const R = (dx) =>
  letterFromSkeleton(
    [
      [c, H],
      [c, c],
      [146, c],
      [146, 52],
      [66, 52],
      [140, H],
    ],
    [0, 4, 34, 22, 2, 0],
    dx,
  );

// S — squared S with generous radii.
const S = (dx) =>
  letterFromSkeleton(
    [
      [180, c],
      [c, c],
      [c, 50],
      [176 - c, 50],
      [176 - c, H - c],
      [0, H - c],
    ],
    [0, 40, 22, 22, 40, 0],
    dx,
  );

// Horizontal layout (design units). Extra air between "GT3" and "RS".
const layout = [
  { id: "g", build: G, dx: 0 },
  { id: "t", build: Tl, dx: 196 },
  { id: "three", build: Three, dx: 362 },
  { id: "r", build: R, dx: 548 },
  { id: "s", build: S, dx: 716 },
];

const letters = layout.map(({ id, build, dx }) => ({ id, d: build(dx) }));

// ── speed stripes (final coordinates) ──
const y0 = BASE_Y + H; // baseline
// Red: sweeps up under the G's lower-left, then runs long and thins out.
const red = [
  `M${r2(30)} ${r2(y0 - 46)}`,
  `Q${r2(6)} ${r2(y0 + 4)} ${r2(70)} ${r2(y0 + 10)}`,
  `L${r2(948)} ${r2(y0 + 12)}`,
  `L${r2(962)} ${r2(y0 + 14.5)}`,
  `L${r2(66)} ${r2(y0 + 19)}`,
  `Q${r2(-14)} ${r2(y0 + 14)} ${r2(30)} ${r2(y0 - 46)}`,
  "Z",
].join("");
// Yellow: shorter, thinner, set below and to the right.
const yellow = [
  `M${r2(470)} ${r2(y0 + 26)}`,
  `Q${r2(482)} ${r2(y0 + 22)} ${r2(520)} ${r2(y0 + 22)}`,
  `L${r2(950)} ${r2(y0 + 20.5)}`,
  `L${r2(936)} ${r2(y0 + 24.5)}`,
  "Z",
].join("");

const stripes = [
  { id: "red", d: red },
  { id: "yellow", d: yellow },
];

// Centre-lines used to draw the stripes progressively (mask strokes).
const stripeGuides = {
  red: `M30 ${y0 - 40} Q8 ${y0 + 6} 70 ${y0 + 14} L962 ${y0 + 14}`,
  yellow: `M470 ${y0 + 24} L950 ${y0 + 22}`,
};

const viewBox = { x: -24, y: 0, width: 1012, height: y0 + 40 };

// ── outputs ──
const COLORS = { ink: "#0b0b0b", red: "#c8102e", yellow: "#f2b705" };

const ts = `/* Generated by scripts/generate-mark.mjs — do not edit by hand. */
/* Original concept geometry for an independent study; not an official Porsche mark. */

export const markViewBox = ${JSON.stringify(viewBox)} as const;

export const markLetters = ${JSON.stringify(letters, null, 2)} as const;

export const markStripes = ${JSON.stringify(stripes, null, 2)} as const;

export const markStripeGuides = ${JSON.stringify(stripeGuides, null, 2)} as const;

export const markColors = ${JSON.stringify(COLORS)} as const;
`;

const vb = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-labelledby="title">
  <title id="title">GT3 RS — concept performance signature (AKLIO Studio study)</title>
  <g fill="${COLORS.ink}">
${letters.map((l) => `    <path id="${l.id}" d="${l.d}"/>`).join("\n")}
  </g>
  <path id="stripe-red" fill="${COLORS.red}" d="${red}"/>
  <path id="stripe-yellow" fill="${COLORS.yellow}" d="${yellow}"/>
</svg>
`;

const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
};
write("src/components/brand/mark-geometry.ts", ts);
write("public/brand/gt3rs-performance-mark.svg", svg);
console.log("mark written");

const previewIndex = process.argv.indexOf("--preview");
if (previewIndex > -1) {
  const out = process.argv[previewIndex + 1] ?? "mark-preview.png";
  const { default: sharp } = await import("sharp");
  const onLight = svg.replace(
    "<g fill",
    '<rect x="-24" y="0" width="1012" height="200" fill="#fff"/>\n  <g fill',
  );
  await sharp(Buffer.from(onLight), { density: 220 }).png().toFile(out);
  console.log("preview", out);
}
