import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { Header } from './components/Header/Header';
import { PortfolioContent } from './components/Content/PortfolioContent';
import { AboutPage } from './components/About/AboutPage';
import { ContactPage } from './components/Pages/ContactPage';
import { GmdcCaseStudy } from './components/Pages/GmdcCaseStudy';
import { ProjectCaseStudy, CASE_STUDIES } from './components/Pages/ProjectCaseStudy';
import { Footer } from './components/Footer/Footer';
import { getPage } from './utils/pages';
import './styles/global.css';

function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const page = getPage(hash);

  // Each page starts at the top (the Experience page also hosts #education and #certifications).
  useEffect(() => {
    const id = hash.replace('#', '');
    const target = id === 'education' || id === 'certifications' ? document.getElementById(id) : null;
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }, [hash]);

  return (
    <ThemeProvider>
      <SoundProvider>
        <div className="portfolio-app">
          <Header />

          {page === 'about' && <AboutPage />}
          {page === 'gmdc' && <GmdcCaseStudy />}
          {CASE_STUDIES[page] && <ProjectCaseStudy data={CASE_STUDIES[page]} />}
          {page === 'contact' && <ContactPage />}
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
