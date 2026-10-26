import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { Header } from './components/Header/Header';
import { NotFoundPage } from './components/Pages/NotFoundPage';
import { Footer } from './components/Footer/Footer';
import { AboutPage, ContactPage, GmdcCaseStudy, CaseStudyRoute, PortfolioContent } from '#pages';
import { getPage, isCaseStudyPage } from './utils/pages';
import { splitLocation, useLocationKey } from './utils/router';
import { useSeo } from './utils/seo';
import './styles/global.css';

function App() {
  const { path, hash } = splitLocation(useLocationKey());
  const page = getPage(path);

  useSeo(path);

  // Each page starts at the top; /experience#education and #certifications scroll to their section.
  useEffect(() => {
    const id = hash.replace('#', '');
    const target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }, [path, hash]);

  return (
    <ThemeProvider>
      <SoundProvider>
        <div className="portfolio-app">
          <Header />

          {/* While a page's file downloads, hold the page's height so the footer does not jump up */}
          <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
            {page === 'about' && <AboutPage />}
            {page === 'gmdc' && <GmdcCaseStudy />}
            {isCaseStudyPage(page) && <CaseStudyRoute page={page} />}
            {page === 'contact' && <ContactPage />}
            {(page === 'projects' || page === 'skills' || page === 'experience') && (
              <main id="main-content">
                <PortfolioContent page={page} />
              </main>
            )}
          </Suspense>
          {page === 'notfound' && <NotFoundPage />}

          <Footer />
        </div>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
