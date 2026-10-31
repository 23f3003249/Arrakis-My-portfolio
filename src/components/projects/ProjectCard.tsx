'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ProjectRecord } from '@/src/data/projects';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useMagneticHover } from '@/src/hooks/useScrollProgress';

interface ProjectCardProps {
  project: ProjectRecord;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const magneticCaseStudy = useMagneticHover(reducedMotion, 5);

  return (
    <BoneyardSkeleton variant="card">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsHovered(true)}
        onBlurCapture={() => setIsHovered(false)}
        data-testid={`project-row-${project.slug}`}
        className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center py-9 md:py-11 transition-colors"
      >
        {/* Subtle Restrained Ambient Amber Row Highlight on Hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 inset-y-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(520px circle at 75% 50%, rgba(233, 154, 69, 0.07) 0%, transparent 75%)',
          }}
        />

        {/* Left: Compact Editorial Project Details */}
        <div className="relative z-10 lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#C69A61] tabular-nums">
            <span>{project.number}</span>
            <span aria-hidden="true" className="text-[#F2EFE9]/25">
              ·
            </span>
            <span className="text-[#F2EFE9]/70">{project.category}</span>
            <span aria-hidden="true" className="text-[#F2EFE9]/25">
              ·
            </span>
            <span className="text-[#F2EFE9]/55">{project.role}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl md:text-[34px] font-light tracking-[-0.035em] leading-[1.06] text-[#F2EFE9] group-hover:text-[#E99A45] transition-colors">
            <Link href={project.caseStudyRoute}>{project.title}</Link>
          </h3>

          <p className="max-w-[54ch] text-[14px] md:text-[15px] font-light leading-[1.65] text-[#F2EFE9]/80">
            {project.shortDescription}
          </p>

          {/* Unboxed Technology Labels */}
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-light text-[#C69A61]">
            {project.technologies.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span>{tech}</span>
                {idx < project.technologies.length - 1 && (
                  <span aria-hidden="true" className="text-[#F2EFE9]/25">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: Three Editorial Action Links Placed One After Another */}
        <div className="relative z-10 lg:col-span-5 flex flex-col lg:items-end justify-center gap-3 pt-2 lg:pt-0">
          <div className="flex flex-wrap items-center lg:justify-end gap-6 sm:gap-8">
            <Link
              href={project.caseStudyRoute}
              onPointerMove={magneticCaseStudy.onPointerMove}
              onPointerLeave={magneticCaseStudy.onPointerLeave}
              className="inline-flex items-center gap-1.5 py-1 text-[13px] md:text-[14px] font-normal text-[#F2EFE9] underline underline-offset-4 decoration-[#F2EFE9]/40 hover:decoration-[#E99A45] hover:text-[#E99A45] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2EFE9] will-change-transform"
            >
              <span>View case study</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1 text-[13px] md:text-[14px] font-light text-[#F2EFE9]/80 hover:text-[#E99A45] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Live project</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1 text-[13px] md:text-[14px] font-light text-[#F2EFE9]/65 hover:text-[#F2EFE9] transition-colors whitespace-nowrap shrink-0"
            >
              <span>GitHub</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </motion.article>
    </BoneyardSkeleton>
  );
}

