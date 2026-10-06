import React from 'react';


export const StrategySection = () => {
  return (
    <section className="section">
      <h2 className="heading">THE HIGHEST OVR DOESN'T ALWAYS WIN</h2>
      
      <div className="strategyList">
        <div className="strategyItem">
          <h3>Player Quality</h3>
          <p>How strong are your players?</p>
        </div>
        <div className="strategyItem">
          <h3>Position Fit</h3>
          <p>Are you using them in the right places?</p>
        </div>
        <div className="strategyItem">
          <h3>Synergy</h3>
          <p>Do the players work together?</p>
        </div>
        <div className="strategyItem">
          <h3>Tactical Fit</h3>
          <p>Does the squad suit the selected approach?</p>
        </div>
        <div className="strategyItem">
          <h3>Squad Balance</h3>
          <p>Does the XI work as a complete team?</p>
        </div>
      </div>
      <p className="footerMsg">Build smarter, not just stronger.</p>
    </section>
  );
};
