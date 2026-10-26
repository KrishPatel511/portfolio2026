import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch, FiX, FiTrash2 } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';
import { navigate } from '../../utils/router';
import { POSTS, postPath } from '../../blog/meta';

const SAMPLE_POSTS = [
  { title: 'GMDC Mining Dispatch System', category: 'Project', href: '/projects/gmdc', desc: 'Sole developer of a 9-checkpoint government truck dispatch system with RFID, weighbridge and camera integration.' },
  { title: 'RepoSentry AI Coding Agent', category: 'Project', href: '/projects/reposentry', desc: 'Agentic AI that connects Gemini and GitHub APIs to read, analyze, fix, commit and raise pull requests.' },
  { title: 'Auralyx Clinic Website', category: 'Project', href: '/projects/auralyx', desc: 'Full-stack Next.js 16 clinic site with a headless WordPress blog, secure forms and 20 pages.' },
  { title: 'EMBERLEAF Platformer Game', category: 'Project', href: '/projects/emberleaf', desc: 'A browser 8-bit platformer with 10 heroes, 4 worlds and 16 stages, built with React, TypeScript and Phaser.' },
  { title: 'Krish Patel Portfolio', category: 'Project', href: '/projects/portfolio', desc: 'This site: a hand-built React portfolio with a WebGL cursor, a real map, synthesized sound and an animated theme.' },
  { title: 'AMNEX Infotechnologies', category: 'Experience', href: '/experience', desc: 'Software Developer: government API integrations, AWS deployments, 3+ client projects delivered end-to-end.' },
  { title: 'BeyonData Solutions', category: 'Experience', href: '/experience', desc: 'Junior Software Developer: 15+ React dashboards and backend automation with stored procedures.' },
  { title: 'React.js and Next.js', category: 'Skill', href: '/skills', desc: 'Production-grade interfaces with TypeScript, Tailwind CSS, GSAP and Framer Motion.' },
  { title: 'Node.js and REST APIs', category: 'Skill', href: '/skills', desc: 'Express and NestJS services with JWT authentication and role-based access control.' },
  { title: 'Blog', category: 'Blog', href: '/blog', desc: 'Write-ups on AI agents, government integrations and React performance.' },
  ...POSTS.map((p) => ({ title: p.title, category: 'Blog', href: postPath(p.slug), desc: p.description })),
  { title: 'Contact and Resume', category: 'Contact', href: '/contact', desc: 'Email, LinkedIn, GitHub and a downloadable PDF resume.' },
  { title: 'Education and Certifications', category: 'Education', href: '/experience#education', desc: 'MCA (2025), BCA (2022), Oracle Cloud Certified Professional, HackerRank SQL.' }
];

const CLOUD_PATH = 'M1825 113C1837.5 112 1874.5 145 2058.5 145.5C2242.5 146 2273 119.5 2288.5 119C2304 118.5 2312 140 2519.5 129.5C2727 119 2739.5 81.5 2748.5 82.5C2757.5 83.5 2821.5 105 2980.5 105C3139.5 105 3198 65 3211.5 61C3225 57 3230 91 3447.5 83.5C3665 76 3663 27.5 3675 29.5C3687 31.5 3710 76 3904 76C4098 76 4088 22 4098 19C4102.46 17.6626 4104.43 23.0822 4112.91 29.5V0.5H0.416992V28C24.7581 17.693 38.7983 8.78176 45.5013 9.5C59.5002 11 60.0014 72 226.501 72.5C393.001 73 432.003 19.5 440.502 18C449 16.5 474.502 77.5 669.002 85C863.502 92.5 889.003 56 902.502 56C916 56 937.002 92 1132.5 102.5C1328 113 1353 85 1363.5 85C1374 85 1391 124.5 1596 131.5C1801 138.5 1812.5 114 1825 113Z';

const PLACEHOLDERS = ['GMDC Mining', 'React', 'RepoSentry', 'Node.js', 'AWS', 'Next.js'];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Wraps every match of the query in a <mark>, like the results on joshwcomeau.com */
const Highlight = ({ text, query }) => {
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? <mark key={i} className="sm-mark">{part}</mark> : part
  );
};

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [mounted, setMounted] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef(null);

  // Keep the modal mounted while it slides back up
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    if (!mounted) return undefined;
    setClosing(true);
    const t = setTimeout(() => { setMounted(false); setClosing(false); }, 550);
    return () => clearTimeout(t);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Focus as soon as the input exists, without scrolling the page
  const setInputRef = useCallback((el) => {
    inputRef.current = el;
    if (el) el.focus({ preventScroll: true });
  }, []);

  // Cycle through example searches in the placeholder
  useEffect(() => {
    if (!mounted) return undefined;
    const id = setInterval(() => setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length), 2400);
    return () => clearInterval(id);
  }, [mounted]);

  // Lock page scroll while the search is open
  useEffect(() => {
    if (!mounted) return undefined;
    // Keep the scrollbar's width reserved, otherwise the whole page jumps sideways
    const root = document.documentElement;
    const hadScrollbar = window.innerWidth > root.clientWidth;
    const previous = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter };
    root.style.overflow = 'hidden';
    if (hadScrollbar) root.style.scrollbarGutter = 'stable';
    return () => {
      root.style.overflow = previous.overflow;
      root.style.scrollbarGutter = previous.gutter;
    };
  }, [mounted]);

  // Handle Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else soundFx.playWhoosh();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const q = query.trim().toLowerCase();
  const results = q
    ? SAMPLE_POSTS.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.category.toLowerCase().includes(q) ||
          post.desc.toLowerCase().includes(q)
      )
    : [];

  const openResult = (href) => {
    soundFx.playPop();
    onClose();
    navigate(href);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results[0]) openResult(results[0].href);
  };

  if (!mounted) return null;

  return (
    <div className={`sm-root ${closing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-label="Search">
      <div className="sm-overlay" onClick={onClose} />

      <div className="sm-panel">
            <div className="sm-content">
              <div className="sm-row">
                <form className="sm-form" role="search" onSubmit={handleSubmit}>
                  <span className="sm-icon" aria-hidden="true"><FiSearch size={20} /></span>
                  <input
                    ref={setInputRef}
                    type="search"
                    className="sm-input"
                    placeholder={PLACEHOLDERS[placeholderIndex]}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    maxLength={150}
                    aria-label="Search projects, skills and experience"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="sm-clear"
                    style={{ opacity: query ? 1 : 0, pointerEvents: query ? 'auto' : 'none' }}
                    onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                    aria-label="Clear search input"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </form>

                <button type="button" className="sm-close" onClick={onClose} aria-label="Dismiss">
                  <FiX size={24} />
                </button>
              </div>

              <div className="sm-results" aria-live="polite">
                {!q && (
                  <p className="sm-hint">Search through all of my projects, skills and experience.</p>
                )}

                {q && results.length === 0 && (
                  <p className="sm-hint">No results found for &ldquo;{query.trim()}&rdquo;.</p>
                )}

                {results.map((post) => (
                  <a
                    key={post.title}
                    href={post.href}
                    className="sm-result"
                    onClick={(e) => { e.preventDefault(); openResult(post.href); }}
                  >
                    <span className="sm-category">{post.category}</span>
                    <h4 className="sm-title"><Highlight text={post.title} query={query} /></h4>
                    <p className="sm-snippet"><Highlight text={post.desc} query={query} /></p>
                  </a>
                ))}
              </div>
            </div>

            {/* White cloud hanging off the bottom edge of the panel */}
            <div className="sm-cloud-wrap" aria-hidden="true">
              <svg className="sm-cloud" viewBox="0 0 4113 146" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d={CLOUD_PATH} fill="var(--sm-bg)" />
              </svg>
            </div>
      </div>
    </div>
  );
};
