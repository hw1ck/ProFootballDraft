import React from 'react';


export const GameModesSection = () => {
  return (
    <section className="section">
      <h2 className="heading">CHOOSE YOUR DRAFT</h2>
      
      <div className="modes">
        <div className="modeCard">
          <h3>Classic Draft</h3>
          <p className="tagline">Five cards. Pick one.</p>
          <p className="desc">
            Build your 16-player squad by making one choice from each five-card selection.
          </p>
        </div>
        <div className="modeCard">
          <h3>Merge Draft</h3>
          <p className="tagline">Two players. Two cards. One decision.</p>
          <p className="desc">
            Choose one card while the other goes to your opponent.
          </p>
        </div>
      </div>
      <p className="comingSoon">More modes coming.</p>
    </section>
  );
};
