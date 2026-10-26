import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, useMotionValue, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { soundFx } from '../../utils/soundEffects';
import { kick, hihat, snare, cowbell } from '../../utils/drumSounds';
import { useSound } from '../../hooks/useSound';
import { CLOUD_BACK, CLOUD_MID, CLOUD_FRONT_WIDE } from '../Hero/cloudPaths';
import { RealMap } from './RealMap';
import { RainbowArt } from './RainbowArt';
import MaskedHeading from '../MaskedHeading/MaskedHeading';
import './AboutPage.css';

/* ─── helpers ────────────────────────────────────────────────────────────── */

const CountUp = ({ to }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{val.toLocaleString('en-US')}</span>;
};

const Card = ({ area, className = '', index = 0, children, ...handlers }) => (
  <motion.div
    {...handlers}
    className={`ab-card ${className}`}
    style={{ gridArea: area }}
    initial={{ opacity: 0, y: 36, scale: 0.97 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ type: 'spring', stiffness: 120, damping: 18, delay: (index % 3) * 0.08 }}
  >
    {children}
  </motion.div>
);

/** Shows a real image when it exists in /public, otherwise the drawn fallback. */
const Photo = ({ src, alt, className, fallback }) => {
  const [bad, setBad] = useState(false);
  if (bad) return fallback;
  return <img className={className} src={src} alt={alt} onError={() => setBad(true)} />;
};

const tone = (freq, dur, type = 'square', vol = 0.12, slideTo) => {
  if (!soundFx.enabled) return;
  const ctx = soundFx.getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + dur);
};

/* Q W E R: the top-left letters of a keyboard, used as four drum pads.
   Press the key (or click the pad) to play: Q kick, W hihat, E snare, R cowbell. */
const DRUMS = [
  { key: 'q', label: 'Q', name: 'kick', sound: kick },
  { key: 'w', label: 'W', name: 'hihat', sound: hihat },
  { key: 'e', label: 'E', name: 'snare', sound: snare },
  { key: 'r', label: 'R', name: 'cowbell', sound: cowbell },
];

/* Indian tricolour (saffron / white / green) + navy Ashoka Chakra, drawn once as an SVG
   data-URI. Every column shows its own vertical slice of this one image, so the chakra
   stays intact while the strips ripple. */
const FLAG_COLS = 15;
const INDIA_FLAG = (() => {
  const spokes = Array.from({ length: 24 }, (_, n) => {
    const a = (n * 15 * Math.PI) / 180;
    const x = (60 + Math.cos(a) * 10.5).toFixed(2);
    const y = (40 + Math.sin(a) * 10.5).toFixed(2);
    return `<line x1="60" y1="40" x2="${x}" y2="${y}"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" preserveAspectRatio="none">`
    + `<rect width="120" height="27" fill="#ff9933"/>`
    + `<rect y="26.6" width="120" height="26.8" fill="#ffffff"/>`
    + `<rect y="53.3" width="120" height="26.7" fill="#138808"/>`
    + `<g stroke="#000080" stroke-width="0.9" fill="none"><circle cx="60" cy="40" r="11.5" stroke-width="1.4"/>${spokes}</g>`
    + `<circle cx="60" cy="40" r="2" fill="#000080"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

/* ─── drawn fallbacks (used until real photos are dropped into /public) ──── */

/* ─── 1. Map ─────────────────────────────────────────────────────────────── */

const toXY = ([lon, lat]) => `${(32 + (lon + 74) * 2.93).toFixed(1)},${(99 + (45 - lat) * 2.72).toFixed(1)}`;
const LANDMASSES = [
  [[-86, 80], [-60, 80], [-62, 64], [-65, 60], [-56, 52], [-52, 47], [-60, 46], [-66, 44], [-70, 41], [-75, 38], [-76, 35], [-80, 32], [-81, 26], [-83, 29], [-86, 30]],
  [[-60, 60], [-45, 60], [-20, 70], [-20, 80], [-60, 80], [-72, 77]],
  [[-24, 65], [-14, 65], [-14, 67], [-24, 67]],
  [[-5, 50], [1, 51], [2, 53], [-2, 58], [-6, 58], [-5, 54], [-4, 52]],
  [[-9, 43], [-9, 37], [-5, 36], [0, 39], [3, 43], [8, 44], [12, 42], [16, 38], [18, 40], [14, 45], [20, 41], [23, 37], [26, 40], [29, 41], [36, 36], [35, 32], [35, 28], [43, 13], [52, 16], [58, 23], [56, 26], [62, 25], [66, 25], [72, 21], [73, 16], [77, 8], [80, 13], [80, 20], [87, 22], [90, 22], [90, 78], [60, 72], [40, 68], [30, 70], [25, 71], [14, 68], [5, 62], [5, 58], [10, 57], [8, 54], [0, 50], [-5, 48], [-2, 44]],
  [[-17, 21], [-17, 14], [-8, 5], [11, 3], [45, 3], [51, 12], [43, 13], [35, 28], [32, 31], [20, 31], [11, 33], [10, 37], [-5, 36], [-9, 29]],
  [[-80, 8], [-72, 12], [-62, 10], [-50, 3], [-80, 3]],
];

const MapCard = ({ isDark }) => {
  // null = still looking up; { km } = distance known; { km: null } = lookup unavailable
  const [loc, setLoc] = useState(null);
  const [ready, setReady] = useState(false);

  const handleLocation = (dest, distance) => {
    setLoc({ km: distance === null ? null : Math.round(distance / 10) * 10, near: distance !== null && distance < 30 });
  };

  let sentence;
  if (loc === null) {
    sentence = <>I’m from Ahmedabad, Gujarat, India, roughly <em>…km</em> away from your current location, according to your IP address.</>;
  } else if (loc.km === null) {
    sentence = <>I’m from Ahmedabad, Gujarat, India.</>;
  } else if (loc.near) {
    sentence = <>I’m from Ahmedabad, Gujarat, India, and according to your IP address, you’re practically <em>right next door</em>!</>;
  } else {
    sentence = (
      <>
        I’m from Ahmedabad, Gujarat, India, roughly <em><CountUp key={loc.km} to={loc.km} />km</em> away from your
        current location, according to your IP address.
      </>
    );
  }

  return (
    <Card area="map" className="ab-map" index={0}>
      <div className={`ab-map-art ${ready ? 'is-ready' : ''}`}>
        {/* drawn world map: visible until the real map has loaded (or if WebGL is unavailable) */}
        <div className="ab-map-fallback">
          <svg viewBox="0 0 510 213" preserveAspectRatio="none" aria-hidden="true">
            <rect width="510" height="213" fill="var(--ab-map-sea)" />
            {LANDMASSES.map((poly, n) => (
              <polygon key={n} points={poly.map(toXY).join(' ')} fill="var(--ab-map-land)" stroke="var(--ab-map-border)" strokeWidth="0.8" strokeLinejoin="round" />
            ))}
          </svg>
        </div>

        <RealMap isDark={isDark} onLocation={handleLocation} onReady={() => setReady(true)} />
      </div>
      <p>{sentence}</p>
    </Card>
  );
};

/* ─── 2. Pride flag ──────────────────────────────────────────────────────── */

const FlagCard = () => {
  const [waving, setWaving] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const wave = () => {
    soundFx.playPop();
    setWaving(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setWaving(false), 1400);
  };
  return (
    <Card area="gay" className="ab-flag" index={1}>
      <button className="ab-flag-btn" aria-label="Wave the Indian flag" onClick={wave}>
        <div className={`ab-flag-art ${waving ? 'waving' : ''}`} aria-hidden="true">
          {Array.from({ length: FLAG_COLS }).map((_, n) => (
            <div
              key={n}
              className="ab-flag-col"
              style={{
                backgroundImage: INDIA_FLAG,
                backgroundSize: `${FLAG_COLS * 100}% 100%`,
                backgroundPosition: `${(n / (FLAG_COLS - 1)) * 100}% 0`,
                '--billow': `${(n * 0.5).toFixed(2)}px`,
                animationDelay: `${(n - FLAG_COLS) * 55}ms`,
              }}
            />
          ))}
        </div>
      </button>
      <p>I&apos;m <em>Indian</em>, born and raised in <em>Ahmedabad</em>, Gujarat.</p>
      <p className="small">Jai Hind! Click the flag to make it wave faster.</p>
    </Card>
  );
};

/* ─── 3. Name ────────────────────────────────────────────────────────────── */

const NameCard = () => {
  const [speaking, setSpeaking] = useState(false);
  const speak = () => {
    soundFx.playPop();
    setSpeaking(true);
    if ('speechSynthesis' in window && soundFx.enabled) {
      const u = new SpeechSynthesisUtterance('Patel');
      u.lang = 'en-IN';
      u.rate = 0.8;
      u.pitch = 0.4;
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setSpeaking(false), 1200);
    }
  };
  return (
    <Card area="name" className="ab-name" index={2}>
      <button className="ab-ipa" onClick={speak}>
        <span aria-hidden="true">ˈpʌtel</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12.0133 4.60757C11.9149 4.2957 11.5463 4.19331 11.2861 4.39151L5.93425 8.46914C5.84716 8.5355 5.74071 8.57143 5.63123 8.57143H1.5C1.22386 8.57143 1 8.79529 1 9.07143V14.9286C1 15.2047 1.22386 15.4286 1.5 15.4286H5.63123C5.74071 15.4286 5.84716 15.4645 5.93425 15.5309L11.2861 19.6085C11.5463 19.8067 11.9149 19.7043 12.0133 19.3924C12.3582 18.2999 13 15.7612 13 12C13 8.2388 12.3582 5.70014 12.0133 4.60757Z" />
          <motion.path d="M17.54 8.46002C18.4774 9.39766 19.004 10.6692 19.004 11.995C19.004 13.3208 18.4774 14.5924 17.54 15.53" animate={{ opacity: speaking ? [0.2, 1, 0.2] : 1 }} transition={{ repeat: speaking ? Infinity : 0, duration: 0.6 }} />
          <motion.path d="M20.0703 4.92999C21.945 6.80527 22.9982 9.34835 22.9982 12C22.9982 14.6516 21.945 17.1947 20.0703 19.07" animate={{ opacity: speaking ? [1, 0.2, 1] : 1 }} transition={{ repeat: speaking ? Infinity : 0, duration: 0.6 }} />
        </svg>
        <span className="sr-only">Phonetic spelling of my last name, Patel. Triggering this button plays a recording of the pronunciation.</span>
      </button>
      <p>My last name, Patel, is pronounced “<em>puh-tel</em>”.</p>
      <p>Click to hear a robot say it.</p>
    </Card>
  );
};

/* ─── 4. Height ──────────────────────────────────────────────────────────── */

/* The stick figure stretches up when the card is hovered, and on leaving it squashes down
   into a T-pose before settling back (an under-damped spring overshoots below zero). */
const StickFigure = ({ h }) => {
  const headCy = useTransform(h, (v) => 35 - 20 * v);
  const neckY = useTransform(h, (v) => 35 - 20 * v + 15);
  const shoulderY = useTransform(h, (v) => 35 - 20 * v + 21);
  const hipY = useTransform(h, (v) => 80 - 6 * v);
  const footDx = useTransform(h, (v) => (v < 0 ? 10 - 5 * v : 10 - 1.5 * v));
  const footL = useTransform(footDx, (d) => 25 - d);
  const footR = useTransform(footDx, (d) => 25 + d);
  const armDx = useTransform(h, (v) => (v < 0 ? 10 - 9 * v : 10 - 3 * v));
  const armDy = useTransform(h, (v) => (v < 0 ? 15 + 25 * v : 15 + 7 * v));
  const armLx = useTransform(armDx, (d) => 25 - d);
  const armRx = useTransform(armDx, (d) => 25 + d);
  const armY = useTransform([shoulderY, armDy], ([sy, dy]) => sy + dy);

  return (
    <svg width="50" height="100" viewBox="0 0 50 100" fill="none" className="ab-stick" aria-hidden="true" style={{ overflow: 'visible' }}>
      <g stroke="var(--color-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <motion.circle cx="25" cy={headCy} r="15" />
        <motion.line x1="25" y1={neckY} x2="25" y2={hipY} />
        <motion.line x1="25" y1={hipY} x2={footL} y2="100" />
        <motion.line x1="25" y1={hipY} x2={footR} y2="100" />
        <motion.line x1="25" y1={shoulderY} x2={armLx} y2={armY} />
        <motion.line x1="25" y1={shoulderY} x2={armRx} y2={armY} />
      </g>
    </svg>
  );
};

const HeightCard = () => {
  const [metric, setMetric] = useState(true);
  const h = useMotionValue(0);

  const stretch = () => animate(h, 1, { type: 'spring', stiffness: 220, damping: 16 });
  const relax = () => animate(h, 0, { type: 'spring', stiffness: 260, damping: 9 });

  return (
    <Card area="tall" className="ab-height" index={3} onMouseEnter={stretch} onMouseLeave={relax}>
      <StickFigure h={h} />
      <div>
        <p>
          <strong>
            I&apos;m{' '}
            <button
              className="ab-flip"
              onClick={() => { soundFx.playPop(); setMetric(!metric); }}
              aria-label="Toggle between imperial and metric units"
            >
              <span aria-hidden="true" style={{ transform: `rotateX(${metric ? 180 : 0}deg)` }}>6’0”</span>
              <span aria-hidden="true" style={{ transform: `rotateX(${metric ? 0 : -180}deg)` }}>183cm</span>
            </button>{' '}
            tall.
          </strong>{' '}
          For some reason, this surprises a lot of people. 😅
        </p>
      </div>
    </Card>
  );
};

/* ─── 5. Packages / drum pads ────────────────────────────────────────────── */

const DrumKey = ({ drum }) => {
  const [play] = useSound(drum.sound);
  const [pressed, setPressed] = useState(false);
  const timer = useRef(0);

  const hit = useCallback(() => {
    play();
    setPressed(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPressed(false), 140);
  }, [play]);

  // the matching keyboard key triggers the pad as well
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key.toLowerCase() === drum.key) hit();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer.current);
    };
  }, [drum.key, hit]);

  return (
    <button
      className={`ab-key ${pressed ? 'pressed' : ''}`}
      onClick={hit}
      aria-label={`Play a ${drum.name} sound. You can also press the ${drum.label} key.`}
    >
      <span className="ab-key-well"><span className="ab-key-top">{drum.label}</span></span>
    </button>
  );
};

const DrumCard = () => (
  <Card area="pkg" className="ab-drums" index={4}>
    <div className="ab-keys">
      {DRUMS.map((d) => <DrumKey key={d.key} drum={d} />)}
    </div>
    <p>
      I built these drum pads myself! Press <strong>Q</strong>, <strong>W</strong>, <strong>E</strong> or <strong>R</strong> on your
      keyboard, or just click them, to play a kick, hihat, snare and cowbell.
    </p>
    <p>
      There are no audio files and no sound library here. Every beat is made live in your browser with the{' '}
      <em>Web Audio API</em> and a small React hook I wrote called <em>useSound</em>.
    </p>
  </Card>
);

/* ─── 6. Desk ────────────────────────────────────────────────────────────── */

const DeskCard = () => {
  const [cups, setCups] = useState(247);
  const [pops, setPops] = useState([]);
  const sip = () => {
    tone(440, 0.12, 'sine', 0.1, 660);
    setCups((c) => c + 1);
    const id = Date.now() + Math.random();
    setPops((p) => [...p, { id, x: (Math.random() - 0.5) * 70 }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
  };
  return (
    <Card area="desk" className="ab-desk" index={5}>
      <button type="button" className="ab-chai" onClick={sip} aria-label="Add a cup of chai to the counter">
        <img className="ab-inset ab-chai-img" src="/images/gmdc/GMDC_IMG01.jpeg" alt="A cup of chai on the table at the GMDC office" />
        <span className="ab-chai-badge">☕ {cups.toLocaleString('en-US')}</span>
        {pops.map((p) => (
          <motion.span
            key={p.id}
            className="ab-chai-pop"
            initial={{ opacity: 1, y: 0, x: p.x }}
            animate={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.9 }}
          >
            +1
          </motion.span>
        ))}
      </button>
      <p>Cups of chai behind <strong>GMDC Mining</strong>. Click the cup to add one.</p>
      <p className="small">Powered by chai, built with care.</p>
    </Card>
  );
};

/* ─── 7. The little machine ──────────────────────────────────────────────── */

const LED_COLORS = ['#1AD9FF', '#1AD9FF', '#1AD9FF', '#32FF98', '#32FF98', '#32FF98', '#FFEB33', '#FFEB33'];
const f2 = (n) => n.toFixed(2);
const wave01 = (v) => 0.5 + 0.5 * Math.sin(v);

const LedStrip = ({ x, y, lit }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width="52" height="16" rx="4" fill="#2B2B2B" />
    {LED_COLORS.map((c, n) => (
      <React.Fragment key={n}>
        <circle cx={5 + n * 6} cy="5" r="2" fill={c} style={{ opacity: n < lit ? 1 : 0, transition: 'opacity 120ms' }} />
        <circle cx={5 + n * 6} cy="11" r="2" fill={c} style={{ opacity: n < lit ? 1 : 0, transition: 'opacity 120ms' }} />
      </React.Fragment>
    ))}
  </g>
);

/* hexagon rings (outer → inner) */
const HEX_RINGS = [
  { c: 'hsl(190deg 100% 55%)', p: '14.85,34.64 0.58,27.63 -2.72,11.88 7.64,-0.75 24.08,-0.75 34.44,11.88 31.13,27.63 16.86,34.64' },
  { c: 'hsl(150deg 100% 60%)', p: '14.85,31.34 3.54,25.76 0.97,13.21 9.28,3.15 22.43,3.15 30.75,13.21 28.17,25.76 16.86,31.34' },
  { c: 'hsl(54deg 100% 60%)', p: '14.85,28.05 6.5,23.89 4.66,14.54 10.92,7.05 20.79,7.05 27.06,14.54 25.21,23.89 16.86,28.05' },
  { c: 'hsl(25deg 100% 55%)', p: '14.85,24.75 9.46,22.02 8.35,15.87 12.56,10.95 19.15,10.95 23.37,15.87 22.25,22.02 16.86,24.75' },
  { c: 'hsl(5deg 100% 55%)', p: '14.85,21.45 12.42,20.14 12.04,17.2 14.2,14.84 17.51,14.84 19.68,17.2 19.29,20.14 16.86,21.45' },
];

const CONTINENTS = [
  'M8.03333 17.0001L4 12.0501V9.30015L6.30476 8.20015H9.7619L10.9143 10.9501L13.219 10.4001L14.3714 13.1501L12.0667 13.7001L10.3381 16.4501L13.7952 17.5501L16.1 19.7501L13.7952 22.5001L10.9143 24.7001L12.0667 20.8501L10.3381 18.1001L8.03333 17.0001Z',
  'M19.7038 18.1001L20.5 15.9001L22.7 14.8001L24.9 15.3501H27.1L28.75 18.6501L29.85 21.9501L27.65 24.7001L24.9 24.1501L23.25 19.7501L21.6 20.3001L19.7038 18.1001Z',
  'M20.5 13.1501L21.6 10.9501L20.5 7.65015L23.25 8.20015L30.4 10.4001L26 13.7001L23.8 12.6001L20.5 13.1501Z',
];

const MachineArt = ({ on, t }) => {
  /* every moving part is a pure function of time `t` (seconds since power-on) */
  const amp = 0.75 + 0.25 * Math.sin(t * 0.9);
  const sinePts = Array.from({ length: 16 }, (_, n) => {
    const x = 8 + n * 2;
    return `${x},${f2(17 + 9 * amp * Math.sin(x * 0.33 - t * 5.5))}`;
  }).join(' ');

  const meter = (phase) => (on ? Math.round(1 + 7 * wave01(t * 3.3 + phase) * (0.55 + 0.45 * wave01(t * 1.1 + phase * 2))) : 0);

  const sx = 11 + 4 * Math.sin(t * 0.8);
  const sy = 20 + 5 * Math.sin(t * 1.3);
  const cx = 34 + 14 * Math.sin(t * 1.1 + 1);
  const cy = 20 + 9 * Math.sin(t * 1.7);
  const ex = 52 + 4 * Math.sin(t * 0.7 + 2);
  const ey = 15 + 6 * Math.sin(t * 1.4 + 0.5);

  const knob = (n) => (on ? -31 * wave01(t * (1.5 + n * 0.55) + n * 2.4) : 0);

  const blink = on && t % 4 > 3.85;
  const eyeScaleY = on ? (blink ? 0.12 : 1) : 0.12;
  const look = on ? { x: 1.4 * Math.sin(t * 0.9), y: 0.8 * Math.sin(t * 1.3) } : { x: 0, y: 0 };

  const smallLed = (col) => (on ? wave01(t * 4 + col * 1.7) > 0.45 : false);

  return (
    <svg width="145" height="177" viewBox="0 0 145 177" fill="none" style={{ display: 'block' }} aria-hidden="true">
      <defs>
        <mask id="ab-machine-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="145" height="177">
          <path d="M12 4.99999L4 13L0 17V21V171V177H6H122H128L132 173L140 165C140 165 142.13 162.531 143 160.5C143.923 158.346 144 155 144 155V6.99999C144 6.99999 144.28 3.27999 143 2C141.72 0.72001 138 0.999992 138 0.999992H22C22 0.999992 18.1537 1.07698 16 1.99999C13.9695 2.87021 12 4.99999 12 4.99999Z" fill="#FFFFFF" />
        </mask>
        <mask id="ab-globe-mask" maskUnits="userSpaceOnUse" x="6" y="8" width="18" height="18">
          <circle cx="15" cy="17" r="8.8" fill="#C4C4C4" />
        </mask>
        <mask id="ab-btn-mask" maskType="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
          <circle cx="20" cy="20" r="15" fill="#000" />
        </mask>
        <radialGradient id="ab-btn-ring" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 20) rotate(90) scale(20)">
          <stop offset="0.773481" stopColor="hsl(348deg 90% 25%)" />
          <stop offset="1" stopColor="hsl(350deg 100% 50%)" />
        </radialGradient>
        <linearGradient id="ab-btn-under" x1="40.7187" y1="20" x2="-1.25" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="hsl(350deg 100% 50%)" stopOpacity="0" />
          <stop offset="0.490056" stopColor="white" />
          <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ab-btn-top" x1="1" y1="0" x2="39.5" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="0.25" />
          <stop offset="0.508287" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.44" />
        </linearGradient>
        <linearGradient id="ab-btn-3d" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopOpacity="0.33" />
          <stop offset="1" stopColor="white" stopOpacity="0.21" />
        </linearGradient>
        <filter id="ab-btn-blur" x="2" y="18.5" width="36" height="19.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <filter id="ab-btn-hl" x="5.2" y="-2" width="29.5" height="10.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      {/* body */}
      <g mask="url(#ab-machine-mask)">
        <path d="M16 1L0 17H128L144 1H16Z" fill="#ABABAB" />
        <path d="M144 1L128 17V177L144 161V1Z" fill="#959595" />
        <rect y="17" width="128" height="160" fill="#C4C4C4" />
      </g>

      {/* sine-wave screen */}
      <g transform="translate(8 25)">
        <rect width="48" height="34" rx="4" fill="#2B2B2B" />
        <polyline points={sinePts} stroke="#32FF98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: 'opacity 350ms' }} />
      </g>

      {/* LED level meters */}
      <LedStrip x={64} y={25} lit={meter(0)} />
      <LedStrip x={64} y={43} lit={meter(1.9)} />

      {/* squiggle screen */}
      <g transform="translate(8 67)">
        <rect width="64" height="38" rx="4" fill="#2B2B2B" />
        <path d={`M ${f2(sx)},${f2(sy)} Q ${f2(cx)},${f2(cy)} ${f2(ex)},${f2(ey)}`} stroke="#FF27FF" strokeWidth="4" strokeLinecap="round" style={{ opacity: on ? 1 : 0, transition: 'opacity 750ms' }} />
      </g>

      {/* hexagon screen */}
      <g transform="translate(80 67)">
        <rect width="36" height="38" rx="4" fill="#2B2B2B" />
        <g transform="translate(5.2 5.8) scale(0.78)" style={{ opacity: on ? 1 : 0, transition: 'opacity 350ms' }} strokeWidth="2.5" strokeLinecap="round">
          {HEX_RINGS.map((r, n) => {
            const s = on ? 1 + 0.1 * Math.sin(t * 4 - n * 0.9) : 1;
            return (
              <polyline
                key={n}
                points={r.p}
                stroke={r.c}
                style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${f2(s)})` }}
              />
            );
          })}
        </g>
      </g>

      {/* sliders */}
      {[0, 1].map((n) => (
        <g key={n} transform={`translate(${8 + n * 24} 113)`}>
          <rect x="2" width="16" height="52" rx="4" fill="#2B2B2B" />
          {[5, 11, 17, 23, 29, 35, 41, 47].map((ly) => (
            <line key={ly} x1="6" y1={ly} x2="14" y2={ly} stroke="#fff" strokeOpacity="0.51" strokeWidth="2" />
          ))}
          <rect y="44" width="20" height="8" rx="4" fill="#FF27FF" style={{ transform: `translateY(${f2(knob(n))}px)`, transition: on ? 'none' : 'transform 450ms ease' }} />
        </g>
      ))}

      {/* globe + small LEDs */}
      <g transform="translate(60 113)">
        <rect width="30" height="52" rx="4" fill="#2B2B2B" />
        <g transform="translate(0 3)" style={{ opacity: on ? 1 : 0, transition: 'opacity 650ms' }}>
          <circle cx="15" cy="17" r="11" stroke="#1AD9FF" strokeWidth="2" transform="translate(0 -2)" />
          <g mask="url(#ab-globe-mask)" stroke="#32FF98" strokeWidth="2" strokeLinejoin="round" transform="translate(0 -2)">
            <g className={on ? 'ab-globe-spin' : undefined}>
              {CONTINENTS.map((d, n) => <path key={n} d={d} />)}
              <g transform="translate(26.5 0)">{CONTINENTS.map((d, n) => <path key={n} d={d} />)}</g>
            </g>
          </g>
        </g>
        <g transform="translate(2 36)">
          {[0, 1, 2, 3].map((col) => (
            [5, 11].map((cy, row) => (
              <circle
                key={`${col}-${row}`}
                cx={5 + col * 6}
                cy={cy}
                r="2"
                fill={LED_COLORS[col < 3 ? 0 : 3]}
                style={{ opacity: smallLed(col + row * 0.5) ? 1 : 0, transition: 'opacity 120ms' }}
              />
            ))
          ))}
        </g>
      </g>

      {/* eyes */}
      <g transform="translate(97 113)">
        <rect width="24" height="17" rx="4" fill="#2B2B2B" />
        {[7.5, 16.5].map((x) => (
          <g key={x} style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scaleY(${eyeScaleY})`, transition: 'transform 140ms' }}>
            <circle cx={x} cy="8.5" r="3.5" fill="#fff" />
            <circle cx={x + look.x} cy={8.5 + look.y} r="1.5" fill="#2B2B2B" />
          </g>
        ))}
      </g>

      {/* big red button */}
      <g transform="translate(95 136) scale(0.75)" style={{ filter: on ? 'drop-shadow(0 0 5px hsl(350deg 100% 55%))' : 'none', transition: 'filter 250ms' }}>
        <circle cx="20" cy="20" r="20" fill="#2B2B2B" />
        <path d="M40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20ZM4.81942 20C4.81942 28.384 11.616 35.1806 20 35.1806C28.384 35.1806 35.1806 28.384 35.1806 20C35.1806 11.616 28.384 4.81942 20 4.81942C11.616 4.81942 4.81942 11.616 4.81942 20Z" fill="url(#ab-btn-ring)" />
        <g filter="url(#ab-btn-blur)">
          <path d="M36.5 20C36.5 24.3761 34.7616 28.5729 31.6673 31.6673C28.5729 34.7616 24.3761 36.5 20 36.5C15.6239 36.5 11.4271 34.7616 8.33274 31.6673C5.23839 28.5729 3.5 24.3761 3.5 20" stroke="url(#ab-btn-under)" strokeOpacity="0.5" strokeLinecap="round" />
        </g>
        <g filter="url(#ab-btn-hl)">
          <path d="M8.21985 5.39015C11.4832 2.56555 15.6528 1.00752 19.9687 1.00003C24.2847 0.992532 28.4597 2.53607 31.7328 5.34932" stroke="url(#ab-btn-top)" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g mask="url(#ab-btn-mask)">
          <g style={{ transform: `translateY(${on ? 3 : 0}px)`, transition: 'transform 150ms' }}>
            <circle cx="20" cy="20" r="15" fill={on ? 'hsl(350deg 100% 55%)' : 'hsl(350deg 100% 50%)'} />
            <circle cx="20" cy="20" r="13" fill="url(#ab-btn-3d)" />
          </g>
        </g>
      </g>
    </svg>
  );
};

/* Linecraft (C:\Design Linecraft). Deployed on Vercel. */
const LINECRAFT_URL = 'https://linecraft-alpha.vercel.app/';

const MachineCard = () => {
  const [on, setOn] = useState(false);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!on) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setT(1.3);
      return undefined;
    }
    let raf;
    let last = 0;
    const start = performance.now();
    const loop = (now) => {
      if (now - last > 32) {
        last = now;
        setT((now - start) / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  return (
    <Card area="side" className="ab-machine" index={6}>
      <button
        className="ab-machine-btn"
        aria-pressed={on}
        onClick={() => { setOn(!on); tone(on ? 300 : 500, 0.2, 'sine', 0.15, on ? 150 : 900); }}
      >
        <MachineArt on={on} t={t} />
        <span className="sr-only">Illustration of a small machine. Triggering this button powers on the machine. This is a purely cosmetic effect.</span>
      </button>
      <p>
        I enjoy building cool / weird stuff with code. A few years ago, I built a{' '}
        <a href={LINECRAFT_URL} target="_blank" rel="noreferrer">generative art machine</a> that lets users create funky line art by dragging sliders.
      </p>
    </Card>
  );
};

/* ─── 8. Owl ─────────────────────────────────────────────────────────────── */

const OwlCard = () => {
  const [tilt, setTilt] = useState(0);
  const [blink, setBlink] = useState(false);
  const nudge = () => {
    tone(520, 0.2, 'sine', 0.1, 380);
    setTilt((t) => (t === 0 ? -7 : t < 0 ? 6 : -7));
    setBlink(true);
    setTimeout(() => setBlink(false), 180);
  };
  return (
    <Card area="cat" className="ab-cat" index={7}>
      <button className="ab-cat-btn" onClick={nudge} aria-label="Poke the cat">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="150" viewBox="0 0 230 240" aria-hidden="true">
          <path fill="#FFE62A" stroke="var(--ab-outline)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M150 196c14-4 38-4 52 4 6 4 4 12-4 14-14 3-34 2-48-2z" />
          <g style={{ transform: `rotate(${tilt - 10}deg)`, transformOrigin: '110px 130px', transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <path fill="#8B6B4A" stroke="var(--ab-outline)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10" d="M26 72L20 20l48 22c14-7 28-10 42-10s28 3 42 10l48-22-6 52c8 14 12 30 12 46 0 50-42 82-96 82S14 168 14 118c0-16 4-32 12-46z" />
            <path fill="#C9A77C" d="M110 140c34 0 58 20 58 44 0 14-8 24-20 30-12 6-26 8-38 8s-26-2-38-8c-12-6-20-16-20-30 0-24 24-44 58-44z" />
            <path stroke="#8B6B4A" strokeLinecap="round" strokeWidth="5" d="M84 176l6 6 6-6M110 184l6 6 6-6M104 166l6 6 6-6" />
            <circle cx="76" cy="98" r="30" fill="#fff" stroke="var(--ab-outline)" strokeWidth="8" />
            <circle cx="146" cy="98" r="30" fill="#fff" stroke="var(--ab-outline)" strokeWidth="8" />
            {blink ? (
              <path stroke="var(--ab-outline)" strokeLinecap="round" strokeWidth="6" d="M64 100q12 8 24 0M134 100q12 8 24 0" />
            ) : (
              <>
                <circle cx="82" cy="100" r="14" fill="var(--ab-outline)" />
                <circle cx="140" cy="100" r="14" fill="var(--ab-outline)" />
                <circle cx="87" cy="94" r="4.5" fill="#fff" />
                <circle cx="145" cy="94" r="4.5" fill="#fff" />
              </>
            )}
            <path fill="#FFE62A" stroke="var(--ab-outline)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M99 122h22l-11 20z" />
          </g>
          <path fill="#8B6B4A" stroke="var(--ab-outline)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M190 150c16-4 32 4 34 16 2 12-12 20-28 16z" />
        </svg>
      </button>
      <div className="ab-cat-text">
        <p>I’m a night owl who has to be at work by 9, so I’ve made peace with coffee.</p>
        <p>I love cooking but burn toast regularly. Please judge my code, not my kitchen.</p>
      </div>
    </Card>
  );
};

/* ─── 9. Talks & 10. Courses ─────────────────────────────────────────────── */

const GMDC_SLIDES = [
  { type: 'img', src: '/images/gmdc/GMDC_IMG02.jpeg', alt: 'On-site visit at the GMDC mining area, Bhavnagar' },
  { type: 'img', src: '/images/gmdc/GMDC_IMG03.jpeg', alt: 'Meeting with the GMDC team' },
  { type: 'video', src: '/images/gmdc/GMDC_VID01.mp4', alt: 'Visit to GMDC Mining, Bhavnagar' },
];

/* Images auto-advance; the last slide is the video, which plays when it comes into view. */
const GmdcSlider = () => {
  const [i, setI] = useState(0);
  const videoRef = useRef(null);
  const last = GMDC_SLIDES.length - 1;
  const go = (n) => setI((n + GMDC_SLIDES.length) % GMDC_SLIDES.length);

  useEffect(() => {
    if (i === last) return undefined;
    const t = setTimeout(() => setI(i + 1), 3500);
    return () => clearTimeout(t);
  }, [i, last]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (i === last) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [i, last]);

  return (
    <div className="ab-slider" role="group" aria-roledescription="carousel" aria-label="GMDC visit photos and video">
      <div className="ab-slider-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {GMDC_SLIDES.map((s, n) => (
          <div className="ab-slide" key={s.src} aria-hidden={n !== i}>
            {s.type === 'img' ? (
              <img src={s.src} alt={s.alt} loading="lazy" />
            ) : (
              <video ref={videoRef} src={s.src} controls muted playsInline preload="metadata" aria-label={s.alt} onEnded={() => go(0)} />
            )}
          </div>
        ))}
      </div>
      <button type="button" className="ab-slider-btn ab-prev" onClick={() => go(i - 1)} aria-label="Previous slide">‹</button>
      <button type="button" className="ab-slider-btn ab-next" onClick={() => go(i + 1)} aria-label="Next slide">›</button>
      <div className="ab-slider-dots">
        {GMDC_SLIDES.map((s, n) => (
          <button type="button" key={s.src} className={n === i ? 'on' : ''} onClick={() => go(n)} aria-label={`Go to slide ${n + 1}`} />
        ))}
      </div>
    </div>
  );
};

const TalksCard = () => (
  <Card area="conf" className="ab-talks" index={8}>
    <GmdcSlider />
    <p className="ab-gmdc-title">GMDC Digital Mining System</p>
    <p>
      I visited GMDC Mining, Bhavnagar, and worked with government clients to understand the mining flow first-hand for this project.
    </p>
    <ul className="ab-links ab-highlights">
      <Highlight>On-site visit to GMDC Mining, Bhavnagar</Highlight>
      <Highlight>Mapped the mining flow with government clients</Highlight>
      <Highlight>Presented to Shri Roopwant Singh, IAS (MD)</Highlight>
    </ul>
    <p className="small">
      One of the biggest projects of my career, and my best experience in government work so far.
    </p>
  </Card>
);

const Highlight = ({ children }) => (
  <li>
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ab-arrow" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {children}
    </span>
  </li>
);

const CoursesCard = () => {
  const [boxOpen, setBoxOpen] = useState(false);
  return (
  <Card area="job" className="ab-courses" index={9}>
    <motion.button
      className="ab-mascot"
      onClick={() => { setBoxOpen(!boxOpen); tone(260, 0.2, 'triangle', 0.2, 520); }}
      aria-label="Poke the mascot"
      whileHover={{ rotate: -4, scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ y: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }}
    >
      <img src="/images/krish/star.svg" alt="" />
      {boxOpen && <motion.span className="ab-mascot-msg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>Hello! 👋</motion.span>}
    </motion.button>
    <p className="ab-first">
      I’m a Software Developer currently working on <strong>GMDC Mining</strong>, a large-scale government project and one of the biggest of my career.
    </p>
    <p>
      I don’t build from assumptions. I visited the mine in Bhavnagar in person and met the Mining Manager and the on-site team to understand the current workflow and what the system truly needs to solve.
    </p>
    <p>
      <em><CountUp to={5} />+ projects</em> delivered, including two large-scale ones:
    </p>
    <ul className="ab-links ab-highlights">
      <Highlight>GMDC Mining: Digital Mining System</Highlight>
      <Highlight>Adani: large-scale enterprise project</Highlight>
      <Highlight>Hands-on work with government departments</Highlight>
    </ul>
  </Card>
  );
};

/* ─── page ───────────────────────────────────────────────────────────────── */

export const AboutPage = () => {
  const { isDark } = useTheme();

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  // While the hero's sky is still behind the header, let the header bar match it (see AboutPage.css)
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const hero = document.querySelector('.ab-hero');
      const bottom = hero ? hero.getBoundingClientRect().bottom : 0;
      // the clouds fill the lower part of the hero, so stop a little before its bottom edge
      root.dataset.overHero = bottom > 380 ? 'true' : 'false';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      delete root.dataset.overHero;
    };
  }, []);

  return (
    <main className="ab-page" id="main-content">
      {/* Hero */}
      <section className="ab-hero">
        <div className="ab-cloud-layer ab-cloud-layer-back" aria-hidden="true">
          <svg className="ab-cloud-svg" width="5120" height="456" viewBox="0 0 5120 456" preserveAspectRatio="none" fill="none">
            <path className="ab-cloud-a" d={CLOUD_BACK} />
            <path className="ab-cloud-b" d={CLOUD_MID} />
          </svg>
        </div>

        <div className="ab-cloud-layer ab-cloud-layer-front" aria-hidden="true">
          <svg className="ab-cloud-svg" width="5120" height="456" viewBox="0 0 5120 456" preserveAspectRatio="none" fill="none">
            <path className="ab-cloud-front" d={CLOUD_FRONT_WIDE} />
          </svg>
        </div>

        <RainbowArt isDark={isDark} />

        <div className="ab-hero-inner">
          <motion.div
            className="ab-hero-text"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <MaskedHeading
              tag="h1"
              text="Hi there! I'm Krish."
              mediaType="image"
              src="/images/mask-water.jpg"
              fillScale={1.3}
              parallax={34}
              reveal="rise"
              trigger="view"
              spotlight
              spotlightRadius={200}
              drift={10}
              hoverZoom={0.06}
              saturation={1.15}
              weight={800}
              tracking={-0.01}
              lineHeight={1.1}
              textScale={0.11}
              align="left"
              style={{ fontFamily: 'var(--font-display)', margin: '0 0 1.5rem' }}
            />
            <h2 className="sr-only">Krish Patel, Full Stack Developer in Ahmedabad, India</h2>
            <p>I write code for the web, and these days for trucks, weighbridges and boom barriers too.</p>
            <p>
              I&apos;m a Full Stack Developer from Ahmedabad, building government systems with React, Next.js,
              TypeScript and Node.js. Right now I&apos;m the sole developer of a live truck dispatch platform for GMDC Mining.
            </p>
            <a className="ab-open" href="/contact">
              <span className="ab-open-dot" aria-hidden="true" />
              <span className="ab-open-label">Open to work</span>
              <span className="ab-open-cta">Let&apos;s talk &rarr;</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Cards */}
      <section className="ab-grid-wrap">
        <div className="ab-grid">
          <MapCard isDark={isDark} />
          <FlagCard />
          <NameCard />
          <HeightCard />
          <DrumCard />
          <DeskCard />
          <MachineCard />
          <OwlCard />
          <TalksCard />
          <CoursesCard />
        </div>
      </section>
    </main>
  );
};
