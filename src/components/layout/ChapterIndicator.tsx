'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CHAPTER_RANGES,
  ChapterRange,
  ARRAKIS_AUDIO_CONFIG,
} from '@/src/lib/arrakis-logic';
import { PROFILE_DATA } from '@/src/data/profile';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useMagneticHover } from '@/src/hooks/useScrollProgress';

interface ChapterIndicatorProps {
  activeChapter: ChapterRange;
  onSelectChapter: (sectionId: string) => void;
  scrollProgress?: number;
  chapters?: ChapterRange[];
}

const AUDIO_STOPPED_STORAGE_KEY = 'arrakis-audio-stopped';

export default function ChapterIndicator({
  activeChapter,
  onSelectChapter,
  scrollProgress = 0,
  chapters = CHAPTER_RANGES,
}: ChapterIndicatorProps) {
  const reducedMotion = useReducedMotion();
  const magneticScrollBtn = useMagneticHover(reducedMotion, 5);

  const chapterList = chapters.length ? chapters : CHAPTER_RANGES;
  const activeIndex = Math.max(
    0,
    chapterList.findIndex((c) => c.id === activeChapter.id)
  );
  const nextChapter =
    chapterList[(activeIndex + 1) % chapterList.length];

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userStoppedRef = useRef<boolean>(false);

  const clearFadeInterval = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const setAudioStartTime = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const targetTime = ARRAKIS_AUDIO_CONFIG.startTimeSeconds; // 286s = 4:46
    try {
      if (audio.currentTime < targetTime) {
        audio.currentTime = targetTime;
      }
    } catch {
      // Metadata not yet loaded; handled in loadedmetadata listener
    }
  }, []);

  const fadeInAudio = useCallback(
    (audio: HTMLAudioElement) => {
      clearFadeInterval();
      audio.volume = 0.05;
      const targetVolume = 0.75;
      const step = 0.05;
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume + step >= targetVolume) {
          audio.volume = targetVolume;
          clearFadeInterval();
        } else {
          audio.volume = Math.min(1, audio.volume + step);
        }
      }, 60);
    },
    [clearFadeInterval]
  );

  const fadeOutAndPause = useCallback(
    (audio: HTMLAudioElement) => {
      clearFadeInterval();
      const step = 0.1;
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume - step <= 0.05) {
          audio.volume = 0;
          audio.pause();
          setIsPlaying(false);
          clearFadeInterval();
        } else {
          audio.volume = Math.max(0, audio.volume - step);
        }
      }, 50);
    },
    [clearFadeInterval]
  );

  const startLoopingPlayback = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio || userStoppedRef.current) return false;

    try {
      setAudioStartTime();
      audio.loop = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      if (!userStoppedRef.current) {
        fadeInAudio(audio);
        setIsPlaying(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fadeInAudio, setAudioStartTime]);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userStoppedRef.current = true;
      try {
        window.sessionStorage.setItem(AUDIO_STOPPED_STORAGE_KEY, 'true');
      } catch {
        // Ignore storage errors
      }
      fadeOutAndPause(audio);
    } else {
      userStoppedRef.current = false;
      try {
        window.sessionStorage.setItem(AUDIO_STOPPED_STORAGE_KEY, 'false');
      } catch {
        // Ignore storage errors
      }
      await startLoopingPlayback();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      userStoppedRef.current =
        window.sessionStorage.getItem(AUDIO_STOPPED_STORAGE_KEY) === 'true';
    } catch {
      userStoppedRef.current = false;
    }

    let interactionListenersRemoved = false;

    const removeInteractionListeners = () => {
      if (interactionListenersRemoved) return;
      interactionListenersRemoved = true;
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('wheel', handleFirstInteraction);
    };

    const handleFirstInteraction = () => {
      if (userStoppedRef.current) {
        removeInteractionListeners();
        return;
      }
      startLoopingPlayback().then((started) => {
        if (started) {
          removeInteractionListeners();
        }
      });
    };

    const handleLoadedMetadata = () => {
      setAudioStartTime();
      if (!userStoppedRef.current && audio.paused) {
        startLoopingPlayback().then((started) => {
          if (started) {
            removeInteractionListeners();
          }
        });
      }
    };

    // Loop continuously from 4:46 (286s) until explicitly stopped
    const handleEnded = () => {
      if (userStoppedRef.current) return;
      audio.currentTime = ARRAKIS_AUDIO_CONFIG.startTimeSeconds;
      audio.play().catch(() => {});
    };

    const handleTimeUpdate = () => {
      if (!userStoppedRef.current && audio.duration > 0) {
        if (audio.currentTime >= audio.duration - 0.35) {
          audio.currentTime = ARRAKIS_AUDIO_CONFIG.startTimeSeconds;
          if (audio.paused) {
            audio.play().catch(() => {});
          }
        }
      }
    };

    const handlePause = () => {
      if (audio.volume === 0 || userStoppedRef.current) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('pause', handlePause);

    // Attempt immediate playback when website opens for the first time
    if (!userStoppedRef.current) {
      startLoopingPlayback().then((started) => {
        if (!started && !userStoppedRef.current) {
          window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
          window.addEventListener('keydown', handleFirstInteraction, { passive: true });
          window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
          window.addEventListener('wheel', handleFirstInteraction, { passive: true });
        }
      });
    }

    return () => {
      clearFadeInterval();
      removeInteractionListeners();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('pause', handlePause);
    };
  }, [clearFadeInterval, setAudioStartTime, startLoopingPlayback]);

  return (
    <BoneyardSkeleton variant="card">
      {/* Hidden Audio Element pointing to Paul's Dream starting at 4:46 and looping until stopped */}
      <audio
        ref={audioRef}
        src={ARRAKIS_AUDIO_CONFIG.src}
        preload="auto"
        loop
        playsInline
      />

      {/* VOS9X Bottom-Left Circular Scroll-Down Button with Real-time Circular Border Progress */}
      <div className="fixed bottom-14 sm:bottom-16 left-5 sm:left-8 lg:left-10 z-40">
        <div
          onPointerMove={magneticScrollBtn.onPointerMove}
          onPointerLeave={magneticScrollBtn.onPointerLeave}
          className="relative flex h-11 w-11 items-center justify-center will-change-transform"
        >
          {/* Animated SVG Progress Ring on the Rounded Border */}
          <svg
            className="absolute inset-0 -rotate-90 pointer-events-none"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            aria-hidden="true"
          >
            {/* Background Track Circle */}
            <circle
              cx="22"
              cy="22"
              r="19"
              fill="none"
              stroke="#F2EFE9"
              strokeOpacity="0.18"
              strokeWidth="1.5"
            />
            {/* Live Progress Ring - Pure White Stroke */}
            <circle
              cx="22"
              cy="22"
              r="19"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray={119.38}
              strokeDashoffset={119.38 * (1 - Math.max(0, Math.min(1, scrollProgress)))}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-150 ease-out"
            />
          </svg>

          <button
            type="button"
            onClick={() => onSelectChapter(nextChapter.id)}
            aria-label={`Scroll to next chapter: ${nextChapter.label} (${Math.round(scrollProgress * 100)}% viewed)`}
            title={`Next: ${nextChapter.label} (${Math.round(scrollProgress * 100)}%)`}
            className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-[#08090B]/35 backdrop-blur-md text-[#F2EFE9]/90 hover:text-[#F2EFE9] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
          >
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5 text-[#F2EFE9]" />
          </button>
        </div>
      </div>

      {/* VOS9X Outer Bottom Bar Indicator (Dynamic Number Badge + ↳ Video Title Navigation + Audio Toggle) */}
      <aside
        aria-label="Chapter Navigation and Audio Bar"
        className="fixed bottom-0 left-2 sm:left-3.5 lg:left-4 right-2 sm:right-3.5 lg:right-4 h-10 sm:h-11 lg:h-12 z-40 flex items-center justify-between pl-11 pr-4 sm:pl-12 sm:pr-6 bg-[#08090B]/85 backdrop-blur-md text-[12px] sm:text-[13px] select-none"
      >
        {/* Left: Dynamic Number Circle Badge + "↳ Video Title" */}
        <div className="flex items-center gap-8 sm:gap-16 min-w-0">
          <span
            aria-label={`Chapter ${activeChapter.number}`}
            className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F2EFE9] text-[11px] font-semibold text-[#08090B] tabular-nums"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={activeChapter.number}
                initial={reducedMotion ? false : { y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reducedMotion ? undefined : { y: -10, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {activeChapter.number}
              </motion.span>
            </AnimatePresence>
          </span>

          <button
            type="button"
            onClick={() => onSelectChapter(nextChapter.id)}
            title={`Current: ${activeChapter.label} · Click for ${nextChapter.label}`}
            className="inline-flex items-center gap-2 overflow-hidden text-[#F2EFE9] hover:text-[#E99A45] font-normal tracking-[-0.01em] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
          >
            <span aria-hidden="true" className="text-[#F2EFE9]/75 text-sm leading-none">
              ↳
            </span>
            <span className="relative inline-flex overflow-hidden py-0.5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeChapter.label}
                  initial={reducedMotion ? false : { y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reducedMotion ? undefined : { y: -12, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {activeChapter.label}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
        </div>

        {/* Right: Studio Copyright & VOS9X Audio On / Off Control */}
        <div className="flex items-center gap-6 sm:gap-8 text-[12px] sm:text-[13px] font-light text-[#F2EFE9]/65 whitespace-nowrap shrink-0">
          <span suppressHydrationWarning className="hidden md:inline">
            {PROFILE_DATA.copyrightYear} © {PROFILE_DATA.brand}
          </span>

          {/* VOS9X-style Audio Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={
              isPlaying
                ? "Mute ambient audio: Paul's Dream"
                : "Play ambient audio: Paul's Dream (from 4:46)"
            }
            title={`Paul's Dream — Hans Zimmer (starts at ${ARRAKIS_AUDIO_CONFIG.formattedStartTime})`}
            className="group inline-flex items-center gap-2 py-1 text-[#F2EFE9]/70 hover:text-[#F2EFE9] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
          >
            {/* Clean equalizer bars (static heights, no pulsing dots) */}
            {isPlaying ? (
              <span
                className="flex items-end gap-[2px] h-3 w-3.5 mb-[1px]"
                aria-hidden="true"
              >
                <span className="w-[2px] bg-[#E99A45] rounded-full h-full" />
                <span className="w-[2px] bg-[#E99A45] rounded-full h-2/3" />
                <span className="w-[2px] bg-[#E99A45] rounded-full h-4/5" />
              </span>
            ) : (
              <span
                className="flex items-end gap-[2px] h-3 w-3.5 mb-[1px] opacity-40 group-hover:opacity-75 transition-opacity"
                aria-hidden="true"
              >
                <span className="w-[2px] bg-[#F2EFE9] rounded-full h-1" />
                <span className="w-[2px] bg-[#F2EFE9] rounded-full h-1" />
                <span className="w-[2px] bg-[#F2EFE9] rounded-full h-1" />
              </span>
            )}
            <span className="font-light tracking-[0.02em]">Audio</span>
            <span
              className={`font-normal transition-colors ${
                isPlaying ? 'text-[#F2EFE9]' : 'text-[#F2EFE9]/45'
              }`}
            >
              {isPlaying ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      </aside>
    </BoneyardSkeleton>
  );
}

