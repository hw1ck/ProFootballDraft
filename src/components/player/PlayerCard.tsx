import React from 'react';


interface PlayerCardProps {
  ovr: number;
  position: string;
  name: string;
  club?: string;
  nation?: string;
  role: string;
  pac?: number;
  sho?: number;
  phy?: number;
  isTopPick?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  ovr,
  position,
  name,
  club,
  nation,
  role,
  pac,
  sho,
  phy,
  isTopPick,
}) => {
  return (
    <div className="card">
      {isTopPick && <div className="topPickLabel">TOP PICK</div>}
      <div className="cardInner">
        <div className="header">
          <div className="ratingBox">
            <span className="ovr">{ovr}</span>
            <span className="position">{position}</span>
          </div>
          <div className="infoBox">
            <h3 className="name">{name}</h3>
            {(club || nation) && (
              <p className="clubNation">
                {club} {club && nation ? '•' : ''} {nation}
              </p>
            )}
            <span className="role">{role}</span>
          </div>
        </div>
        {(pac || sho || phy) && (
          <div className="statsRow">
            {pac && <div className="stat"><span className="statLabel">PAC</span><span className="statValue">{pac}</span></div>}
            {sho && <div className="stat"><span className="statLabel">SHO</span><span className="statValue">{sho}</span></div>}
            {phy && <div className="stat"><span className="statLabel">PHY</span><span className="statValue">{phy}</span></div>}
          </div>
        )}
      </div>
    </div>
  );
};
