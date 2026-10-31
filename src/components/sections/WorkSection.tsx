'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PROJECTS_DATA } from '@/src/data/projects';
import ProjectCard from '@/src/components/projects/ProjectCard';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

export default function WorkSection() {
  return (
    <section
      id="work"
      data-world-scene="artifacts"
      aria-label="05 — Artifacts"
      className="relative z-10 min-h-screen w-full flex flex-col justify-center py-24 md:py-32 px-7 sm:px-12 lg:px-16 max-w-[1380px] mx-auto"
    >
      <div>
        {/* Chapter Opening */}
        <BoneyardSkeleton variant="editorial">
          <div data-gsap-parallax="14" className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6DFD5]/75">
              05 · ARTIFACTS
            </p>
            <h2
              data-gsap-masked-lines
              className="mt-3 font-display text-[clamp(2.35rem,4.5vw,4.1rem)] font-light leading-[1.04] tracking-[-0.044em] text-[#F2EFE9]"
            >
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  Ideas
                </span>
              </span>
              <span className="block overflow-hidden pb-2.5 -mb-1.5">
                <span data-gsap-line className="block will-change-transform">
                  made real.
                </span>
              </span>
            </h2>
            <p className="mt-4 max-w-[48ch] text-[15px] md:text-[16px] font-light leading-[1.6] text-[#F2EFE9]/75">
              Selected digital products, systems, and interfaces built with curiosity and engineering.
            </p>
          </div>
        </BoneyardSkeleton>

        {/* Sleek Editorial Project Index */}
        <div className="mt-14 divide-y divide-[#F2EFE9]/15 border-t border-b border-[#F2EFE9]/15">
          {PROJECTS_DATA.map((project, idx) => (
            <ProjectCard key={project.slug} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
