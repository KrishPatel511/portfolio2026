import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiLink, FiCheck, FiLinkedin } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';
import { usePath } from '../../utils/router';
import { HeaderSplash } from '../SplashCursor/HeaderSplash';
import { PageTitle } from '../MaskedHeading/PageTitle';
import { StarButton } from '../StarBorder/StarButton';
import { BlogCover } from './BlogCover';
import { BODIES } from '../../blog/content';
import { POSTS, formatDate, getPost, postPath } from '../../blog/meta';
import { SITE_URL } from '../../seo/routes';
import '../Pages/Pages.css';
import './Blog.css';

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* **bold**, `code` and [text](link) inside a line of text */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const Inline = ({ text }) =>
  text.split(INLINE).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={i} href={link[2]}>{link[1]}</a>;
    return part;
  });

const Block = ({ block }) => {
  const [type, a, b] = block;
  if (type === 'h2') return <h2 id={slugify(a)}>{a}</h2>;
  if (type === 'p') return <p><Inline text={a} /></p>;
  if (type === 'ul') return <ul>{a.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>;
  if (type === 'callout') return <aside className="bl-callout"><Inline text={a} /></aside>;
  if (type === 'code') {
    return (
      <figure className="bl-code">
        <figcaption>{a}</figcaption>
        <pre><code>{b}</code></pre>
      </figure>
    );
  }
  return null;
};

/* A thin bar at the top of the screen that fills as the article is read */
const ReadingProgress = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const article = document.getElementById('article-body');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      setValue(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return <div className="bl-progress" style={{ transform: `scaleX(${value})` }} role="presentation" />;
};

const ShareRow = ({ post }) => {
  const [copied, setCopied] = useState(false);
  const url = SITE_URL + postPath(post.slug);

  const copy = async () => {
    soundFx.playPop();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bl-share">
      <span>Share this post</span>
      <button type="button" className="bl-share-btn" onClick={copy}>
        {copied ? <FiCheck size={15} /> : <FiLink size={15} />} {copied ? 'Link copied' : 'Copy link'}
      </button>
      <a
        className="bl-share-btn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        onClick={() => soundFx.playPop()}
      >
        <FiLinkedin size={15} /> LinkedIn
      </a>
    </div>
  );
};

export const BlogPostPage = () => {
  const path = usePath();
  const post = getPost(path.replace('/blog/', ''));
  if (!post) return null;

  const body = BODIES[post.slug] || [];
  const headings = body.filter(([type]) => type === 'h2').map(([, text]) => text);
  const index = POSTS.indexOf(post);
  const newer = POSTS[index - 1];
  const older = POSTS[index + 1];

  return (
    <main id="main-content" className="pg-wrapper" style={{ '--accent': post.color }}>
      <ReadingProgress />
      <div className="pg-container pg-container--narrow">
        <a className="pg-back" href="/blog" onClick={() => soundFx.playPop()}>
          <FiArrowLeft size={15} /> All posts
        </a>

        <header className="pg-header">
          <HeaderSplash />
          <span className="pg-kicker">{post.category}</span>
          <PageTitle text={post.title} texture={post.texture} />
          <p className="pg-sub">{post.description}</p>
          <p className="bl-meta bl-meta--post">
            <span><FiCalendar size={14} aria-hidden="true" /> <time dateTime={post.date}>{formatDate(post.date)}</time></span>
            <span><FiClock size={14} aria-hidden="true" /> {post.readTime}</span>
            <span className="bl-by">By Krish Patel</span>
          </p>
          <ul className="bl-tags" aria-label="Topics">
            {post.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </header>

        <BlogCover post={post} size="hero" />

        {headings.length > 2 && (
          <nav className="bl-toc" aria-label="On this page">
            <strong>On this page</strong>
            <ol>
              {headings.map((h) => <li key={h}><a href={`#${slugify(h)}`}>{h}</a></li>)}
            </ol>
          </nav>
        )}

        <article id="article-body" className="bl-article">
          {body.map((block, i) => <Block key={i} block={block} />)}
        </article>

        <ShareRow post={post} />

        <aside className="bl-author">
          <span className="bl-author-badge" aria-hidden="true">KP</span>
          <div>
            <strong>Krish Patel</strong>
            <p>Full Stack Developer in Ahmedabad building React, Next.js and Node.js systems for government and enterprise clients.</p>
            <p className="bl-author-links">
              <a href={post.project.href}>{post.project.label}</a>
              <a href="/contact">Work with me</a>
            </p>
          </div>
        </aside>

        {(newer || older) && (
          <nav className="bl-pager" aria-label="More posts">
            {older ? (
              <a className="bl-pager-link" href={postPath(older.slug)} onClick={() => soundFx.playPop()}>
                <span><FiArrowLeft size={14} /> Previous</span>
                <strong>{older.title}</strong>
              </a>
            ) : <span />}
            {newer ? (
              <a className="bl-pager-link bl-pager-link--next" href={postPath(newer.slug)} onClick={() => soundFx.playPop()}>
                <span>Next <FiArrowRight size={14} /></span>
                <strong>{newer.title}</strong>
              </a>
            ) : <span />}
          </nav>
        )}

        <div className="pg-actions">
          <StarButton as="a" primary href="/blog" onClick={() => soundFx.playPop()}>All posts</StarButton>
          <StarButton as="a" href="/contact" onClick={() => soundFx.playPop()}>Discuss a project</StarButton>
        </div>
      </div>
    </main>
  );
};
