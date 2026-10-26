/* The blog's post list. Only small facts live here (it is also used for SEO, the sitemap, search and
   the nav), so it stays light. The article text itself is in content.js and loads with the blog pages.

   To add a post: add an entry here, then add its text to content.js under the same slug. */

export const POSTS = [
  {
    slug: 'ai-agent-github-safe-write-access',
    title: 'How I gave an AI agent write access to GitHub without losing control',
    description:
      'Four rules I used while building RepoSentry, an AI coding agent that fixes bugs and opens pull requests: enforce safety in code, keep deterministic work out of the model, bound every loop and track usage from day one.',
    date: '2026-10-26',
    readTime: '6 min read',
    category: 'AI Agents',
    tags: ['AI Agents', 'Node.js', 'GitHub API', 'Gemini'],
    color: '#8b5cf6',
    texture: 'violet',
    icon: 'shield',
    project: { label: 'Read the RepoSentry case study', href: '/projects/reposentry' },
  },
  {
    slug: 'making-a-react-portfolio-load-fast',
    title: 'Making my React portfolio load faster: what I measured and what helped',
    description:
      'A real before and after on this site: one 2.2 MB image, code splitting with lazy loading, two bugs that lazy loading caused, and one fix I had to revert. With Lighthouse numbers.',
    date: '2026-10-26',
    readTime: '7 min read',
    category: 'Performance',
    tags: ['Performance', 'React', 'Vite', 'Lighthouse'],
    color: '#10b981',
    texture: 'emerald',
    icon: 'zap',
    project: { label: 'Read the portfolio case study', href: '/projects/portfolio' },
  },
  {
    slug: 'building-a-truck-checkpoint-system-for-a-government-mine',
    title: 'What building a 9-checkpoint truck system for a government mine taught me',
    description:
      'Lessons from being the only developer on a live RFID, weighbridge and boom barrier platform for GMDC Mining: go and see the real workflow, treat hardware as part of the product and test on site.',
    date: '2026-10-26',
    readTime: '5 min read',
    category: 'Case Notes',
    tags: ['Government Tech', 'RFID', 'Node.js', 'React'],
    color: '#f59e0b',
    texture: 'amber',
    icon: 'truck',
    project: { label: 'Read the GMDC case study', href: '/projects/gmdc' },
  },
];

export const BLOG_TITLE = 'Notes from building real systems.';
export const BLOG_SUB =
  'Plain-language write-ups of what I build, what broke and what I learned: AI agents, government integrations and front-end performance.';

export const postPath = (slug) => `/blog/${slug}`;
export const getPost = (slug) => POSTS.find((p) => p.slug === slug);

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
