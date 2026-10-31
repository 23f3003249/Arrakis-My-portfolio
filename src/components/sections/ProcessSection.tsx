'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PROFILE_DATA } from '@/src/data/profile';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

export default function ProcessSection() {
  return (
    <section
      id="process"
      data-world-scene="method"
      aria-label="06 — Method"
      className="relative z-10 min-h-screen w-full flex flex-col justify-center py-24 md:py-32 px-7 sm:px-12 lg:px-16 max-w-[1380px] mx-auto"
    >
      <div>
        {/* Opening */}
        <BoneyardSkeleton variant="editorial">
          <div data-gsap-parallax="14" className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6DFD5]/75">
              06 · METHOD
            </p>
            <h2
              data-gsap-masked-lines
              className="mt-3 font-display text-[clamp(2.35rem,4.5vw,4.1rem)] font-light leading-[1.04] tracking-[-0.044em] text-[#F2EFE9]"
            >
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  Great experiences
                </span>
              </span>
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  are built with intention.
                </span>
              </span>
            </h2>
            <p className="mt-4 max-w-[48ch] text-[15px] md:text-[16px] font-light leading-[1.6] text-[#F2EFE9]/75">
              Complex problems break down into four disciplined stages—from initial inquiry to polished implementation.
            </p>
          </div>
        </BoneyardSkeleton>

        {/* Four Sleek Top-Hairline Process Columns (No Bulky Black Cards) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {PROFILE_DATA.processStages.map((stage, index) => (
            <BoneyardSkeleton key={stage.number} variant="card">
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                className="relative h-full border-t border-[#F2EFE9]/20 pt-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                    <span className="text-[#C69A61] tabular-nums">
                      {stage.number}
                    </span>
                    <span className="text-[#F2EFE9]/55">
                      {stage.stage}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-light tracking-[-0.025em] text-[#F2EFE9]">
                    {stage.label.replace(/^\d+\s*\/\s*/, '')}
                  </h3>

                  <p className="mt-2.5 text-[14px] font-light leading-[1.6] text-[#F2EFE9]/75">
                    {stage.description}
                  </p>
                </div>

                <p className="mt-5 pt-3 border-t border-[#F2EFE9]/10 text-[11px] font-light text-[#F2EFE9]/55">
                  {stage.visualMetaphor}
                </p>
              </motion.article>
            </BoneyardSkeleton>
          ))}
        </div>

        {/* Minimal Editorial Technical Stack Strip */}
        <BoneyardSkeleton variant="editorial" className="mt-14">
          <div className="border-t border-[#F2EFE9]/20 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C69A61]">
                TECHNICAL STACK
              </h3>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#F2EFE9]/50">
                CORE TOOLS & LANGUAGES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PROFILE_DATA.techCapabilities.map((group) => (
                <div key={group.category} className="space-y-1.5">
                  <h4 className="text-[11px] uppercase tracking-[0.16em] text-[#C69A61]">
                    {group.category}
                  </h4>
                  <p className="text-[14px] font-light leading-[1.6] text-[#F2EFE9]/85">
                    {group.items.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </BoneyardSkeleton>
      </div>
    </section>
  );
}
