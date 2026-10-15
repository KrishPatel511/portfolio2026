import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { ArticlesGrid } from './components/Content/ArticlesGrid';
import { Footer } from './components/Footer/Footer';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <div className="portfolio-app">
          {/* Fully Transparent Glassmorphic Header */}
          <Header />

          {/* Hero Cloudscape Section with 3D Boy Mascot & Radiating Sprinkles */}
          <Hero />

          {/* Articles & Tutorials Stream + Browse by Category Sidebar */}
          <main id="main-content">
            <ArticlesGrid />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
