import React from 'react';
import { Header } from '../components/navigation/Header';
import { Hero } from '../sections/Hero';
import { DraftSection } from '../sections/DraftSection';
import { BuildSquadSection } from '../sections/BuildSquadSection';
import { StrategySection } from '../sections/StrategySection';
import { GameModesSection } from '../sections/GameModesSection';
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
        <StrategySection />
        <GameModesSection />
        <HowToPlaySection />
        <PlayTogetherSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}