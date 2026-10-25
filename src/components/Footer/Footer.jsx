import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  FiSearch,
  FiVolume2,
  FiVolumeX,
  FiSun,
  FiMoon,
  FiGithub,
  FiLinkedin,
  FiArrowRight,
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { Logo } from '../Header/Logo';
import { soundFx } from '../../utils/soundEffects';
import { RESUME_URL } from '../../utils/pages';
import './Footer.css';

const CATEGORIES_COL_1 = [
  ['React.js', '/skills'],
  ['Next.js', '/skills'],
  ['TypeScript', '/skills'],
  ['Node.js', '/skills'],
];

const CATEGORIES_COL_2 = [
  ['PostgreSQL', '/skills'],
  ['AWS', '/skills'],
  ['REST APIs', '/skills'],
  ['Gov Integrations', '/skills'],
];

const COURSES = [
  ['GMDC Mining Dispatch', '/projects/gmdc'],
  ['RepoSentry AI Agent', '/projects/reposentry'],
  ['Auralyx Clinic Website', '/projects/auralyx'],
  ['This Portfolio', '/projects/portfolio'],
];

const GENERAL = [
  ['About Me', '/'],
  ['Experience & Education', '/experience'],
  ['Contact', '/contact'],
  ['Resume (PDF)', RESUME_URL],
];

const CONTACT_EMAIL = 'krishpatel51151@gmail.com';

const LEGAL = [
  ['Email', `mailto:${CONTACT_EMAIL}`],
  ['LinkedIn', 'https://www.linkedin.com/in/krishpatel511'],
  ['GitHub', 'https://github.com/KrishPatel511'],
];

export const Footer = () => {
  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  // Hide-and-Seek scroll animation state
  // -226px: hidden behind cloud ceiling
  // -155px: peeking eyes & hair
  // -92px: fully hanging out
  const [offset, setOffset] = useState(-226);
  const footerRef = React.useRef(null);

  React.useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.intersectionRatio < 0.2) {
          setOffset(-226);
        } else if (entry.intersectionRatio < 0.5) {
          setOffset(-155);
        } else {
          setOffset(-92);
        }
      },
      {
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mood = offset < -100 ? 'happy' : 'very-happy';

  const handleMascotClick = (e) => {
    soundFx.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 65,
      origin: { x, y },
      colors: ['#38bdf8', '#818cf8', '#f43f5e', '#fbbf24', '#34d399', '#ec4899'],
    });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'sending') return;
    soundFx.playPop();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  const handleOpenSearch = () => {
    soundFx.playPop();
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  return (
    <footer ref={footerRef} className="site-footer" role="contentinfo">
      {/* 1. Upside-Down 3D Mascot with Hide-and-Seek Animation & Reactions */}
      <div className="footer-mascot-container" aria-hidden="true">
        <div
          className="footer-mascot-anchor"
          style={{ '--offset': `${offset}px` }}
          onClick={handleMascotClick}
          title={mood === 'very-happy' ? 'Hello from upside-down! 🙃' : 'Peeking at you! 👀'}
        >
          <div className="footer-mascot-wrapper">
            {/* Dark Layer */}
            <div className="footer-mascot-dark-layer">
              <picture>
                <source type="image/webp" srcSet="/images/josh/josh-happy-dark.webp" />
                <img
                  alt="Mascot"
                  loading="eager"
                  decoding="sync"
                  src="/images/josh/josh-happy-dark.png"
                  className="footer-mascot-img"
                />
              </picture>
              {mood !== 'happy' && (
                <picture>
                  <source type="image/webp" srcSet="/images/josh/head-very-happy-dark.webp" />
                  <img
                    alt="Happy mascot"
                    loading="eager"
                    decoding="sync"
                    src="/images/josh/head-very-happy-dark.png"
                    className="footer-mascot-head-overlay"
                  />
                </picture>
              )}
            </div>

            {/* Light Layer */}
            <div
              className="footer-mascot-light-layer"
              style={{ opacity: isDark ? 0 : 1 }}
            >
              <picture>
                <source type="image/webp" srcSet="/images/josh/josh-happy-light.webp" />
                <img
                  alt="Mascot"
                  loading="eager"
                  decoding="sync"
                  src="/images/josh/josh-happy-light.png"
                  className="footer-mascot-img"
                />
              </picture>
              {mood !== 'happy' && (
                <picture>
                  <source type="image/webp" srcSet="/images/josh/head-very-happy-light.webp" />
                  <img
                    alt="Happy mascot"
                    loading="eager"
                    decoding="sync"
                    src="/images/josh/head-very-happy-light.png"
                    className="footer-mascot-head-overlay"
                  />
                </picture>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Light-Blue Soft Cloud Layer (Josh exact .wfzqr02 SVG) */}
      <svg
        viewBox="0 0 1557 213"
        width="1590"
        height="213"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="footer-bottom-cloud-svg"
        aria-hidden="true"
      >
        <path d="M1331 165.5C1320.5 162.5 1311 112 1221.5 92.4999C1132 72.9999 1104.5 114 1093.5 112C1082.5 110 1052 6.04351 903.5 1.00011C771 -3.49989 732.5 90 722.5 92.4999C712.5 94.9998 647.5 54.0001 535.5 73.9999C423.5 93.9997 421.5 165.5 411.5 165.5C401.5 165.5 359 58.5001 203.5 49.4999C48 40.4998 0.5 136 0.5 209.5C0.5 283 62.5 309.5 62.5 309.5H100.5L1556.5 304.5V232.5C1556.5 215.5 1542.5 159.009 1464 145.5C1368.81 129.118 1341.5 168.5 1331 165.5Z" />
      </svg>

      {/* 3. Top Cloud Ceiling SVG (Josh exact .w1r7oec7 & 5120px scalloped clouds) */}
      <div className="footer-cloud-top" aria-hidden="true">
        <svg
          width="320rem"
          height="15.625rem"
          viewBox="0 0 5120 337"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="footer-cloud-top-svg"
        >
          <path
            fill="var(--color-background)"
            d="M2262 93C2122.5 82.5987 2116 21.5 2096.5 21.5C2077 21.5 2070.5 77.5238 1920.5 93C1794.5 106 1786 62 1771.5 63.5C1757 65 1687 155.5 1580 142C1473 128.5 1446.5 90 1435 93C1423.5 96 1448.03 199.005 1340 214C1181.5 236 1155.5 142 1144 142C1132.5 142 1105.5 269 946.5 236C787.5 203 799 115 784 114.5C769 114 732.5 162 544 158C382 154.562 352.5 81 341 84.5C329.5 88 358 269 168 326C-22 383 -75.5 180 -75.5 180V0.5H5189.5L5193.5 46C5193.5 46 5200 94 5069.5 100.5C4939 107 4923.5 21.5 4906.5 21.5C4889.5 21.5 4870 35 4835 93.5C4800 152 4765.5 169.5 4643.5 173.5C4521.5 177.5 4436.5 69 4425.5 76.5C4414.5 84 4413.5 212 4235 222C4056.5 232 4045.5 92 4033.5 89C4021.5 86 3968.5 169.5 3823.5 172.5C3678.5 175.5 3573.5 104 3562.5 106.5C3551.5 109 3553.5 167.5 3396 201C3238.5 234.5 3171.5 168.5 3161 172.5C3150.5 176.5 3164 273 3076.5 294.5C2975.99 319.197 2935 228 2920 225.5C2905 223 2862 276.955 2749 245C2671.4 223.057 2672.5 149 2660.5 151.5C2648.5 154 2622.5 181.04 2548.5 158C2425 119.548 2427.5 53.5 2412 51C2396.5 48.5 2376 101.5 2262 93Z"
          />
        </svg>
      </div>

      {/* 4. Main Grid Content Container (Josh exact .wd6hsrp.bwhtsx5.watium4) */}
      <div className="footer-container">
        {/* Area 1: Intro (Logo & Tagline directly below upside-down mascot) */}
        <div className="footer-intro-area">
          <Logo />
          <p className="footer-tagline">
            Turning real-world workflows into reliable software.
          </p>
        </div>

        {/* Area 2: Email / Newsletter Form */}
        <div className="footer-email-area">
          <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
            <p className="newsletter-text-lines">
              <span className="newsletter-line">Have a project or an opportunity in mind?</span>
              <span className="newsletter-line">Drop your email and let&apos;s talk:</span>
            </p>
            <div className="newsletter-pill-box">
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-pill-input"
                aria-label="Your email address"
              />
              <button
                type="submit"
                className="newsletter-pill-submit"
                disabled={status === 'sending'}
                aria-label="Get in touch"
              >
                <FiArrowRight size={18} />
              </button>
            </div>
            {status === 'success' && (
              <p className="newsletter-success">Thanks! I will get back to you soon. 🎉</p>
            )}
            {status === 'error' && (
              <p className="newsletter-success">
                Could not send. Please email me at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            )}
          </form>
        </div>

        {/* Area 3: Legal (Copyright & Policies) */}
        <div className="footer-legal-area">
          <p className="footer-copyright">
            © 2025–present Krish Patel. All rights reserved.
          </p>
          <ul className="footer-legal-links">
            {LEGAL.map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  onClick={() => soundFx.playPop()}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Area 4: Links Area (Tech Stack, Featured Projects, General, Socials) */}
        <div className="footer-links-area">
          {/* Column 1: Tech Stack (2 sub-columns) */}
          <div className="footer-col footer-col-categories">
            <h3 className="footer-col-heading">Tech Stack</h3>
            <div className="footer-subcol-grid">
              <ul className="footer-link-list">
                {CATEGORIES_COL_1.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="footer-link"
                      onClick={() => soundFx.playPop()}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="footer-link-list">
                {CATEGORIES_COL_2.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="footer-link"
                      onClick={() => soundFx.playPop()}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Featured Projects */}
          <div className="footer-col footer-col-courses">
            <h3 className="footer-col-heading">Featured Projects</h3>
            <ul className="footer-link-list">
              {COURSES.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="footer-link"
                    onClick={() => soundFx.playPop()}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: General */}
          <div className="footer-col footer-col-general">
            <h3 className="footer-col-heading">Explore</h3>
            <ul className="footer-link-list">
              {GENERAL.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="footer-link"
                    onClick={() => soundFx.playPop()}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Controls & Socials Row (Placed directly below Courses & General) */}
          <div className="footer-controls-row">
            {/* Search Button */}
            <button
              type="button"
              className="footer-control-btn"
              onClick={handleOpenSearch}
              title="Search articles"
              aria-label="Search articles"
            >
              <FiSearch size={18} />
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              className="footer-control-btn"
              onClick={toggleSound}
              title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
              aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              className="footer-control-btn"
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/KrishPatel511"
              target="_blank"
              rel="noreferrer"
              className="footer-control-btn"
              title="GitHub"
              aria-label="GitHub"
              onClick={() => soundFx.playPop()}
            >
              <FiGithub size={18} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/krishpatel511"
              target="_blank"
              rel="noreferrer"
              className="footer-control-btn"
              title="LinkedIn"
              aria-label="LinkedIn"
              onClick={() => soundFx.playPop()}
            >
              <FiLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
