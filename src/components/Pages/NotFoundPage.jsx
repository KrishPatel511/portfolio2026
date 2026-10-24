import React from 'react';
import { StarButton } from '../StarBorder/StarButton';
import { soundFx } from '../../utils/soundEffects';
import './Pages.css';

export const NotFoundPage = () => (
  <main id="main-content" className="pg-wrapper">
    <div className="pg-container pg-container--narrow">
      <header className="pg-header">
        <span className="pg-kicker">Error 404</span>
        <h1 className="pg-title">This page does not exist.</h1>
        <p className="pg-sub">The link may be old or mistyped. Here is a way back.</p>
      </header>
      <div className="pg-actions">
        <StarButton as="a" primary href="/" onClick={() => soundFx.playPop()}>Go to the home page</StarButton>
        <StarButton as="a" href="/projects" onClick={() => soundFx.playPop()}>See my projects</StarButton>
      </div>
    </div>
  </main>
);
