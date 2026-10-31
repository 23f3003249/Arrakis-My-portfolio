'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';
import {
  WorldSceneId,
  SceneVideoConfig,
  ARRAKIS_VIDEO_MAP,
  isValidWorldScene,
  computeBackgroundZoomScale,
} from '@/src/lib/arrakis-logic';

export type { WorldSceneId, SceneVideoConfig };
export { ARRAKIS_VIDEO_MAP, isValidWorldScene };

interface ArrakisVideoBackgroundProps {
  fixedScene?: WorldSceneId;
}

export default function ArrakisVideoBackground({
  fixedScene,
}: ArrakisVideoBackgroundProps = {}) {
  const initialScene: WorldSceneId =
    fixedScene && isValidWorldScene(fixedScene) ? fixedScene : 'arrival';

  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  const zoomStageRef = useRef<HTMLDivElement | null>(null);

  // Track which slot ('A' or 'B') is currently visible on screen
  const activeSlotRef = useRef<'A' | 'B'>('A');
  const activeSceneRef = useRef<WorldSceneId>(initialScene);
  const pendingSceneRef = useRef<WorldSceneId | null>(null);
  const crossfadeTweenRef = useRef<gsap.core.Tween | null>(null);
  const cleanupLoadListenersRef = useRef<(() => void) | null>(null);

  const [currentScene, setCurrentScene] = useState<WorldSceneId>(initialScene);

  // Helper to resolve mobile vs desktop source if mobile variants are provided
  const resolveVideoSrc = useCallback((sceneId: WorldSceneId): string => {
    const config = ARRAKIS_VIDEO_MAP[sceneId] || ARRAKIS_VIDEO_MAP.arrival;
    if (typeof window !== 'undefined' && window.innerWidth < 768 && config.mobileSrc) {
      return config.mobileSrc;
    }
    return config.src;
  }, []);

  // Safely pause a video element without throwing if a play promise is pending
  const safePause = useCallback((videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    try {
      if (!videoEl.paused) {
        videoEl.pause();
      }
    } catch {
      // Ignore interruption errors
    }
  }, []);

  // Switch to target scene using dual-buffer crossfade only after next video is ready
  const transitionToScene = useCallback(
    (targetScene: WorldSceneId) => {
      if (fixedScene && isValidWorldScene(fixedScene)) {
        return;
      }
      if (targetScene === activeSceneRef.current && pendingSceneRef.current === null) {
        return;
      }

      pendingSceneRef.current = targetScene;
      setCurrentScene(targetScene);

      // Clean up any in-flight listeners from a previous pending load
      if (cleanupLoadListenersRef.current) {
        cleanupLoadListenersRef.current();
        cleanupLoadListenersRef.current = null;
      }

      const currentSlot = activeSlotRef.current;
      const nextSlot: 'A' | 'B' = currentSlot === 'A' ? 'B' : 'A';

      const currentVideo = currentSlot === 'A' ? videoARef.current : videoBRef.current;
      const nextVideo = nextSlot === 'A' ? videoARef.current : videoBRef.current;

      if (!currentVideo || !nextVideo) return;

      const targetSrc = resolveVideoSrc(targetScene);
      const currentNextSrc = nextVideo.getAttribute('data-loaded-src');

      const executeCrossfade = () => {
        if (pendingSceneRef.current !== targetScene) return;

        // Kill any ongoing opacity tween
        if (crossfadeTweenRef.current) {
          crossfadeTweenRef.current.kill();
        }

        const finishTransition = () => {
          activeSlotRef.current = nextSlot;
          activeSceneRef.current = targetScene;
          pendingSceneRef.current = null;
          // Pause the previous video so multiple videos never play simultaneously
          safePause(currentVideo);
        };

        if (reducedMotionRef.current) {
          safePause(nextVideo);
          gsap.set(nextVideo, { opacity: 1 });
          gsap.set(currentVideo, { opacity: 0 });
          finishTransition();
          return;
        }

        const playPromise = nextVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (pendingSceneRef.current !== targetScene) {
                safePause(nextVideo);
                return;
              }
              crossfadeTweenRef.current = gsap.to(nextVideo, {
                opacity: 1,
                duration: 0.9,
                ease: 'power2.inOut',
                overwrite: 'auto',
                onStart: () => {
                  gsap.to(currentVideo, {
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power2.inOut',
                    overwrite: 'auto',
                  });
                },
                onComplete: finishTransition,
              });
            })
            .catch(() => {
              // If autoplay or empty source fails, retain current video or poster gracefully without black screen
              pendingSceneRef.current = null;
              activeSceneRef.current = targetScene;
            });
        } else {
          gsap.to(nextVideo, {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.inOut',
            onStart: () => {
              gsap.to(currentVideo, {
                opacity: 0,
                duration: 0.9,
                ease: 'power2.inOut',
              });
            },
            onComplete: finishTransition,
          });
        }
      };

      // If the next video element already has this source buffered and ready
      if (currentNextSrc === targetSrc && nextVideo.readyState >= 3) {
        executeCrossfade();
        return;
      }

      const handleReady = () => {
        cleanup();
        executeCrossfade();
      };

      const handleError = () => {
        // Graceful fallback: keep previous video visible or rely on subtle poster backdrop
        cleanup();
        pendingSceneRef.current = null;
        activeSceneRef.current = targetScene;
      };

      const cleanup = () => {
        nextVideo.removeEventListener('canplay', handleReady);
        nextVideo.removeEventListener('loadeddata', handleReady);
        nextVideo.removeEventListener('error', handleError);
      };

      cleanupLoadListenersRef.current = cleanup;

      nextVideo.addEventListener('canplay', handleReady, { once: true });
      nextVideo.removeEventListener('loadeddata', handleReady);
      nextVideo.addEventListener('loadeddata', handleReady, { once: true });
      nextVideo.addEventListener('error', handleError, { once: true });

      if (currentNextSrc !== targetSrc) {
        nextVideo.setAttribute('data-loaded-src', targetSrc);
        nextVideo.src = targetSrc;
        nextVideo.load();
      } else if (nextVideo.readyState >= 2) {
        handleReady();
      }
    },
    [fixedScene, resolveVideoSrc, safePause]
  );

  // Initialize initial video ('arrival' or fixedScene such as 'desert'), bind GSAP ScrollTrigger crossfades & subtle 1 -> 1.08 chapter zoom
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    const zoomStage = zoomStageRef.current;
    const targetInitialScene: WorldSceneId =
      fixedScene && isValidWorldScene(fixedScene) ? fixedScene : 'arrival';

    activeSceneRef.current = targetInitialScene;

    if (videoA && videoB) {
      const initialSrc = resolveVideoSrc(targetInitialScene);
      videoA.setAttribute('data-loaded-src', initialSrc);
      videoA.src = initialSrc;
      gsap.set(videoA, { opacity: 1 });
      gsap.set(videoB, { opacity: 0 });

      const onInitialReady = () => {
        gsap.set(videoA, { opacity: 1 });
        gsap.set(videoB, { opacity: 0 });
        if (!reducedMotionRef.current) {
          videoA.play().catch(() => {
            // Silently retain poster if video file is empty or blocked
          });
        } else {
          safePause(videoA);
        }
      };

      const onInitialError = () => {
        // Keep poster visible if video is unavailable
        gsap.set(videoA, { opacity: 0 });
      };

      videoA.addEventListener('loadedmetadata', onInitialReady, { once: true });
      videoA.addEventListener('canplay', onInitialReady, { once: true });
      videoA.addEventListener('loadeddata', onInitialReady, { once: true });
      videoA.addEventListener('error', onInitialError, { once: true });
      videoA.load();
      if (videoA.readyState >= 1) {
        onInitialReady();
      }
    }

    // Create ScrollTrigger instances for each section with data-world-scene
    const sectionElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-world-scene]')
    );

    const triggers: ScrollTrigger[] = [];

    if (sectionElements.length > 0) {
      sectionElements.forEach((sectionEl) => {
        const sceneAttr = sectionEl.getAttribute('data-world-scene');
        if (!isValidWorldScene(sceneAttr)) return;

        const trigger = ScrollTrigger.create({
          trigger: sectionEl,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => {
            if (!fixedScene) {
              transitionToScene(sceneAttr);
            }
          },
          onEnterBack: () => {
            if (!fixedScene) {
              transitionToScene(sceneAttr);
            }
          },
          onUpdate: (self) => {
            if (!zoomStage) return;
            const targetScale = computeBackgroundZoomScale(
              self.progress,
              reducedMotionRef.current
            );
            gsap.to(zoomStage, {
              scale: targetScale,
              duration: 0.45,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          },
        });

        triggers.push(trigger);
      });
    } else if (zoomStage) {
      // Fallback page-level scroll zoom if no individual data-world-scene sections exist
      const pageZoomTrigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const targetScale = computeBackgroundZoomScale(
            self.progress,
            reducedMotionRef.current
          );
          gsap.to(zoomStage, {
            scale: targetScale,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        },
      });
      triggers.push(pageZoomTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
      if (cleanupLoadListenersRef.current) {
        cleanupLoadListenersRef.current();
        cleanupLoadListenersRef.current = null;
      }
      if (crossfadeTweenRef.current) {
        crossfadeTweenRef.current.kill();
      }
      safePause(videoA);
      safePause(videoB);
    };
  }, [fixedScene, resolveVideoSrc, safePause, transitionToScene]);

  // Respect runtime changes to prefers-reduced-motion
  useEffect(() => {
    const activeVideo =
      activeSlotRef.current === 'A' ? videoARef.current : videoBRef.current;
    if (!activeVideo) return;

    if (reducedMotion) {
      safePause(activeVideo);
      if (zoomStageRef.current) {
        gsap.set(zoomStageRef.current, { scale: 1 });
      }
    } else if (activeVideo.readyState >= 2) {
      activeVideo.play().catch(() => {});
    }
  }, [reducedMotion, safePause]);

  const activeConfig = ARRAKIS_VIDEO_MAP[currentScene] || ARRAKIS_VIDEO_MAP.arrival;

  return (
    <BoneyardSkeleton variant="hero">
      <div
        aria-hidden="true"
        suppressHydrationWarning
        data-testid="arrakis-video-background"
        data-active-scene={currentScene}
        className="fixed top-2 sm:top-3.5 lg:top-4 left-2 sm:left-3.5 lg:left-4 right-2 sm:right-3.5 lg:right-4 bottom-10 sm:bottom-11 lg:bottom-12 rounded-[14px] sm:rounded-[16px] z-0 pointer-events-none overflow-hidden bg-[#08090B]"
      >
        {/* Inner Zoom (1 -> 1.08) + Subtle 4-6px Mouse Parallax Stage */}
        <div
          ref={zoomStageRef}
          data-testid="arrakis-video-zoom-stage"
          style={{
            transformOrigin: '50% 42%',
            transform:
              'translate3d(var(--parallax-bg-x, 0px), var(--parallax-bg-y, 0px), 0)',
          }}
          className="absolute -inset-2 pointer-events-none will-change-transform"
        >
          {/* Graceful Atmospheric Poster Base (prevents black frames while videos load or if an asset fails) */}
          <div
            className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none"
            style={{
              background: activeConfig.posterGradient,
            }}
          />

          {/* Video Element A (Preloads initial hero video) */}
          <video
            ref={videoARef}
            muted
            playsInline
            loop
            preload="auto"
            suppressHydrationWarning
            data-slot="A"
            className="absolute inset-0 h-full w-full object-cover opacity-0 pointer-events-none will-change-[opacity]"
          />

          {/* Video Element B (Loads subsequent videos on demand for seamless crossfade) */}
          <video
            ref={videoBRef}
            muted
            playsInline
            loop
            preload="none"
            suppressHydrationWarning
            data-slot="B"
            className="absolute inset-0 h-full w-full object-cover opacity-0 pointer-events-none will-change-[opacity]"
          />
        </div>

        {/* Restrained Ambient Amber Glow Following Pointer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background:
              'radial-gradient(640px circle at var(--pointer-glow-x, 50%) var(--pointer-glow-y, 42%), rgba(233, 154, 69, 0.075) 0%, rgba(198, 154, 97, 0.025) 45%, transparent 75%)',
          }}
        />

        {/* Lighter, More Luminous Cinematic Vignette (Enhanced Atmospheric Transparency) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(8, 9, 11, 0.06) 0%, rgba(8, 9, 11, 0.22) 58%, rgba(8, 9, 11, 0.48) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(8, 9, 11, 0.14) 0%, rgba(8, 9, 11, 0.05) 38%, rgba(8, 9, 11, 0.30) 100%)',
          }}
        />
      </div>
    </BoneyardSkeleton>
  );
}

