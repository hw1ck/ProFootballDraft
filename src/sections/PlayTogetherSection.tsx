import React from 'react';

import { Button } from '../components/common/Button';

export const PlayTogetherSection = () => {
  return (
    <section className="section">
      <h2 className="heading">PLAY TOGETHER</h2>
      <p className="copy">
        Create a room, invite friends with a code, and start a draft together.
      </p>
      
      <div className="lobbyCard">
        <div className="lobbyHeader">
          <span>ROOM LOBBY</span>
          <span className="joinedBadge">3 / 4 JOINED</span>
        </div>
        <div className="codeRow">
          <span className="hash">#</span>
          <span className="code">X7K29</span>
          <Button variant="secondary" className="copyBtn">COPY</Button>
        </div>
        <div className="playersRow">
          <div className="avatars">
            <div className="avatar">JD</div>
            <div className="avatar">MK</div>
            <div className="avatarHost">SL</div>
          </div>
          <span className="status">Host starts the draft.</span>
        </div>
      </div>
    </section>
  );
};