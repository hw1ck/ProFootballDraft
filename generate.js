const fs = require('fs');
const path = require('path');

const files = {
  "src/components/navigation/Header.tsx": `import React from 'react';
import { Button } from '../common/Button';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.icon}>⚽</span>
        ProFootballDraft<span className={styles.dot}>.</span>
      </div>
      <Button variant="secondary">Sign In</Button>
    </header>
  );
};`,
  "src/components/navigation/Header.module.css": `.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border);
  background: var(--background-primary);
}
.logo {
  font-family: var(--font-family-display);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.dot {
  color: var(--accent-primary);
}
.icon {
  font-size: 1.5rem;
}`,
  "src/sections/Hero.tsx": `import React from 'react';
import { Button } from '../components/common/Button';
import { PlayerCard } from '../components/player/PlayerCard';
import styles from './Hero.module.css';

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.liveDraft}>
          <span className={styles.dot}></span> LIVE DRAFT #409
          <div className={styles.timer}>⏱ 00:18s</div>
        </div>
        
        <div className={styles.mockCardWrapper}>
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
          <div className={styles.mockTurn}>
            <span className={styles.mockPick}>Pick 4 of 16 • Classic</span>
            <span className={styles.turnLabel}>TURN: YOUR PICK</span>
          </div>
        </div>

        <h1 className={styles.headline}>
          DRAFT.<br/>BUILD.<br/>WIN.
        </h1>
        <p className={styles.description}>
          Draft with friends, build a winning squad, and prove who built the best team.
        </p>

        <div className={styles.ctaGroup}>
          <Button variant="primary" className={styles.primaryCta}>⚽ Play Now - Join Draft</Button>
          <Button variant="tertiary" className={styles.secondaryCta}>• JOIN A ROOM</Button>
        </div>
      </div>
    </section>
  );
};`,
  "src/sections/Hero.module.css": `.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-12) var(--space-4);
  text-align: center;
}
.heroContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  gap: var(--space-8);
}
.liveDraft {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  background: var(--surface);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
  font-family: var(--font-family-display);
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.timer {
  background: var(--surface-elevated);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-pill);
}
.dot {
  width: 8px;
  height: 8px;
  background: var(--accent-primary);
  border-radius: 50%;
}
.mockCardWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
}
.mockTurn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-family: var(--font-family-display);
  font-size: 0.7rem;
  color: var(--text-secondary);
}
.headline {
  font-size: 3rem;
  line-height: 1.2;
  letter-spacing: 0.05em;
  margin: var(--space-4) 0;
  color: var(--text-primary);
}
.description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 400px;
}
.ctaGroup {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 400px;
}
.primaryCta {
  width: 100%;
}`,
  "src/sections/DraftSection.tsx": `import React from 'react';
import styles from './DraftSection.module.css';
import { PlayerCard } from '../components/player/PlayerCard';

export const DraftSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>DRAFT WITH FRIENDS</h2>
      <p className={styles.copy}>
        Five cards. One choice. Draft 16 players in Classic Draft. Every pick shapes your squad.
      </p>
      
      <div className={styles.draftDemo}>
        <div className={styles.draftHeader}>
          <span>PICK YOUR CARD</span>
          <span>ROUND 3 / 16</span>
        </div>
        <div className={styles.cardsRow}>
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
};`,
  "src/sections/DraftSection.module.css": `.section {
  padding: var(--space-12) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  background: var(--background-secondary);
  border-radius: var(--radius-xl);
  margin: var(--space-4);
}
.heading {
  font-size: 1.8rem;
}
.copy {
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 500px;
}
.draftDemo {
  background: var(--background-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--border);
}
.draftHeader {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-family-display);
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}
.cardsRow {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-4);
}`,
  "src/sections/BuildSquadSection.tsx": `import React from 'react';
import styles from './BuildSquadSection.module.css';

export const BuildSquadSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>BUILD YOUR SQUAD</h2>
      <p className={styles.copy}>
        Big names aren't enough. Find the right positions, discover synergies, and turn your drafted talent into a winning XI.
      </p>
      <div className={styles.pitchDemo}>
        <div className={styles.pitch}>
          <div className={styles.row}>
            <div className={styles.node}>LW</div>
            <div className={styles.node}>ST</div>
            <div className={styles.node}>RW</div>
          </div>
          <div className={styles.row}>
            <div className={styles.node}>CM</div>
            <div className={styles.node}>CDM</div>
            <div className={styles.node}>CM</div>
          </div>
          <div className={styles.row}>
            <div className={styles.node}>LB</div>
            <div className={styles.node}>CB</div>
            <div className={styles.node}>CB</div>
            <div className={styles.node}>RB</div>
          </div>
        </div>
        <div className={styles.pitchFooter}>
          <div className={styles.formation}>FORMATION: 4-3-3<br/>ATTACKING</div>
          <div className={styles.synergy}>ROLE<br/>SYNERGY</div>
        </div>
      </div>
    </section>
  );
};`,
  "src/sections/BuildSquadSection.module.css": `.section {
  padding: var(--space-12) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.heading {
  font-size: 1.8rem;
}
.copy {
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 500px;
}
.pitchDemo {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
.pitch {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  align-items: center;
}
.row {
  display: flex;
  gap: var(--space-10);
}
.node {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-display);
  font-size: 0.8rem;
  border: 2px solid var(--border);
}
.pitchFooter {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-family-display);
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--surface-elevated);
  padding: var(--space-4);
  border-radius: var(--radius-pill);
}`,
  "src/sections/HowToPlaySection.tsx": `import React from 'react';
import styles from './HowToPlaySection.module.css';

export const HowToPlaySection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>HOW TO PLAY</h2>
      <p className={styles.copy}>Three simple steps: draft, build, and rank.</p>
      
      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNum}>01</div>
          <div className={styles.stepContent}>
            <h3>Pick a Draft</h3>
            <p>Classic Draft, Merge Draft, and more.</p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNum}>02</div>
          <div className={styles.stepContent}>
            <h3>Draft with Friends</h3>
            <p>Draft 16 players, then build your XI in the Locker Room.</p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNum}>03</div>
          <div className={styles.stepContent}>
            <h3>Rank Your Squad</h3>
            <p>Lock your team. Once everyone locks, the final rankings settle the rivalry.</p>
          </div>
        </div>
      </div>
    </section>
  );
};`,
  "src/sections/HowToPlaySection.module.css": `.section {
  padding: var(--space-12) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  background: var(--background-secondary);
  border-radius: var(--radius-xl);
  margin: var(--space-4);
}
.heading {
  font-size: 1.8rem;
}
.copy {
  color: var(--text-secondary);
  line-height: 1.5;
}
.steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.step {
  display: flex;
  gap: var(--space-4);
  background: var(--surface);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  align-items: center;
}
.stepNum {
  background: var(--surface-elevated);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-display);
  font-size: 1.2rem;
  flex-shrink: 0;
}
.stepContent h3 {
  font-family: var(--font-family-body);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: var(--space-1);
}
.stepContent p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}`,
  "src/sections/PlayTogetherSection.tsx": `import React from 'react';
import styles from './PlayTogetherSection.module.css';
import { Button } from '../components/common/Button';

export const PlayTogetherSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>PLAY TOGETHER</h2>
      <p className={styles.copy}>
        Create a room, invite friends with a code, and start a draft together.
      </p>
      
      <div className={styles.lobbyCard}>
        <div className={styles.lobbyHeader}>
          <span>ROOM LOBBY</span>
          <span className={styles.joinedBadge}>3 / 4 JOINED</span>
        </div>
        <div className={styles.codeRow}>
          <span className={styles.hash}>#</span>
          <span className={styles.code}>X7K29</span>
          <Button variant="secondary" className={styles.copyBtn}>COPY</Button>
        </div>
        <div className={styles.playersRow}>
          <div className={styles.avatars}>
            <div className={styles.avatar}>JD</div>
            <div className={styles.avatar}>MK</div>
            <div className={styles.avatarHost}>SL</div>
          </div>
          <span className={styles.status}>Host starts the draft.</span>
        </div>
      </div>
    </section>
  );
};`,
  "src/sections/PlayTogetherSection.module.css": `.section {
  padding: var(--space-12) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.heading {
  font-size: 1.8rem;
}
.copy {
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 400px;
}
.lobbyCard {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.lobbyHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-family-display);
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.joinedBadge {
  background: var(--surface-elevated);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
}
.codeRow {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--background-primary);
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
}
.hash {
  color: var(--text-secondary);
  font-family: var(--font-family-display);
  font-size: 1.2rem;
}
.code {
  font-family: var(--font-family-display);
  font-size: 1.2rem;
  flex-grow: 1;
}
.copyBtn {
  font-size: 0.8rem;
  padding: var(--space-2) var(--space-6);
}
.playersRow {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.avatars {
  display: flex;
  gap: var(--space-2);
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-display);
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.avatarHost {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--warning);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-display);
  font-size: 0.8rem;
}
.status {
  color: var(--text-secondary);
  font-size: 0.9rem;
}`,
  "src/sections/FinalCTASection.tsx": `import React from 'react';
import styles from './FinalCTASection.module.css';
import { Button } from '../components/common/Button';

export const FinalCTASection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.iconBox}>🏆</div>
      <h2 className={styles.heading}>READY TO BUILD YOUR WINNING SQUAD?</h2>
      <p className={styles.copy}>
        Join a room, draft 16 players, and see how your squad ranks.
      </p>
      <Button variant="primary" className={styles.cta}>🚀 Join Draft</Button>
    </section>
  );
};`,
  "src/sections/FinalCTASection.module.css": `.section {
  padding: var(--space-16) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-6);
  background: var(--background-secondary);
  border-radius: var(--radius-xl);
  margin: var(--space-4);
}
.iconBox {
  width: 64px;
  height: 64px;
  background: var(--surface-elevated);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.heading {
  font-size: 2rem;
  max-width: 500px;
  line-height: 1.2;
}
.copy {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 400px;
  line-height: 1.5;
}
.cta {
  margin-top: var(--space-4);
  width: 100%;
  max-width: 300px;
}`,
  "src/components/footer/Footer.tsx": `import React from 'react';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>ProFootballDraft</div>
      <div className={styles.links}>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Support</a>
        <a href="#">Discord Community</a>
      </div>
      <div className={styles.copyright}>
        © 2025 ProFootballDraft. All rights reserved.
      </div>
    </footer>
  );
};`,
  "src/components/footer/Footer.module.css": `.footer {
  padding: var(--space-12) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  border-top: 1px solid var(--border);
  margin-top: var(--space-8);
}
.logo {
  font-family: var(--font-family-display);
  font-size: 1.2rem;
}
.links {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
  justify-content: center;
}
.links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color 0.2s ease;
}
.links a:hover {
  color: var(--text-primary);
}
.copyright {
  color: var(--text-muted);
  font-size: 0.8rem;
}`,
  "src/app/page.tsx": `import React from 'react';
import { Header } from '../components/navigation/Header';
import { Hero } from '../sections/Hero';
import { DraftSection } from '../sections/DraftSection';
import { BuildSquadSection } from '../sections/BuildSquadSection';
import { HowToPlaySection } from '../sections/HowToPlaySection';
import { PlayTogetherSection } from '../sections/PlayTogetherSection';
import { FinalCTASection } from '../sections/FinalCTASection';
import { Footer } from '../components/footer/Footer';

export default function LandingPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Header />
      <main>
        <Hero />
        <DraftSection />
        <BuildSquadSection />
        <HowToPlaySection />
        <PlayTogetherSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}
console.log('Files generated successfully.');
