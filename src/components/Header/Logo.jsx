import React from 'react';
import { soundFx } from '../../utils/soundEffects';
import './Logo.css';

export const Logo = () => {
  const handleClick = () => {
    soundFx.playPop();
  };

  return (
    <a
      className="sal3l5t w17lbfx3 s1j91s21 site-logo"
      href="/"
      onClick={handleClick}
      aria-label="Krish Patel Homepage"
    >
      <span className="goxpqke gr874hq logo-first-name">Krish</span>
      <span className="irj294a logo-middle-mark">
        <svg
          width="0.875rem"
          height="0.75rem"
          viewBox="0 0 14 12"
          fill="none"
          className="idwm85l i9xec9h logo-svg-top"
          aria-hidden="true"
        >
          <path
            d="M2 9.5 L5 3.5 L8 8.5 L12 2.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="p16e8bzl logo-stroke"
          />
        </svg>

        <svg
          width="0.5625rem"
          height="0.625rem"
          viewBox="0 0 9 10"
          fill="none"
          className="l1c4qjpw l1ngw3bx logo-svg-bottom"
          aria-hidden="true"
        >
          <path
            d="M1.5 9 L4.5 2 L7.5 9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="p16e8bzl logo-stroke"
          />
        </svg>

        <span className="i100qmoq logo-spacer-letter" aria-hidden="true">W</span>
      </span>
      <span className="f7ysafc f5ggs7 logo-last-name">Patel</span>
    </a>
  );
};
