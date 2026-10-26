import React from 'react';
import { motion } from 'framer-motion';

// Authentic radiating dashed sprinkles halo behind the mascot as seen on Josh W. Comeau's site
export const RadiatingSprinkles = () => {
  // Center of radiation (relative to the boy's chest/head)
  const cx = 260;
  const cy = 200;
  const dashLength = 16;

  // Rays radiating outward around the boy with varying angles, distances, and colors
  const rays = [
    // Far left
    { angle: -158, dashes: [{ d: 115, c: '#1e1b4b' }, { d: 142, c: '#ec4899' }, { d: 168, c: '#2563eb' }] },
    { angle: -142, dashes: [{ d: 120, c: '#1e3a8a' }, { d: 146, c: '#db2777' }, { d: 172, c: '#2563eb' }] },
    // Mid left
    { angle: -126, dashes: [{ d: 130, c: '#2563eb' }, { d: 156, c: '#f43f5e' }, { d: 182, c: '#7c3aed' }] },
    { angle: -110, dashes: [{ d: 135, c: '#1e1b4b' }, { d: 160, c: '#ec4899' }] },
    // Top left & top
    { angle: -95,  dashes: [{ d: 140, c: '#2563eb' }, { d: 166, c: '#db2777' }] },
    { angle: -80,  dashes: [{ d: 142, c: '#7c3aed' }, { d: 168, c: '#2563eb' }] },
    { angle: -65,  dashes: [{ d: 138, c: '#db2777' }, { d: 164, c: '#1e1b4b' }] },
    // Top right
    { angle: -48,  dashes: [{ d: 132, c: '#2563eb' }, { d: 158, c: '#ec4899' }, { d: 184, c: '#7c3aed' }] },
    { angle: -32,  dashes: [{ d: 124, c: '#ec4899' }, { d: 150, c: '#2563eb' }] },
    // Far right
    { angle: -16,  dashes: [{ d: 118, c: '#1e1b4b' }, { d: 144, c: '#f43f5e' }, { d: 170, c: '#2563eb' }] },
    { angle: 0,    dashes: [{ d: 112, c: '#2563eb' }, { d: 138, c: '#db2777' }] },
    { angle: 16,   dashes: [{ d: 112, c: '#1e1b4b' }, { d: 138, c: '#ec4899' }] }
  ];

  return (
    <div className="radiating-sprinkles-wrap" aria-hidden="true">
      <svg
        viewBox="0 0 520 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="radiating-sprinkles-svg"
      >
        {rays.map((ray, rayIdx) => {
          const rad = (ray.angle * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);

          return ray.dashes.map((dash, dashIdx) => {
            const x1 = cx + dash.d * cos;
            const y1 = cy + dash.d * sin;
            const x2 = cx + (dash.d + dashLength) * cos;
            const y2 = cy + (dash.d + dashLength) * sin;

            return (
              <motion.line
                key={`${rayIdx}-${dashIdx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={dash.c}
                strokeWidth={5}
                strokeLinecap="round"
                initial={{ opacity: 0.85, scale: 1 }}
                animate={{
                  opacity: [0.75, 1, 0.75],
                  scale: [1, 1.06, 1]
                }}
                transition={{
                  duration: 2.8 + ((rayIdx + dashIdx) % 3) * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (rayIdx * 0.08)
                }}
              />
            );
          });
        })}
      </svg>
    </div>
  );
};
