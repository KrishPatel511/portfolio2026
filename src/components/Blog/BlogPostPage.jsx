import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { FiAlertOctagon, FiAlertTriangle, FiArrowRight, FiCheck, FiCheckCircle, FiCopy, FiHeart, FiInfo, FiLink } from 'react-icons/fi';
import { SiFramer, SiGooglegemini, SiGreensock, SiLighthouse, SiMaplibre, SiNodedotjs, SiPostgresql, SiReact, SiVite } from 'react-icons/si';
import { soundFx } from '../../utils/soundEffects';
import { usePath } from '../../utils/router';
import { BODIES } from '../../blog/content';
import { POSTS, formatDate, getPost, postPath } from '../../blog/meta';
import { SITE_URL } from '../../seo/routes';
import './Blog.css';

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ── Inline text: **bold**, *italic*, `code` and [text](link) ─────────────── */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const Inline = ({ text }) =>
  text.split(INLINE).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={i} href={link[2]}>{link[1]}</a>;
    return part;
  });

/* ── Code: a small colouring pass (comments, strings, keywords, numbers) ───── */
const TOKEN = /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|if|else|throw|new|from|import|export|return|await|async|function|for|of|in|true|false|null)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)(?=\s*:)/gm;

const Highlighted = ({ code }) => {
  const out = [];
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 'n' : 'p';
    out.push(<span key={m.index} className={`bl-tok-${cls}`}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(code.slice(last));
  return out;
};

const CodeBlock = ({ code }) => {
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
  react: SiReact, vite: SiVite, gsap: SiGreensock, framer: SiFramer, maplibre: SiMaplibre,
  lighthouse: SiLighthouse, node: SiNodedotjs, postgres: SiPostgresql, gemini: SiGooglegemini,
};
const Stack = ({ items }) => (
  <ul className="bl-stack" style={{ '--cols': items.length === 6 ? 3 : Math.min(items.length, 4) }}>
    {items.map(([name, note, icon]) => {
      const Icon = STACK_ICONS[icon] || FiInfo;
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

const Heading = ({ text }) => {
  const id = slugify(text);
  return (
    <h2 id={id}>
      <a className="bl-anchor" href={`#${id}`} aria-label={`Link to ${text}`}><FiLink size={18} /></a>
      {text}
    </h2>
  );
};

const Block = ({ block }) => {
  const [type, a, b, c] = block;
  if (type === 'h2') return <Heading text={a} />;
  if (type === 'p') return <p><Inline text={a} /></p>;
  if (type === 'ul') return <ul className="bl-ul">{a.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>;
  if (type === 'ol') return <ol className="bl-ol">{a.map((item) => <li key={item}><Inline text={item} /></li>)}</ol>;
  if (type === 'code') return <CodeBlock code={b} />;
  if (type === 'aside') return <Aside kind={a} title={b} text={c} />;
  if (type === 'stack') return <Stack items={a} />;
  return null;
};

/* ── A heart that pops confetti. Nothing is counted or sent anywhere. ────── */
const LikeButton = ({ slug }) => {
  const key = `liked:${slug}`;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try { setLiked(localStorage.getItem(key) === '1'); } catch { /* storage blocked */ }
  }, [key]);

  const toggle = (event) => {
    soundFx.playPop();
    const next = !liked;
    setLiked(next);
    try { localStorage.setItem(key, next ? '1' : '0'); } catch { /* storage blocked */ }
    if (next) {
      const rect = event.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 40, spread: 70, startVelocity: 25, scalar: 0.8,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ['#f43f5e', '#ec4899', '#818cf8', '#fbbf24'],
      });
    }
  };

  return (
    <button type="button" className={`bl-like ${liked ? 'is-liked' : ''}`} onClick={toggle} aria-pressed={liked} aria-label="Like this post">
      <FiHeart size={34} />
      <span>{liked ? 'Thanks!' : 'Like'}</span>
    </button>
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
        {post.updated !== post.date && (
          <p className="bl-filed"><em>Last updated on</em> <time dateTime={post.updated}>{formatDate(post.updated)}</time></p>
        )}
      </header>

      <article className="bl-article">
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
              <a href="/contact" onClick={() => soundFx.playPop()}><FiArrowRight size={18} /> Work with me</a>
            </li>
          </ul>
        </section>
      </article>

      <LikeButton slug={post.slug} />
    </main>
  );
};
