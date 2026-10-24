import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { soundFx } from '../../utils/soundEffects';

export const HeaderActions = ({ onOpenSearch, onToggleMobile }) => {
  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();

  const handleSearchClick = () => {
    soundFx.playWhoosh();
    onOpenSearch();
  };

  const handleSoundClick = () => {
    soundFx.playPop();
    toggleSound();
  };

  const handleThemeClick = () => {
    soundFx.playPop();
    toggleTheme();
  };

  const handleRssClick = (e) => {
    soundFx.playPop();
  };

  return (
    <div id="site-header-actions" className="a5r4dca">
      {/* 1. Search Action */}
      <div data-is-optional="false" className="a18yhdhc w1nwb8mx">
        <button
          type="button"
          className="w17zbdjf"
          onClick={handleSearchClick}
          aria-label="Search"
        >
          <span className="w4ln40i">
            <span className="s15za2df">
              <span
                className="s1qsi09f"
                style={{ transform: 'rotate(-20deg) translateX(50%)' }}
              />
            </span>
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="1.25rem"
              height="1.25rem"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="slgln6u"
              style={{ transform: 'scale(1) rotate(0deg)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <span className="wlgbkjj">Search</span>
        </button>
      </div>

      {/* 2. Sound Effects Toggle Action */}
      <div data-is-optional="true" className="a18yhdhc w1nwb8mx">
        <button
          type="button"
          className="w17zbdjf"
          onClick={handleSoundClick}
          aria-label={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
        >
          <svg
            width="1.25rem"
            height="1.25rem"
            viewBox="0 0 24 24"
            fill="none"
            className="slyn8ky"
          >
            <g
              className="sq4k8cp"
              style={{
                transform: soundEnabled ? 'translateX(0px)' : 'translateX(-2px)',
                transitionDelay: '0ms',
              }}
            >
              <path
                d="M12.0133 4.60757C11.9149 4.2957 11.5463 4.19331 11.2861 4.39151L5.93425 8.46914C5.84716 8.5355 5.74071 8.57143 5.63123 8.57143H1.5C1.22386 8.57143 1 8.79529 1 9.07143V14.9286C1 15.2047 1.22386 15.4286 1.5 15.4286H5.63123C5.74071 15.4286 5.84716 15.4645 5.93425 15.5309L11.2861 19.6085C11.5463 19.8067 11.9149 19.7043 12.0133 19.3924C12.3582 18.2999 13 15.7612 13 12C13 8.2388 12.3582 5.70014 12.0133 4.60757Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-should-wiggle="false"
                className="s1um8jkh pv1k4t7"
                style={{ transform: 'rotate(0deg)' }}
              />
            </g>
            <g
              className="w1azqaf0"
              style={{
                opacity: soundEnabled ? 1 : 0,
                transform: soundEnabled ? 'translateX(0px)' : 'translateX(-3px)',
                transition: 'opacity 0.2s, transform 0.2s',
                transitionDelay: '0ms',
              }}
            >
              <path
                d="M 17.54 8.46002 C 18.4774 9.39766 19.004 10.6692 19.004 11.995 C 19.004 13.3208 18.4774 14.5924 17.54 15.53"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pv1k4t7"
              />
            </g>
            <g
              className="w1azqaf0"
              style={{
                opacity: soundEnabled ? 1 : 0,
                transform: soundEnabled ? 'translateX(0px)' : 'translateX(-5px)',
                transition: 'opacity 0.2s, transform 0.2s',
                transitionDelay: '150ms',
              }}
            >
              <path
                d="M 20.0703 4.92999 C 21.945 6.80527 22.9982 9.34835 22.9982 12 C 22.9982 14.6516 21.945 17.1947 20.0703 19.07"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pv1k4t7"
              />
            </g>
          </svg>
          <span className="wlgbkjj">
            {soundEnabled ? 'Disable sounds' : 'Enable sounds'}
          </span>
        </button>
      </div>

      {/* 3. Theme Toggle Action (Sun/Moon Mask SVG) */}
      <div data-is-optional="false" className="a18yhdhc w1nwb8mx">
        <button
          type="button"
          className="w17zbdjf"
          onClick={handleThemeClick}
          aria-label={isDark ? 'Activate light mode' : 'Activate dark mode'}
        >
          <svg
            width="1.25rem"
            height="1.25rem"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`smm9umv theme-icon ${isDark ? 'is-dark' : 'is-light'}`}
          >
            {/* Sun: shown in light mode */}
            <g className="theme-icon__sun">
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
            </g>
            {/* Moon: shown in dark mode */}
            <g className="theme-icon__moon">
              <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" fill="currentColor" />
              <path d="M17.5 3.5v2.4M16.3 4.7h2.4" strokeWidth="1.6" />
            </g>
          </svg>
          <span className="wlgbkjj">
            {isDark ? 'Activate light mode' : 'Activate dark mode'}
          </span>
        </button>
      </div>

      {/* 4. GitHub Action */}
      <div data-is-optional="true" className="a18yhdhc w1nwb8mx">
        <a
          rel="noopener noreferrer"
          target="_blank"
          className="w17zbdjf s1j91s21"
          href="https://github.com/KrishPatel511"
          onClick={handleRssClick}
          aria-label="GitHub"
        >
          <svg
            width="1.25rem"
            height="1.25rem"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="s11zvmub"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <span className="wlgbkjj">GitHub</span>
        </a>
      </div>

      {/* 5. Mobile Menu Toggle Hamburger */}
      <div data-is-optional="false" className="h57b4uk a18yhdhc w1nwb8mx">
        <button
          type="button"
          className="s1wslf2n w17zbdjf"
          onClick={onToggleMobile}
          aria-label="Toggle menu"
          style={{ transform: 'scale(1)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.25rem"
            height="1.25rem"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="s1wls44k"
          >
            <line x1="3" y1="5" x2="21" y2="5" />
            <line x1="3" y1="12" x2="21" y2="12" style={{ opacity: 1 }} />
            <line x1="3" y1="19" x2="21" y2="19" />
          </svg>
          <span className="wlgbkjj">Toggle menu</span>
        </button>
      </div>
    </div>
  );
};
