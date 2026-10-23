/* Hash-based page routing: maps the URL hash to one of the site's pages. */

export const NAV_LINKS = [
  { page: 'about', label: 'About', href: '#about' },
  { page: 'projects', label: 'Projects', href: '#projects' },
  { page: 'experience', label: 'Experience', href: '#experience' },
  { page: 'skills', label: 'Skills', href: '#skills' },
  { page: 'contact', label: 'Contact', href: '#contact' },
];

export const RESUME_URL = '/cv/Patel_Krish.pdf';
export const RESUME_FILENAME = 'Krish_Patel_Resume.pdf';

const HASH_TO_PAGE = {
  '': 'about',
  about: 'about',
  projects: 'projects',
  gmdc: 'gmdc',
  reposentry: 'reposentry',
  waldor: 'waldor',
  portfolio: 'portfolio',
  skills: 'skills',
  experience: 'experience',
  education: 'experience',
  certifications: 'experience',
  contact: 'contact',
};

export const getPage = (hash) => HASH_TO_PAGE[(hash || '').replace('#', '')] ?? 'about';

/* The nav item to highlight for a page (the case study belongs to Projects). */
export const getNavPage = (page) => (['gmdc', 'reposentry', 'waldor', 'portfolio'].includes(page) ? 'projects' : page);
