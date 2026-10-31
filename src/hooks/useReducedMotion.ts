'use client';

import { useSyncExternalStore } from 'react';

let reducedMotionReady = false;

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  if (!reducedMotionReady) {
    window.requestAnimationFrame(() => {
      reducedMotionReady = true;
      callback();
    });
  }
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  if (!reducedMotionReady || typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
