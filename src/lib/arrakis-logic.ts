export type NavSectionId =
  | 'home'
  | 'about'
  | 'awakening'
  | 'capabilities'
  | 'work'
  | 'process'
  | 'contact';

export interface ChapterRange {
  id: string;
  navId: NavSectionId;
  sceneId: WorldSceneId;
  number: string;
  label: string;
  sublabel: string;
  start: number;
  end: number;
}

export const CHAPTER_RANGES: ChapterRange[] = [
  { id: 'home', navId: 'home', sceneId: 'arrival', number: '1', label: 'Arrival', sublabel: '01 · ARRIVAL', start: 0.0, end: 0.14 },
  { id: 'about', navId: 'about', sceneId: 'desert', number: '2', label: 'Desert', sublabel: '02 · DESERT', start: 0.14, end: 0.28 },
  { id: 'awakening', navId: 'awakening', sceneId: 'awakening', number: '3', label: 'Awakening', sublabel: '03 · AWAKENING', start: 0.28, end: 0.42 },
  { id: 'capabilities', navId: 'capabilities', sceneId: 'architecture', number: '4', label: 'Architecture', sublabel: '04 · ARCHITECTURE', start: 0.42, end: 0.57 },
  { id: 'work', navId: 'work', sceneId: 'artifacts', number: '5', label: 'Artifacts', sublabel: '05 · ARTIFACTS', start: 0.57, end: 0.72 },
  { id: 'process', navId: 'process', sceneId: 'method', number: '6', label: 'Method', sublabel: '06 · METHOD', start: 0.72, end: 0.86 },
  { id: 'contact', navId: 'contact', sceneId: 'horizon', number: '7', label: 'Horizon', sublabel: '07 · HORIZON', start: 0.86, end: 1.0 },
];

export const PRIMARY_NAV_ITEMS = [
  { id: 'home', sceneId: 'arrival', number: '1', label: 'Arrival', targetSectionId: 'home' },
  { id: 'about', sceneId: 'desert', number: '2', label: 'Desert', targetSectionId: 'about' },
  { id: 'awakening', sceneId: 'awakening', number: '3', label: 'Awakening', targetSectionId: 'awakening' },
  { id: 'capabilities', sceneId: 'architecture', number: '4', label: 'Architecture', targetSectionId: 'capabilities' },
  { id: 'work', sceneId: 'artifacts', number: '5', label: 'Artifacts', targetSectionId: 'work' },
  { id: 'process', sceneId: 'method', number: '6', label: 'Method', targetSectionId: 'process' },
  { id: 'contact', sceneId: 'horizon', number: '7', label: 'Horizon', targetSectionId: 'contact' },
] as const;

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function getActiveChapter(progress: number): ChapterRange {
  const p = clampProgress(progress);
  for (let i = 0; i < CHAPTER_RANGES.length; i++) {
    const ch = CHAPTER_RANGES[i];
    if (p >= ch.start && (p < ch.end || i === CHAPTER_RANGES.length - 1)) {
      return ch;
    }
  }
  return CHAPTER_RANGES[0];
}

export function getActiveNavId(progress: number): NavSectionId {
  return getActiveChapter(progress).navId;
}

// ============================================================================
// 2. CONTACT FORM VALIDATION
// ============================================================================

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactPayload, string>>;
}

export function validateContactForm(payload: ContactPayload): ValidationResult {
  const errors: Partial<Record<keyof ContactPayload, string>> = {};
  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  const subject = (payload.subject || '').trim();
  const message = (payload.message || '').trim();

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!subject) {
    errors.subject = 'Subject is required.';
  }

  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export type WorldSceneId =
  | 'arrival'
  | 'desert'
  | 'awakening'
  | 'architecture'
  | 'artifacts'
  | 'method'
  | 'horizon';

export interface SceneVideoConfig {
  id: WorldSceneId;
  src: string;
  mobileSrc?: string;
  posterGradient: string;
}

export const ARRAKIS_VIDEO_MAP: Record<WorldSceneId, SceneVideoConfig> = {
  arrival: {
    id: 'arrival',
    src: '/videos/arrakis/01-arrival.mp4',
    posterGradient:
      'radial-gradient(circle at 72% 38%, rgba(233, 154, 69, 0.22) 0%, rgba(198, 154, 97, 0.08) 38%, rgba(8, 9, 9, 0.96) 80%)',
  },
  desert: {
    id: 'desert',
    src: '/videos/arrakis/02-desert.mp4',
    posterGradient:
      'radial-gradient(circle at 65% 45%, rgba(198, 154, 97, 0.20) 0%, rgba(41, 35, 27, 0.35) 45%, rgba(8, 9, 9, 0.98) 85%)',
  },
  awakening: {
    id: 'awakening',
    src: '/videos/arrakis/03-awakening.mp4',
    posterGradient:
      'radial-gradient(circle at 60% 40%, rgba(233, 154, 69, 0.24) 0%, rgba(156, 106, 53, 0.12) 42%, rgba(8, 9, 9, 0.96) 82%)',
  },
  architecture: {
    id: 'architecture',
    src: '/videos/arrakis/04-architecture.mp4',
    posterGradient:
      'radial-gradient(circle at 68% 36%, rgba(233, 154, 69, 0.20) 0%, rgba(41, 35, 27, 0.30) 48%, rgba(8, 9, 9, 0.97) 85%)',
  },
  artifacts: {
    id: 'artifacts',
    src: '/videos/arrakis/05-artifacts.mp4',
    posterGradient:
      'radial-gradient(circle at 74% 35%, rgba(198, 154, 97, 0.18) 0%, rgba(41, 35, 27, 0.28) 45%, rgba(8, 9, 9, 0.98) 85%)',
  },
  method: {
    id: 'method',
    src: '/videos/arrakis/06-method.mp4',
    posterGradient:
      'radial-gradient(circle at 58% 42%, rgba(233, 154, 69, 0.18) 0%, rgba(41, 35, 27, 0.28) 45%, rgba(8, 9, 9, 0.98) 85%)',
  },
  horizon: {
    id: 'horizon',
    src: '/videos/arrakis/07-horizon.mp4',
    posterGradient:
      'radial-gradient(circle at 70% 38%, rgba(233, 154, 69, 0.24) 0%, rgba(198, 154, 97, 0.09) 40%, rgba(8, 9, 9, 0.96) 82%)',
  },
};

export function isValidWorldScene(value: string | null | undefined): value is WorldSceneId {
  if (!value) return false;
  return value in ARRAKIS_VIDEO_MAP;
}



// ============================================================================
// 4. AMBIENT AUDIO CONFIGURATION (AUTO-START & LOOP UNTIL STOPPED)
// ============================================================================

export interface ArrakisAudioConfig {
  title: string;
  artist: string;
  src: string;
  startTimeSeconds: number;
  formattedStartTime: string;
  autoPlayOnOpen: boolean;
  loop: boolean;
}

export const ARRAKIS_AUDIO_CONFIG: ArrakisAudioConfig = {
  title: "Paul's Dream",
  artist: 'Hans Zimmer',
  src: "/audio/Paul's%20Dream.mp3",
  startTimeSeconds: 286, // 4 minutes 46 seconds (4 * 60 + 46 = 286s)
  formattedStartTime: '04:46',
  autoPlayOnOpen: true,
  loop: true,
};

export function parseAudioTimeStringToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const trimmed = timeStr.trim();
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':').map((p) => parseFloat(p));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return Math.floor(parts[0] * 60 + parts[1]);
    }
  }
  if (trimmed.includes('.')) {
    const parts = trimmed.split('.').map((p) => parseFloat(p));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return Math.floor(parts[0] * 60 + parts[1]);
    }
  }
  const numeric = parseFloat(trimmed);
  return isNaN(numeric) ? 0 : Math.floor(numeric);
}

export function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateCircularProgressOffset(
  progress: number,
  radius: number = 19
): number {
  const clamped = clampProgress(progress);
  const circumference = 2 * Math.PI * radius;
  return circumference * (1 - clamped);
}

export interface MouseParallaxLayerOffsets {
  background: { x: number; y: number };
  particles: { x: number; y: number };
  heroHeading: { x: number; y: number };
  decorative: { x: number; y: number };
}

/**
 * Computes restrained mouse-based parallax offsets matching specification:
 * - Background: 4–6px maximum (5px default)
 * - Foreground particle layer: 8–12px maximum (10px default)
 * - Hero heading: 2–3px maximum (2.5px default)
 * - Decorative elements: 5–8px maximum (6.5px default)
 */
export function computeMouseParallaxOffsets(
  normX: number,
  normY: number,
  reducedMotion: boolean = false
): MouseParallaxLayerOffsets {
  if (reducedMotion) {
    return {
      background: { x: 0, y: 0 },
      particles: { x: 0, y: 0 },
      heroHeading: { x: 0, y: 0 },
      decorative: { x: 0, y: 0 },
    };
  }

  const clampedX = Math.max(-1, Math.min(1, Number.isNaN(normX) ? 0 : normX));
  const clampedY = Math.max(-1, Math.min(1, Number.isNaN(normY) ? 0 : normY));

  // Background and particles retain subtle spatial depth; text remains rock-solid without jiggle
  return {
    background: {
      x: Number((clampedX * 5).toFixed(2)),
      y: Number((clampedY * 5).toFixed(2)),
    },
    particles: {
      x: Number((clampedX * 10).toFixed(2)),
      y: Number((clampedY * 10).toFixed(2)),
    },
    heroHeading: {
      x: 0,
      y: 0,
    },
    decorative: {
      x: 0,
      y: 0,
    },
  };
}

/**
 * Subtly scales the video background from 1 to 1.08 during chapter transitions.
 */
export function computeBackgroundZoomScale(
  chapterProgress: number,
  reducedMotion: boolean = false
): number {
  if (reducedMotion) return 1;
  const clamped = clampProgress(chapterProgress);
  return Number((1 + clamped * 0.08).toFixed(4));
}

/**
 * Computes subtle magnetic hover offset for CTAs.
 */
export function computeMagneticOffset(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxOffsetPx: number = 6,
  reducedMotion: boolean = false
): { x: number; y: number } {
  if (reducedMotion || rect.width <= 0 || rect.height <= 0) {
    return { x: 0, y: 0 };
  }
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const normX = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2)));
  const normY = Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height / 2)));

  return {
    x: Number((normX * maxOffsetPx).toFixed(2)),
    y: Number((normY * maxOffsetPx).toFixed(2)),
  };
}

export interface PointerSandConfig {
  maxParticles: number;
  minLifespanMs: number;
  maxLifespanMs: number;
  paletteHex: readonly string[];
}

export const POINTER_SAND_CONFIG: PointerSandConfig = {
  maxParticles: 24, // Within 15-30 active particles budget
  minLifespanMs: 600,
  maxLifespanMs: 1200,
  paletteHex: ['#FDE2A6', '#E99A45', '#D4A86A', '#C69A61'],
};

/**
 * The sand-moving desert dunes video ('desert' -> '/videos/arrakis/02-desert.mp4')
 * used consistently across Case Study and Get In Touch pages.
 */
export const SANDMOVING_SCENE_ID: WorldSceneId = 'desert';

export function resolvePageSceneVideo(
  pageType: 'home' | 'casestudy' | 'getintouch',
  requestedScene?: WorldSceneId
): SceneVideoConfig {
  if (pageType === 'casestudy' || pageType === 'getintouch') {
    return ARRAKIS_VIDEO_MAP[SANDMOVING_SCENE_ID];
  }
  const key = requestedScene && isValidWorldScene(requestedScene) ? requestedScene : 'arrival';
  return ARRAKIS_VIDEO_MAP[key];
}

export const CASE_STUDY_CHAPTER_RANGES: ChapterRange[] = [
  { id: 'cs-intro', navId: 'work', sceneId: 'desert', number: '1', label: 'Overview', sublabel: '01 · OVERVIEW', start: 0.0, end: 0.16 },
  { id: 'cs-challenge', navId: 'work', sceneId: 'desert', number: '2', label: 'The Problem', sublabel: '02 · THE CHALLENGE', start: 0.16, end: 0.30 },
  { id: 'cs-approach', navId: 'work', sceneId: 'desert', number: '3', label: 'The Approach', sublabel: '03 · THE APPROACH', start: 0.30, end: 0.44 },
  { id: 'cs-architecture', navId: 'work', sceneId: 'desert', number: '4', label: 'Architecture', sublabel: '04 · ARCHITECTURE', start: 0.44, end: 0.58 },
  { id: 'cs-features', navId: 'work', sceneId: 'desert', number: '5', label: 'Feature Showcase', sublabel: '05 · KEY FEATURES', start: 0.58, end: 0.74 },
  { id: 'cs-hard-part', navId: 'work', sceneId: 'desert', number: '6', label: 'The Hard Part', sublabel: '06 · CHALLENGES', start: 0.74, end: 0.88 },
  { id: 'cs-results', navId: 'work', sceneId: 'desert', number: '7', label: 'What Came to Life', sublabel: '07 · RESULTS', start: 0.88, end: 1.0 },
];

export const CONTACT_PAGE_CHAPTER_RANGES: ChapterRange[] = [
  { id: 'contact-hero', navId: 'contact', sceneId: 'desert', number: '7', label: 'Get in touch', sublabel: '07 · HORIZON', start: 0.0, end: 0.5 },
  { id: 'contact-channels', navId: 'contact', sceneId: 'desert', number: '7', label: 'Direct Transmission', sublabel: '07 · DIRECT CHANNELS', start: 0.5, end: 1.0 },
];



