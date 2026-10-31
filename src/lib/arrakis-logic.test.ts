import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getActiveChapter,
  getActiveNavId,
  validateContactForm,
  CHAPTER_RANGES,
} from './arrakis-logic';

test('getActiveChapter maps scroll progress ranges accurately across the 7 video-title chapters', () => {
  assert.equal(getActiveChapter(0.0).id, 'home');
  assert.equal(getActiveChapter(0.10).label, 'Arrival');
  assert.equal(getActiveChapter(0.20).id, 'about');
  assert.equal(getActiveChapter(0.20).label, 'Desert');
  assert.equal(getActiveChapter(0.35).id, 'awakening');
  assert.equal(getActiveChapter(0.35).label, 'Awakening');
  assert.equal(getActiveChapter(0.50).id, 'capabilities');
  assert.equal(getActiveChapter(0.50).label, 'Architecture');
  assert.equal(getActiveChapter(0.65).id, 'work');
  assert.equal(getActiveChapter(0.65).label, 'Artifacts');
  assert.equal(getActiveChapter(0.80).id, 'process');
  assert.equal(getActiveChapter(0.80).label, 'Method');
  assert.equal(getActiveChapter(0.95).id, 'contact');
  assert.equal(getActiveChapter(0.95).label, 'Horizon');
  assert.equal(CHAPTER_RANGES.length, 7);
});

test('getActiveNavId maps accurately to the 7 video-title chapters', () => {
  assert.equal(getActiveNavId(0.05), 'home');
  assert.equal(getActiveNavId(0.20), 'about');
  assert.equal(getActiveNavId(0.35), 'awakening');
  assert.equal(getActiveNavId(0.50), 'capabilities');
  assert.equal(getActiveNavId(0.65), 'work');
  assert.equal(getActiveNavId(0.80), 'process');
  assert.equal(getActiveNavId(0.95), 'contact');
});

test('PRIMARY_NAV_ITEMS contains Arrival, Desert, Awakening, Architecture, Artifacts, Method, Horizon', () => {
  const { PRIMARY_NAV_ITEMS } = require('./arrakis-logic');
  assert.equal(PRIMARY_NAV_ITEMS.length, 7);
  assert.deepEqual(
    PRIMARY_NAV_ITEMS.map((item: any) => item.label),
    ['Arrival', 'Desert', 'Awakening', 'Architecture', 'Artifacts', 'Method', 'Horizon']
  );
  assert.equal(PRIMARY_NAV_ITEMS[0].targetSectionId, 'home');
  assert.equal(PRIMARY_NAV_ITEMS[6].targetSectionId, 'contact');
});

test('validateContactForm enforces required fields and email format', () => {
  const emptyResult = validateContactForm({ name: '', email: '', subject: '', message: '' });
  assert.equal(emptyResult.valid, false);
  assert.ok(emptyResult.errors.name);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.subject);
  assert.ok(emptyResult.errors.message);

  const invalidEmail = validateContactForm({
    name: 'Souvik',
    email: 'invalid-email',
    subject: 'Project Inquiry',
    message: 'Hello there, let us build worlds.',
  });
  assert.equal(invalidEmail.valid, false);
  assert.ok(invalidEmail.errors.email);

  const validPayload = validateContactForm({
    name: 'Souvik Ghosh',
    email: 'souvik@example.com',
    subject: 'Collaboration',
    message: 'Let us build an interactive 3D experience together.',
  });
  assert.equal(validPayload.valid, true);
  assert.equal(Object.keys(validPayload.errors).length, 0);
});

test('ARRAKIS_VIDEO_MAP maps all 7 narrative chapters to their exact video paths', () => {
  const { ARRAKIS_VIDEO_MAP, isValidWorldScene } = require('./arrakis-logic');
  assert.equal(ARRAKIS_VIDEO_MAP.arrival.src, '/videos/arrakis/01-arrival.mp4');
  assert.equal(ARRAKIS_VIDEO_MAP.desert.src, '/videos/arrakis/02-desert.mp4');
  assert.equal(ARRAKIS_VIDEO_MAP.awakening.src, '/videos/arrakis/03-awakening.mp4');
  assert.equal(ARRAKIS_VIDEO_MAP.architecture.src, '/videos/arrakis/04-architecture.mp4');
  assert.equal(ARRAKIS_VIDEO_MAP.artifacts.src, '/videos/arrakis/05-artifacts.mp4');
  assert.equal(ARRAKIS_VIDEO_MAP.method.src, '/videos/arrakis/06-method.mp4');
  assert.equal(ARRAKIS_VIDEO_MAP.horizon.src, '/videos/arrakis/07-horizon.mp4');

  assert.equal(isValidWorldScene('arrival'), true);
  assert.equal(isValidWorldScene('horizon'), true);
  assert.equal(isValidWorldScene('unknown'), false);
});

test('ARRAKIS_AUDIO_CONFIG points to Pauls Dream starting at 4:46 min (286 seconds) with autoPlayOnOpen and loop', () => {
  const {
    ARRAKIS_AUDIO_CONFIG,
    parseAudioTimeStringToSeconds,
    formatAudioTime,
  } = require('./arrakis-logic');

  assert.equal(ARRAKIS_AUDIO_CONFIG.title, "Paul's Dream");
  assert.equal(ARRAKIS_AUDIO_CONFIG.startTimeSeconds, 286);
  assert.equal(ARRAKIS_AUDIO_CONFIG.formattedStartTime, '04:46');
  assert.equal(ARRAKIS_AUDIO_CONFIG.autoPlayOnOpen, true);
  assert.equal(ARRAKIS_AUDIO_CONFIG.loop, true);
  assert.equal(parseAudioTimeStringToSeconds('4.46'), 286);
  assert.equal(parseAudioTimeStringToSeconds('4:46'), 286);
  assert.equal(parseAudioTimeStringToSeconds('04:46'), 286);
  assert.equal(parseAudioTimeStringToSeconds('286'), 286);
  assert.equal(formatAudioTime(286), '04:46');
});

test('calculateCircularProgressOffset computes stroke-dashoffset accurately based on radius and progress', () => {
  const { calculateCircularProgressOffset } = require('./arrakis-logic');
  const circumference = 2 * Math.PI * 19;

  // At 0% progress, offset equals full circumference (0% filled)
  assert.equal(calculateCircularProgressOffset(0, 19), circumference);

  // At 50% progress, offset equals half circumference
  assert.ok(Math.abs(calculateCircularProgressOffset(0.5, 19) - circumference * 0.5) < 0.001);

  // At 100% progress, offset equals 0 (100% filled)
  assert.equal(calculateCircularProgressOffset(1, 19), 0);

  // Clamped bounds
  assert.equal(calculateCircularProgressOffset(-0.2, 19), circumference);
  assert.equal(calculateCircularProgressOffset(1.5, 19), 0);
});

test('computeMouseParallaxOffsets keeps text rock-solid with zero jiggle and bounds spatial layers', () => {
  const { computeMouseParallaxOffsets } = require('./arrakis-logic');

  const maxRight = computeMouseParallaxOffsets(1, -1, false);
  // Background: 4-6px max (5px)
  assert.equal(maxRight.background.x, 5);
  assert.equal(maxRight.background.y, -5);
  // Particles: 8-12px max (10px)
  assert.equal(maxRight.particles.x, 10);
  assert.equal(maxRight.particles.y, -10);
  // Hero heading and decorative text: 0px (zero jiggle/wobble)
  assert.equal(maxRight.heroHeading.x, 0);
  assert.equal(maxRight.heroHeading.y, 0);
  assert.equal(maxRight.decorative.x, 0);
  assert.equal(maxRight.decorative.y, 0);

  // Reduced motion zeroes all offsets
  const reduced = computeMouseParallaxOffsets(1, 1, true);
  assert.equal(reduced.background.x, 0);
  assert.equal(reduced.particles.x, 0);
  assert.equal(reduced.heroHeading.x, 0);
  assert.equal(reduced.decorative.x, 0);
});

test('PROJECTS_DATA features Sweve with exact GitHub repository and case study route', () => {
  const { PROJECTS_DATA, getProjectBySlug } = require('../data/projects');
  const sweve = PROJECTS_DATA[0];
  assert.equal(sweve.slug, 'sweve');
  assert.equal(sweve.title, 'Sweve');
  assert.equal(sweve.githubUrl, 'https://github.com/23f3003249/sweve-frontend');
  assert.equal(sweve.caseStudyRoute, '/work/sweve');

  // getProjectBySlug resolves sweve and handles connectville redirect gracefully
  assert.equal(getProjectBySlug('sweve')?.title, 'Sweve');
  assert.equal(getProjectBySlug('connectville')?.title, 'Sweve');
});

test('PROFILE_DATA includes verified email, Medium link, and 2026 copyright year', () => {
  const { PROFILE_DATA } = require('../data/profile');
  assert.equal(PROFILE_DATA.contact.email, 'souvikghosh6392@gmail.com');
  assert.equal(PROFILE_DATA.contact.medium, 'https://medium.com/@souvikghosh6392');
  assert.equal(PROFILE_DATA.copyrightYear, 2026);
});

test('computeBackgroundZoomScale scales from 1 to 1.08 and respects reduced motion', () => {
  const { computeBackgroundZoomScale } = require('./arrakis-logic');
  assert.equal(computeBackgroundZoomScale(0, false), 1);
  assert.equal(computeBackgroundZoomScale(0.5, false), 1.04);
  assert.equal(computeBackgroundZoomScale(1, false), 1.08);
  assert.equal(computeBackgroundZoomScale(1, true), 1);
});

test('computeMagneticOffset calculates bounded CTA offset and POINTER_SAND_CONFIG matches constraints', () => {
  const { computeMagneticOffset, POINTER_SAND_CONFIG } = require('./arrakis-logic');
  const rect = { left: 100, top: 100, width: 200, height: 60 };
  // Center is (200, 130)
  const centered = computeMagneticOffset(200, 130, rect, 6, false);
  assert.equal(centered.x, 0);
  assert.equal(centered.y, 0);

  const rightEdge = computeMagneticOffset(300, 160, rect, 6, false);
  assert.equal(rightEdge.x, 6);
  assert.equal(rightEdge.y, 6);

  assert.ok(POINTER_SAND_CONFIG.maxParticles >= 15 && POINTER_SAND_CONFIG.maxParticles <= 30);
  assert.equal(POINTER_SAND_CONFIG.minLifespanMs, 600);
  assert.equal(POINTER_SAND_CONFIG.maxLifespanMs, 1200);
});

test('resolvePageSceneVideo uses sandmoving video (/videos/arrakis/02-desert.mp4) for casestudy and getintouch pages', () => {
  const {
    SANDMOVING_SCENE_ID,
    resolvePageSceneVideo,
    CASE_STUDY_CHAPTER_RANGES,
    CONTACT_PAGE_CHAPTER_RANGES,
  } = require('./arrakis-logic');

  assert.equal(SANDMOVING_SCENE_ID, 'desert');

  const caseStudyVideo = resolvePageSceneVideo('casestudy');
  assert.equal(caseStudyVideo.id, 'desert');
  assert.equal(caseStudyVideo.src, '/videos/arrakis/02-desert.mp4');

  const getInTouchVideo = resolvePageSceneVideo('getintouch');
  assert.equal(getInTouchVideo.id, 'desert');
  assert.equal(getInTouchVideo.src, '/videos/arrakis/02-desert.mp4');

  const homeVideo = resolvePageSceneVideo('home', 'arrival');
  assert.equal(homeVideo.id, 'arrival');
  assert.equal(homeVideo.src, '/videos/arrakis/01-arrival.mp4');

  assert.equal(CASE_STUDY_CHAPTER_RANGES.length, 7);
  assert.equal(CASE_STUDY_CHAPTER_RANGES[0].id, 'cs-intro');
  assert.equal(CONTACT_PAGE_CHAPTER_RANGES.length, 2);
  assert.equal(CONTACT_PAGE_CHAPTER_RANGES[0].label, 'Get in touch');
});



