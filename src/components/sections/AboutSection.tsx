'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PROFILE_DATA } from '@/src/data/profile';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

export default function AboutSection() {
  return (
    <section
      id="about"
      data-world-scene="desert"
      aria-label="02 — Desert"
      className="relative z-10 min-h-screen w-full flex flex-col justify-center py-24 md:py-32 px-7 sm:px-12 lg:px-16 max-w-[1380px] mx-auto"
    >
      <div>
        {/* Section Opening */}
        <BoneyardSkeleton variant="editorial">
          <div data-gsap-parallax="14" className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6DFD5]/75">
              02 · DESERT
            </p>
            <h2
              data-gsap-masked-lines
              className="mt-3 font-display text-[clamp(2.35rem,4.5vw,4.1rem)] font-light leading-[1.04] tracking-[-0.044em] text-[#F2EFE9]"
            >
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  Everything begins
                </span>
              </span>
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  with curiosity.
                </span>
              </span>
            </h2>
            <p className="mt-5 max-w-[48ch] text-[15px] md:text-[17px] font-light leading-[1.6] text-[#F2EFE9]/80">
              “{PROFILE_DATA.aboutQuote}”
            </p>
          </div>
        </BoneyardSkeleton>

        {/* Sleek Open Editorial Two-Column Composition (No Big Black Cards) */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Compact Editorial Bio & Highlights */}
          <div className="lg:col-span-5">
            <BoneyardSkeleton variant="card">
              <div className="border-t border-[#F2EFE9]/20 pt-6 space-y-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl md:text-2xl font-light tracking-[-0.03em] text-[#F2EFE9]">
                    {PROFILE_DATA.name}
                  </h3>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#C69A61]">
                    {PROFILE_DATA.education}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {PROFILE_DATA.bioParagraphs.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-[14px] md:text-[15px] font-light leading-[1.65] text-[#F2EFE9]/78"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Unboxed Compact Focus List */}
                <div className="pt-4 border-t border-[#F2EFE9]/12">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C69A61] mb-2.5">
                    CORE FOCUS
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] font-light text-[#F2EFE9]/85">
                    {PROFILE_DATA.profileHighlights.map((item, idx) => (
                      <React.Fragment key={item}>
                        <span>{item}</span>
                        {idx < PROFILE_DATA.profileHighlights.length - 1 && (
                          <span aria-hidden="true" className="text-[#F2EFE9]/25">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </BoneyardSkeleton>
          </div>

          {/* Right Column: Lightweight Hairline Experience Index */}
          <div className="lg:col-span-7">
            <BoneyardSkeleton variant="timeline">
              <div className="border-t border-[#F2EFE9]/20 pt-6">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C69A61]">
                    EXPERIENCE & COMMUNITY
                  </h3>
                  <span className="text-[11px] font-mono text-[#F2EFE9]/55 tabular-nums">
                    01 — 04
                  </span>
                </div>

                <div className="divide-y divide-[#F2EFE9]/12">
                  {PROFILE_DATA.timeline.map((exp, index) => (
                    <motion.article
                      key={exp.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.55, delay: index * 0.05 }}
                      className="py-4 first:pt-3 last:pb-1 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h4 className="font-display text-base md:text-lg font-light tracking-[-0.02em] text-[#F2EFE9] group-hover:text-[#E99A45] transition-colors">
                          {exp.role}{' '}
                          <span className="text-[#F2EFE9]/60 font-light">
                            · {exp.organization}
                          </span>
                        </h4>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-[#F2EFE9]/55 shrink-0">
                          {exp.period}
                        </span>
                      </div>

                      <p className="mt-1.5 max-w-[58ch] text-[14px] font-light leading-[1.55] text-[#F2EFE9]/72">
                        {exp.summary}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-light text-[#C69A61]">
                        {exp.highlights.map((hl, idx) => (
                          <React.Fragment key={hl}>
                            <span>{hl}</span>
                            {idx < exp.highlights.length - 1 && (
                              <span aria-hidden="true" className="text-[#F2EFE9]/25">
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </BoneyardSkeleton>
          </div>
        </div>
      </div>
    </section>
  );
}
