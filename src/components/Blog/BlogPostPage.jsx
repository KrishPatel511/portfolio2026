import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  FiAlertOctagon, FiAlertTriangle, FiArrowRight, FiCheck, FiCheckCircle, FiCopy, FiExternalLink, FiGift, FiInfo, FiLink, FiPackage,
} from 'react-icons/fi';
import {
  SiFramer, SiGreensock, SiLighthouse, SiMaplibre, SiOxc, SiReact, SiResend, SiSupabase, SiVercel, SiVite,
} from 'react-icons/si';
import { soundFx } from '../../utils/soundEffects';
import { usePath } from '../../utils/router';
import { BODIES } from '../../blog/content';
import { POSTS, formatDate, getPost, postPath } from '../../blog/meta';
import { SITE_URL } from '../../seo/routes';
import { Highlighted } from './BlogCode';
import { CodeFrame, Compare, Playground, RainbowDemo } from './BlogWidgets';
import './Blog.css';

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ── Inline text: **bold**, `code` and [text](link) ───────────────────────── */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const Inline = ({ text }) =>
  text.split(INLINE).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const external = /^https?:/.test(link[2]);
      return external ? (
        <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="bl-ext">
          {link[1]}
          <FiExternalLink size={14} aria-hidden="true" />
          <span className="bl-sr">(opens in new tab)</span>
        </a>
      ) : (
        <a key={i} href={link[2]}>{link[1]}</a>
      );
    }
    return part;
  });

const CodeBlock = ({ code, file }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    soundFx.playPop();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };
  return (
    <div className="bl-code bl-wide">
      {file && <span className="bl-code-file">{file}</span>}
      <button type="button" className="bl-copy" onClick={copy} aria-label="Copy code to clipboard">
        {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy'}
      </button>
      <pre><code><Highlighted code={code} /></code></pre>
    </div>
  );
};

/* ── Side notes ───────────────────────────────────────────────────────────── */
const ASIDE_ICONS = { info: FiInfo, success: FiCheckCircle, warning: FiAlertTriangle, error: FiAlertOctagon };
const Aside = ({ kind, title, text }) => {
  const Icon = ASIDE_ICONS[kind] || FiInfo;
  return (
    <aside className={`bl-aside bl-aside--${kind} bl-wide`}>
      <span className="bl-aside-icon" aria-hidden="true"><Icon size={20} /></span>
      <strong className="bl-aside-title">{title}</strong>
      <p><Inline text={text} /></p>
    </aside>
  );
};

/* ── Tool cards (a wide grid, like a "my stack" list) ─────────────────────── */
const STACK_ICONS = {
  react: SiReact, vite: SiVite, gsap: SiGreensock, framer: SiFramer, maplibre: SiMaplibre, supabase: SiSupabase,
  resend: SiResend, vercel: SiVercel, lighthouse: SiLighthouse, oxc: SiOxc, confetti: FiGift, icons: FiPackage,
};
const Stack = ({ items }) => (
  <ul className="bl-stack" style={{ '--cols': items.length % 4 === 0 ? 4 : items.length % 3 === 0 ? 3 : Math.min(items.length, 4) }}>
    {items.map(([name, note, icon]) => {
      const Icon = STACK_ICONS[icon] || FiPackage;
      return (
        <li key={name}>
          <Icon size={44} aria-hidden="true" />
          <strong>{name}</strong>
          <span>{note}</span>
        </li>
      );
    })}
  </ul>
);

const Figure = ({ src, alt, caption }) => (
  <figure className="bl-figure bl-wide">
    <img src={src} alt={alt} loading="lazy" />
    <figcaption>{caption}</figcaption>
  </figure>
);

/* ── Live demos, in a small bordered shell ────────────────────────────────── */
const SOUNDS = [
  ['Pop', () => soundFx.playPop()],
  ['Chime', () => soundFx.playChime()],
  ['Whoosh', () => soundFx.playWhoosh()],
  ['Toggle', () => soundFx.playToggle()],
];
const SoundDemo = () => {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const tick = setInterval(() => setOn(soundFx.enabled), 500);
    return () => clearInterval(tick);
  }, []);
  const fire = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 45, spread: 65, scalar: 0.85,
      origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
      colors: ['#38bdf8', '#818cf8', '#f43f5e', '#fbbf24', '#34d399'],
    });
  };
  return (
    <div className="bl-demo bl-wide">
      <p className="bl-demo-title">Synthesized sounds</p>
      <div className="bl-demo-row">
        {SOUNDS.map(([label, play]) => (
          <button key={label} type="button" className="bl-demo-btn" onClick={play}>{label}</button>
        ))}
        <button type="button" className="bl-demo-btn bl-demo-btn--alt" onClick={fire}>Confetti</button>
      </div>
      <p className="bl-demo-note">
        {on ? 'No audio files: each sound is generated in your browser.' : 'Sound is off. Turn it on with the speaker icon in the header.'}
      </p>
    </div>
  );
};
const DEMOS = { sound: SoundDemo };

const Heading = ({ text }) => {
  const id = slugify(text);
  return (
    <h2 id={id}>
      <a className="bl-anchor" href={`#${id}`}>
        <FiLink size={18} aria-hidden="true" />
        <span className="bl-sr">Link to this heading</span>
      </a>
      {text}
    </h2>
  );
};

const Block = ({ block }) => {
  const [type, a, b, c, d] = block;
  if (type === 'h2') return <Heading text={a} />;
  if (type === 'h3') return <h3 id={slugify(a)}>{a}</h3>;
  if (type === 'p') return <p><Inline text={a} /></p>;
  if (type === 'ul') return <ul className="bl-ul">{a.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>;
  if (type === 'ol') return <ol className="bl-ol">{a.map((item) => <li key={item}><Inline text={item} /></li>)}</ol>;
  if (type === 'code') return <CodeBlock code={b} file={c} />;
  if (type === 'aside') return <Aside kind={a} title={b} text={c} />;
  if (type === 'stack') return <Stack items={a} />;
  if (type === 'figure') return <Figure src={a} alt={b} caption={c} />;
  if (type === 'compare') return <Compare title={a} items={b} />;
  if (type === 'codeframe') return <CodeFrame title={a} code={b} themes={c} />;
  if (type === 'playground') return <Playground />;
  if (type === 'rainbow') return <RainbowDemo />;
  if (type === 'demo') {
    const Demo = DEMOS[a];
    return Demo ? <Demo /> : null;
  }
  void d;
  return null;
};

/* ── The heart ────────────────────────────────────────────────────────────────
   It stays out of the way: hidden at the top of the page, it fades in once you start reading,
   fades away again when you stop moving or scrolling, and comes back on the next movement.
   Each click fills it a little more (up to 16). Nothing is counted or sent anywhere. */
const MAX_LIKES = 16;

const HEART_PATH = 'M25 40 C 8 28, 2 20, 2 12.5 C 2 6.5, 6.5 2, 12.5 2 C 17.5 2, 22 5, 25 10 C 28 5, 32.5 2, 37.5 2 C 43.5 2, 48 6.5, 48 12.5 C 48 20, 42 28, 25 40 Z';

/* A round little heart with a sleepy face. It starts grey and fills with pink from the bottom as you click. */
const HeartIcon = ({ fill, happy }) => (
  <svg viewBox="0 0 50 44" width="52" height="46" fill="none" aria-hidden="true">
    <defs>
      <clipPath id="bl-heart-clip"><rect x="0" y={42 - 40 * fill} width="50" height="44" /></clipPath>
    </defs>
    <path className="bl-heart-base" d={HEART_PATH} />
    <path className="bl-heart-fill" d={HEART_PATH} clipPath="url(#bl-heart-clip)" />
    <g className="bl-heart-face">
      <ellipse cx="18" cy="20" rx="2.2" ry={happy ? 2.6 : 1.4} />
      <ellipse cx="32" cy="20" rx="2.2" ry={happy ? 2.6 : 1.4} />
      <path d={happy ? 'M21 25 Q25 30 29 25' : 'M22 26 Q25 28 28 26'} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </svg>
);

const useLikes = (slug) => {
  const key = `likes:${slug}`;
  const [count, setCount] = useState(0);
  useEffect(() => {
    try { setCount(Math.min(MAX_LIKES, Number(localStorage.getItem(key)) || 0)); } catch { /* storage blocked */ }
  }, [key]);
  const add = () => {
    setCount((c) => {
      const next = Math.min(MAX_LIKES, c + 1);
      try { localStorage.setItem(key, String(next)); } catch { /* storage blocked */ }
      return next;
    });
  };
  return [count, add];
};

const burst = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  confetti({
    particleCount: 24, spread: 70, startVelocity: 22, scalar: 0.75, ticks: 90,
    origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
    colors: ['#f43f5e', '#ec4899', '#818cf8', '#fbbf24'],
  });
};

const LikeButton = ({ slug, floating }) => {
  const [count, add] = useLikes(slug);
  const [bounce, setBounce] = useState(false);
  const [shown, setShown] = useState(!floating);
  const hovering = useRef(false);

  useEffect(() => {
    if (!floating) return undefined;
    let idle;
    const update = () => {
      const article = document.getElementById('article-body');
      const rect = article ? article.getBoundingClientRect() : null;
      const reading = window.scrollY > 320 && rect && rect.bottom > window.innerHeight * 0.45;
      clearTimeout(idle);
      if (!reading) { setShown(false); return; }
      setShown(true);
      idle = setTimeout(() => { if (!hovering.current) setShown(false); }, 3200);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('mousemove', update, { passive: true });
    return () => {
      clearTimeout(idle);
      window.removeEventListener('scroll', update);
      window.removeEventListener('mousemove', update);
    };
  }, [floating]);

  const click = (event) => {
    soundFx.playPop();
    if (count < MAX_LIKES) burst(event);
    add();
    setBounce(true);
    setTimeout(() => setBounce(false), 260);
  };

  return (
    <div
      className={`bl-like-wrap ${floating ? 'is-floating' : 'is-inline'} ${shown ? 'is-shown' : ''} ${count > 0 ? 'has-likes' : ''}`}
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      <button type="button" className={`bl-like ${bounce ? 'is-bouncing' : ''}`} onClick={click} aria-label={`Like this post. You have liked it ${count} of ${MAX_LIKES} times.`}>
        <HeartIcon fill={count / MAX_LIKES} happy={count > 0} />
      </button>
      <span className="bl-like-count" aria-hidden="true">{count > 0 ? `${count}/${MAX_LIKES}` : 'Like'}</span>
    </div>
  );
};

/* ── Sky and clouds along the top of the page ─────────────────────────────── */
const CloudBanner = () => (
  <div className="bl-sky" aria-hidden="true">
    <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
      <path className="bl-cloud bl-cloud--far" d="M0 120 C80 70 150 90 220 112 C300 60 400 50 470 100 C560 40 690 60 740 112 C830 62 940 56 1010 108 C1100 50 1220 60 1280 104 C1340 70 1400 80 1440 100 L1440 220 L0 220 Z" />
      <path className="bl-cloud bl-cloud--mid" d="M0 150 C90 120 170 130 240 150 C330 100 440 105 520 148 C610 108 720 112 800 152 C890 112 1010 108 1090 150 C1180 112 1310 118 1440 146 L1440 220 L0 220 Z" />
      <path className="bl-cloud bl-cloud--near" d="M0 186 C110 160 200 170 300 184 C420 150 560 152 680 184 C800 156 940 156 1060 184 C1180 160 1320 164 1440 182 L1440 220 L0 220 Z" />
    </svg>
  </div>
);

export const BlogPostPage = () => {
  const path = usePath();
  const post = getPost(path.replace('/blog/', ''));
  if (!post) return null;

  const body = BODIES[post.slug] || [];
  const others = POSTS.filter((p) => p.slug !== post.slug);

  const copyLink = async () => {
    soundFx.playPop();
    try { await navigator.clipboard.writeText(SITE_URL + postPath(post.slug)); } catch { /* clipboard blocked */ }
  };

  return (
    <main id="main-content" className="bl-main">
      <CloudBanner />

      <header className="bl-head">
        <h1 className="bl-title">{post.title}</h1>
        <p className="bl-subtitle">{post.subtitle}</p>
        <p className="bl-filed">
          <em>Filed under</em> <strong>{post.category}</strong> <em>on</em> <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <p className="bl-filed"><em>Last updated on</em> <time dateTime={post.updated}>{formatDate(post.updated)}</time></p>
      </header>

      <article id="article-body" className="bl-article">
        {body.map((block, i) => <Block key={i} block={block} />)}

        <footer className="bl-end">
          <div>
            <span className="bl-end-label">Last updated on</span>
            <time dateTime={post.updated}>{formatDate(post.updated)}</time>
          </div>
          <div className="bl-end-right">
            <span className="bl-end-label">Share</span>
            <button type="button" className="bl-end-btn" onClick={copyLink}><FiLink size={14} /> Copy link</button>
          </div>
        </footer>

        <LikeButton slug={post.slug} floating={false} />

        <section className="bl-more" aria-labelledby="more-heading">
          <h2 id="more-heading" className="bl-more-title">Keep reading</h2>
          <ul>
            <li>
              <a href={post.project.href} onClick={() => soundFx.playPop()}><FiArrowRight size={18} /> {post.project.label}</a>
            </li>
            {others.map((p) => (
              <li key={p.slug}>
                <a href={postPath(p.slug)} onClick={() => soundFx.playPop()}><FiArrowRight size={18} /> {p.title}</a>
              </li>
            ))}
            <li>
              <a href="/projects" onClick={() => soundFx.playPop()}><FiArrowRight size={18} /> Browse my projects</a>
            </li>
            <li>
              <a href="/contact" onClick={() => soundFx.playPop()}><FiArrowRight size={18} /> Work with me</a>
            </li>
          </ul>
        </section>
      </article>

      <LikeButton slug={post.slug} floating />
    </main>
  );
};
