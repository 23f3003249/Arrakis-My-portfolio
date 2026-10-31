'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { PRIMARY_NAV_ITEMS, NavSectionId } from '@/src/lib/arrakis-logic';
import { PROFILE_DATA } from '@/src/data/profile';

interface NavigationProps {
  activeNavId?: NavSectionId;
  isScrolled?: boolean;
  onNavigate?: (sectionId: string) => void;
  isCaseStudyPage?: boolean;
}

export default function Navigation({
  activeNavId = 'home',
  isScrolled = false,
  onNavigate,
  isCaseStudyPage = false,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetSectionId: string
  ) => {
    if (!isCaseStudyPage && onNavigate) {
      e.preventDefault();
      onNavigate(targetSectionId);
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-2 sm:top-3.5 lg:top-4 left-2 sm:left-3.5 lg:left-4 right-2 sm:right-3.5 lg:right-4 z-40 rounded-t-[14px] sm:rounded-t-[16px] transition-colors duration-300 ${
        mobileMenuOpen ? 'bg-[#08090B]/90' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 sm:h-16 items-center justify-between gap-8 px-5 sm:px-8 lg:px-10 max-w-[1600px]">
        {/* Zone 1: LEFT — ARRAKIS architectural wordmark */}
        <Link
          href="/#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="font-display text-[13px] font-normal tracking-[0.26em] text-[#F2EFE9] hover:text-[#E99A45] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
        >
          {PROFILE_DATA.brand}
        </Link>

        {/* Center space left open for clean architectural framing */}

        {/* Zone 3: RIGHT — Minimal Action & Mobile Menu Button */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="hidden sm:inline-flex items-center gap-1.5 py-1 text-[12px] font-light tracking-[0.02em] text-[#F2EFE9]/80 hover:text-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
          >
            <span>Souvik Ghosh · Creative Developer</span>
          </Link>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex md:hidden h-10 w-10 items-center justify-center text-[#F2EFE9] hover:text-[#E99A45] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden bg-[#08090B]/80 backdrop-blur-lg border-b border-[#E6DFD5]/10 px-6 py-5"
        >
          <div className="flex flex-col space-y-2.5">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = !isCaseStudyPage && activeNavId === item.id;
              return (
                <Link
                  key={item.id}
                  href={`/#${item.targetSectionId}`}
                  onClick={(e) => handleNavClick(e, item.targetSectionId)}
                  className={`flex items-center justify-between py-2 text-[13px] font-light border-b border-[#E6DFD5]/[0.06] ${
                    isActive ? 'text-[#F2EFE9] font-normal' : 'text-[#F2EFE9]/60'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="text-[#F2EFE9]/40">↳</span>
                    <span>{item.label}</span>
                  </span>
                  <span className="text-[11px] tabular-nums text-[#F2EFE9]/45">
                    0{item.number}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
