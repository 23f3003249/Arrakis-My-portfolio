'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PROFILE_DATA } from '@/src/data/profile';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

export default function ArchitectureSection() {
  return (
    <section
      id="capabilities"
      data-world-scene="architecture"
      aria-label="04 — Architecture"
      className="relative z-10 min-h-screen w-full flex flex-col justify-center py-24 md:py-32 px-7 sm:px-12 lg:px-16 max-w-[1380px] mx-auto"
    >
      <div>
        <BoneyardSkeleton variant="editorial">
          <div data-gsap-parallax="14" className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6DFD5]/75">
              04 · ARCHITECTURE
            </p>
            <h2
              data-gsap-masked-lines
              className="mt-3 font-display text-[clamp(2.35rem,4.5vw,4.1rem)] font-light leading-[1.04] tracking-[-0.044em] text-[#F2EFE9]"
            >
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  From chaos
                </span>
              </span>
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  to structure.
                </span>
              </span>
            </h2>
            <p className="mt-4 max-w-[48ch] text-[15px] md:text-[16px] font-light leading-[1.6] text-[#F2EFE9]/75">
              Four engineering disciplines that turn abstract concepts into durable software systems.
            </p>
          </div>
        </BoneyardSkeleton>

        {/* Four Compact Editorial Columns with Top Hairline Rules (No Bulky Black Cards) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROFILE_DATA.capabilities.map((cap, idx) => (
            <BoneyardSkeleton key={cap.id} variant="card">
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
                className="group h-full border-t border-[#F2EFE9]/20 hover:border-[#E99A45]/70 pt-5 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#C69A61]">
                    <span className="tabular-nums">{cap.index}</span>
                    <span className="text-[#F2EFE9]/55">{cap.subtitle}</span>
                  </div>

                  <h3 className="mt-4 font-display text-xl md:text-[22px] font-light tracking-[-0.025em] text-[#F2EFE9] group-hover:text-[#E99A45] transition-colors">
                    {cap.title}
                  </h3>

                  <p className="mt-2.5 text-[14px] font-light leading-[1.6] text-[#F2EFE9]/75">
                    {cap.description}
                  </p>
                </div>

                {/* Unboxed Text Annotations */}
                <div className="mt-6 pt-3 border-t border-[#F2EFE9]/10 flex flex-wrap items-center gap-1.5 text-[11px] font-light text-[#F2EFE9]/60">
                  {cap.annotations.map((ann, i) => (
                    <React.Fragment key={ann}>
                      <span>{ann}</span>
                      {i < cap.annotations.length - 1 && (
                        <span aria-hidden="true" className="text-[#F2EFE9]/25">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.article>
            </BoneyardSkeleton>
          ))}
        </div>
      </div>
    </section>
  );
}
