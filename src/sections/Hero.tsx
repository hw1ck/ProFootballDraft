import React from 'react';
import { Button } from '../components/common/Button';
import { PlayerCard } from '../components/player/PlayerCard';


export const Hero = () => {
  return (
    <section className="hero">
      <div className="heroContent">
        <div className="demoCard">
          <div className="demoCardHeader">
            <div className="liveDraft">
              <span className="dot"></span> LIVE DRAFT #409
            </div>
            <div className="timer">⏱ 00:18s</div>
          </div>
          
          <div className="mockCardWrapper">
            <PlayerCard 
              ovr={91}
              position="ST"
              name="Erling Haaland"
              club="Manchester City"
              nation="Norway"
              role="FINISHER"
              pac={89}
              sho={93}
              phy={88}
            />
          </div>

          <div className="mockTurn">
            <span className="mockPick">Pick 4 of 16 • Classic</span>
            <span className="turnLabel">TURN: YOUR PICK</span>
          </div>
        </div>

        <h1 className="headline">
          DRAFT. BUILD.<br/>WIN.
        </h1>
        <p className="description">
          Draft with friends, build a winning squad, and prove who built the best team.
        </p>

        <div className="ctaGroup">
          <Button variant="primary" className="primaryCta">⚽ Play Now - Join Draft</Button>
          <Button variant="secondary" className="secondaryCta"><span className="dot"></span> JOIN A ROOM</Button>
        </div>
      </div>
    </section>
  );
};