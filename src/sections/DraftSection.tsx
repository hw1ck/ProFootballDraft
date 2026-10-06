import React from 'react';

import { PlayerCard } from '../components/player/PlayerCard';

export const DraftSection = () => {
  return (
    <section className="section">
      <h2 className="heading">DRAFT WITH FRIENDS</h2>
      <p className="copy">
        Five cards. One choice. Draft 16 players in Classic Draft. Every pick shapes your squad.
      </p>
      
      <div className="draftDemo">
        <div className="draftHeader">
          <span>PICK YOUR CARD</span>
          <span>ROUND 3 / 16</span>
        </div>
        <div className="cardsRow">
          <PlayerCard 
            ovr={91} position="ST" name="Haaland" role="FINISHER" isTopPick={true}
          />
          <PlayerCard 
            ovr={90} position="CM" name="Bellingham" role="BOX-TO-BOX"
          />
          <PlayerCard 
            ovr={88} position="RW" name="Saka" role="WINGER"
          />
        </div>
      </div>
    </section>
  );
};