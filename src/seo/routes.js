/* Everything search engines and link previews need to know about each page.
   Used at build time (prerender) and at runtime (client-side navigation). */

import { POSTS, postPath } from '../blog/meta.js';

export const SITE_URL = 'https://www.krishpatel.website';
export const SITE_NAME = 'Krish Patel';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const PERSON_ID = `${SITE_URL}/#person`;

export const PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Krish Patel',
  url: SITE_URL,
  image: OG_IMAGE,
  jobTitle: 'Full Stack Developer',
  description:
    'Full Stack Developer from Ahmedabad, India building React, Next.js and Node.js systems for government and enterprise clients.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  worksFor: { '@type': 'Organization', name: 'AMNEX Infotechnologies' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Shri Chimanbhai Patel Institute (SVGU)' },
    { '@type': 'CollegeOrUniversity', name: 'J G College of Computer Application' },
  ],
  knowsAbout: [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma',
    'AWS', 'REST APIs', 'Agentic AI', 'WebGL', 'Government system integrations',
  ],
  sameAs: ['https://github.com/KrishPatel511', 'https://www.linkedin.com/in/krishpatel511'],
};

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Krish Patel | Full Stack Developer',
  inLanguage: 'en-IN',
  publisher: { '@id': PERSON_ID },
};

const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: SITE_URL + (path === '/' ? '' : path),
  })),
});

const work = (name, path, description) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name,
  url: SITE_URL + path,
  description,
  inLanguage: 'en',
  author: { '@id': PERSON_ID },
});

export const ROUTES = {
  '/': {
    title: 'Krish Patel | Full Stack Developer in Ahmedabad, India',
    description:
      'Krish Patel is a Full Stack Developer from Ahmedabad, India building React, Next.js, Node.js and AI systems for government and enterprise clients. See his projects, experience and skills.',
    priority: 1,
    schema: [PERSON, WEBSITE],
  },
  '/projects': {
    title: 'Projects | Krish Patel, Full Stack Developer',
    description:
      'Projects by Krish Patel: a government truck dispatch system for GMDC Mining, RepoSentry (an AI GitHub coding agent), the Auralyx clinic website, EMBERLEAF (a browser platformer game) and this interactive portfolio.',
    priority: 0.9,
    schema: [crumbs([['Home', '/'], ['Projects', '/projects']])],
  },
  '/projects/gmdc': {
    title: 'GMDC Mining Dispatch Case Study | Krish Patel',
    description:
      'How Krish Patel built a 9-checkpoint government truck dispatch platform for GMDC Mining with RFID, weighbridge and camera integration, as the sole developer.',
    priority: 0.8,
    schema: [
      work('GMDC Mining Dispatch', '/projects/gmdc', 'A government vehicle checkpoint automation platform with RFID, weighbridges and national API integrations.'),
      crumbs([['Home', '/'], ['Projects', '/projects'], ['GMDC Mining Dispatch', '/projects/gmdc']]),
    ],
  },
  '/projects/reposentry': {
    title: 'RepoSentry AI Coding Agent Case Study | Krish Patel',
    description:
      'RepoSentry is a full-stack AI agent that reads GitHub repositories, reviews code and opens pull requests. Built with React, TypeScript, Node.js, PostgreSQL and the Gemini API.',
    priority: 0.8,
    schema: [
      work('RepoSentry AI Coding Agent', '/projects/reposentry', 'A full-stack AI agent that explores GitHub repositories, fixes bugs and opens pull requests.'),
      crumbs([['Home', '/'], ['Projects', '/projects'], ['RepoSentry', '/projects/reposentry']]),
    ],
  },
  '/projects/auralyx': {
    title: 'Auralyx Clinic Website Case Study | Krish Patel',
    description:
      'A luxury skin, hair and longevity clinic website built with Next.js 16, TypeScript and a headless WordPress blog, with 20 pages and secure enquiry forms.',
    priority: 0.8,
    schema: [
      work('Auralyx Clinic Website', '/projects/auralyx', 'A 20-page Next.js clinic website with a headless WordPress blog and secure forms.'),
      crumbs([['Home', '/'], ['Projects', '/projects'], ['Auralyx', '/projects/auralyx']]),
    ],
  },
  '/projects/emberleaf': {
    title: 'EMBERLEAF Browser Platformer Game Case Study | Krish Patel',
    description:
      'EMBERLEAF is a fan-style 8-bit platformer built with React, TypeScript and Phaser: 10 heroes, 4 worlds and 16 stages that play on desktop, tablet and phone.',
    priority: 0.8,
    schema: [
      work('EMBERLEAF Platformer Game', '/projects/emberleaf', 'A browser 8-bit platformer with 10 heroes, 4 worlds and 16 stages, built with React, TypeScript and Phaser.'),
      crumbs([['Home', '/'], ['Projects', '/projects'], ['EMBERLEAF', '/projects/emberleaf']]),
    ],
  },
  '/projects/portfolio': {
    title: 'This Portfolio: Case Study | Krish Patel',
    description:
      'A hand-built React portfolio with a WebGL fluid cursor, a generative rainbow, a real visitor map, synthesized sound and a smooth animated light and dark theme.',
    priority: 0.7,
    schema: [
      work('Krish Patel Portfolio', '/projects/portfolio', 'An interactive developer portfolio built with React, WebGL, GSAP and Web Audio.'),
      crumbs([['Home', '/'], ['Projects', '/projects'], ['Portfolio', '/projects/portfolio']]),
    ],
  },
  '/experience': {
    title: 'Experience and Education | Krish Patel',
    description:
      'Work experience of Krish Patel at AMNEX Infotechnologies, BeyonData Solutions and Sufalam Technology, plus his MCA, BCA and certifications including Oracle Cloud.',
    priority: 0.7,
    schema: [crumbs([['Home', '/'], ['Experience', '/experience']])],
  },
  '/skills': {
    title: 'Skills and Tech Stack | Krish Patel',
    description:
      'The tech stack of Krish Patel: React, Next.js, TypeScript, Node.js, Express, PostgreSQL, Prisma, AWS and AI integrations.',
    priority: 0.6,
    schema: [crumbs([['Home', '/'], ['Skills', '/skills']])],
  },
  '/contact': {
    title: 'Contact and Resume | Krish Patel',
    description:
      'Get in touch with Krish Patel, Full Stack Developer in Ahmedabad, India. Email, LinkedIn, GitHub and a downloadable PDF resume.',
    priority: 0.6,
    schema: [crumbs([['Home', '/'], ['Contact', '/contact']])],
  },
};

const blogRoutes = Object.fromEntries(
  POSTS.map((post) => [
    postPath(post.slug),
    {
      title: `${post.title} | Krish Patel`,
      description: post.description,
      priority: 0.7,
      type: 'article',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          image: OG_IMAGE,
          keywords: post.tags.join(', '),
          inLanguage: 'en',
          mainEntityOfPage: SITE_URL + postPath(post.slug),
          author: { '@id': PERSON_ID },
          publisher: { '@id': PERSON_ID },
        },
        crumbs([['Home', '/'], ['Blog', '/blog'], [post.title, postPath(post.slug)]]),
      ],
    },
  ])
);

Object.assign(ROUTES, {
  '/blog': {
    title: 'Blog | Krish Patel, Full Stack Developer',
    description:
      'Write-ups by Krish Patel on building AI agents, government system integrations and fast React websites, with real numbers and lessons learned.',
    priority: 0.8,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Krish Patel Blog',
        url: SITE_URL + '/blog',
        author: { '@id': PERSON_ID },
        blogPost: POSTS.map((post) => ({ '@type': 'BlogPosting', headline: post.title, url: SITE_URL + postPath(post.slug), datePublished: post.date })),
      },
      crumbs([['Home', '/'], ['Blog', '/blog']]),
    ],
  },
  ...blogRoutes,
});

export const NOT_FOUND = {
  title: 'Page not found | Krish Patel',
  description: 'This page does not exist. Head back to the portfolio of Krish Patel.',
  noindex: true,
  schema: [],
};

export const getSeo = (path) => ROUTES[path] ?? NOT_FOUND;

export const canonicalFor = (path) => SITE_URL + (path === '/' ? '/' : path);
