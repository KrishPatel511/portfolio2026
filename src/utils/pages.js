/* Page routing: maps the URL path to one of the site's pages. */

export const NAV_LINKS = [
  { page: 'about', label: 'About', href: '/' },
  { page: 'projects', label: 'Projects', href: '/projects' },
  { page: 'experience', label: 'Experience', href: '/experience' },
  { page: 'skills', label: 'Skills', href: '/skills' },
  { page: 'contact', label: 'Contact', href: '/contact' },
];

export const RESUME_URL = '/cv/Patel_Krish.pdf';
export const RESUME_FILENAME = 'Krish_Patel_Resume.pdf';

/* path -> page key */
export const PATH_TO_PAGE = {
  '/': 'about',
  '/projects': 'projects',
  '/projects/gmdc': 'gmdc',
  '/projects/reposentry': 'reposentry',
  '/projects/auralyx': 'waldor',
  '/projects/portfolio': 'portfolio',
  '/skills': 'skills',
  '/experience': 'experience',
  '/contact': 'contact',
};

export const isKnownPath = (path) => path in PATH_TO_PAGE;

export const getPage = (path) => PATH_TO_PAGE[path] ?? 'notfound';

const CASE_STUDY_PAGES = ['gmdc', 'reposentry', 'waldor', 'portfolio'];

/* Case studies that share the ProjectCaseStudy template (GMDC has its own page). */
export const isCaseStudyPage = (page) => page !== 'gmdc' && CASE_STUDY_PAGES.includes(page);

/* The nav item to highlight for a page (case studies belong to Projects). */
export const getNavPage = (page) => (CASE_STUDY_PAGES.includes(page) ? 'projects' : page);
