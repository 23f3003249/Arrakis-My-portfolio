'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ChapterRange,
  CHAPTER_RANGES,
  NavSectionId,
  getActiveChapter,
  clampProgress,
  computeMouseParallaxOffsets,
  computeMagneticOffset,
} from '@/src/lib/arrakis-logic';

export interface ScrollProgressState {
  progressRef: React.MutableRefObject<number>;
  scrollProgress: number;
  activeChapter: ChapterRange;
  activeNavId: NavSectionId;
  isScrolled: boolean;
  scrollToSection: (sectionId: string) => void;
}

/**
 * Reusable hook for subtle magnetic hover micro-interaction on primary CTAs.
 */
export function useMagneticHover(reducedMotion: boolean, maxPullPx: number = 6) {
  const elementRef = useRef<HTMLElement | null>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion || typeof window === 'undefined') return;
      if (window.matchMedia('(pointer: coarse)').matches) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const offset = computeMagneticOffset(
        e.clientX,
        e.clientY,
        rect,
        maxPullPx,
        reducedMotion
      );
      gsap.to(el, {
        x: offset.x,
        y: offset.y,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [reducedMotion, maxPullPx]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = e.currentTarget;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    },
    []
  );

  return {
    elementRef,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
  };
}

export function useScrollProgress(
  reducedMotion: boolean,
  chapters: ChapterRange[] = CHAPTER_RANGES
): ScrollProgressState {
  const progressRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);
  const chaptersRef = useRef<ChapterRange[]>(chapters);
  useEffect(() => {
    chaptersRef.current = chapters;
  }, [chapters]);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeChapter, setActiveChapter] = useState<ChapterRange>(
    chapters[0] || CHAPTER_RANGES[0]
  );
  const [activeNavId, setActiveNavId] = useState<NavSectionId>(
    (chapters[0] || CHAPTER_RANGES[0]).navId
  );
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let rafId = 0;

    // Unified pointer parallax state updated inside the main animation loop
    const isCoarsePointer = window.matchMedia
      ? window.matchMedia('(pointer: coarse)').matches
      : false;
    const pointerTarget = { x: 0, y: 0, glowX: 50, glowY: 42 };
    const pointerCurrent = { x: 0, y: 0, glowX: 50, glowY: 42 };

    const applyParallaxVariables = (normX: number, normY: number, glowX: number, glowY: number) => {
      const root = document.documentElement;
      const offsets = computeMouseParallaxOffsets(normX, normY, reducedMotion || isCoarsePointer);
      root.style.setProperty('--parallax-bg-x', `${offsets.background.x}px`);
      root.style.setProperty('--parallax-bg-y', `${offsets.background.y}px`);
      root.style.setProperty('--parallax-particles-x', `${offsets.particles.x}px`);
      root.style.setProperty('--parallax-particles-y', `${offsets.particles.y}px`);
      root.style.setProperty('--parallax-hero-x', `${offsets.heroHeading.x}px`);
      root.style.setProperty('--parallax-hero-y', `${offsets.heroHeading.y}px`);
      root.style.setProperty('--parallax-decor-x', `${offsets.decorative.x}px`);
      root.style.setProperty('--parallax-decor-y', `${offsets.decorative.y}px`);
      root.style.setProperty('--pointer-glow-x', `${glowX.toFixed(1)}%`);
      root.style.setProperty('--pointer-glow-y', `${glowY.toFixed(1)}%`);
    };

    applyParallaxVariables(0, 0, 50, 42);

    const handlePointerMove = (e: PointerEvent) => {
      if (reducedMotion || isCoarsePointer) return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerTarget.x = (e.clientX / w) * 2 - 1;
      pointerTarget.y = (e.clientY / h) * 2 - 1;
      pointerTarget.glowX = (e.clientX / w) * 100;
      pointerTarget.glowY = (e.clientY / h) * 100;
    };

    if (!reducedMotion && !isCoarsePointer) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      });
      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      const updateLoop = (time: number) => {
        lenis?.raf(time);

        if (!isCoarsePointer) {
          const dx = pointerTarget.x - pointerCurrent.x;
          const dy = pointerTarget.y - pointerCurrent.y;
          if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
            pointerCurrent.x += dx * 0.085;
            pointerCurrent.y += dy * 0.085;
            pointerCurrent.glowX += (pointerTarget.glowX - pointerCurrent.glowX) * 0.085;
            pointerCurrent.glowY += (pointerTarget.glowY - pointerCurrent.glowY) * 0.085;
            applyParallaxVariables(
              pointerCurrent.x,
              pointerCurrent.y,
              pointerCurrent.glowX,
              pointerCurrent.glowY
            );
          }
        }

        rafId = requestAnimationFrame(updateLoop);
      };
      rafId = requestAnimationFrame(updateLoop);
    }

    // GSAP Context for Scroll-Based Text Reveals & Foreground Text Parallax
    const gsapCtx = gsap.context(() => {
      // 1. Word-by-word selective reveal (Hero & Horizon closing statement)
      const wordGroups = gsap.utils.toArray<HTMLElement>('[data-gsap-words]');
      wordGroups.forEach((group) => {
        const words = group.querySelectorAll<HTMLElement>('[data-gsap-word]');
        if (!words.length) return;

        if (reducedMotion) {
          gsap.set(words, { yPercent: 0, opacity: 1 });
          return;
        }

        gsap.fromTo(
          words,
          { yPercent: 108, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.82,
            stagger: 0.055,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 88%',
              end: 'bottom 15%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 2. Masked line-by-line heading reveals from below
      const lineGroups = gsap.utils.toArray<HTMLElement>('[data-gsap-masked-lines]');
      lineGroups.forEach((group) => {
        const lines = group.querySelectorAll<HTMLElement>('[data-gsap-line]');
        if (!lines.length) return;

        if (reducedMotion) {
          gsap.set(lines, { yPercent: 0, opacity: 1 });
          return;
        }

        gsap.fromTo(
          lines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.88,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 86%',
              end: 'bottom 15%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 3. Rock-solid foreground text presentation (zero lag/jiggle)
      const parallaxBlocks = gsap.utils.toArray<HTMLElement>('[data-gsap-parallax]');
      parallaxBlocks.forEach((block) => {
        gsap.set(block, { y: 0, clearProps: 'transform' });
      });
    });

    const computeScrollState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight =
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        ) - window.innerHeight;

      const rawProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      const clamped = clampProgress(rawProgress);
      progressRef.current = clamped;
      setScrollProgress(clamped);

      setIsScrolled(scrollTop > 32);

      // Check DOM section bounding boxes so active chapter aligns accurately with visible section
      const viewportCenter = window.innerHeight * 0.42;
      const activeList = chaptersRef.current.length ? chaptersRef.current : CHAPTER_RANGES;
      let matchedByDom: ChapterRange | null = null;

      for (const ch of activeList) {
        const el = document.getElementById(ch.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            matchedByDom = ch;
            break;
          }
        }
      }

      let fallbackByRange: ChapterRange = activeList[activeList.length - 1];
      for (let i = 0; i < activeList.length; i++) {
        const ch = activeList[i];
        const isLast = i === activeList.length - 1;
        if (clamped >= ch.start && (isLast ? clamped <= ch.end : clamped < ch.end)) {
          fallbackByRange = ch;
          break;
        }
      }

      const nextChapter = matchedByDom || fallbackByRange || getActiveChapter(clamped);
      setActiveChapter((prev) => (prev.id !== nextChapter.id ? nextChapter : prev));
      setActiveNavId((prev) => (prev !== nextChapter.navId ? nextChapter.navId : prev));
    };

    computeScrollState();
    window.addEventListener('scroll', computeScrollState, { passive: true });
    window.addEventListener('resize', computeScrollState, { passive: true });

    const masterTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = clampProgress(self.progress);
        progressRef.current = p;
        setScrollProgress(p);
      },
    });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', computeScrollState);
      window.removeEventListener('resize', computeScrollState);
      masterTrigger.kill();
      gsapCtx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, [reducedMotion]);

  const scrollToSection = useCallback((sectionId: string) => {
    if (typeof window === 'undefined') return;
    const target = document.getElementById(sectionId);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return {
    progressRef,
    scrollProgress,
    activeChapter,
    activeNavId,
    isScrolled,
    scrollToSection,
  };
}

