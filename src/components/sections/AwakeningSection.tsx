'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PROFILE_DATA } from '@/src/data/profile';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

export default function AwakeningSection() {
  return (
    <section
      id="awakening"
      data-world-scene="awakening"
      aria-label="03 — Awakening"
      className="relative z-10 min-h-[85vh] w-full flex items-center py-24 px-7 sm:px-12 lg:px-16 max-w-[1380px] mx-auto"
    >
      <div className="w-full flex justify-start lg:justify-end">
        <BoneyardSkeleton variant="editorial">
          <div data-gsap-parallax="16" className="max-w-xl space-y-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6DFD5]/75">
              03 · AWAKENING
            </p>

            <h2
              data-gsap-masked-lines
              className="font-display text-[clamp(2.35rem,4.6vw,4.25rem)] font-light leading-[1.04] tracking-[-0.044em] text-[#F2EFE9]"
            >
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  Some ideas change
                </span>
              </span>
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  how we see the world.
                </span>
              </span>
            </h2>

            <p className="text-[15px] md:text-[17px] font-light leading-[1.6] text-[#F2EFE9]/85 max-w-[46ch]">
              “{PROFILE_DATA.awakeningQuote}”
            </p>

            <p className="text-[14px] md:text-[15px] font-light leading-[1.65] text-[#F2EFE9]/70 max-w-[48ch]">
              Every meaningful system begins as scattered observations in unfamiliar terrain—curiosity about how data flows, how people collaborate, and how interfaces shape understanding.
            </p>

            <div className="pt-4 border-t border-[#F2EFE9]/15 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#C69A61]">
              <span>Curiosity</span>
              <span aria-hidden="true" className="text-[#F2EFE9]/25">·</span>
              <span>Learning</span>
              <span aria-hidden="true" className="text-[#F2EFE9]/25">·</span>
              <span>Exploration</span>
              <span aria-hidden="true" className="text-[#F2EFE9]/25">·</span>
              <span>Experimentation</span>
            </div>
          </div>
        </BoneyardSkeleton>
      </div>
    </section>
  );
}
