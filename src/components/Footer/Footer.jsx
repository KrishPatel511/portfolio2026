import React, { useState } from 'react';
import { FiGithub, FiLinkedin, FiRss } from 'react-icons/fi';
import { FaBluesky } from 'react-icons/fa6';
import { Logo } from '../Header/Logo';
import { soundFx } from '../../utils/soundEffects';
import './Footer.css';

const CATEGORIES = [
  ['CSS', '/css/'],
  ['React', '/react/'],
  ['Animation', '/animation/'],
  ['JavaScript', '/javascript/'],
  ['Career', '/career/'],
  ['SVG', '/svg/'],
  ['Next.js', '/nextjs/'],
  ['General', '/blog/'],
];

const COURSES = [
  ['CSS for JS Developers', 'https://css-for-js.dev/'],
  ['The Joy of React', 'https://joyofreact.com'],
  ['Whimsical Animations', 'https://whimsy.joshwcomeau.com'],
];

const GENERAL = [
  ['About Josh', '/about-josh/'],
  ['About This Blog', '/blog/how-i-built-my-blog-v2/'],
  ['Contact', '/contact/'],
];

const SOCIALS = [
  ['RSS Feed', 'https://www.joshwcomeau.com/rss.xml', FiRss],
  ['Bluesky', 'https://bsky.app/profile/joshwcomeau.com', FaBluesky],
  ['GitHub', 'https://github.com/joshwcomeau/', FiGithub],
  ['LinkedIn', 'https://www.linkedin.com/in/joshwcomeau/', FiLinkedin],
];

const LEGAL = [
  ['Terms of Use', 'https://courses.joshwcomeau.com/terms'],
  ['Privacy Policy', 'https://courses.joshwcomeau.com/privacy'],
  ['Code of Conduct', 'https://courses.joshwcomeau.com/code-of-conduct'],
];

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [human, setHuman] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Honeypot: real people leave the "are you a human" checkbox unchecked.
    if (human || !email) return;
    soundFx.playPop();
    setSubmitted(true);
    setEmail('');
  };

  const external = (href) =>
    href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {};

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-newsletter">
          <form onSubmit={handleSubmit} className="newsletter-form">
            <label className="honeypot">
              Are you a human? If so, please ignore this checkbox.
              <input
                type="checkbox"
                checked={human}
                onChange={(e) => setHuman(e.target.checked)}
                tabIndex={-1}
              />
            </label>
            <label htmlFor="footer-email" className="newsletter-label">
              Want to know when I publish new content?
            </label>
            <div className="newsletter-row">
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">Submit</button>
            </div>
            {submitted && (
              <p className="newsletter-thanks" role="status">Thanks! You&apos;re on the list. 🎉</p>
            )}
          </form>
        </div>

        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <div className="footer-socials">
              {SOCIALS.map(([label, href, Icon]) => (
                <a
                  key={label}
                  href={href}
                  {...external(href)}
                  className="social-btn"
                  aria-label={label}
                  onClick={() => soundFx.playPop()}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-heading">Browse By Category</h4>
              <ul>
                {CATEGORIES.map(([label, href]) => (
                  <li key={label}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Interactive Courses</h4>
              <ul>
                {COURSES.map(([label, href]) => (
                  <li key={label}><a href={href} {...external(href)}>{label}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">General</h4>
              <ul>
                {GENERAL.map(([label, href]) => (
                  <li key={label}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2018–present Joshua Comeau. All Rights Reserved.</p>
          <ul className="footer-legal">
            {LEGAL.map(([label, href]) => (
              <li key={label}><a href={href} {...external(href)}>{label}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
