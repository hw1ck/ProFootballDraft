import React from 'react';
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
    <div className="relative min-h-screen bg-[#0B0E17] text-[#e5e7eb] antialiased selection:bg-[#00F0FF] selection:text-[#0B0E17] pb-16 overflow-x-hidden">
      {/* Ambient stadium cyber backdrops */}
      <div className="pointer-events-none fixed inset-0 -z-10 stadium-ambient"></div>
      <div className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#00F0FF]/10 via-[#8B5CF6]/10 to-transparent blur-3xl -z-10"></div>

      {/* TOP APP BAR */}
      <Header />

      {/* MAIN SECTIONS */}
      <main className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 space-y-14 sm:space-y-20 mt-4 sm:mt-6">
        <Hero />
        <DraftSection />
        <BuildSquadSection />
        <HowToPlaySection />
        <PlayTogetherSection />
        <FinalCTASection />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
