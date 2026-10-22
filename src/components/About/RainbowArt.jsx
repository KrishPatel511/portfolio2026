import React, { useCallback, useEffect, useId, useMemo, useReducer, useRef, useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import './RainbowArt.css';

/* ==========================================================================
   Generative rainbow behind the hero mascot, plus the "Rainbow Configurator".
   A port of the interaction on joshwcomeau.com: a canvas of dashes laid out on
   concentric arcs, steered by the mouse, with a small panel to tweak it.
   ========================================================================== */

/* ─── tiny math helpers ──────────────────────────────────────────────────── */

const normalize = (v, a, b, c = 0, d = 1) => ((v - a) / (b - a)) * (d - c) + c;
const clamp = (v, lo = 0, hi = 1) => Math.max(Math.min(lo, hi), Math.min(Math.max(lo, hi), v));
const mapClamped = (v, a, b, c = 0, d = 1) => clamp(normalize(v, a, b, c, d), c, d);
const lerp = (a, b, t) => a * (1 - t) + b * t;
const sample = (list) => list[Math.floor(Math.random() * list.length)];
const randomBetween = (lo, hi, rounded = true) => {
  const r = Math.random() * (hi - lo);
  return rounded ? Math.floor(r) + lo : r + lo;
};
const snap = (v, step) => Math.round(v / step) * step;
const wrap = (v, min, max) => {
  let offset = 0;
  let lo = min;
  let hi = max;
  let x = v;
  if (lo < 0) { offset = Math.abs(lo); lo = 0; hi += offset; x += offset; }
  const range = hi - lo;
  const m = x % range;
  return (m < 0 ? m + range : m) - offset;
};
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* A critically-tuned damped spring, stepped with small sub-steps so it stays stable. */
const stepSpring = (pos, vel, target, tension, friction, dt) => {
  const steps = Math.max(1, Math.ceil(dt / 0.004));
  const h = dt / steps;
  let p = pos;
  let v = vel;
  for (let i = 0; i < steps; i++) {
    v += (-tension * (p - target) - friction * v) * h;
    p += v * h;
  }
  return [p, v];
};

/* ─── state ──────────────────────────────────────────────────────────────── */

const DEFAULTS = {
  lineWidth: 0,
  lineLength: 0.25,
  density: 55,
  numOfRows: 10,
  linecap: 'round',
  shape: 'line',
  springiness: 75,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TWEAK':
      return { ...state, ...action.payload };
    case 'RESET':
      return DEFAULTS;
    default:
      return state;
  }
};

const randomValues = () => ({
  lineWidth: randomBetween(-1, 1, false),
  lineLength: randomBetween(-1, 1, false),
  density: sample([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
  numOfRows: sample([2, 3, 3, 5, 5, 7, 8, 8, 8, 8, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]),
  linecap: sample(['round', 'square']),
  shape: sample(['line', 'circle']),
  springiness: randomBetween(0, 100),
});

/* ─── canvas ─────────────────────────────────────────────────────────────── */

const WIDTH = 1000;
const HEIGHT = 520;

/* [hue, saturation, lightness] per row, light theme → dark theme */
const PALETTE = {
  light: [[340, 100, 50], [340, 100, 50], [310, 100, 40], [310, 100, 40], [270, 100, 40], [270, 100, 40], [240, 100, 30], [240, 100, 30], [230, 100, 20], [230, 100, 20]],
  dark: [[350, 100, 55], [350, 100, 55], [50, 100, 50], [50, 100, 50], [150, 100, 50], [150, 100, 50], [240, 100, 70], [240, 100, 70], [270, 100, 80], [270, 100, 80]],
};

const rowColor = (row, rows, lightRatio) => {
  const n = Math.floor(normalize(row, 0, rows, 0, rows === 8 ? 8 : 10));
  const hue = Math.round(normalize(lightRatio, 1, 0, PALETTE.light[n][0] + 360, PALETTE.dark[n][0] + 360)) - 360;
  const sat = normalize(lightRatio, 1, 0, PALETTE.light[n][1], PALETTE.dark[n][1]);
  const lit = normalize(lightRatio, 1, 0, PALETTE.light[n][2], PALETTE.dark[n][2]);
  return `hsl(${hue}deg ${sat}% ${lit}%)`;
};

const blendAngles = (a, b, t) => {
  const na = normalize(a, -Math.PI, Math.PI, 0, 100);
  const nb = normalize(b, -Math.PI, Math.PI, 0, 100);
  return normalize(na * (1 - t) + nb * t, 0, 100, -Math.PI, Math.PI);
};

const drawRainbow = (ctx, o) => {
  const {
    mountAt, mouseRatio, lightRatio, interactive, editing, mouse,
    lineWidth, lineLength, density, numOfRows, linecap, shape,
  } = o;

  const elapsed = Date.now() - (mountAt + 200);
  const phase = elapsed < 2000 && interactive ? 'enter' : 'default';
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const spacing = normalize(density, 0, 100, 450, 115);
  const yFactor = normalize(numOfRows, 3, 10, 1.2, 1.325);
  const cx = 0.5 * WIDTH;
  const cy = HEIGHT * yFactor;
  const baseRadius = 0.4 * WIDTH;
  const width = normalize(lineWidth, -1, 1, shape === 'line' ? 18 : 25, 2);
  const length = normalize(lineLength, -1, 1, 4, 40);

  ctx.lineWidth = width;
  ctx.lineCap = linecap;

  for (let row = 0; row < numOfRows; row++) {
    const radius = baseRadius + 100 * row * 0.1575;
    const step = spacing / (2 * Math.PI * radius);
    const start = Math.PI;
    const end = 2 * Math.PI;
    ctx.strokeStyle = rowColor(row, numOfRows, lightRatio);

    for (let a = start; a < end; a += step) {
      if (phase === 'enter' && normalize(a, start, end, 0, 1) > normalize(elapsed, 0, 2000, 0, 1)) continue;

      const x = cx + radius * Math.cos(a);
      const y = cy + radius * Math.sin(a);
      const dx = mouse.x - x;
      let toMouse = Math.atan2(mouse.y - y, dx);
      let tangent = wrap(a + 0.5 * Math.PI, -Math.PI, Math.PI);
      if (dx > 0) toMouse -= Math.PI;
      toMouse = wrap(toMouse - Math.PI, -Math.PI, Math.PI);

      if (shape === 'line') {
        const angle = blendAngles(tangent, toMouse, mouseRatio);
        const half = 0.5 * length;
        const ox = half * Math.cos(angle);
        const oy = half * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(x - ox, y - oy);
        ctx.lineTo(x + ox, y + oy);
        ctx.stroke();
        ctx.closePath();
      } else {
        let target = mouse;
        if (editing) {
          const home = { x: 0.2 * WIDTH, y: 0.5 * HEIGHT };
          target = {
            x: clamp(normalize(mouseRatio, 0, 1, home.x, mouse.x), Math.min(home.x, mouse.x), Math.max(home.x, mouse.x)),
            y: clamp(normalize(mouseRatio, 0, 1, home.y, mouse.y), Math.min(home.y, mouse.y), Math.max(home.y, mouse.y)),
          };
        }
        const dist = Math.sqrt((target.x - x) ** 2 + (target.y - y) ** 2);
        const half = 0.5 * length;
        let p1;
        let p2;
        if (dist <= 300) {
          const k = clamp(normalize(dist, 0, 300, 1, 0), 0, 1);
          const vx = ((x - target.x) * half) / dist;
          const vy = ((y - target.y) * half) / dist;
          p1 = { x: x - vx * k, y: y - vy * k };
          p2 = { x: x + vx * k, y: y + vy * k };
        } else {
          const tx = 0.01 * Math.cos(tangent);
          const ty = 0.01 * Math.sin(tangent);
          p1 = { x: x - tx, y: y - ty };
          p2 = { x: x + tx, y: y + ty };
        }
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
};

const RainbowCanvas = ({ settings, isDark, interactive, trackingDisabled, editing }) => {
  const canvasRef = useRef(null);
  const live = useRef({});
  const [dpr, setDpr] = useState(() => (typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1));

  // keep the latest props visible to the animation loop without restarting it
  live.current.settings = settings;
  live.current.interactive = interactive;
  live.current.trackingDisabled = trackingDisabled;
  live.current.editing = editing;
  live.current.lightTarget = isDark ? 0 : 1;
  live.current.dirty = true;

  useEffect(() => {
    const onResize = () => setDpr(window.devicePixelRatio || 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const sim = {
      mx: -1000, my: -1000, vx: 0, vy: 0,
      mouse: 0, mouseV: 0,
      light: live.current.lightTarget, lightV: 0,
      inside: false,
      mountAt: Date.now(),
    };
    live.current.sim = sim;

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const buffer = live.current.settings.shape === 'line' ? 100 : 220;
      const inside = e.clientX >= rect.left - buffer && e.clientX <= rect.right + buffer
        && e.clientY >= rect.top - buffer && e.clientY <= rect.bottom + buffer;
      if (!inside) { sim.inside = false; return; }
      sim.inside = true;
      sim.tx = e.clientX - rect.left;
      sim.ty = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { settings: s, interactive: canInteract, trackingDisabled: off, editing: edit } = live.current;

      const friction = normalize(s.springiness, 0, 100, 50, 12) || 20;
      if (typeof sim.tx === 'number') {
        [sim.mx, sim.vx] = stepSpring(sim.mx === -1000 ? sim.tx : sim.mx, sim.vx, sim.tx, 300, friction, dt);
        [sim.my, sim.vy] = stepSpring(sim.my === -1000 ? sim.ty : sim.my, sim.vy, sim.ty, 300, friction, dt);
      }
      const mouseTarget = sim.inside && canInteract && !off ? 1 : 0;
      [sim.mouse, sim.mouseV] = stepSpring(sim.mouse, sim.mouseV, mouseTarget, 170, 26, dt);
      [sim.light, sim.lightV] = stepSpring(sim.light, sim.lightV, live.current.lightTarget, 170, 26, dt);

      const moving = Math.abs(sim.mouse - mouseTarget) > 0.002 || Math.abs(sim.mouseV) > 0.01
        || Math.abs(sim.light - live.current.lightTarget) > 0.002 || Math.abs(sim.lightV) > 0.01
        || (typeof sim.tx === 'number' && (Math.abs(sim.mx - sim.tx) > 0.2 || Math.abs(sim.vx) > 0.2 || Math.abs(sim.my - sim.ty) > 0.2 || Math.abs(sim.vy) > 0.2));
      const intro = canInteract && Date.now() - sim.mountAt < 2300;

      if (moving || intro || live.current.dirty) {
        live.current.dirty = false;
        ctx.setTransform(live.current.dpr, 0, 0, live.current.dpr, 0, 0);
        drawRainbow(ctx, {
          mountAt: sim.mountAt,
          mouseRatio: clamp(sim.mouse, 0, 1),
          lightRatio: clamp(sim.light, 0, 1),
          interactive: canInteract,
          editing: edit,
          mouse: { x: sim.mx, y: sim.my },
          ...s,
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dpr]);

  live.current.dpr = dpr;

  return (
    <canvas
      ref={canvasRef}
      className="rb-canvas"
      width={WIDTH * dpr}
      height={HEIGHT * dpr}
      style={{ width: WIDTH, height: HEIGHT }}
      aria-hidden="true"
    />
  );
};

/* ─── panel controls ─────────────────────────────────────────────────────── */

const coverDelay = (stage) => `${(stage - 1) * 100 + 700}ms`;

const Covers = ({ stage = 1 }) => {
  const delay = { animationDelay: coverDelay(stage) };
  return (
    <>
      <div className="rb-cover-shadow" style={delay} />
      <div className="rb-cover rb-cover-top" style={delay} />
      <div className="rb-cover rb-cover-bottom" style={delay} />
    </>
  );
};

const Slider = React.memo(({ id, min, max, step, label, value, onChange, stage }) => {
  const ticks = Math.min(typeof step === 'number' ? (max - min) / step + 1 : 16, 21);
  return (
    <label className="rb-label" htmlFor={id}>
      {label}
      <div className="rb-slider">
        <div className="rb-ticks">{range(ticks).map((n) => <div className="rb-tick" key={n} />)}</div>
        <input className="rb-range" id={id} type="range" min={min} max={max} step={step} value={value} onChange={onChange} />
        <Covers stage={stage} />
      </div>
    </label>
  );
});

const Toggle = React.memo(({ label, options, value, onSelect }) => {
  const [focused, setFocused] = useState(0);
  const refs = useRef([]);
  const items = options.map((o) => (typeof o === 'object' ? o : { label: o, value: o }));
  const onKeyDown = (e) => {
    let next;
    if (e.code === 'ArrowLeft') { next = focused - 1; if (next < 0) next = items.length - 1; }
    else if (e.code === 'ArrowRight') { next = focused + 1; if (next >= items.length) next = 0; }
    if (typeof next === 'number') {
      refs.current[next]?.focus();
      onSelect(items[next].value);
      setFocused(next);
    }
  };
  return (
    <div className="rb-label rb-toggle-label" role="group" aria-label={label}>
      {label}
      <div className="rb-toggle-row">
        {items.map((item, n) => {
          const selected = value === item.value;
          return (
            <button
              type="button"
              key={item.value}
              ref={(el) => { if (el) refs.current[n] = el; }}
              className="rb-toggle"
              data-is-selected={selected}
              tabIndex={n === focused ? undefined : -1}
              aria-pressed={selected}
              onClick={() => { onSelect(item.value); setFocused(n); }}
              onKeyDown={onKeyDown}
              style={{ color: selected ? '#fff' : 'hsl(210deg 25% 60%)' }}
            >
              <span className="rb-toggle-text">{item.label}</span>
            </button>
          );
        })}
        <Covers stage={3} />
      </div>
    </div>
  );
});

const DotGrid = React.memo(({ rows = 10, cols = 10 }) => (
  <svg className="rb-dots" viewBox="0 0 200 200" aria-hidden="true">
    <line className="rb-axis" x1="0" y1="100" x2="200" y2="100" />
    <line className="rb-axis" x1="100" y1="0" x2="100" y2="200" />
    <g>
      {range(rows - 1).map((r) => range(cols - 1).map((c) => {
        const onAxis = c === cols / 2 - 1 || r === rows / 2 - 1;
        return onAxis ? null : <circle key={`${r}-${c}`} cx={((c + 1) / cols) * 200} cy={((r + 1) / rows) * 200} r="1" fill="var(--dot-color)" />;
      }))}
    </g>
  </svg>
));

const Pad = React.memo(({ id, label, size, x, y, onChange }) => {
  const boxRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const hx = mapClamped(x, -1, 1, 8, size - 8);
  const hy = mapClamped(y, -1, 1, 8, size - 8);

  const fromPoint = useCallback((clientX, clientY) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    onChange({
      x: mapClamped(clientX - rect.left, 0, rect.width, -1, 1),
      y: mapClamped(clientY - rect.top, 0, rect.height, -1, 1),
    });
  }, [onChange]);

  useEffect(() => {
    if (!dragging) return undefined;
    const move = (e) => fromPoint(e.clientX, e.clientY);
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging, fromPoint]);

  const nudge = (e) => {
    const step = 0.05;
    const next = { x, y };
    if (e.key === 'ArrowUp') next.y = snap(clamp(y - step, -1, 1), step);
    else if (e.key === 'ArrowDown') next.y = snap(clamp(y + step, -1, 1), step);
    else if (e.key === 'ArrowLeft') next.x = snap(clamp(x - step, -1, 1), step);
    else if (e.key === 'ArrowRight') next.x = snap(clamp(x + step, -1, 1), step);
    else return;
    e.preventDefault();
    onChange(next);
  };

  return (
    <div className="rb-label" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`}>{label}</span>
      <div
        ref={boxRef}
        className="rb-pad"
        style={{ width: size, height: size, '--cursor': dragging ? 'grabbing' : 'pointer' }}
        onMouseDown={(e) => { fromPoint(e.clientX, e.clientY); setDragging(true); }}
        onTouchMove={(e) => { const t = e.touches[0]; fromPoint(t.clientX, t.clientY); }}
      >
        <div className="rb-pad-bg"><DotGrid /></div>
        <button
          type="button"
          id={id}
          className="rb-handle-btn"
          style={{ transform: `translate(${hx}px, ${hy}px)`, '--cursor': dragging ? 'grabbing' : 'grab' }}
          data-is-dragging={dragging}
          aria-label="Segment length and width"
          onMouseDown={(e) => { e.stopPropagation(); setDragging(true); }}
          onTouchStart={() => setDragging(true)}
          onKeyDown={nudge}
        >
          <div className="rb-handle" />
        </button>
        <div className="rb-doors">
          <div className="rb-door-shadow" style={{ animationDelay: '1300ms' }} />
          <div className="rb-door-wrap rb-door-left" style={{ animationDelay: '1300ms' }}>
            <div className="rb-door rb-door-inner-left" style={{ animationDelay: '1000ms' }} />
            <div className="rb-door rb-door-outer-left" />
          </div>
          <div className="rb-door-wrap rb-door-right" style={{ animationDelay: '1300ms' }}>
            <div className="rb-door rb-door-inner-right" style={{ animationDelay: '1000ms' }} />
            <div className="rb-door rb-door-outer-right" />
          </div>
        </div>
      </div>
    </div>
  );
});

const PushButton = ({ label, color = 'gray', onClick }) => {
  const id = useId();
  const red = color === 'red';
  return (
    <div
      className="rb-push"
      style={{
        '--button-top-center': red ? 'hsl(348deg 100% 60%)' : 'hsl(210deg 20% 90%)',
        '--button-top': red ? 'hsl(348deg 90% 40%)' : 'hsl(210deg 20% 75%)',
        '--button-top-highlight': red ? 'hsl(348deg 100% 70%)' : 'hsl(212deg 100% 95% / 0.6)',
        '--button-shaft-top': red ? 'hsl(355deg 100% 30%)' : 'hsl(212deg 8% 60%)',
        '--button-shaft-bottom': red ? 'hsl(355deg 80% 20%)' : 'hsl(212deg 8% 50%)',
      }}
    >
      <label className="rb-push-label" htmlFor={id}><span>{label}</span></label>
      <div className="rb-push-wrap">
        <div className="rb-push-hole"><span className="rb-push-shaft" /></div>
        <button type="button" id={id} className="rb-push-btn" onClick={onClick}>
          <span className="rb-push-top" />
        </button>
      </div>
    </div>
  );
};

/* ─── panel ──────────────────────────────────────────────────────────────── */

const CloseIcon = ({ pressed, booped }) => (
  <svg
    className="rb-close-icon"
    width="1.25rem"
    height="1.25rem"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    data-pressed={pressed}
    data-booped={booped}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Panel = ({ settings, dispatch, onDismiss, onRandomize, ...rest }) => {
  const uid = useId().replace(/:/g, '-');
  const [phase, setPhase] = useState('idle');
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onDismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  useEffect(() => {
    panelRef.current?.querySelector('.rb-close')?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (phase !== 'booped') return undefined;
    const t = window.setTimeout(() => setPhase('idle'), 150);
    return () => window.clearTimeout(t);
  }, [phase]);

  const tweak = (payload) => dispatch({ type: 'TWEAK', payload });

  return (
    <section
      ref={panelRef}
      className="rb-panel"
      aria-label="Rainbow Configurator"
      style={{ opacity: phase === 'dismissed' ? 0 : 1 }}
      {...rest}
    >
      <header className="rb-panel-header">
        <h2>Rainbow Configurator</h2>
        <button
          type="button"
          className="rb-close"
          aria-label="Close configurator"
          onClick={() => { setPhase('dismissed'); window.setTimeout(onDismiss, 300); }}
          onMouseEnter={() => setPhase('booped')}
          onMouseLeave={() => setPhase('idle')}
          onMouseDown={() => setPhase('pressed')}
          onMouseUp={() => setPhase('idle')}
        >
          <CloseIcon pressed={phase === 'pressed'} booped={phase === 'booped'} />
        </button>
      </header>

      <div className="rb-panel-content">
        <div className="rb-column">
          <Slider id={`${uid}-density`} label="Density" min={0} max={100} step={1} value={settings.density} onChange={(e) => tweak({ density: Number(e.target.value) })} />
          <Slider id={`${uid}-rows`} label="Num of Rows" min={3} max={10} step={1} value={settings.numOfRows} onChange={(e) => tweak({ numOfRows: Number(e.target.value) })} stage={2} />
          <div className="rb-row">
            <Toggle
              label="Operation"
              options={[{ label: 'modern', value: 'line' }, { label: 'classic', value: 'circle' }]}
              value={settings.shape}
              onSelect={(shape) => tweak({ shape })}
            />
            <Toggle label="Edges" options={['round', 'square']} value={settings.linecap} onSelect={(linecap) => tweak({ linecap })} />
          </div>
        </div>
        <div className="rb-column">
          <Pad
            id={`${uid}-pad`}
            label="Segment Values"
            size={206}
            x={settings.lineLength}
            y={settings.lineWidth}
            onChange={({ x, y }) => tweak({ lineLength: x, lineWidth: y })}
          />
        </div>
      </div>

      <footer className="rb-panel-footer">
        <p className="rb-note">This panel allows you to tweak the generative rainbow. Experiment with different combinations!</p>
        <div className="rb-actions">
          <PushButton label="Random" onClick={() => { soundFx.playPop(); dispatch({ type: 'TWEAK', payload: randomValues() }); onRandomize(); }} />
          <PushButton label="Reset" color="red" onClick={() => { soundFx.playPop(); dispatch({ type: 'RESET' }); }} />
        </div>
      </footer>
    </section>
  );
};

/* ─── gear button ────────────────────────────────────────────────────────── */

const GearButton = React.forwardRef(({ isEditing, ...props }, ref) => {
  const [spin, setSpin] = useState({ rotate: 0, scale: 1 });
  const pressed = spin.scale !== 1;
  return (
    <button
      ref={ref}
      type="button"
      className="rb-gear"
      data-pressed={pressed}
      aria-expanded={isEditing}
      onMouseDown={() => { setSpin((s) => ({ rotate: s.rotate - 20, scale: 0.875 })); soundFx.playPop(); }}
      onMouseUp={() => setSpin((s) => ({ rotate: s.rotate + 160, scale: 1 }))}
      {...props}
    >
      <span className="rb-gear-icon" style={{ transform: `rotate(${spin.rotate}deg) scale(${spin.scale})` }}>
        <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
      <span className="sr-only">Edit the generative art</span>
    </button>
  );
});

/* ─── mascot ─────────────────────────────────────────────────────────────── */

const Mascot = ({ isDark, mood }) => {
  const theme = isDark ? 'dark' : 'light';
  return (
    <button
      type="button"
      className="ab-mascot-btn"
      onClick={() => soundFx.playPop()}
      aria-label="Say hi to Josh"
    >
      {/* both themes stay mounted and cross-fade, so switching theme never makes Josh blink */}
      <span className="ab-josh">
        {['dark', 'light'].map((t) => (
          <span key={t} className={t === 'light' ? 'ab-josh-layer ab-josh-light' : 'ab-josh-layer'}>
            <picture>
              <source type="image/webp" srcSet={`/images/josh/josh-happy-${t}.webp`} />
              <img src={`/images/josh/josh-happy-${t}.png`} alt={t === theme ? 'A cartoon of me sitting cross-legged on a cloud' : ''} width="137.5" height="232" />
            </picture>
            {mood === 'very-happy' && (
              <picture>
                <source type="image/webp" srcSet={`/images/josh/head-very-happy-${t}.webp`} />
                <img className="rb-head" src={`/images/josh/head-very-happy-${t}.png`} alt="" />
              </picture>
            )}
          </span>
        ))}
      </span>
    </button>
  );
};

/* ─── the whole hero art ─────────────────────────────────────────────────── */

export const RainbowArt = ({ isDark }) => {
  const [settings, dispatch] = useReducer(reducer, DEFAULTS);
  const [showGear, setShowGear] = useState(false);
  const [editing, setEditing] = useState(false);
  const [overPanel, setOverPanel] = useState(false);
  const [mood, setMood] = useState('happy');
  const [gearHidden, setGearHidden] = useState(false);
  const hoverTimer = useRef(0);
  const moodTimer = useRef(0);
  const hasHovered = useRef(false);
  const gearRef = useRef(null);

  const interactive = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia?.('(hover: hover)').matches ?? true;
    return !reduced && canHover;
  }, []);

  useEffect(() => () => {
    window.clearTimeout(hoverTimer.current);
    window.clearTimeout(moodTimer.current);
  }, []);

  // the gear tucks away once it scrolls under the header
  useEffect(() => {
    const onScroll = () => {
      const top = gearRef.current?.getBoundingClientRect().top;
      setGearHidden(typeof top === 'number' && top < 120);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showGear]);

  const dismiss = useCallback(() => {
    setEditing(false);
    setOverPanel(false);
    gearRef.current?.focus({ preventScroll: true });
  }, []);

  const onArtEnter = () => {
    if (!interactive || showGear) return;
    if (hasHovered.current) { setShowGear(true); return; }
    hoverTimer.current = window.setTimeout(() => { setShowGear(true); hasHovered.current = true; }, 2000);
  };
  const onArtLeave = () => {
    window.clearTimeout(hoverTimer.current);
    if (!editing) hoverTimer.current = window.setTimeout(() => setShowGear(false), 1000);
  };

  const onRandomize = () => {
    setMood('very-happy');
    window.clearTimeout(moodTimer.current);
    moodTimer.current = window.setTimeout(() => setMood('happy'), 800);
  };

  return (
    <>
      {/* behind the front cloud, so the rainbow's lower ends tuck into it */}
      <div className="rb-art" aria-hidden="true">
        <div className="rb-art-wrap" onMouseEnter={onArtEnter} onMouseLeave={onArtLeave}>
          <RainbowCanvas settings={settings} isDark={isDark} interactive={interactive} trackingDisabled={overPanel} editing={editing} />
        </div>
      </div>

      {interactive && (
        <div className="rb-gear-pos">
          <div className="rb-gear-wrap" data-is-visible={showGear && !gearHidden}>
            <GearButton
              ref={gearRef}
              isEditing={editing}
              onMouseEnter={() => window.clearTimeout(hoverTimer.current)}
              onClick={() => setEditing((v) => !v)}
              style={{ pointerEvents: gearHidden ? 'none' : 'auto' }}
            />
          </div>
        </div>
      )}

      {editing && (
        <div className="rb-panel-pos">
          <Panel
            settings={settings}
            dispatch={dispatch}
            onDismiss={dismiss}
            onRandomize={onRandomize}
            onMouseEnter={() => setOverPanel(true)}
            onMouseLeave={() => setOverPanel(false)}
          />
        </div>
      )}

      <div className="rb-mascot">
        <Mascot isDark={isDark} mood={mood} />
      </div>
    </>
  );
};
