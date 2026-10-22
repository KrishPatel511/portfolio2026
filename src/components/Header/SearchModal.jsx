import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight, FiFileText } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';

const SAMPLE_POSTS = [
  { title: 'GMDC Mining Dispatch System', category: 'Project', href: '#gmdc', desc: 'Sole developer of a 9-checkpoint government truck dispatch system with RFID, weighbridge and camera integration.' },
  { title: 'AI GitHub Coding Agent', category: 'Project', href: '#projects', desc: 'Agentic AI that connects Gemini and GitHub APIs to read, analyze, fix, commit and raise pull requests.' },
  { title: 'Waldor Clinic Website', category: 'Project', href: '#projects', desc: 'Full-stack Next.js 16 site with headless WordPress CMS and 15+ dynamic pages.' },
  { title: 'AMNEX Infotechnologies', category: 'Experience', href: '#experience', desc: 'Software Developer: government API integrations, AWS deployments, 3+ client projects delivered end-to-end.' },
  { title: 'BeyonData Solutions', category: 'Experience', href: '#experience', desc: 'Junior Software Developer: 15+ React dashboards and backend automation with stored procedures.' },
  { title: 'React.js and Next.js', category: 'Skill', href: '#skills', desc: 'Production-grade interfaces with TypeScript, Tailwind CSS, GSAP and Framer Motion.' },
  { title: 'Node.js and REST APIs', category: 'Skill', href: '#skills', desc: 'Express and NestJS services with JWT authentication and role-based access control.' },
  { title: 'Contact and Resume', category: 'Contact', href: '#contact', desc: 'Email, LinkedIn, GitHub and a downloadable PDF resume.' },
  { title: 'Education and Certifications', category: 'Education', href: '#education', desc: 'MCA (2025), BCA (2022), Oracle Cloud Certified Professional, HackerRank SQL.' }
];

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

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

  const filteredPosts = SAMPLE_POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase()) ||
      post.desc.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="search-backdrop" onClick={onClose}>
        <motion.div
          className="search-dialog"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        >
          <div className="search-input-wrapper">
            <FiSearch className="search-input-icon" size={20} />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search projects, skills, experience..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setQuery('')}
              >
                <FiX size={16} />
              </button>
            )}
            <kbd className="search-kbd">ESC</kbd>
          </div>

          <div className="search-results">
            <div className="search-results-label">
              {query ? `Results matching "${query}"` : 'Quick Links'}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="search-empty">No results found for &ldquo;{query}&rdquo;</div>
            ) : (
              <div className="search-results-list">
                {filteredPosts.map((post, idx) => (
                  <a
                    key={idx}
                    href={post.href}
                    className="search-result-item"
                    onClick={() => {
                      soundFx.playPop();
                      onClose();
                    }}
                  >
                    <div className="result-item-main">
                      <div className="result-badge-row">
                        <span className="result-category">{post.category}</span>
                      </div>
                      <h4 className="result-title">{post.title}</h4>
                      <p className="result-snippet">{post.desc}</p>
                    </div>
                    <FiArrowRight className="result-arrow" size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
