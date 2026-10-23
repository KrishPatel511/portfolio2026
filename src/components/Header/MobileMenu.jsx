import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiSearch,
  FiSun,
  FiMoon,
  FiMinus,
  FiChevronDown,
  FiLayers,
  FiZap,
  FiBriefcase,
  FiDownload,
  FiTruck,
  FiGitBranch,
  FiHeart,
  FiGrid,
  FiLayout,
  FiTerminal,
  FiDatabase,
  FiCloud,
  FiCpu,
  FiAward,
  FiBookOpen,
  FiBarChart2,
  FiTrendingUp,
} from 'react-icons/fi';
import { Logo } from './Logo';
import { useTheme } from '../../context/ThemeContext';
import { soundFx } from '../../utils/soundEffects';
import { RESUME_URL, RESUME_FILENAME } from '../../utils/pages';
import './MobileMenu.css';

const GROUPS = [
  {
    key: 'projects',
    label: 'Projects',
    Icon: FiLayers,
    items: [
      { label: 'All Projects', href: '#projects', Icon: FiGrid },
      { label: 'GMDC Mining', href: '#gmdc', Icon: FiTruck },
      { label: 'AI GitHub Agent', href: '#projects', Icon: FiGitBranch },
      { label: 'Auralyx', href: '#waldor', Icon: FiHeart },
    ],
  },
  {
    key: 'skills',
    label: 'Skills',
    Icon: FiZap,
    items: [
      { label: 'Frontend', href: '#skills', Icon: FiLayout },
      { label: 'Backend', href: '#skills', Icon: FiTerminal },
      { label: 'Database', href: '#skills', Icon: FiDatabase },
      { label: 'Cloud & Tools', href: '#skills', Icon: FiCloud },
      { label: 'AI & APIs', href: '#skills', Icon: FiCpu },
    ],
  },
  {
    key: 'experience',
    label: 'Experience',
    Icon: FiBriefcase,
    items: [
      { label: 'AMNEX', href: '#experience', Icon: FiTrendingUp },
      { label: 'BeyonData', href: '#experience', Icon: FiBarChart2 },
      { label: 'Education', href: '#education', Icon: FiBookOpen },
      { label: 'Certificates', href: '#certifications', Icon: FiAward },
    ],
  },
];

const SKY_LINKS = [
  ['About Me', '#about'],
  ['Experience', '#experience'],
  ['Contact', '#contact'],
];

export const MobileMenu = ({ isOpen, onClose, onOpenSearch }) => {
  const { isDark, toggleTheme } = useTheme();
  const [openKey, setOpenKey] = useState('projects');

  // Lock page scroll behind the menu and close it with Escape.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  // The menu is mobile-only: close it if the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 50.0625rem)');
    const onChange = (e) => e.matches && onClose();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [onClose]);

  const pick = () => {
    soundFx.playPop();
    onClose();
  };

  const toggleGroup = (key) => {
    soundFx.playPop();
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="mm-root"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Top bar: logo and quick actions */}
          <div className="mm-top">
            <Logo />
            <div className="mm-actions">
              <button
                type="button"
                className="mm-icon-btn"
                aria-label="Search"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
              >
                <FiSearch size={22} />
              </button>
              <button
                type="button"
                className="mm-icon-btn"
                aria-label={isDark ? 'Activate light mode' : 'Activate dark mode'}
                onClick={() => {
                  soundFx.playPop();
                  toggleTheme();
                }}
              >
                {isDark ? <FiSun size={22} /> : <FiMoon size={22} />}
              </button>
              <button type="button" className="mm-icon-btn mm-close" aria-label="Close menu" onClick={onClose}>
                <FiX size={30} />
              </button>
            </div>
          </div>

          {/* White sheet: accordion groups, resume row and the sky card */}
          <motion.div
            className="mm-sheet-wrap"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.17, 0.67, 0.2, 1] }}
          >
            <div className="mm-sheet">
              <ul className="mm-list">
                {GROUPS.map(({ key, label, Icon, items }) => {
                  const open = openKey === key;
                  return (
                    <li key={key} className="mm-item">
                      <button
                        type="button"
                        className="mm-row"
                        aria-expanded={open}
                        aria-controls={`mm-panel-${key}`}
                        onClick={() => toggleGroup(key)}
                      >
                        <Icon size={22} className="mm-row-icon" aria-hidden="true" />
                        <span className="mm-row-label">{label}</span>
                        {open ? <FiChevronDown size={22} aria-hidden="true" /> : <FiMinus size={22} aria-hidden="true" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            id={`mm-panel-${key}`}
                            className="mm-panel-clip"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.17, 0.67, 0.2, 1] }}
                          >
                            <ul className="mm-panel">
                              {items.map(({ label: itemLabel, href, Icon: ItemIcon }) => (
                                <li key={itemLabel}>
                                  <a href={href} className="mm-sub" onClick={pick}>
                                    <ItemIcon size={22} aria-hidden="true" />
                                    <span>{itemLabel}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}

                <li className="mm-item">
                  <a className="mm-row" href={RESUME_URL} download={RESUME_FILENAME} onClick={pick}>
                    <FiDownload size={22} className="mm-row-icon" aria-hidden="true" />
                    <span className="mm-row-label">Download Resume</span>
                  </a>
                </li>
              </ul>

              {/* Sky card */}
              <div className="mm-sky">
                <svg viewBox="0 0 788 265" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="mm-sky-back" aria-hidden="true">
                  <path
                    d="M681.771 38.1111C693.771 38.1111 688.271 -2.38884 759.771 0.111155C770.228 0.476802 779.338 1.54837 787.271 3.11155V264.111H0.770948C0.770948 264.111 -9.72906 229.611 46.7709 192.611C103.271 155.611 148.271 182.611 153.271 181.611C158.271 180.611 153.771 139.111 230.771 123.111C307.771 107.111 322.771 138.111 332.271 136.111C341.771 134.111 336.771 87.6111 405.271 74.1111C473.771 60.6112 497.771 89.1112 505.771 88.1111C513.771 87.1111 510.271 37.1111 574.271 21.6111C638.271 6.11115 669.771 38.1111 681.771 38.1111Z"
                    fill="#dcecf7"
                  />
                </svg>
                <picture>
                  <source type="image/webp" srcSet="/images/josh/josh-happy-light.webp" />
                  <img className="mm-sky-mascot" src="/images/josh/josh-happy-light.png" alt="" />
                </picture>
                <svg viewBox="0 0 740 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="mm-sky-front" aria-hidden="true">
                  <path
                    d="M230 74.9998C221.5 71.9995 190.5 22.4998 69 18.4998C45.6329 17.7305 25.6317 19.3469 8.56594 22.4598C4.15502 23.2644 0 19.9389 0 15.4552V108H740V60.9843C740 65.0822 736.496 68.3004 732.408 68.01C729.819 67.8261 727.184 67.6558 724.5 67.4998C595.5 59.9998 582 95 573.5 94.9998C565 94.9995 532 58.9998 406 47.4998C280 35.9998 238.5 78 230 74.9998Z"
                    fill="#ffffff"
                  />
                </svg>
                <ul className="mm-sky-links">
                  {SKY_LINKS.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} onClick={pick}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
