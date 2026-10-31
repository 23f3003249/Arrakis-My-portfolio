'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useMagneticHover } from '@/src/hooks/useScrollProgress';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

const HERO_LINES = [
  ['I', 'build', 'worlds'],
  ['through', 'code.'],
] as const;

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const reducedMotion = useReducedMotion();
  const magneticCta = useMagneticHover(reducedMotion, 6);

  return (
    <section
      id="home"
      data-world-scene="arrival"
      aria-label="01 — Arrival"
      className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center py-24 px-7 sm:px-12 lg:px-16 max-w-[1600px] mx-auto text-center"
    >
      {/* Centered Hero Composition Inspired by VOS9X */}
      <div
        data-gsap-parallax="14"
        className="my-auto w-full max-w-4xl mx-auto flex flex-col items-center text-center"
      >
        <BoneyardSkeleton variant="hero">
          {/* Small Centered Eyebrow */}
          <div className="mb-5 flex flex-col items-center">
            <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#E6DFD5]/80">
              CREATIVE DEVELOPER · SOUVIK GHOSH
            </p>
          </div>

          {/* Centered Two-Line Sentence-Case Display Headline with Rock-Solid Word-by-Word Reveal */}
          <h1
            data-gsap-words
            className="font-display text-[clamp(2.9rem,6.5vw,5.85rem)] font-light leading-[1.03] tracking-[-0.048em] text-[#F2EFE9] mx-auto"
          >
            {HERO_LINES.map((lineWords, lineIdx) => (
              <span key={lineIdx} className="block overflow-hidden pb-3 -mb-2">
                {lineWords.map((word, wordIdx) => (
                  <span
                    key={`${lineIdx}-${wordIdx}`}
                    className="inline-block overflow-hidden align-bottom pb-2 -mb-2 mr-[0.26em] last:mr-0"
                  >
                    <span data-gsap-word className="inline-block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Centered Editorial Subtitle & Primary Action (No "Get in touch" in Hero) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[46ch] mx-auto text-[15px] md:text-[17px] font-light leading-[1.6] text-[#F2EFE9]/75"
          >
            Exploring the intersection of creativity, technology, and engineering to craft thoughtful digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => onNavigate('work')}
              onPointerMove={magneticCta.onPointerMove}
              onPointerLeave={magneticCta.onPointerLeave}
              data-testid="hero-magnetic-cta"
              className="group inline-flex items-center gap-2 py-2 px-3 -mx-3 text-[15px] md:text-[17px] font-light text-[#F2EFE9]/85 hover:text-[#F2EFE9] transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45] will-change-transform"
            >
              <span className="text-[#F2EFE9]/70">Discover</span>
              <span className="underline underline-offset-[6px] decoration-[#F2EFE9]/60 group-hover:decoration-[#E99A45] text-[#F2EFE9]">
                selected artifacts
              </span>
              <span className="text-[#F2EFE9]/70">in motion</span>
            </button>
          </motion.div>
        </BoneyardSkeleton>
      </div>
    </section>
  );
}

