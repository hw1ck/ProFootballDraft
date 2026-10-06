import React from 'react';

import { Button } from '../components/common/Button';

export const FinalCTASection = () => {
  return (
    <section className="section">
      <div className="iconBox">🏆</div>
      <h2 className="heading">READY TO BUILD YOUR WINNING SQUAD?</h2>
      <p className="copy">
        Join a room, draft 16 players, and see how your squad ranks.
      </p>
      <Button variant="primary" className="cta">🚀 Join Draft</Button>
    </section>
  );
};