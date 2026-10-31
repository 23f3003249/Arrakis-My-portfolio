'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { POINTER_SAND_CONFIG } from '@/src/lib/arrakis-logic';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';

const VERTEX_SHADER = `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  attribute float aRotation;
  attribute float aSeed;

  varying float vAlpha;
  varying vec3 vColor;
  varying float vRotation;
  varying float vSeed;

  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vRotation = aRotation;
    vSeed = aSeed;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize;
  }
`;

const FRAGMENT_SHADER = `
  varying float vAlpha;
  varying vec3 vColor;
  varying float vRotation;
  varying float vSeed;

  void main() {
    if (vAlpha <= 0.005) discard;

    // Center UV in [-0.5, 0.5] and rotate per grain
    vec2 uv = gl_PointCoord - vec2(0.5);
    float c = cos(vRotation);
    float s = sin(vRotation);
    vec2 rotUv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);

    // Irregular faceted sand grain silhouette (anisotropic diamond/polygon)
    float aspect = mix(0.68, 1.35, fract(vSeed * 7.13));
    vec2 grainUv = vec2(rotUv.x * aspect, rotUv.y);
    float angle = atan(grainUv.y, grainUv.x);
    float facetPerturb = 1.0 + 0.22 * cos(angle * 3.0 + vSeed * 6.28) + 0.14 * sin(angle * 5.0 - vSeed * 3.14);
    float dist = length(grainUv) * facetPerturb;

    if (dist > 0.46) discard;

    // Subtle specular glitter highlight on sand facets
    float glitter = 1.0 + 0.32 * sin(vRotation * 2.5 + vSeed * 6.28);
    float edgeAlpha = smoothstep(0.46, 0.12, dist);
    gl_FragColor = vec4(vColor * glitter, min(1.0, vAlpha * edgeAlpha));
  }
`;

interface SandGrainState {
  alive: boolean;
  ageMs: number;
  lifespanMs: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  rotation: number;
  vRot: number;
  seed: number;
  r: number;
  g: number;
  b: number;
}

export default function PointerSandParticles() {
  const reducedMotion = useReducedMotion();
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) return;

    // Disable on coarse touch devices
    const isCoarsePointer = window.matchMedia
      ? window.matchMedia('(pointer: coarse)').matches
      : false;
    if (isCoarsePointer) return;

    const mountEl = canvasMountRef.current;
    const windowEl = containerRef.current;
    if (!mountEl || !windowEl) return;

    // Detect software WebGL per threejs skill guidelines
    let isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const gl =
        probeCanvas.getContext('webgl2') ||
        probeCanvas.getContext('webgl') ||
        probeCanvas.getContext('experimental-webgl');
      if (!gl) return;
      const glCtx = gl as WebGLRenderingContext;
      const ext = glCtx.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : glCtx.RENDERER;
      const gpu = String(glCtx.getParameter(param));
      glCtx.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const pixelRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const initialRect = windowEl.getBoundingClientRect();
    let width = Math.max(1, initialRect.width || window.innerWidth);
    let height = Math.max(1, initialRect.height || window.innerHeight);
    renderer.setSize(width, height);

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Pixel-space orthographic camera centered at (0, 0)
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      10
    );
    camera.position.z = 5;

    const maxParticles = POINTER_SAND_CONFIG.maxParticles; // 24 particles
    const paletteColors = POINTER_SAND_CONFIG.paletteHex.map((hex) => new THREE.Color(hex));

    const positions = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const alphas = new Float32Array(maxParticles);
    const colors = new Float32Array(maxParticles * 3);
    const rotations = new Float32Array(maxParticles);
    const seeds = new Float32Array(maxParticles);

    const grains: SandGrainState[] = Array.from({ length: maxParticles }, (_, i) => {
      const c = paletteColors[i % paletteColors.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      seeds[i] = ((i + 1) * 0.61803398875) % 1;
      return {
        alive: false,
        ageMs: 0,
        lifespanMs: 900,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        baseSize: 3.5,
        rotation: 0,
        vRot: 0,
        seed: seeds[i],
        r: c.r,
        g: c.g,
        b: c.b,
      };
    });

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    const sizeAttr = new THREE.BufferAttribute(sizes, 1);
    const alphaAttr = new THREE.BufferAttribute(alphas, 1);
    const colorAttr = new THREE.BufferAttribute(colors, 3);
    const rotAttr = new THREE.BufferAttribute(rotations, 1);
    const seedAttr = new THREE.BufferAttribute(seeds, 1);

    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('aSize', sizeAttr);
    geometry.setAttribute('aAlpha', alphaAttr);
    geometry.setAttribute('aColor', colorAttr);
    geometry.setAttribute('aRotation', rotAttr);
    geometry.setAttribute('aSeed', seedAttr);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let spawnCursor = 0;
    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;
    let lastSpawnTime = 0;
    let isLoopRunning = false;
    let frameId = 0;
    let lastFrameTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    const tick = () => {
      const now = performance.now();
      const dtMs = Math.min(now - lastFrameTime, 64);
      lastFrameTime = now;
      const dtSec = dtMs / 1000;

      let activeCount = 0;

      for (let i = 0; i < maxParticles; i++) {
        const g = grains[i];
        if (!g.alive) {
          alphas[i] = 0;
          sizes[i] = 0;
          continue;
        }

        g.ageMs += dtMs;
        if (g.ageMs >= g.lifespanMs) {
          g.alive = false;
          alphas[i] = 0;
          sizes[i] = 0;
          continue;
        }

        activeCount++;
        const progress = g.ageMs / g.lifespanMs;

        // Natural drift with slight desert breeze and air resistance
        g.vx *= Math.pow(0.92, dtSec * 60);
        g.vy *= Math.pow(0.92, dtSec * 60);
        g.vy -= 8.5 * dtSec; // Gentle gravity/settling
        g.x += g.vx * dtSec + Math.sin(now * 0.004 + g.seed * 12.0) * 6.0 * dtSec;
        g.y += g.vy * dtSec;
        g.rotation += g.vRot * dtSec;

        // Smooth fade-in and gradual fade-out in opacity and scale
        const fadeIn = Math.min(1, progress / 0.18);
        const fadeOut = 1 - Math.pow(progress, 1.45);
        const envelope = Math.max(0, fadeIn * fadeOut);

        positions[i * 3] = g.x;
        positions[i * 3 + 1] = g.y;
        positions[i * 3 + 2] = 0;

        sizes[i] = g.baseSize * (0.55 + 0.45 * envelope) * pixelRatio;
        alphas[i] = 0.82 * envelope;
        rotations[i] = g.rotation;
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
      rotAttr.needsUpdate = true;

      renderer.render(scene, camera);

      if (activeCount > 0) {
        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      } else {
        isLoopRunning = false;
      }
    };

    const startLoopIfNeeded = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        lastFrameTime = performance.now();
        frameId = requestAnimationFrame(tick);
      }
    };

    const spawnGrain = (localX: number, localY: number, dx: number, dy: number) => {
      const g = grains[spawnCursor];
      spawnCursor = (spawnCursor + 1) % maxParticles;

      const jitterX = (Math.random() - 0.5) * 14;
      const jitterY = (Math.random() - 0.5) * 14;

      g.alive = true;
      g.ageMs = 0;
      g.lifespanMs =
        POINTER_SAND_CONFIG.minLifespanMs +
        Math.random() *
          (POINTER_SAND_CONFIG.maxLifespanMs - POINTER_SAND_CONFIG.minLifespanMs);
      g.x = localX + jitterX;
      g.y = localY + jitterY;

      // Drift naturally following the pointer's direction with subtle organic spread
      const clampedDx = Math.max(-36, Math.min(36, dx));
      const clampedDy = Math.max(-36, Math.min(36, dy));
      g.vx = clampedDx * 1.45 + (Math.random() - 0.5) * 22;
      g.vy = clampedDy * 1.45 + (Math.random() - 0.5) * 22;

      g.baseSize = 3.2 + Math.random() * 3.0;
      g.rotation = Math.random() * Math.PI * 2;
      g.vRot = (Math.random() - 0.5) * 3.2;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      // Throttle emission slightly (~22ms) so 24 grains span the full 600-1200ms trail smoothly
      if (now - lastSpawnTime < 22) return;

      const rect = windowEl.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const localX = e.clientX - rect.left - rect.width / 2;
      const localY = -(e.clientY - rect.top - rect.height / 2);

      const dx = lastPointerX !== null ? localX - lastPointerX : 0;
      const dy = lastPointerY !== null ? localY - lastPointerY : 0;
      lastPointerX = localX;
      lastPointerY = localY;

      const speed = Math.hypot(dx, dy);
      if (speed < 1.2) return;

      lastSpawnTime = now;
      spawnGrain(localX, localY, dx, dy);
      if (speed > 18) {
        spawnGrain(localX - dx * 0.35, localY - dy * 0.35, dx * 0.85, dy * 0.85);
      }

      startLoopIfNeeded();
    };

    const handleResize = () => {
      const rect = windowEl.getBoundingClientRect();
      width = Math.max(1, rect.width || window.innerWidth);
      height = Math.max(1, rect.height || window.innerHeight);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <BoneyardSkeleton variant="hero">
      <div
        ref={containerRef}
        aria-hidden="true"
        data-testid="pointer-sand-particles"
        className="fixed top-2 sm:top-3.5 lg:top-4 left-2 sm:left-3.5 lg:left-4 right-2 sm:right-3.5 lg:right-4 bottom-10 sm:bottom-11 lg:bottom-12 rounded-[14px] sm:rounded-[16px] z-[5] pointer-events-none overflow-hidden"
      >
        <div
          ref={canvasMountRef}
          style={{
            transform:
              'translate3d(var(--parallax-particles-x, 0px), var(--parallax-particles-y, 0px), 0)',
          }}
          className="w-full h-full pointer-events-none will-change-transform"
        />
      </div>
    </BoneyardSkeleton>
  );
}
