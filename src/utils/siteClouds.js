// Cloud edges for the footer and the search panel, drawn by cloudShapes.js.
import { cloudPath } from './cloudShapes';

// The page colour hanging down into the footer (viewBox 0 0 5120 337)
export const FOOTER_CEILING = cloudPath({
  width: 5120,
  height: 337,
  base: 160,
  profile: (x) => 28 * Math.sin(x / 520),
  radius: [85, 175],
  lift: 0.85,
  hanging: true,
  seed: 5,
});

// The soft cloud along the bottom of the footer (viewBox 0 0 1557 213)
export const FOOTER_BOTTOM = cloudPath({
  width: 1557,
  height: 213,
  base: 110,
  profile: (x) => -30 * Math.sin(x / 260),
  radius: [60, 130],
  lift: 0.8,
  seed: 9,
});

// The cloud hanging off the search panel (viewBox 0 0 4113 146)
export const SEARCH_CLOUD = cloudPath({
  width: 4113,
  height: 146,
  base: 70,
  profile: (x) => 16 * Math.sin(x / 400),
  radius: [60, 140],
  lift: 0.6,
  hanging: true,
  seed: 3,
});
