import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { DropdownMenu, dropdownData } from './DropdownMenu';
import { HeaderActions } from './HeaderActions';
import { SearchModal } from './SearchModal';
import { soundFx } from '../../utils/soundEffects';
import './Header.css';

export const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);

  // Detect scroll to enhance glass shadow/border
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    soundFx.playPop();
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header ${isScrolled ? 'header-scrolled' : ''} ${
          activeMenu ? 'header-menu-active' : ''
        }`}
      >
        <div className="header-container">
          {/* Logo */}
          <div className="header-left">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="header-center">
            <Navigation activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          </div>

          {/* Right Action Icons (Search, Sound, Theme, RSS) */}
          <div className="header-right">
            <HeaderActions onOpenSearch={() => setIsSearchOpen(true)} />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop Mega-Menu Dropdown */}
        <DropdownMenu
          activeMenu={activeMenu}
          onClose={() => setActiveMenu(null)}
        />
      </header>

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-drawer-header">
                <Logo />
                <button
                  type="button"
                  className="mobile-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiX size={22} />
                </button>
              </div>

              <div className="mobile-drawer-search">
                <button
                  type="button"
                  className="mobile-search-trigger"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                >
                  <FiSearch size={18} />
                  <span>Search articles & tools...</span>
                </button>
              </div>

              <div className="mobile-nav-groups">
                {Object.entries(dropdownData).map(([key, data]) => (
                  <div key={key} className="mobile-group">
                    <h3 className="mobile-group-title">{data.title}</h3>
                    <div className="mobile-group-links">
                      {data.items.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={idx}
                            href={`#${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                            className="mobile-item-link"
                            onClick={() => {
                              soundFx.playPop();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <span
                              className="mobile-item-icon"
                              style={{ color: item.color }}
                            >
                              <Icon size={18} />
                            </span>
                            <div>
                              <div className="mobile-item-title">{item.title}</div>
                              <div className="mobile-item-desc">{item.desc}</div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="mobile-group">
                  <h3 className="mobile-group-title">More</h3>
                  <a
                    href="#about"
                    className="mobile-direct-link"
                    onClick={() => {
                      soundFx.playPop();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    About Josh Comeau
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
