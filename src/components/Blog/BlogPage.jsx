import { useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { BLOG_SUB, BLOG_TITLE, POSTS, formatDate, postPath } from '../../blog/meta';
import './Blog.css';

const CATEGORIES = ['All', ...new Set(POSTS.map((p) => p.category))];

/* The blog index. Plain white cards on a pale sky-blue page, one idea per card: title,
   a grey one-line subtitle, the summary, and a "Read more" link. No pictures needed. */
export const BlogPage = () => {
  const [category, setCategory] = useState('All');
  const shown = POSTS.filter((p) => category === 'All' || p.category === category);

  return (
    <main id="main-content" className="bl-main bl-main--list">
      <div className="bl-list-wrap">
        <header className="bl-list-head">
          <div>
            <h1 className="bl-list-title">{BLOG_TITLE}</h1>
            <p className="bl-list-sub">{BLOG_SUB}</p>
          </div>
          <p className="bl-count">{shown.length} {shown.length === 1 ? 'Article' : 'Articles'}</p>
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

        <div className="bl-cards">
          {shown.map((post) => (
            <article key={post.slug} className="bl-card">
              <h2 className="bl-card-title">
                <a href={postPath(post.slug)} onClick={() => soundFx.playPop()}>{post.title}</a>
              </h2>
              <p className="bl-card-sub">{post.subtitle}</p>
              <p className="bl-card-desc">{post.description}</p>
              <p className="bl-card-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readTime}
              </p>
              <span className="bl-read-more" aria-hidden="true">Read more</span>
            </article>
          ))}
        </div>

        <p className="bl-footnote">
          More posts are on the way. Want me to write about something specific? <a href="/contact">Tell me</a>.
        </p>
      </div>
    </main>
  );
};
