'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { PROFILE_DATA } from '@/src/data/profile';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useMagneticHover } from '@/src/hooks/useScrollProgress';

const CLOSING_LINES = [
  ["Let's", 'build', 'what'],
  ["doesn't", 'exist', 'yet.'],
] as const;

export default function ContactSection() {
  const reducedMotion = useReducedMotion();
  const magneticCta = useMagneticHover(reducedMotion, 8);

  return (
    <section
      id="contact"
      data-world-scene="horizon"
      aria-label="07 — Horizon"
      className="relative z-10 min-h-screen w-full flex flex-col justify-center py-24 md:py-32 px-7 sm:px-12 lg:px-16 max-w-[1380px] mx-auto"
    >
      <div data-gsap-parallax="14">
        {/* Opening Editorial Headline with Selective Word-by-Word Reveal */}
        <BoneyardSkeleton variant="editorial">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6DFD5]/85">
              07 · HORIZON
            </p>
            <h2
              data-gsap-words
              className="mt-3 font-display text-[clamp(2.35rem,4.5vw,4.1rem)] font-light leading-[1.04] tracking-[-0.044em] text-[#F2EFE9]"
            >
              {CLOSING_LINES.map((lineWords, lineIdx) => (
                <span key={lineIdx} className="block overflow-hidden pb-2.5 -mb-1.5">
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
            </h2>
            <p className="mt-4 max-w-[48ch] text-[15px] md:text-[16px] font-light leading-[1.6] text-[#F2EFE9]/85">
              Have an interesting idea, a product to develop, or a challenging problem to solve? Let&apos;s create something meaningful.
            </p>
          </div>
        </BoneyardSkeleton>

        {/* Big Editorial "→ Get in touch" CTA with Subtle Magnetic Hover */}
        <div className="mt-14 md:mt-20 pt-10 border-t border-[#F2EFE9]/20">
          <BoneyardSkeleton variant="editorial">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: 0.1 }}
            >
              <Link
                href="/contact"
                onPointerMove={magneticCta.onPointerMove}
                onPointerLeave={magneticCta.onPointerLeave}
                data-testid="horizon-magnetic-cta"
                className="group inline-flex items-center gap-5 sm:gap-8 py-2 font-display text-[clamp(2.8rem,7.5vw,6.5rem)] font-light tracking-[-0.04em] text-[#F2EFE9] hover:text-[#E99A45] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45] will-change-transform"
              >
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-4 inline-block font-normal text-[#E99A45]"
                >
                  →
                </span>
                <span className="no-underline transition-colors">
                  Get in touch
                </span>
              </Link>

              {/* Subordinate Direct Channels Hint */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] md:text-[14px] font-light text-[#F2EFE9]/75">
                <span>Direct inquiry & transmission portal</span>
                <span aria-hidden="true" className="text-[#F2EFE9]/30">
                  /
                </span>
                <a
                  href={`mailto:${PROFILE_DATA.contact.email}`}
                  className="hover:text-[#F2EFE9] transition-colors underline underline-offset-4 decoration-[#F2EFE9]/35 hover:decoration-[#E99A45]"
                >
                  {PROFILE_DATA.contact.email}
                </a>
              </div>
            </motion.div>
          </BoneyardSkeleton>
        </div>
      </div>
    </section>
  );
}

