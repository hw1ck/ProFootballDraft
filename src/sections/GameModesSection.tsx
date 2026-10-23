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
        <div className="modeCard" style={{ borderColor: '#10B981', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', border: '1px solid #10B981', borderRadius: '4px', fontSize: '10px', padding: '2px 6px', fontFamily: 'var(--font-family-display)' }}>LIVE MODE</div>
          <h3>Auction Draft</h3>
          <p className="tagline">Real-time bidding arena. Manage your cap.</p>
          <p className="desc">
            Compete live against friends in a high-stakes transfer auction. Outbid opponents and build your squad within your budget!
          </p>
          <a href="/auction" className="button primary" style={{ marginTop: '16px', display: 'inline-block', fontSize: '0.85rem', padding: '8px 16px', textDecoration: 'none' }}>
            ENTER AUCTION ARENA ➔
          </a>
        </div>
      </div>
      <p className="comingSoon">More modes coming.</p>
    </section>
  );
};
