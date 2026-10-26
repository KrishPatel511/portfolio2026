/* Build-time (server) render: pages are imported normally so the prerendered HTML contains their content. */
export { AboutPage } from './components/About/AboutPage';
export { ContactPage } from './components/Pages/ContactPage';
export { GmdcCaseStudy } from './components/Pages/GmdcCaseStudy';
export { default as CaseStudyRoute } from './components/Pages/CaseStudyRoute';
export { PortfolioContent } from './components/Content/PortfolioContent';

export const preloadPage = () => Promise.resolve();
export const preloadAllPages = () => {};
