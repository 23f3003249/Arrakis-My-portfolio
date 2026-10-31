'use client';

import React from 'react';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

interface ArchitecturalWindowProps {
  activeChapterNumber?: string;
  activeChapterLabel?: string;
}

export function ArchitecturalWindow({
  activeChapterNumber = '1',
  activeChapterLabel = 'Arrival',
}: ArchitecturalWindowProps) {
  return (
    <BoneyardSkeleton variant="card">
      <div
        aria-hidden="true"
        data-chapter={activeChapterNumber}
        data-chapter-label={activeChapterLabel}
        className="fixed top-2 sm:top-3.5 lg:top-4 left-2 sm:left-3.5 lg:left-4 right-2 sm:right-3.5 lg:right-4 bottom-10 sm:bottom-11 lg:bottom-12 rounded-[14px] sm:rounded-[16px] pointer-events-none z-30 border border-[#E6DFD5]/20 transition-colors duration-700"
        style={{
          boxShadow: '0 0 0 100vmax #08090B',
        }}
      />
    </BoneyardSkeleton>
  );
}
