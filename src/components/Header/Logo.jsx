import React from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '../../utils/soundEffects';

export const Logo = () => {
  return (
    <motion.a
      href="/"
      className="site-logo"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      onClick={() => soundFx.playPop()}
      aria-label="Josh W Comeau Homepage"
    >
      <span className="logo-first">Josh</span>
      <span className="logo-middle-container">
        {/* Top playful mark */}
        <motion.svg
          className="logo-mark logo-mark-top"
          width="14"
          height="12"
          viewBox="0 0 14 12"
          fill="none"
          variants={{
            hover: { y: -3, rotate: -6, transition: { type: 'spring', stiffness: 400, damping: 10 } }
          }}
        >
          <path
            d="M1.83685 4.19021C2.50472 5.35898 3.23081 6.5572 3.80331 7.77375C4.05248 8.30325 4.35843 9.36185 4.81149 9.75018C5.73454 10.5414 6.29678 10.273 6.76796 9.06143C7.13194 8.12547 7.20283 7.08915 7.54655 6.12672C7.91111 5.10596 9.23909 6.70274 9.78252 7.06503C10.3171 7.42139 13.574 9.528 12.8869 7.60406C12.6687 6.99301 12.6107 6.33922 12.4777 5.70748C12.3451 5.07774 12.1099 4.28137 12.0784 3.65119C12.0399 2.88207 11.719 2.12838 11.719 1.3154"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>

        {/* W Letter */}
        <motion.span
          className="logo-w"
          variants={{
            hover: { scale: 1.15, rotate: 4, transition: { type: 'spring', stiffness: 500, damping: 12 } }
          }}
        >
          W
        </motion.span>

        {/* Bottom playful mark */}
        <motion.svg
          className="logo-mark logo-mark-bottom"
          width="9"
          height="10"
          viewBox="0 0 9 10"
          fill="none"
          variants={{
            hover: { y: 2, rotate: 8, transition: { type: 'spring', stiffness: 400, damping: 10 } }
          }}
        >
          <path
            d="M1 9C2.23995 7.12464 3.87268 5.18927 4.17593 2.59926C4.22017 2.22137 4.11111 0.731563 4.11111 1.04233C4.11111 1.49132 4.41831 2.03152 4.55761 2.40705C4.98522 3.55977 5.31447 4.69324 5.92593 5.70352C6.43274 6.54092 7.08081 7.96204 8 7.96204"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </span>
      <span className="logo-last">Comeau</span>
    </motion.a>
  );
};
