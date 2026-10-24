import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { HeaderActions } from './HeaderActions';
import { SearchModal } from './SearchModal';
import { MobileMenu } from './MobileMenu';
import { soundFx } from '../../utils/soundEffects';
import './Header.css';

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverThreshold, setIsOverThreshold] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const headerRef = useRef(null);
  const slotRef = useRef(null);

  // Scroll behaviour: the header slides away while scrolling down and returns as soon as
  // you scroll up (always visible near the top of the page).
  useEffect(() => {
    let lastY = window.scrollY;

    const update = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      setIsOverThreshold(y > 30);

      if (y <= 30) {
        setIsHidden(false);
        lastY = y;
      } else if (delta > 6 && y > 80) {
        setIsHidden(true);
        lastY = y;
      } else if (delta < -6) {
        setIsHidden(false);
        lastY = y;
      }
    };

    const onScroll = update;
    const onHash = () => {
      lastY = window.scrollY;
      setIsHidden(false);
      setIsOverThreshold(window.scrollY > 30);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('popstate', onHash);
    window.addEventListener('routechange', onHash);
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpenSearch);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('popstate', onHash);
      window.removeEventListener('routechange', onHash);
      window.removeEventListener('open-search-modal', handleOpenSearch);
    };
  }, []);

  // The header is fixed, so an in-flow placeholder of the same height keeps the page layout.
  useEffect(() => {
    const header = headerRef.current;
    const slot = slotRef.current;
    if (!header || !slot) return undefined;
    const sync = () => {
      slot.style.height = `${header.offsetHeight}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  const toggleMobileMenu = () => {
    soundFx.playPop();
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <>
      <div ref={slotRef} className="header-slot">
      <div
        ref={headerRef}
        data-is-over-threshold={isOverThreshold ? 'true' : 'false'}
        data-is-hidden={isHidden ? 'true' : 'false'}
        className="h1w8168s"
        onFocus={() => setIsHidden(false)}
      >
        <div className="bui2te1" aria-hidden="true" />
        <div style={{ '--max-width': '68.75rem', position: 'relative' }} className="watium4">
          <div className="o16qpys8">
            <header style={{ viewTransitionName: 'site-header' }} className="wisp6v7">
              {/* Logo (Krish Patel with Doodle W) */}
              <Logo />

              {/* Desktop Navigation */}
              <Navigation />

              {/* Actions: Search, Sound, Theme, RSS, Mobile */}
              <HeaderActions
                onOpenSearch={() => setIsSearchOpen(true)}
                onToggleMobile={toggleMobileMenu}
              />
            </header>
          </div>

        </div>
      </div>
      </div>

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Sidebar Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
};
