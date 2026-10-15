import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FiSettings } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/soundEffects';

const PALETTE = [
  '#ec4899', // bright pink
  '#d946ef', // fuchsia
  '#a855f7', // purple
  '#8b5cf6', // violet
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#fbbf24', // amber
];

export const GenerativeCanvas = ({ onTriggerSparkles }) => {
  const canvasRef = useRef(null);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000));
  const [isRotating, setIsRotating] = useState(false);

  const drawCanvas = useCallback((currentSeed) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width; // 2000
    const height = canvas.height; // 1040

    ctx.clearRect(0, 0, width, height);

    // Origin: centered horizontally, situated at the base of the mascot's head
    const centerX = width / 2;
    const centerY = height * 0.78;

    const count = 38;
    const rng = (i) => {
      const x = Math.sin(currentSeed * 997.13 + i * 43.19) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      // Radiate in an arch around the head (from top-left -145deg to top-right +145deg)
      const ratio = i / (count - 1);
      const baseAngle = -Math.PI * 0.88 + ratio * (Math.PI * 0.76);
      const jitterAngle = (rng(i * 3 + 1) - 0.5) * 0.22;
      const angle = baseAngle + jitterAngle;

      // 3 concentric radial rings
      const ring = i % 3;
      const baseRadius = ring === 0 ? 230 : ring === 1 ? 380 : 530;
      const jitterRadius = (rng(i * 3 + 2) - 0.5) * 90;
      const radius = baseRadius + jitterRadius;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * (radius * 0.84);

      // Rectangles (confetti tiles)
      const rectW = 56 + rng(i * 4) * 36; // 56 - 92px in 2x space
      const rectH = 18 + rng(i * 4 + 1) * 8; // 18 - 26px in 2x space
      const rotation = angle + Math.PI / 2 + (rng(i * 4 + 2) - 0.5) * 0.55;

      const color = PALETTE[Math.floor(rng(i * 5) * PALETTE.length)];

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-rectW / 2, -rectH / 2, rectW, rectH, 5);
      } else {
        ctx.rect(-rectW / 2, -rectH / 2, rectW, rectH);
      }
      ctx.fill();
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    drawCanvas(seed);
  }, [seed, drawCanvas]);

  const handleEditArt = (e) => {
    e?.stopPropagation();
    setIsRotating(true);
    soundFx.playPop();
    const nextSeed = Math.floor(Math.random() * 10000);
    setSeed(nextSeed);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height * 0.4) / window.innerHeight;
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { x, y },
        colors: PALETTE
      });
    }

    setTimeout(() => {
      setIsRotating(false);
    }, 450);
  };

  return (
    <>
      {/* Canvas container matching Josh's inspect: .afruw7b > .a1mwec1d > canvas.cq0g9op */}
      <div className="hero-canvas-art-container" aria-hidden="true">
        <div className="hero-canvas-art-wrapper">
          <canvas
            ref={canvasRef}
            data-enable-interactive-features="true"
            width={2000}
            height={1040}
            className="hero-generative-canvas"
            style={{ width: '1000px', height: '520px' }}
          />
        </div>
      </div>

      {/* Settings gear button matching Josh's inspect: .e13rridy > .e1jn8qlp > button.wf3zp34 */}
      <div className="hero-settings-wrapper">
        <div className="hero-settings-inner" data-is-visible="true">
          <button
            type="button"
            className="hero-settings-btn"
            onClick={handleEditArt}
            title="Edit the generative art"
            aria-label="Edit the generative art"
          >
            <span
              className={`hero-settings-icon ${isRotating ? 'rotating' : ''}`}
              style={{ transform: isRotating ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1)' }}
            >
              <FiSettings size={18} />
            </span>
            <span className="hero-settings-text">Edit the generative art</span>
          </button>
        </div>
      </div>
    </>
  );
};
