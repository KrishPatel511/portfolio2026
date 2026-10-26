/* Draws the site's clouds as SVG paths, from a few numbers.

   A cloud edge is a row of round bumps. Each bump gets a random width and height (from a seeded
   generator, so the result is the same on the server and in the browser), and the whole edge
   rises and falls gently along a profile. Nothing here is traced from an image. */

const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const round = (n) => Math.round(n * 10) / 10;

/* Options:
     width, height   the size of the picture (its viewBox)
     base            the average height of the edge
     profile(x)      how much the edge is lifted at x (negative = higher); default flat
     radius [min,max]  the half-width of a bump
     lift            how tall a bump is compared to its half-width
     seed            any number; change it for a different cloud
     hanging         true: the cloud hangs from the top edge (bumps point down) */
export function cloudPath({ width, height, base, profile = () => 0, radius = [80, 160], lift = 0.8, seed = 1, hanging = false }) {
  const next = rng(seed);
  const pts = [];
  let x = -60;
  while (x < width + 60) {
    const r = radius[0] + next() * (radius[1] - radius[0]);
    const y = base + profile(x + r);
    pts.push({ x0: x, x1: x + 2 * r, y, h: r * lift * (0.7 + next() * 0.6) });
    x += 2 * r;
  }

  // Build the outline: along the bumpy edge, then close it along the bottom (or top, if hanging)
  const flip = (y) => (hanging ? height - y : y);
  let d = `M${round(pts[0].x0)} ${round(hanging ? 0 : height)} L${round(pts[0].x0)} ${round(flip(pts[0].y))}`;
  for (const p of pts) {
    const up = hanging ? p.h : -p.h;
    const y0 = flip(p.y);
    d += ` C${round(p.x0)} ${round(y0 + up * 1.33)} ${round(p.x1)} ${round(y0 + up * 1.33)} ${round(p.x1)} ${round(y0)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L${round(last.x1)} ${round(hanging ? 0 : height)} Z`;
  return d;
}
