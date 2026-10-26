import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';
import './ArticlesGrid.css';

const MAIN_ARTICLES = [
  {
    id: 'anchor-positioning',
    title: 'Getting Started with Anchor Positioning',
    desc: 'For decades, one of the most notoriously-challenging problems on the web has been sticking one element to another element, for things like tooltips and nested menus. The CSSWG has decided to provide a first-class solution to this problem, and it’s pretty friggin’ cool! In this tutorial, I’ll share the most useful parts I’ve found from this modern CSS feature.'
  },
  {
    id: 'css-vs-javascript',
    title: 'CSS vs. JavaScript',
    subtitle: 'Exploring the performance implications of different animation strategies',
    desc: 'There are a bunch of JavaScript animation libraries out there, and you might have wondered whether there’s a performance cost compared to traditional CSS transitions and keyframe animations. In this blog post, we’ll compare the same animation across several different strategies and see the differences firsthand. There’s some interesting nuance here!'
  },
  {
    id: 'scroll-driven-animations',
    title: 'Scroll-Driven Animations',
    subtitle: 'Exploring the majestic new animation-timeline API',
    desc: 'The new Animation Timeline API allows us to create dynamic scroll animations without any JavaScript! It’s honestly a very lovely API, and in this blog post, we’ll explore some of the super cool things we can do with it.'
  },
  {
    id: 'squash-and-stretch',
    title: 'Squash and Stretch',
    subtitle: 'The little secret that makes animations feel alive ✨',
    desc: 'Have you ever heard of Disney’s 12 Basic Principles of Animation? In this tutorial, we’ll explore how we can use the very first principle to create SVG micro-interactions that feel way more natural and believable. It’s one of those small things that has a big impact.'
  },
  {
    id: 'header-blockers',
    title: 'Sneaky Header Blocker Trick',
    desc: 'There is a lil’ UI detail on this blog. Most people don’t even notice it, but the ones who do often reach out, asking how on earth it works. It feels like it defies the rules of CSS! In this blog post, I’ll break down the surprisingly-straightforward implementation so you can start using this trick yourself.'
  },
  {
    id: 'sprites',
    title: 'Sprites on the Web',
    desc: 'In game development, it’s common to use spritesheets for animation, but this technique isn’t as widely used on the web these days. Which is a shame, because we can do some pretty cool stuff with sprites! In this post, we’ll share the niche CSS function you can use to leverage this technique, and explore some of the potential use cases.'
  },
  {
    id: 'subgrid',
    title: 'Brand New Layouts with CSS Subgrid',
    desc: 'Subgrid allows us to extend a grid template down through the DOM tree, so that deeply-nested elements can participate in the same grid layout. At first glance, I thought this would be a helpful convenience, but it turns out that it’s so much more. Subgrid unlocks exciting new layout possibilities, stuff we couldn’t do until now. ✨'
  },
  {
    id: 'linear-timing-function',
    title: 'Springs and Bounces in Native CSS',
    subtitle: 'The magic of the linear() timing function',
    desc: 'The “linear()” timing function is a game-changer; it allows us to model physics-based motion right in vanilla CSS! That said, there are some limitations and quirks to be aware of. I’ve been experimenting with this API for a while now, and in this post, I’ll share all of the tips and tricks I’ve learned for using it effectively. ✨'
  }
];

const CATEGORIES = [
  'CSS',
  'React',
  'Animation',
  'Career',
  'JavaScript',
  'SVG',
  'Next.js',
  'General'
];

const POPULAR_ARTICLES = [
  'An Interactive Guide to Flexbox',
  'A Modern CSS Reset',
  'An Interactive Guide to CSS Transitions',
  'How To Center a Div',
  'The End of Front-End Development',
  'An Interactive Guide to CSS Grid',
  'Designing Beautiful Shadows in CSS',
  'Making Sense of React Server Components',
  'Why React Re-Renders',
  'CSS Variables for React Devs'
];

export const ArticlesGrid = () => {
  return (
    <div className="homepage-content-wrapper">
      <div className="homepage-grid-container">
        {/* Left Column (2fr): Articles & Tutorials */}
        <div className="homepage-main-col">
          <header className="articles-kicker-header">
            <span className="articles-kicker">ARTICLES AND TUTORIALS</span>
          </header>

          <div className="articles-list">
            {MAIN_ARTICLES.map((article) => (
              <article key={article.id} className="article-entry">
                <h2 className="article-title">
                  <a
                    href={`#${article.id}`}
                    onClick={() => soundFx.playPop()}
                  >
                    {article.title}
                  </a>
                </h2>

                {article.subtitle && (
                  <p className="article-subtitle">{article.subtitle}</p>
                )}

                <p className="article-excerpt">{article.desc}</p>

                <a
                  href={`#${article.id}`}
                  className="article-read-more"
                  onClick={() => soundFx.playPop()}
                >
                  <span>Read more</span>
                  <span className="read-more-dots" aria-hidden="true">
                    <FiArrowRight size={15} />
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column (1fr): Browse by Category & Popular Content */}
        <aside className="homepage-sidebar-col">
          {/* Browse By Category */}
          <section className="aside-block">
            <h3 className="aside-heading">BROWSE BY CATEGORY</h3>
            <div className="category-pill-wrap">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`#category-${cat.toLowerCase()}`}
                  className="category-pill"
                  onClick={() => soundFx.playPop()}
                >
                  {cat}
                </a>
              ))}
            </div>
          </section>

          {/* Popular Content */}
          <section className="aside-block popular-block">
            <h3 className="aside-heading">POPULAR CONTENT</h3>
            <ol className="popular-list">
              {POPULAR_ARTICLES.map((item, idx) => (
                <li key={idx} className="popular-item">
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="popular-link"
                    onClick={() => soundFx.playPop()}
                  >
                    <FiArrowRight className="popular-arrow" size={14} />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
};
