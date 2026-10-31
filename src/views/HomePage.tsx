'use client';

import React from 'react';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useScrollProgress } from '@/src/hooks/useScrollProgress';
import Navigation from '@/src/components/layout/Navigation';
import { ArchitecturalWindow } from '@/src/components/layout/ArchitecturalWindow';
import ChapterIndicator from '@/src/components/layout/ChapterIndicator';
import Footer from '@/src/components/layout/Footer';
import ArrakisVideoBackground from '@/src/components/arrakis/ArrakisVideoBackground';
import PointerSandParticles from '@/src/components/arrakis/PointerSandParticles';
import HeroSection from '@/src/components/sections/HeroSection';
import AboutSection from '@/src/components/sections/AboutSection';
import AwakeningSection from '@/src/components/sections/AwakeningSection';
import ArchitectureSection from '@/src/components/sections/ArchitectureSection';
import WorkSection from '@/src/components/sections/WorkSection';
import ProcessSection from '@/src/components/sections/ProcessSection';
import ContactSection from '@/src/components/sections/ContactSection';

export default function HomePage() {
  const reducedMotion = useReducedMotion();
  const {
    scrollProgress,
    activeChapter,
    activeNavId,
    isScrolled,
    scrollToSection,
  } = useScrollProgress(reducedMotion);

  return (
    <div
      className="relative min-h-screen bg-[#08090B] text-[#F2EFE9] selection:bg-[#E99A45] selection:text-[#08090B] overflow-x-hidden pb-12"
      data-active-chapter={activeChapter.id}
    >
      {/* Inset Rounded Rectangular Experience Window (VOS9X Inspiration) */}
      <ArchitecturalWindow
        activeChapterNumber={activeChapter.number}
        activeChapterLabel={activeChapter.label}
      />

      {/* Persistent Crossfading Dual-Video Background Clipped Inside Window */}
      <ArrakisVideoBackground />

      {/* Pointer-Only Three.js Golden Sand Particles Clipped Inside Window */}
      <PointerSandParticles />

      {/* Minimal Editorial Header Integrated Inside Window */}
      <Navigation
        activeNavId={activeNavId}
        isScrolled={isScrolled}
        onNavigate={scrollToSection}
      />

      {/* VOS9X Bottom Bar Chapter Indicator & Circular Scroll Progress Ring */}
      <ChapterIndicator
        activeChapter={activeChapter}
        onSelectChapter={scrollToSection}
        scrollProgress={scrollProgress}
      />

      {/* Seven Continuous Narrative Beats */}
      <main className="relative z-10">
        {/* 01 — ARRIVAL */}
        <HeroSection onNavigate={scrollToSection} />

        {/* 02 — THE DESERT */}
        <AboutSection />

        {/* 03 — THE AWAKENING */}
        <AwakeningSection />

        {/* 04 — THE ARCHITECTURE */}
        <ArchitectureSection />

        {/* 05 — THE ARTIFACTS */}
        <WorkSection />

        {/* 06 — THE METHOD */}
        <ProcessSection />

        {/* 07 — THE HORIZON */}
        <ContactSection />
      </main>

      {/* Minimal Editorial Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
