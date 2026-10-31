'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ProjectRecord, getAdjacentProjects, ProjectFeature } from '@/src/data/projects';
import {
  CASE_STUDY_CHAPTER_RANGES,
  SANDMOVING_SCENE_ID,
} from '@/src/lib/arrakis-logic';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useScrollProgress, useMagneticHover } from '@/src/hooks/useScrollProgress';
import { ArchitecturalWindow } from '@/src/components/layout/ArchitecturalWindow';
import ArrakisVideoBackground from '@/src/components/arrakis/ArrakisVideoBackground';
import PointerSandParticles from '@/src/components/arrakis/PointerSandParticles';
import Navigation from '@/src/components/layout/Navigation';
import ChapterIndicator from '@/src/components/layout/ChapterIndicator';
import Footer from '@/src/components/layout/Footer';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

interface CaseStudyLayoutProps {
  project: ProjectRecord;
}

function FeatureDiagramSurface({
  type,
  title,
  annotation,
}: {
  type: ProjectFeature['diagramType'];
  title: string;
  annotation: string;
}) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(16% 16% 16% 16%)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-xl border border-[#F2EFE9]/15 bg-[#08090B]/24 backdrop-blur-md p-5 md:p-7 flex flex-col justify-between gap-6 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(198,154,97,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(198,154,97,0.16) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] text-[#C69A61]">
        <span>{annotation}</span>
        <span>EDITABLE SCREENSHOT</span>
      </div>

      <div className="relative z-10 py-2">
        {(type === 'event-feed' || type === 'community-graph') && (
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3 font-mono text-[10px]">
            <div className="rounded-lg border border-[#C69A61]/35 bg-[#08090B]/35 backdrop-blur-sm p-3.5 space-y-2">
              <div className="text-[#E99A45]">COMMUNITY HUB</div>
              <div className="h-2 w-4/5 bg-[#F2EFE9]/70" />
              <div className="h-1.5 w-3/5 bg-[#F2EFE9]/45" />
            </div>
            <div className="rounded-lg border border-[#F2EFE9]/15 bg-[#08090B]/35 backdrop-blur-sm p-3.5 space-y-2">
              <div className="text-[#C69A61]">RSVP PIPELINE</div>
              <div className="h-2 w-3/4 bg-[#E99A45]/70" />
              <div className="h-1.5 w-1/2 bg-[#F2EFE9]/45" />
            </div>
          </div>
        )}

        {(type === 'admin-matrix' || type === 'drive-workflow') && (
          <div className="max-w-md mx-auto rounded-lg border border-[#C69A61]/35 bg-[#08090B]/35 backdrop-blur-sm p-4 space-y-3 font-mono text-[10px]">
            <div className="flex justify-between text-[#E99A45] border-b border-[#F2EFE9]/12 pb-2">
              <span>ELIGIBILITY & DRIVE MATRIX</span>
              <span>SQL VERIFIED</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded border border-[#F2EFE9]/15 text-[#F2EFE9]">ADMIN</div>
              <div className="p-2 rounded border border-[#F2EFE9]/15 text-[#C69A61]">COMPANY</div>
              <div className="p-2 rounded border border-[#F2EFE9]/15 text-[#E99A45]">STUDENT</div>
            </div>
          </div>
        )}

        {(type === 'telemetry-wave' || type === 'sensor-topology') && (
          <div className="max-w-md mx-auto rounded-lg border border-[#C69A61]/35 bg-[#08090B]/35 backdrop-blur-sm p-4 space-y-3 font-mono text-[10px]">
            <div className="flex justify-between text-[#E99A45]">
              <span>LIVE TELEMETRY STREAM</span>
              <span className="tabular-nums">MQTT · REST</span>
            </div>
            <svg viewBox="0 0 240 44" className="w-full h-11 stroke-[#E99A45] fill-none" strokeWidth="1.5">
              <path d="M 0 28 Q 30 8, 60 24 T 120 18 T 180 28 T 240 12" />
            </svg>
          </div>
        )}
      </div>

      <div className="relative z-10 border-t border-[#F2EFE9]/12 pt-3 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-[#F2EFE9]/65">
        <span>{title.toUpperCase()}</span>
        <span className="text-[#C69A61]">INTERFACE VIEW</span>
      </div>
    </motion.div>
  );
}

export default function CaseStudyLayout({ project }: CaseStudyLayoutProps) {
  const { prev, next } = getAdjacentProjects(project.slug);
  const reducedMotion = useReducedMotion();
  const {
    scrollProgress,
    activeChapter,
    isScrolled,
    scrollToSection,
  } = useScrollProgress(reducedMotion, CASE_STUDY_CHAPTER_RANGES);

  const magneticLiveBtn = useMagneticHover(reducedMotion, 6);
  const magneticGithubBtn = useMagneticHover(reducedMotion, 5);
  const magneticPrevBtn = useMagneticHover(reducedMotion, 5);
  const magneticNextBtn = useMagneticHover(reducedMotion, 5);

  const titleWords = project.title.split(' ');

  return (
    <div
      className="relative min-h-screen bg-[#08090B] text-[#F2EFE9] selection:bg-[#E99A45] selection:text-[#08090B] overflow-x-hidden pb-12"
      data-active-chapter={activeChapter.id}
    >
      {/* Inset Rounded Rectangular Experience Window (VOS9X Consistent Frame) */}
      <ArchitecturalWindow
        activeChapterNumber={activeChapter.number}
        activeChapterLabel={activeChapter.label}
      />

      {/* Persistent Sandmoving Video Background Clipped Inside Rectangular Window */}
      <ArrakisVideoBackground fixedScene={SANDMOVING_SCENE_ID} />

      {/* Pointer-Only Three.js Golden Sand Particles Clipped Inside Rectangular Window */}
      <PointerSandParticles />

      {/* Minimal Editorial Header Integrated Inside Window */}
      <Navigation
        isScrolled={isScrolled}
        isCaseStudyPage={true}
      />

      {/* VOS9X Bottom Bar Chapter Indicator & Circular Scroll Progress Ring */}
      <ChapterIndicator
        activeChapter={activeChapter}
        onSelectChapter={scrollToSection}
        scrollProgress={scrollProgress}
        chapters={CASE_STUDY_CHAPTER_RANGES}
      />

      <main className="relative z-10 mx-auto max-w-[1380px] pt-28 pb-24 px-7 sm:px-12 lg:px-16 space-y-28">
        {/* SECTION 01 — PROJECT INTRODUCTION */}
        <section
          id="cs-intro"
          data-world-scene="desert"
          aria-label="Project Introduction"
          className="space-y-10"
        >
          <BoneyardSkeleton variant="hero">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2EFE9]/15 pb-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#C69A61] tabular-nums">
                01 · ARTIFACT {project.number} / CASE STUDY
              </p>
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 text-xs font-light tracking-[0.12em] text-[#F2EFE9]/75 hover:text-[#E99A45] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to selected work</span>
              </Link>
            </div>

            <div data-gsap-parallax="14" className="mt-8 max-w-4xl space-y-6">
              <h1
                data-gsap-words
                className="font-display text-[clamp(2.5rem,5.2vw,4.6rem)] font-light leading-[1.03] tracking-[-0.044em] text-[#F2EFE9]"
              >
                <span className="block overflow-hidden pb-2.5 -mb-1.5">
                  {titleWords.map((word, idx) => (
                    <span
                      key={`${word}-${idx}`}
                      className="inline-block overflow-hidden align-bottom pb-2 -mb-2 mr-[0.26em] last:mr-0"
                    >
                      <span data-gsap-word className="inline-block will-change-transform">
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-[16px] md:text-[18px] font-light leading-[1.6] text-[#F2EFE9]/82"
              >
                {project.summary}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-6 pt-2"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerMove={magneticLiveBtn.onPointerMove}
                  onPointerLeave={magneticLiveBtn.onPointerLeave}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F2EFE9] hover:bg-[#E99A45] px-6 py-2.5 text-[#08090B] font-medium text-[13px] tracking-[-0.01em] transition-colors will-change-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
                >
                  <span>Live project</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerMove={magneticGithubBtn.onPointerMove}
                  onPointerLeave={magneticGithubBtn.onPointerLeave}
                  className="inline-flex items-center gap-2 py-2.5 text-[14px] font-light text-[#F2EFE9]/85 hover:text-[#E99A45] transition-colors will-change-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
                >
                  <span>GitHub repository</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </motion.div>
            </div>

            {/* Metadata Strip: ROLE / CATEGORY / TECH STACK / TIMELINE */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-y border-[#F2EFE9]/15 py-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#C69A61]">
                  Role
                </p>
                <p className="mt-1.5 text-[14px] font-light text-[#F2EFE9]">{project.role}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#C69A61]">
                  Category
                </p>
                <p className="mt-1.5 text-[14px] font-light text-[#F2EFE9]">{project.category}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#C69A61]">
                  Tech Stack
                </p>
                <p className="mt-1.5 text-[14px] font-light text-[#F2EFE9]">
                  {project.technologies.join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#C69A61]">
                  Timeline
                </p>
                <p className="mt-1.5 text-[14px] font-light text-[#F2EFE9]">{project.timeline}</p>
              </div>
            </div>

            {/* Large Application Screenshot Surface */}
            <div className="mt-10">
              <FeatureDiagramSurface
                type={project.keyFeatures[0]?.diagramType || 'event-feed'}
                title={`${project.title} — Primary Application Interface`}
                annotation={`PROJECT ${project.number} · APPLICATION OVERVIEW`}
              />
            </div>
          </BoneyardSkeleton>
        </section>

        {/* SECTION 02 — THE CHALLENGE */}
        <section
          id="cs-challenge"
          data-world-scene="desert"
          aria-label="The Challenge"
          className="border-t border-[#F2EFE9]/15 pt-16"
        >
          <BoneyardSkeleton variant="editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div data-gsap-parallax="14" className="lg:col-span-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#C69A61]">
                  02 · THE CHALLENGE
                </p>
                <h2
                  data-gsap-masked-lines
                  className="mt-3 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06] tracking-[-0.04em] text-[#F2EFE9]"
                >
                  <span className="block overflow-hidden pb-2 -mb-1">
                    <span data-gsap-line className="block will-change-transform">
                      The problem<span className="text-[#E99A45]">.</span>
                    </span>
                  </span>
                </h2>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-3"
                >
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C69A61]">
                    BACKGROUND & CONTEXT
                  </h3>
                  <p className="text-[14px] md:text-[15px] font-light leading-[1.65] text-[#F2EFE9]/80">
                    {project.challenge.background}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.06 }}
                  className="space-y-3"
                >
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C69A61]">
                    TARGET USERS
                  </h3>
                  <p className="text-[14px] md:text-[15px] font-light leading-[1.65] text-[#F2EFE9]/80">
                    {project.challenge.targetUsers}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="border-t border-[#F2EFE9]/20 pt-5 space-y-3"
                  >
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#E99A45]">
                      CORE REQUIREMENTS
                    </h4>
                    <ul className="space-y-2.5 text-[13px] font-light leading-[1.6] text-[#F2EFE9]/85">
                      {project.challenge.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#E99A45] shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.16 }}
                    className="border-t border-[#F2EFE9]/20 pt-5 space-y-3"
                  >
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C69A61]">
                      SYSTEM CONSTRAINTS
                    </h4>
                    <ul className="space-y-2.5 text-[13px] font-light leading-[1.6] text-[#F2EFE9]/78">
                      {project.challenge.constraints.map((con) => (
                        <li key={con} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#C69A61] shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </BoneyardSkeleton>
        </section>

        {/* SECTION 03 — THE APPROACH */}
        <section
          id="cs-approach"
          data-world-scene="desert"
          aria-label="The Approach"
          className="border-t border-[#F2EFE9]/15 pt-16"
        >
          <BoneyardSkeleton variant="editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div data-gsap-parallax="14" className="lg:col-span-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#C69A61]">
                  03 · THE APPROACH
                </p>
                <h2
                  data-gsap-masked-lines
                  className="mt-3 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06] tracking-[-0.04em] text-[#F2EFE9]"
                >
                  <span className="block overflow-hidden pb-2 -mb-1">
                    <span data-gsap-line className="block will-change-transform">
                      The approach<span className="text-[#E99A45]">.</span>
                    </span>
                  </span>
                </h2>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: '01 / RESEARCH & DISCOVERY', text: project.approach.research },
                  { label: '02 / ARCHITECTURE PLANNING', text: project.approach.architecture },
                  { label: '03 / TECHNOLOGY SELECTION', text: project.approach.techSelection },
                  { label: '04 / USER EXPERIENCE DECISIONS', text: project.approach.uxDecisions },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: idx * 0.06 }}
                    className="border-t border-[#F2EFE9]/20 pt-5 space-y-2.5"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#E99A45]">
                      {item.label}
                    </p>
                    <p className="text-[14px] font-light leading-[1.6] text-[#F2EFE9]/78">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </BoneyardSkeleton>
        </section>

        {/* SECTION 04 — SYSTEM ARCHITECTURE */}
        <section
          id="cs-architecture"
          data-world-scene="desert"
          aria-label="System Architecture"
          className="border-t border-[#F2EFE9]/15 pt-16"
        >
          <BoneyardSkeleton variant="card">
            <div className="space-y-10">
              <div data-gsap-parallax="14">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#C69A61]">
                  04 · SYSTEM ARCHITECTURE
                </p>
                <h2
                  data-gsap-masked-lines
                  className="mt-3 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06] tracking-[-0.04em] text-[#F2EFE9]"
                >
                  <span className="block overflow-hidden pb-2 -mb-1">
                    <span data-gsap-line className="block will-change-transform">
                      Under the surface<span className="text-[#E99A45]">.</span>
                    </span>
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {project.systemArchitecture.map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.06 }}
                    className="relative border-t border-[#F2EFE9]/20 pt-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#C69A61]">
                        <span>{node.layer}</span>
                        <span className="tabular-nums text-[#F2EFE9]/55">0{index + 1}</span>
                      </div>
                      <h3 className="mt-4 font-display text-xl font-light tracking-[-0.025em] text-[#F2EFE9]">
                        {node.title}
                      </h3>
                      <p className="mt-2.5 text-[14px] font-light leading-[1.6] text-[#F2EFE9]/75">
                        {node.description}
                      </p>
                    </div>
                    <p className="mt-6 pt-3 border-t border-[#F2EFE9]/12 text-[11px] font-light text-[#C69A61]">
                      {node.tech}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </BoneyardSkeleton>
        </section>

        {/* SECTION 05 — KEY FEATURES */}
        <section
          id="cs-features"
          data-world-scene="desert"
          aria-label="Key Features"
          className="border-t border-[#F2EFE9]/15 pt-16 space-y-12"
        >
          <div data-gsap-parallax="14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#C69A61]">
              05 · KEY FEATURES
            </p>
            <h2
              data-gsap-masked-lines
              className="mt-3 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.04] tracking-[-0.04em] text-[#F2EFE9]"
            >
              <span className="block overflow-hidden pb-2 -mb-1">
                <span data-gsap-line className="block will-change-transform">
                  Feature showcase<span className="text-[#E99A45]">.</span>
                </span>
              </span>
            </h2>
          </div>

          <div className="space-y-12">
            {project.keyFeatures.map((feat, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <BoneyardSkeleton key={feat.id} variant="card">
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.65, delay: idx * 0.06 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl border border-[#F2EFE9]/15 bg-[#08090B]/28 backdrop-blur-md p-6 md:p-10"
                  >
                    <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <FeatureDiagramSurface
                        type={feat.diagramType}
                        title={feat.title}
                        annotation={feat.annotation}
                      />
                    </div>
                    <div className={`lg:col-span-5 space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[#E99A45] tabular-nums">
                        FEATURE {feat.index}
                      </span>
                      <h3 className="font-display text-2xl font-light tracking-[-0.03em] text-[#F2EFE9]">
                        {feat.title}
                      </h3>
                      <p className="text-[14px] md:text-[15px] font-light leading-[1.6] text-[#F2EFE9]/78">
                        {feat.description}
                      </p>
                      <p className="pt-2 text-[11px] uppercase tracking-[0.18em] text-[#C69A61]">
                        {feat.annotation}
                      </p>
                    </div>
                  </motion.div>
                </BoneyardSkeleton>
              );
            })}
          </div>
        </section>

        {/* SECTION 06 — ENGINEERING CHALLENGES */}
        <section
          id="cs-hard-part"
          data-world-scene="desert"
          aria-label="Engineering Challenges"
          className="border-t border-[#F2EFE9]/15 pt-16 space-y-10"
        >
          <div data-gsap-parallax="14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#C69A61]">
              06 · ENGINEERING CHALLENGES
            </p>
            <h2
              data-gsap-masked-lines
              className="mt-3 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06] tracking-[-0.04em] text-[#F2EFE9]"
            >
              <span className="block overflow-hidden pb-2 -mb-1">
                <span data-gsap-line className="block will-change-transform">
                  The hard part<span className="text-[#E99A45]">.</span>
                </span>
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.engineeringChallenges.map((chal, i) => (
              <BoneyardSkeleton key={chal.id} variant="card">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className="border-t border-[#F2EFE9]/20 pt-6 space-y-5 h-full"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#E99A45] tabular-nums">
                    CHALLENGE 0{i + 1}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-light tracking-[-0.025em] text-[#F2EFE9]">
                    {chal.title}
                  </h3>
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#C69A61]">
                      PROBLEM
                    </p>
                    <p className="text-[14px] font-light leading-[1.6] text-[#F2EFE9]/75">
                      {chal.problem}
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-[#F2EFE9]/12">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#E99A45]">
                      ENGINEERING SOLUTION
                    </p>
                    <p className="text-[14px] font-light leading-[1.6] text-[#F2EFE9]/88">
                      {chal.solution}
                    </p>
                  </div>
                </motion.div>
              </BoneyardSkeleton>
            ))}
          </div>
        </section>

        {/* SECTION 07 — RESULTS AND LEARNINGS */}
        <section
          id="cs-results"
          data-world-scene="desert"
          aria-label="Results and Learnings"
          className="border-t border-[#F2EFE9]/15 pt-16 space-y-10"
        >
          <div data-gsap-parallax="14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#C69A61]">
              07 · RESULTS AND LEARNINGS
            </p>
            <h2
              data-gsap-masked-lines
              className="mt-3 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06] tracking-[-0.04em] text-[#F2EFE9]"
            >
              <span className="block overflow-hidden pb-2 -mb-1">
                <span data-gsap-line className="block will-change-transform">
                  What came to life<span className="text-[#E99A45]">.</span>
                </span>
              </span>
            </h2>
          </div>

          <BoneyardSkeleton variant="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="border-t border-[#F2EFE9]/20 pt-6 space-y-4"
              >
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#E99A45]">
                  VERIFIED DELIVERABLES
                </h3>
                <ul className="space-y-3 text-[14px] font-light leading-[1.6] text-[#F2EFE9]/88">
                  {project.resultsAndLearnings.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#E99A45] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="border-t border-[#F2EFE9]/20 pt-6 space-y-4"
              >
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C69A61]">
                  KEY ARCHITECTURAL LEARNINGS
                </h3>
                <ul className="space-y-3 text-[14px] font-light leading-[1.6] text-[#F2EFE9]/78">
                  {project.resultsAndLearnings.learnings.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#C69A61] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </BoneyardSkeleton>
        </section>

        {/* SECTION 08 — NAVIGATION (Previous Project / Back to Selected Work / Next Project) */}
        <BoneyardSkeleton variant="editorial">
          <section
            id="cs-nav"
            aria-label="Case Study Navigation"
            className="border-t border-[#F2EFE9]/20 pt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6"
          >
            <Link
              href={prev.caseStudyRoute}
              onPointerMove={magneticPrevBtn.onPointerMove}
              onPointerLeave={magneticPrevBtn.onPointerLeave}
              className="group rounded-xl border border-[#F2EFE9]/15 hover:border-[#E99A45]/60 bg-[#08090B]/28 backdrop-blur-md p-6 flex flex-col justify-between transition-colors sm:w-1/3 will-change-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
            >
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#F2EFE9]/65 group-hover:text-[#E99A45]">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>PREVIOUS PROJECT</span>
              </span>
              <span className="mt-3 font-display text-xl font-light tracking-[-0.025em] text-[#F2EFE9]">
                {prev.title}
              </span>
            </Link>

            <Link
              href="/#work"
              className="rounded-full border border-[#F2EFE9]/20 hover:border-[#E99A45] bg-[#08090B]/28 backdrop-blur-md px-6 py-3.5 text-center text-[11px] uppercase tracking-[0.2em] text-[#C69A61] hover:text-[#F2EFE9] transition-colors self-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
            >
              BACK TO SELECTED WORK
            </Link>

            <Link
              href={next.caseStudyRoute}
              onPointerMove={magneticNextBtn.onPointerMove}
              onPointerLeave={magneticNextBtn.onPointerLeave}
              className="group rounded-xl border border-[#F2EFE9]/15 hover:border-[#E99A45]/60 bg-[#08090B]/28 backdrop-blur-md p-6 flex flex-col items-end justify-between text-right transition-colors sm:w-1/3 will-change-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
            >
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#F2EFE9]/65 group-hover:text-[#E99A45]">
                <span>NEXT PROJECT</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-3 font-display text-xl font-light tracking-[-0.025em] text-[#F2EFE9]">
                {next.title}
              </span>
            </Link>
          </section>
        </BoneyardSkeleton>
      </main>

      <Footer isCaseStudyPage={true} />
    </div>
  );
}

