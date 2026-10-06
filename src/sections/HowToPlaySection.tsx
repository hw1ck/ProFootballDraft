import React from 'react';


export const HowToPlaySection = () => {
  return (
    <section className="section">
      <h2 className="heading">HOW TO PLAY</h2>
      <p className="copy">Three simple steps: draft, build, and rank.</p>
      
      <div className="steps">
        <div className="step">
          <div className="stepNum">01</div>
          <div className="stepContent">
            <h3>Pick a Draft</h3>
            <p>Classic Draft, Merge Draft, and more.</p>
          </div>
        </div>
        <div className="step">
          <div className="stepNum">02</div>
          <div className="stepContent">
            <h3>Draft with Friends</h3>
            <p>Draft 16 players, then build your XI in the Locker Room.</p>
          </div>
        </div>
        <div className="step">
          <div className="stepNum">03</div>
          <div className="stepContent">
            <h3>Rank Your Squad</h3>
            <p>Lock your team. Once everyone locks, the final rankings settle the rivalry.</p>
          </div>
        </div>
      </div>
    </section>
  );
};