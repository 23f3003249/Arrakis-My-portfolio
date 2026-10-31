'use client';

import React from 'react';
import Link from 'next/link';
import { PRIMARY_NAV_ITEMS } from '@/src/lib/arrakis-logic';
import { PROFILE_DATA } from '@/src/data/profile';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
  isCaseStudyPage?: boolean;
}

export default function Footer({ onNavigate, isCaseStudyPage = false }: FooterProps) {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetSectionId: string
  ) => {
    if (!isCaseStudyPage && onNavigate) {
      e.preventDefault();
      onNavigate(targetSectionId);
    }
  };

  return (
    <footer className="relative z-20 border-t border-[#F2EFE9]/15 px-7 sm:px-12 lg:px-16 py-16 pb-20 max-w-[1380px] mx-auto">
      <BoneyardSkeleton variant="editorial">
        <div className="flex flex-col gap-10">
          {/* Final Brand Moment */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <p className="font-display text-lg font-normal tracking-[0.26em] text-[#F2EFE9]">
                {PROFILE_DATA.brand}
              </p>
              <p className="text-[13px] font-light text-[#A69F95]">
                {PROFILE_DATA.name} · Creative Developer & Digital Builder
              </p>
            </div>

            {/* Footer Navigation */}
            <nav
              aria-label="Footer Navigation"
              className="flex flex-wrap items-center gap-6 text-[12px] font-light tracking-[0.12em]"
            >
              {PRIMARY_NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={`/#${item.targetSectionId}`}
                  onClick={(e) => handleNavClick(e, item.targetSectionId)}
                  className="text-[#A69F95] hover:text-[#F2EFE9] transition-colors whitespace-nowrap shrink-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="h-[1px] w-full bg-[#E6DFD5]/[0.08]" />

          {/* Bottom Row: Social Links & Copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12px] font-light text-[#A69F95]">
            <p suppressHydrationWarning>
              {PROFILE_DATA.copyrightYear} © {PROFILE_DATA.brand} · {PROFILE_DATA.name}
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/contact"
                className="hover:text-[#F2EFE9] transition-colors whitespace-nowrap"
              >
                Contact
              </Link>
              <span aria-hidden="true" className="text-[#E6DFD5]/20">
                /
              </span>
              <a
                href={PROFILE_DATA.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F2EFE9] transition-colors whitespace-nowrap"
              >
                GitHub
              </a>
              <span aria-hidden="true" className="text-[#E6DFD5]/20">
                /
              </span>
              <a
                href={PROFILE_DATA.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F2EFE9] transition-colors whitespace-nowrap"
              >
                LinkedIn
              </a>
              <span aria-hidden="true" className="text-[#E6DFD5]/20">
                /
              </span>
              <a
                href={PROFILE_DATA.contact.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F2EFE9] transition-colors whitespace-nowrap"
              >
                Medium
              </a>
              <span aria-hidden="true" className="text-[#E6DFD5]/20">
                /
              </span>
              <a
                href={`mailto:${PROFILE_DATA.contact.email}`}
                className="hover:text-[#F2EFE9] transition-colors whitespace-nowrap"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </BoneyardSkeleton>
    </footer>
  );
}
