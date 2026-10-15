import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight, FiFileText } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';

const SAMPLE_POSTS = [
  {
    title: 'An Interactive Guide to Flexbox',
    category: 'CSS',
    desc: 'Flexbox is a remarkably powerful layout mode. In this comprehensive interactive tutorial, we’ll build an intuition for how it works.'
  },
  {
    title: 'A Modern CSS Reset',
    category: 'CSS',
    desc: 'A tiny, sensible collection of CSS defaults that eliminate weird browser quirks and streamline styling.'
  },
  {
    title: 'An Interactive Guide to CSS Transitions',
    category: 'Animation',
    desc: 'CSS transitions are the easiest way to bring interfaces to life. Master timing functions and hardware acceleration.'
  },
  {
    title: 'Brand New Layouts with CSS Subgrid',
    category: 'CSS',
    desc: 'Subgrid allows us to extend a grid template down through the DOM tree. Unlocks exciting new layout possibilities.'
  },
  {
    title: 'Springs and Bounces in Native CSS',
    category: 'Animation',
    desc: 'The magic of the linear() timing function to model physics-based motion right in native vanilla CSS.'
  },
  {
    title: 'Why React Re-Renders',
    category: 'React',
    desc: 'An in-depth explanation of when and why components re-render, and how to optimize without premature useMemo.'
  },
  {
    title: 'Making Sense of React Server Components',
    category: 'React',
    desc: 'Demystifying RSCs, streaming SSR, and how client/server boundaries work together seamlessly.'
  }
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
              placeholder="Search tutorials, articles, goodies..."
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
              {query ? `Results matching "${query}"` : 'Popular Articles & Tutorials'}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="search-empty">No results found for &ldquo;{query}&rdquo;</div>
            ) : (
              <div className="search-results-list">
                {filteredPosts.map((post, idx) => (
                  <a
                    key={idx}
                    href={`#${post.title.toLowerCase().replace(/\s+/g, '-')}`}
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
