import { lazy } from 'react';

/* Browser build: every page is its own JavaScript file, downloaded only when that page is opened.
   Vite swaps this file for pages.static.jsx in the build-time (server) render, see vite.config.js. */

const loaders = {
  about: () => import('./components/About/AboutPage').then((m) => ({ default: m.AboutPage })),
  contact: () => import('./components/Pages/ContactPage').then((m) => ({ default: m.ContactPage })),
  gmdc: () => import('./components/Pages/GmdcCaseStudy').then((m) => ({ default: m.GmdcCaseStudy })),
  caseStudy: () => import('./components/Pages/CaseStudyRoute'),
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
  projects: 'list',
  skills: 'list',
  experience: 'list',
};

export const AboutPage = lazy(loaders.about);
export const ContactPage = lazy(loaders.contact);
export const GmdcCaseStudy = lazy(loaders.gmdc);
export const CaseStudyRoute = lazy(loaders.caseStudy);
export const PortfolioContent = lazy(loaders.list);

/* Starts downloading a page's file (a repeat call is free: the browser keeps the module). */
export const preloadPage = (page) => {
  const key = LOADER_FOR_PAGE[page];
  return key ? loaders[key]() : Promise.resolve();
};

/* After the first page is up, fetch the rest quietly so later clicks feel instant. */
export const preloadAllPages = () => {
  const run = () => Object.keys(LOADER_FOR_PAGE).forEach((p) => preloadPage(p).catch(() => {}));
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2000);
};
