import { lazy } from 'react';

/* Browser build: every page is its own JavaScript file, downloaded only when that page is opened.
   Vite swaps this file for pages.static.jsx in the build-time (server) render, see vite.config.js. */

const loaders = {
  about: () => import('./components/About/AboutPage').then((m) => ({ default: m.AboutPage })),
  contact: () => import('./components/Pages/ContactPage').then((m) => ({ default: m.ContactPage })),
  gmdc: () => import('./components/Pages/GmdcCaseStudy').then((m) => ({ default: m.GmdcCaseStudy })),
  caseStudy: () => import('./components/Pages/CaseStudyRoute'),
  blog: () => import('./components/Blog/BlogPage').then((m) => ({ default: m.BlogPage })),
  blogpost: () => import('./components/Blog/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
  list: () => import('./components/Content/PortfolioContent').then((m) => ({ default: m.PortfolioContent })),
};

/* page key (see utils/pages.js) -> which loader holds it */
const LOADER_FOR_PAGE = {
  about: 'about',
  contact: 'contact',
  gmdc: 'gmdc',
  reposentry: 'caseStudy',
  waldor: 'caseStudy',
  portfolio: 'caseStudy',
  blog: 'blog',
  blogpost: 'blogpost',
  projects: 'list',
  skills: 'list',
  experience: 'list',
};

/* Pages that have finished downloading, by loader key. A page found here renders at once, with no
   "loading" frame, which is what keeps the footer from flashing at the top of the screen. */
const loaded = {};

const load = (key) =>
  loaders[key]().then((m) => {
    loaded[key] = m.default;
    return m;
  });

const makePage = (key) => {
  const Lazy = lazy(() => load(key));
  return function Page(props) {
    const Ready = loaded[key];
    return Ready ? <Ready {...props} /> : <Lazy {...props} />;
  };
};

export const AboutPage = makePage('about');
export const ContactPage = makePage('contact');
export const GmdcCaseStudy = makePage('gmdc');
export const CaseStudyRoute = makePage('caseStudy');
export const PortfolioContent = makePage('list');
export const BlogPage = makePage('blog');
export const BlogPostPage = makePage('blogpost');

/* Starts downloading a page's file (a repeat call is free: the browser keeps the module). */
export const preloadPage = (page) => {
  const key = LOADER_FOR_PAGE[page];
  return key ? load(key) : Promise.resolve();
};

/* After the first page is up, fetch the rest quietly so later clicks feel instant. */
export const preloadAllPages = () => {
  const run = () => Object.keys(LOADER_FOR_PAGE).forEach((p) => preloadPage(p).catch(() => {}));
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2000);
};
