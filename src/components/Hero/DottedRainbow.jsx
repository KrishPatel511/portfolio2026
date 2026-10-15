import React from 'react';
import { motion } from 'framer-motion';

// Authentic whimsical bead/sparkle rainbow arch behind the 3D mascot
export const DottedRainbow = () => {
  // Coordinated to arch across ~380px directly behind the boy's head
  const dotPoints = [
    // Outer prominent arc (left to right)
    { cx: 35, cy: 190, r: 4.5, color: '#1e3a8a', delay: 0.1 },
    { cx: 65, cy: 155, r: 4.5, color: '#2563eb', delay: 0.15 },
    { cx: 100, cy: 125, r: 5, color: '#3b82f6', delay: 0.2 },
    { cx: 140, cy: 102, r: 5, color: '#6366f1', delay: 0.25 },
    { cx: 185, cy: 88, r: 5.5, color: '#8b5cf6', delay: 0.3 },
    { cx: 230, cy: 85, r: 5.5, color: '#ec4899', delay: 0.35 },
    { cx: 275, cy: 92, r: 5.5, color: '#db2777', delay: 0.4 },
    { cx: 315, cy: 108, r: 5, color: '#6366f1', delay: 0.45 },
    { cx: 350, cy: 132, r: 5, color: '#3b82f6', delay: 0.5 },
    { cx: 380, cy: 165, r: 4.5, color: '#2563eb', delay: 0.55 },
    { cx: 405, cy: 200, r: 4.5, color: '#1e3a8a', delay: 0.6 },

    // Middle arc
    { cx: 55, cy: 200, r: 4, color: '#ec4899', delay: 0.18 },
    { cx: 85, cy: 168, r: 4.5, color: '#db2777', delay: 0.22 },
    { cx: 120, cy: 142, r: 4.5, color: '#f43f5e', delay: 0.28 },
    { cx: 160, cy: 125, r: 5, color: '#ec4899', delay: 0.32 },
    { cx: 205, cy: 116, r: 5, color: '#8b5cf6', delay: 0.38 },
    { cx: 250, cy: 118, r: 5, color: '#6366f1', delay: 0.42 },
    { cx: 292, cy: 128, r: 5, color: '#3b82f6', delay: 0.48 },
    { cx: 330, cy: 148, r: 4.5, color: '#f43f5e', delay: 0.52 },
    { cx: 362, cy: 175, r: 4.5, color: '#db2777', delay: 0.58 },
    { cx: 388, cy: 205, r: 4, color: '#ec4899', delay: 0.62 },

    // Trailing lower sparkle beads (left & right)
    { cx: 25, cy: 220, r: 4, color: '#1e3a8a', delay: 0.1 },
    { cx: 40, cy: 224, r: 3.5, color: '#ec4899', delay: 0.14 },
    { cx: 55, cy: 226, r: 3.5, color: '#f43f5e', delay: 0.18 },
    { cx: 415, cy: 220, r: 4, color: '#1e3a8a', delay: 0.65 },
    { cx: 400, cy: 224, r: 3.5, color: '#ec4899', delay: 0.62 },
    { cx: 385, cy: 226, r: 3.5, color: '#f43f5e', delay: 0.58 },

    // Gentle accents
    { cx: 135, cy: 175, r: 4.5, color: '#2563eb', delay: 0.25 },
    { cx: 155, cy: 180, r: 4, color: '#ec4899', delay: 0.3 },
    { cx: 295, cy: 175, r: 4.5, color: '#2563eb', delay: 0.5 },
    { cx: 275, cy: 180, r: 4, color: '#ec4899', delay: 0.45 }
  ];

  return (
    <div className="dotted-rainbow-wrap" aria-hidden="true">
      <svg
        viewBox="0 0 440 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="dotted-rainbow-svg"
      >
        {dotPoints.map((dot, index) => (
          <motion.circle
            key={index}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={dot.color}
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.85, 1, 0.85],
              y: [0, -3, 0]
            }}
            transition={{
              duration: 3.2 + (index % 4) * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: dot.delay
            }}
          />
        ))}
      </svg>
    </div>
  );
};
