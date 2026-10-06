import React from 'react';


export const BuildSquadSection = () => {
  return (
    <section className="section">
      <h2 className="heading">BUILD YOUR SQUAD</h2>
      <p className="copy">
        Big names aren't enough. Find the right positions, discover synergies, and turn your drafted talent into a winning XI.
      </p>
      <div className="pitchDemo">
        <div className="pitch">
          <div className="row">
            <div className="node">LW</div>
            <div className="node">ST</div>
            <div className="node">RW</div>
          </div>
          <div className="row">
            <div className="node">CM</div>
            <div className="node">CDM</div>
            <div className="node">CM</div>
          </div>
          <div className="row">
            <div className="node">LB</div>
            <div className="node">CB</div>
            <div className="node">CB</div>
            <div className="node">RB</div>
          </div>
        </div>
        <div className="pitchFooter">
          <div className="formation">FORMATION: 4-3-3<br/>ATTACKING</div>
          <div className="synergy">ROLE<br/>SYNERGY</div>
        </div>
      </div>
    </section>
  );
};