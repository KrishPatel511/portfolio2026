import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { Header } from './components/Header/Header';
import { PortfolioContent } from './components/Content/PortfolioContent';
import { AboutPage } from './components/About/AboutPage';
import { ContactPage } from './components/Pages/ContactPage';
import { GmdcCaseStudy } from './components/Pages/GmdcCaseStudy';
import { ProjectCaseStudy, CASE_STUDIES } from './components/Pages/ProjectCaseStudy';
import { NotFoundPage } from './components/Pages/NotFoundPage';
import { Footer } from './components/Footer/Footer';
import { getPage } from './utils/pages';
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

          {page === 'about' && <AboutPage />}
          {page === 'gmdc' && <GmdcCaseStudy />}
          {CASE_STUDIES[page] && <ProjectCaseStudy data={CASE_STUDIES[page]} />}
          {page === 'contact' && <ContactPage />}
          {page === 'notfound' && <NotFoundPage />}
          {(page === 'projects' || page === 'skills' || page === 'experience') && (
            <main id="main-content">
              <PortfolioContent page={page} />
            </main>
          )}

          <Footer />
        </div>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
