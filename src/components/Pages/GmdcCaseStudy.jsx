import React from 'react';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';
import { HeaderSplash } from '../SplashCursor/HeaderSplash';
import { PageTitle } from '../MaskedHeading/PageTitle';
import { StarButton } from '../StarBorder/StarButton';
import './Pages.css';

const FACTS = [
  ['Role', 'Sole Developer'],
  ['Client', 'GMDC (Government)'],
  ['Scale', '9 checkpoints · 100+ daily transactions'],
  ['Stack', 'React.js · Node.js · REST APIs · RFID & hardware'],
];

const BUILT = [
  'RFID-based vehicle validation at every checkpoint',
  'Boom barrier control, weighbridge capture and camera-based vehicle logging',
  'Slot booking and slip generation',
  'Node.js REST services connected to national systems: Parivahan, Saarthi, FASTag, GST e-Invoice and e-Way Bill',
];

const PROCESS = [
  'Visited the GMDC mine in Bhavnagar in person to see the real workflow',
  'Met the Mining Manager and the on-site team to understand what the system truly needed',
  'Gathered requirements directly with government clients',
  'Handled on-site testing and deployment',
  'Presented the project to Shri Roopwant Singh, IAS (MD)',
];

export const GmdcCaseStudy = () => (
  <div className="pg-wrapper">
    <div className="pg-container pg-container--narrow">
      <a className="pg-back" href="#projects" onClick={() => soundFx.playPop()}>
        <FiArrowLeft size={15} /> All projects
      </a>

      <header className="pg-header">
        <HeaderSplash />
        <span className="pg-kicker">Case Study</span>
        <PageTitle text="GMDC Mining Dispatch" texture="amber" />
        <p className="pg-sub">
          Government Vehicle Checkpoint Automation: a live truck dispatch platform for a government mining operation, where software, RFID hardware,
          weighbridges and national APIs all have to work together in real time.
        </p>
      </header>

      <dl className="pg-facts">
        {FACTS.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="pg-media">
        <video
          className="pg-media-video"
          src="/images/gmdc/GMDC_VID01.mp4"
          controls
          playsInline
          preload="metadata"
          aria-label="Visit to GMDC Mining, Bhavnagar"
        />
        <img src="/images/gmdc/GMDC_IMG02.jpeg" alt="On-site visit at the GMDC mining area, Bhavnagar" loading="lazy" />
        <img src="/images/gmdc/GMDC_IMG03.jpeg" alt="Meeting with the GMDC team" loading="lazy" />
      </div>

      <section className="pg-block">
        <h2>The challenge</h2>
        <p>
          Move trucks through 9 checkpoints accurately and in real time. Every vehicle has to be identified,
          validated and weighed, with hardware at each step and compliance checks against government systems.
        </p>
      </section>

      <section className="pg-block">
        <h2>What I built</h2>
        <ul className="pg-checks">
          {BUILT.map((t) => <li key={t}><FiCheck size={16} /><span>{t}</span></li>)}
        </ul>
      </section>

      <section className="pg-block">
        <h2>How I worked</h2>
        <ul className="pg-checks">
          {PROCESS.map((t) => <li key={t}><FiCheck size={16} /><span>{t}</span></li>)}
        </ul>
      </section>

      <section className="pg-block">
        <h2>Outcome</h2>
        <p>
          The system is live and processes 100+ transactions every day. It is one of the biggest projects of my
          career, and I was the only developer on it from requirements to go-live.
        </p>
      </section>

      <div className="pg-actions">
        <StarButton as="a" primary href="#contact" onClick={() => soundFx.playPop()}>Discuss a project</StarButton>
        <StarButton as="a" href="#projects" onClick={() => soundFx.playPop()}>See other projects</StarButton>
      </div>
    </div>
  </div>
);
