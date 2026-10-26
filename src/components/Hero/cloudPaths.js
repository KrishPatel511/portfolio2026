// The three cloud layers of the home hero (viewBox 0 0 5120 456), drawn by src/utils/cloudShapes.js.
import { cloudPath } from '../../utils/cloudShapes';

const hill = (x, centre, spread, height) => -height * Math.exp(-(((x - centre) / spread) ** 2));

// Far clouds: high and soft
export const CLOUD_BACK = cloudPath({
  width: 5120,
  height: 456,
  base: 215,
  profile: (x) => hill(x, 2050, 520, 70) + hill(x, 3500, 600, 90),
  radius: [95, 190],
  lift: 0.95,
  seed: 11,
});

// Middle clouds
export const CLOUD_MID = cloudPath({
  width: 5120,
  height: 456,
  base: 275,
  profile: (x) => hill(x, 1850, 500, 90) + hill(x, 3350, 560, 110),
  radius: [90, 170],
  lift: 0.9,
  seed: 23,
});

// The white ground in front, with a hill on the left and a dip in the middle
export const CLOUD_FRONT_WIDE = cloudPath({
  width: 5120,
  height: 456,
  base: 330,
  profile: (x) => hill(x, 1850, 380, 150) + hill(x, 3300, 450, 70),
  radius: [80, 150],
  lift: 0.75,
  seed: 37,
});
