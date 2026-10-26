import React, { useState } from 'react';
import { FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';
import { HeaderSplash } from '../SplashCursor/HeaderSplash';
import { PageTitle } from '../MaskedHeading/PageTitle';
import { BlogCover } from './BlogCover';
import { BLOG_SUB, BLOG_TITLE, POSTS, formatDate, postPath } from '../../blog/meta';
import '../Pages/Pages.css';
import './Blog.css';

const CATEGORIES = ['All', ...new Set(POSTS.map((p) => p.category))];

const PostMeta = ({ post }) => (
  <p className="bl-meta">
    <span><FiCalendar size={13} aria-hidden="true" /> <time dateTime={post.date}>{formatDate(post.date)}</time></span>
    <span><FiClock size={13} aria-hidden="true" /> {post.readTime}</span>
  </p>
);

const PostCard = ({ post, featured }) => (
  <article className={`bl-card ${featured ? 'bl-card--featured' : ''}`} style={{ '--accent': post.color }}>
    <BlogCover post={post} size={featured ? 'wide' : 'card'} />
    <div className="bl-card-body">
      <span className="bl-pill">{featured ? 'Latest' : post.category}</span>
      <h2 className="bl-card-title">
        <a href={postPath(post.slug)} onClick={() => soundFx.playPop()}>{post.title}</a>
      </h2>
      <p className="bl-card-desc">{post.description}</p>
      <PostMeta post={post} />
      <ul className="bl-tags" aria-label="Topics">
        {post.tags.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <span className="bl-more" aria-hidden="true">Read article <FiArrowRight size={15} /></span>
    </div>
  </article>
);

export const BlogPage = () => {
  const [category, setCategory] = useState('All');
  const shown = POSTS.filter((p) => category === 'All' || p.category === category);
  const [first, ...rest] = shown;

  return (
    <main id="main-content" className="pg-wrapper">
      <div className="pg-container">
        <header className="pg-header">
          <HeaderSplash />
          <span className="pg-kicker">Blog</span>
          <PageTitle text={BLOG_TITLE} texture="violet" />
          <p className="pg-sub">{BLOG_SUB}</p>
        </header>

        <div className="bl-filters" role="group" aria-label="Filter posts by topic">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`bl-chip ${category === c ? 'is-active' : ''}`}
              aria-pressed={category === c}
              onClick={() => { soundFx.playPop(); setCategory(c); }}
            >
              {c}
            </button>
          ))}
        </div>

        {first && <PostCard post={first} featured />}

        {rest.length > 0 && (
          <div className="bl-grid">
            {rest.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        )}

        <p className="bl-footnote">
          More posts are on the way. Want me to write about something specific? <a href="/contact">Tell me</a>.
        </p>
      </div>
    </main>
  );
};
