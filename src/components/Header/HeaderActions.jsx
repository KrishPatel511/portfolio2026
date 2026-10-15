import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiVolume2, FiVolumeX, FiSun, FiMoon, FiRss } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { soundFx } from '../../utils/soundEffects';

export const HeaderActions = ({ onOpenSearch }) => {
  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();

  const handleSearchClick = () => {
    soundFx.playWhoosh();
    onOpenSearch();
  };

  const handleRssClick = (e) => {
    e.preventDefault();
    soundFx.playPop();
    alert('Subscribed to Josh Comeau RSS Feed: /rss.xml');
  };

  return (
    <div className="header-actions" id="site-header-actions">
      {/* Search Button */}
      <motion.button
        type="button"
        className="action-btn"
        onClick={handleSearchClick}
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.92 }}
        title="Search articles & tutorials (Cmd+K)"
        aria-label="Search"
      >
        <FiSearch size={19} />
        <span className="tooltip">Search (Cmd+K)</span>
      </motion.button>

      {/* Sound FX Toggle */}
      <motion.button
        type="button"
        className={`action-btn ${!soundEnabled ? 'muted' : ''}`}
        onClick={toggleSound}
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.92 }}
        title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        <motion.div
          key={soundEnabled ? 'sound-on' : 'sound-off'}
          initial={{ rotate: -20, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {soundEnabled ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
        </motion.div>
        <span className="tooltip">{soundEnabled ? 'Sound: ON' : 'Sound: OFF'}</span>
      </motion.button>

      {/* Theme Toggle (Sun / Moon) */}
      <motion.button
        type="button"
        className="action-btn theme-toggle-btn"
        onClick={toggleTheme}
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.92 }}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle Color Theme"
      >
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {isDark ? <FiSun size={20} className="sun-icon" /> : <FiMoon size={20} className="moon-icon" />}
        </motion.div>
        <span className="tooltip">{isDark ? 'Light Theme' : 'Dark Theme'}</span>
      </motion.button>

      {/* RSS Feed Button */}
      <motion.a
        href="/rss.xml"
        className="action-btn"
        onClick={handleRssClick}
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.92 }}
        title="RSS Feed"
        aria-label="RSS Feed"
      >
        <FiRss size={19} />
        <span className="tooltip">RSS Feed</span>
      </motion.a>
    </div>
  );
};
