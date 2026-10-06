import React from 'react';
import { Button } from '../common/Button';


export const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span className="icon">⚽</span>
        ProFootballDraft<span className="dot">.</span>
      </div>
      <Button variant="secondary">Sign In</Button>
    </header>
  );
};