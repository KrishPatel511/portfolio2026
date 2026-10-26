import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiHash, FiRotateCcw, FiX } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';
import { useTheme } from '../../context/ThemeContext';
import { Highlighted } from './BlogCode';

/* The interactive pieces used inside the article: a before/after frame, a code frame, a small
   playground and a rainbow with its settings panel. They share one look: a bordered card with a bold
   title, and "Toggle" and "Expand" buttons underneath. */

const FrameButtons = ({ expanded, onToggle, onExpand, canToggle = true }) => (
  <div className="bl-frame-buttons">
    <button type="button" className="bl-frame-btn bl-frame-btn--solid" onClick={onToggle} disabled={expanded || !canToggle}>Toggle</button>
    <button type="button" className="bl-frame-btn" onClick={onExpand} aria-expanded={expanded}>{expanded ? 'Collapse' : 'Expand'}</button>
  </div>
);

/* ── Before / after pictures ──────────────────────────────────────────────── */
export const Compare = ({ title, items }) => {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const flip = () => { soundFx.playPop(); setIndex((i) => (i + 1) % items.length); };
  const expand = () => { soundFx.playPop(); setExpanded((e) => !e); };

  return (
    <div className="bl-frame bl-wide">
      {!expanded ? (
        <>
          <p className="bl-frame-title">{title} ({items[index][0]})</p>
          <img className="bl-frame-img" src={items[index][1]} alt={items[index][2]} loading="lazy" />
        </>
      ) : (
        <div className="bl-frame-grid" style={{ '--n': items.length }}>
          {items.map(([label, src, alt]) => (
            <figure key={label}>
              <figcaption>{title} ({label})</figcaption>
              <img src={src} alt={alt} loading="lazy" />
            </figure>
          ))}
        </div>
      )}
      <FrameButtons expanded={expanded} onToggle={flip} onExpand={expand} />
    </div>
  );
};

/* ── The same code in two colour themes ───────────────────────────────────── */
export const CodeFrame = ({ title, code, themes }) => {
  const [index, setIndex] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const flip = () => { soundFx.playPop(); setIndex((i) => (i + 1) % themes.length); };
  const expand = () => { soundFx.playPop(); setExpanded((e) => !e); };

  const pane = (name) => (
    <pre className={`bl-code-pane bl-code-pane--${name.toLowerCase()}`}><code><Highlighted code={code} /></code></pre>
  );

  return (
    <div className="bl-frame bl-wide">
      {!expanded ? (
        <>
          <p className="bl-frame-title">{title} ({themes[index]})</p>
          {pane(themes[index])}
        </>
      ) : (
        <div className="bl-frame-grid" style={{ '--n': themes.length }}>
          {themes.map((name) => (
            <figure key={name}>
              <figcaption>{title} ({name})</figcaption>
              {pane(name)}
            </figure>
          ))}
        </div>
      )}
      <FrameButtons expanded={expanded} onToggle={flip} onExpand={expand} />
    </div>
  );
};

/* ── A tiny playground: edit three files, see the result run in a sandboxed frame ─ */
const PLAYGROUND_FILES = [
  {
    name: 'index.html',
    code: '<div class="wave" id="wave"></div>',
  },
  {
    name: 'styles.css',
    code: `.wave {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 150px;
}

.bar {
  width: 16px;
  border-radius: 8px;
  background: linear-gradient(to top, #818cf8, #f43f5e);
  animation: rise 1.4s ease-in-out infinite;
  /* Each bar starts a little later than the one before it */
  animation-delay: calc(var(--i) * 90ms);
}

@keyframes rise {
  0%, 100% { height: 24px; }
  50% { height: 140px; }
}`,
  },
  {
    name: 'script.js',
    code: `const wave = document.getElementById('wave');
const COUNT = 12;

for (let i = 0; i < COUNT; i++) {
  const bar = document.createElement('div');
  bar.className = 'bar';
  bar.style.setProperty('--i', i);
  wave.appendChild(bar);
}`,
  },
];

const buildDoc = ([html, css, js]) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%}body{display:grid;place-items:center;font-family:system-ui,sans-serif}${css}</style></head><body>${html}<script>${js.replace(/<\/script/gi, '<\\/script')}<\/script></body></html>`;

export const Playground = () => {
  const [files, setFiles] = useState(() => PLAYGROUND_FILES.map((f) => f.code));
  const [active, setActive] = useState(0);
  const [lineNumbers, setLineNumbers] = useState(false);
  const [doc, setDoc] = useState(() => buildDoc(PLAYGROUND_FILES.map((f) => f.code)));
  const [tab, setTab] = useState('result');
  const gutter = useRef(null);
  const highlight = useRef(null);

  // Re-run a moment after typing stops
  useEffect(() => {
    const t = setTimeout(() => setDoc(buildDoc(files)), 450);
    return () => clearTimeout(t);
  }, [files]);

  const edit = (value) => setFiles((all) => all.map((c, i) => (i === active ? value : c)));
  const reset = () => { soundFx.playPop(); setFiles(PLAYGROUND_FILES.map((f) => f.code)); };
  const sync = (event) => {
    const { scrollTop, scrollLeft } = event.currentTarget;
    if (highlight.current) { highlight.current.scrollTop = scrollTop; highlight.current.scrollLeft = scrollLeft; }
    if (gutter.current) gutter.current.scrollTop = scrollTop;
  };
  const code = files[active];
  const lines = code.split('\n').length;

  return (
    <div className="bl-play bl-wide">
      <div className="bl-play-bar">
        <span>Code Playground</span>
        <div>
          <button type="button" title="Reset code" aria-label="Reset code" onClick={reset}><FiRotateCcw size={16} /></button>
          <button type="button" title="Show line numbers" aria-label="Show line numbers" aria-pressed={lineNumbers} className={lineNumbers ? 'is-on' : ''} onClick={() => setLineNumbers((v) => !v)}><FiHash size={16} /></button>
        </div>
      </div>
      <div className="bl-play-body">
        <div className="bl-play-editor">
          <div className="bl-play-tabs" role="tablist" aria-label="Files">
            {PLAYGROUND_FILES.map((f, i) => (
              <button key={f.name} type="button" role="tab" aria-selected={active === i} className={active === i ? 'is-active' : ''} onClick={() => setActive(i)}>{f.name}</button>
            ))}
          </div>
          <div className="bl-play-code">
            {lineNumbers && (
              <div className="bl-play-gutter" ref={gutter} aria-hidden="true">
                {Array.from({ length: lines }, (_, i) => <span key={i}>{i + 1}</span>)}
              </div>
            )}
            <div className="bl-play-stack">
              <pre ref={highlight} aria-hidden="true"><code><Highlighted code={code + '\n'} /></code></pre>
              <textarea
                value={code}
                onChange={(e) => edit(e.target.value)}
                onScroll={sync}
                spellCheck={false}
                aria-label={`Edit ${PLAYGROUND_FILES[active].name}`}
                wrap="off"
              />
            </div>
          </div>
        </div>
        <div className="bl-play-result">
          <div className="bl-play-tabs" role="tablist" aria-label="Output">
            <button type="button" role="tab" aria-selected={tab === 'result'} className={tab === 'result' ? 'is-active' : ''} onClick={() => setTab('result')}>Result</button>
            <button type="button" role="tab" aria-selected={tab === 'about'} className={tab === 'about' ? 'is-active' : ''} onClick={() => setTab('about')}>About</button>
          </div>
          {tab === 'result' ? (
            <iframe title="Playground result" sandbox="allow-scripts" srcDoc={doc} />
          ) : (
            <p className="bl-play-about">Edit any file and the result updates a moment later. It runs in a sandboxed frame, so nothing you type can affect this page.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── The rainbow, and its settings panel ──────────────────────────────────── */
const RAINBOW_COLORS = ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#fb923c', '#f43f5e', '#ec4899'];
const DEFAULTS = { rows: 6, density: 34, bend: 70, thickness: 8 };

const Slider = ({ label, value, min, max, step = 1, onChange }) => (
  <label className="bl-slider">
    <span className="bl-slider-label">{label}<b>{value}</b></span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
  </label>
);

export const RainbowDemo = () => {
  const { isDark } = useTheme();
  const [cfg, setCfg] = useState(DEFAULTS);
  const [canEdit, setCanEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const stage = useRef(null);
  const canvas = useRef(null);
  const pointer = useRef({ x: -999, y: -999, active: false });
  const hoverTimer = useRef(null);
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  useEffect(() => {
    const el = canvas.current;
    const box = stage.current;
    if (!el || !box) return undefined;
    const ctx = el.getContext('2d');
    let width = 0;
    let height = 0;
    let raf = 0;
    let eased = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.clientWidth;
      height = box.clientHeight;
      el.width = width * dpr;
      el.height = height * dpr;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const wrap = (a) => { while (a > Math.PI / 2) a -= Math.PI; while (a < -Math.PI / 2) a += Math.PI; return a; };

    const frame = () => {
      const { rows, density, bend, thickness } = cfgRef.current;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height * 0.97;
      const outer = Math.min(width * 0.47, height * 0.92);
      const inner = outer * 0.56;
      const reach = outer * 0.5;
      const p = pointer.current;
      let moving = p.active;
      let index = 0;
      ctx.lineCap = 'round';
      ctx.lineWidth = thickness * Math.min(1, width / 700 + 0.35);

      for (let r = 0; r < rows; r++) {
        const radius = outer - ((outer - inner) * r) / Math.max(1, rows - 1);
        const count = Math.max(8, Math.round((density * radius) / outer));
        const len = ((Math.PI * radius) / count) * 0.6;
        ctx.strokeStyle = RAINBOW_COLORS[r % RAINBOW_COLORS.length];
        for (let j = 0; j < count; j++) {
          const theta = Math.PI - ((j + 0.5) * Math.PI) / count;
          let x = cx + radius * Math.cos(theta);
          let y = cy - radius * Math.sin(theta);
          const base = Math.atan2(-Math.cos(theta), -Math.sin(theta));
          const dx = p.x - x;
          const dy = p.y - y;
          const d = Math.hypot(dx, dy);
          const target = p.active ? Math.exp(-((d / reach) ** 2)) * (bend / 100) : 0;
          const prev = eased[index] ?? 0;
          const now = prev + (target - prev) * 0.14;
          eased[index] = now;
          if (Math.abs(now - target) > 0.002) moving = true;
          let angle = base;
          if (now > 0.001) {
            angle = base + wrap(Math.atan2(dy, dx) - base) * now;
            x += (dx / (d || 1)) * now * 9;
            y += (dy / (d || 1)) * now * 9;
          }
          const ux = Math.cos(angle) * (len / 2);
          const uy = Math.sin(angle) * (len / 2);
          ctx.beginPath();
          ctx.moveTo(x - ux, y - uy);
          ctx.lineTo(x + ux, y + uy);
          ctx.stroke();
          index += 1;
        }
      }
      raf = moving ? requestAnimationFrame(frame) : 0;
    };

    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onMove = (e) => {
      const rect = box.getBoundingClientRect();
      pointer.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
      kick();
    };
    const onLeave = () => { pointer.current.active = false; kick(); };

    resize();
    frame();
    const ro = new ResizeObserver(() => { resize(); kick(); });
    ro.observe(box);
    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);
    const redraw = setInterval(kick, 400); // picks up slider changes
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(redraw);
      ro.disconnect();
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const hoverIn = () => { clearTimeout(hoverTimer.current); hoverTimer.current = setTimeout(() => setCanEdit(true), 1200); };
  const hoverOut = () => { clearTimeout(hoverTimer.current); hoverTimer.current = setTimeout(() => setCanEdit(false), 2200); };
  useEffect(() => () => clearTimeout(hoverTimer.current), []);
  const set = useCallback((key) => (value) => setCfg((c) => ({ ...c, [key]: value })), []);
  const mascot = useMemo(() => (isDark ? '/portfolio_image_back_dark.png' : '/portfolio_image_back_light.png'), [isDark]);

  return (
    <>
      <div className="bl-rb bl-wide" onPointerEnter={hoverIn} onPointerLeave={hoverOut}>
        <div className="bl-rb-stage" ref={stage}>
          <canvas ref={canvas} aria-hidden="true" />
          <img className="bl-rb-mascot" src={mascot} alt="A 3D character of me, sitting under the rainbow" loading="lazy" />
          <button type="button" className={`bl-rb-edit ${canEdit || open ? 'is-visible' : ''}`} onClick={() => { soundFx.playPop(); setOpen(true); }} tabIndex={canEdit || open ? 0 : -1}>
            Edit
          </button>
        </div>
      </div>
      {open && (
        <div className="bl-config" role="group" aria-label="Rainbow Configurator">
          <div className="bl-config-bar">
            <strong>Rainbow Configurator</strong>
            <button type="button" aria-label="Close the configurator" onClick={() => setOpen(false)}><FiX size={18} /></button>
          </div>
          <div className="bl-config-grid">
            <Slider label="Rows" value={cfg.rows} min={3} max={8} onChange={set('rows')} />
            <Slider label="Density" value={cfg.density} min={16} max={56} onChange={set('density')} />
            <Slider label="Bend" value={cfg.bend} min={0} max={100} onChange={set('bend')} />
            <Slider label="Thickness" value={cfg.thickness} min={3} max={14} onChange={set('thickness')} />
          </div>
          <button type="button" className="bl-config-reset" onClick={() => setCfg(DEFAULTS)}><FiRotateCcw size={14} /> Reset</button>
        </div>
      )}
    </>
  );
};
