/* The blog's post list. Only small facts live here (it is also used for SEO, the sitemap, search and
   the nav), so it stays light. The article text itself is in content.js and loads with the blog pages.

   To add a post: add an entry here, then add its text to content.js under the same slug. */

export const POSTS = [
  {
    slug: 'how-i-built-my-portfolio',
    title: 'How I Built My Portfolio',
    subtitle: '2026 “Hand-Built” Edition',
    description:
      'How this portfolio is built: a hand-written React and Vite stack, a tiny router, pre-rendered pages, a WebGL cursor, a serverless contact form, and the real numbers from making it fast and accessible.',
    date: '2026-10-26',
    updated: '2026-10-26',
    readTime: '14 min read',
    category: 'General',
    tags: ['React', 'Vite', 'Performance', 'Accessibility'],
    project: { label: 'Read the portfolio case study', href: '/projects/portfolio' },
  },
];

export const BLOG_TITLE = 'Blog';
export const BLOG_SUB = 'Write-ups of what I build, what broke and what I learned.';

export const postPath = (slug) => `/blog/${slug}`;
export const getPost = (slug) => POSTS.find((p) => p.slug === slug);

export const formatDate = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  const day = d.getUTCDate();
  const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const month = d.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  return `${month} ${day}${suffix}, ${d.getUTCFullYear()}`;
};
