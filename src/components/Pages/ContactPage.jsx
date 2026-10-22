import React, { useState } from 'react';
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiMapPin, FiDownload, FiExternalLink, FiSend } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';
import { RESUME_URL, RESUME_FILENAME } from '../../utils/pages';
import { PageTitle } from '../MaskedHeading/PageTitle';
import { StarButton } from '../StarBorder/StarButton';
import SplashCursor from '../SplashCursor/SplashCursor';
import { useTheme } from '../../context/ThemeContext';
import './Pages.css';

const EMAIL = 'krishpatel51151@gmail.com';

const CHANNELS = [
  { Icon: FiMail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { Icon: FiPhone, label: 'Phone', value: '+91 91043 33811', href: 'tel:+919104333811' },
  { Icon: FiLinkedin, label: 'LinkedIn', value: 'linkedin.com/in/krishpatel511', href: 'https://www.linkedin.com/in/krishpatel511', external: true },
  { Icon: FiGithub, label: 'GitHub', value: 'github.com/KrishPatel511', href: 'https://github.com/KrishPatel511', external: true },
  { Icon: FiMapPin, label: 'Location', value: 'Ahmedabad, India' },
];

export const ContactPage = () => {
  const { isDark } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    soundFx.playPop();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n${form.name}\n${form.email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pg-wrapper">
      {/* Fluid ink that follows the cursor, drawn behind the page content */}
      <SplashCursor
        rainbow
        size={1}
        force={1}
        swirl={3}
        trail={1}
        clickSplash
        zIndex={0}
        theme={isDark ? 'dark' : 'light'}
      />
      <div className="pg-container">
        <header className="pg-header">
          <span className="pg-kicker">Contact</span>
          <PageTitle text="Let's build something reliable together." texture="water" />
          <p className="pg-sub">
            I&apos;m a Full Stack Developer based in Ahmedabad, building enterprise and government systems.
            If you&apos;re hiring or have a project in mind, I&apos;d love to hear from you.
          </p>
          <div className="pg-actions">
            <StarButton as="a" primary href={RESUME_URL} download={RESUME_FILENAME} onClick={() => soundFx.playPop()}>
              <FiDownload size={16} /> Download Resume
            </StarButton>
            <StarButton as="a" href={RESUME_URL} target="_blank" rel="noreferrer" onClick={() => soundFx.playPop()}>
              <FiExternalLink size={16} /> View Online
            </StarButton>
          </div>
        </header>

        <div className="pg-contact-grid">
          <ul className="pg-channels">
            {CHANNELS.map(({ Icon, label, value, href, external }) => (
              <li key={label}>
                {href ? (
                  <a
                    className="pg-channel"
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    onClick={() => soundFx.playPop()}
                  >
                    <span className="pg-channel-icon"><Icon size={18} /></span>
                    <span>
                      <span className="pg-channel-label">{label}</span>
                      <span className="pg-channel-value">{value}</span>
                    </span>
                  </a>
                ) : (
                  <div className="pg-channel">
                    <span className="pg-channel-icon"><Icon size={18} /></span>
                    <span>
                      <span className="pg-channel-label">{label}</span>
                      <span className="pg-channel-value">{value}</span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <form className="pg-form" onSubmit={submit}>
            <h2 className="pg-form-title">Send a message</h2>
            <label>
              <span>Your name</span>
              <input required value={form.name} onChange={set('name')} placeholder="Your name" />
            </label>
            <label>
              <span>Your email</span>
              <input required type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" />
            </label>
            <label>
              <span>Message</span>
              <textarea required rows={5} value={form.message} onChange={set('message')} placeholder="Tell me about the role or project..." />
            </label>
            <StarButton type="submit" primary className="pg-submit">
              <FiSend size={16} /> Send via email
            </StarButton>
            <p className="pg-note">This opens your email app with the message ready to send.</p>
          </form>
        </div>
      </div>
    </div>
  );
};
