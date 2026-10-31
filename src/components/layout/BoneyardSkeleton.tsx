'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';

// Minimal subtle geometric amber pulse / sand grain orbit Lottie JSON
export const SAND_ORBIT_LOTTIE = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 90,
  w: 64,
  h: 64,
  nm: 'ArrakisOrb',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Ring',
      sr: 1,
      ks: {
        o: { a: 0, k: 75 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [360], i: { x: [0.5], y: [0.5] }, o: { x: [0.5], y: [0.5] } },
            { t: 90, s: [360] },
          ],
        },
        p: { a: 0, k: [32, 32, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [44, 44] },
              p: { a: 0, k: [0, 0] },
              nm: 'Ellipse',
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.776, 0.604, 0.38, 1] },
              o: { a: 0, k: 80 },
              w: { a: 0, k: 1.5 },
              lc: 2,
              lj: 1,
              ml: 4,
              nm: 'Stroke',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: 'RingGroup',
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
};

export function LottieAmberOrb({ className = 'w-6 h-6' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animInstance: { destroy?: () => void } | null = null;
    let cancelled = false;

    import('lottie-react')
      .then((mod) => {
        if (cancelled || !containerRef.current) return;
        const lottieObj = (mod as unknown as { LottiePlayer?: { loadAnimation?: (cfg: unknown) => { destroy?: () => void } } }).LottiePlayer;
        if (lottieObj && typeof lottieObj.loadAnimation === 'function') {
          animInstance = lottieObj.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: SAND_ORBIT_LOTTIE,
          });
        }
      })
      .catch(() => {
        // Fallback SVG ring remains visible
      });

    return () => {
      cancelled = true;
      if (animInstance && typeof animInstance.destroy === 'function') {
        animInstance.destroy();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full stroke-[#C69A61] fill-none animate-spin" style={{ animationDuration: '8s' }}>
        <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeDasharray="18 8" />
      </svg>
    </div>
  );
}

interface BoneyardWrapperProps {
  children: React.ReactNode;
  heightClass?: string;
  className?: string;
  variant?: 'hero' | 'editorial' | 'card' | 'timeline' | 'form';
}

let isClientHydrated = false;
const hydrationListeners = new Set<() => void>();

function subscribeHydration(listener: () => void) {
  hydrationListeners.add(listener);
  if (!isClientHydrated && typeof window !== 'undefined') {
    window.requestAnimationFrame(() => {
      if (!isClientHydrated) {
        isClientHydrated = true;
        hydrationListeners.forEach((l) => l());
      }
    });
  }
  return () => {
    hydrationListeners.delete(listener);
  };
}

function getHydrationSnapshot(): boolean {
  return isClientHydrated;
}

function getHydrationServerSnapshot(): boolean {
  return false;
}

/**
 * Boneyard architectural skeleton loading wrapper paired with Lottie accent.
 * Ensures immediate DOM accessibility for text/controls while displaying a
 * sand-toned Boneyard shimmer placeholder during initial hydration.
 */
export function BoneyardSkeleton({
  children,
  className = '',
  variant = 'editorial',
}: BoneyardWrapperProps) {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    getHydrationServerSnapshot
  );

  return (
    <div
      suppressHydrationWarning
      className={`relative ${className}`}
      data-boneyard-variant={variant}
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div
        aria-hidden="true"
        suppressHydrationWarning
        className={`pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-sm bg-[#080909]/55 backdrop-blur-sm border border-[#C69A61]/15 p-6 flex flex-col justify-between transition-opacity duration-500 ${
          hydrated ? 'opacity-0 invisible' : 'opacity-100 animate-pulse'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-24 bg-[#29231B] rounded-none" />
          <LottieAmberOrb className="w-6 h-6 opacity-60" />
        </div>
        <div className="space-y-3 my-auto">
          <div className="h-6 w-3/4 bg-[#29231B]/90 rounded-none" />
          <div className="h-4 w-1/2 bg-[#29231B]/70 rounded-none" />
        </div>
        <div className="h-2 w-1/3 bg-[#C69A61]/20 rounded-none" />
      </div>
      {children}
    </div>
  );
}
