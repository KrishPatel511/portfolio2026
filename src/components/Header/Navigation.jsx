import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';

export const Navigation = ({ activeMenu, setActiveMenu }) => {
  const navItems = [
    { id: 'categories', label: 'Categories', hasDropdown: true },
    { id: 'courses', label: 'Courses', hasDropdown: true },
    { id: 'goodies', label: 'Goodies', hasDropdown: true },
    { id: 'about', label: 'About', hasDropdown: false, href: '#about' }
  ];

  const handleMouseEnter = (item) => {
    if (item.hasDropdown) {
      if (activeMenu !== item.id) {
        soundFx.playPop();
      }
      setActiveMenu(item.id);
    } else {
      setActiveMenu(null);
    }
  };

  const handleClick = (item) => {
    soundFx.playPop();
    if (item.hasDropdown) {
      setActiveMenu(activeMenu === item.id ? null : item.id);
    } else {
      setActiveMenu(null);
    }
  };

  return (
    <nav className="site-navigation" aria-label="Main Navigation">
      <ul className="nav-list">
        {navItems.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <li
              key={item.id}
              className="nav-item"
              onMouseEnter={() => handleMouseEnter(item)}
            >
              {item.hasDropdown ? (
                <button
                  type="button"
                  className={`nav-button ${isActive ? 'active' : ''}`}
                  onClick={() => handleClick(item)}
                  aria-expanded={isActive}
                  aria-haspopup="true"
                >
                  <span className="nav-label">{item.label}</span>
                  <motion.span
                    className="nav-chevron"
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown size={14} />
                  </motion.span>
                  {isActive && (
                    <motion.div
                      className="nav-active-pill"
                      layoutId="activeNavPill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ) : (
                <a
                  href={item.href}
                  className="nav-button"
                  onClick={() => soundFx.playPop()}
                >
                  <span className="nav-label">{item.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
