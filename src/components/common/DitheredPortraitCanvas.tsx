import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isCoarsePointer, prefersReducedMotion } from '../../lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface DitheredPortraitCanvasProps {
  className?: string;
}

const STAGES: { until: number; label: string }[] = [
  { until: 0.2, label: 'STAGE 1: ORIGINAL COLOUR' },
  { until: 0.4, label: 'STAGE 2: DESATURATING' },
  { until: 0.62, label: 'STAGE 3: HALFTONE' },
  { until: 0.85, label: 'STAGE 4: 8x8 BAYER DITHER' },
  { until: 1.01, label: 'STAGE 5: EROSION DISSOLVE' },
];

const stageFor = (p: number) => (STAGES.find((s) => p < s.until) ?? STAGES[STAGES.length - 1]).label;

/**
 * Scroll-driven portrait: colour -> desaturation -> halftone dots -> 8x8 Bayer
 * dither -> erosion dissolve, all computed in a WebGL fragment shader.
 * Fully reversible (progress is a pure function of scroll position).
 *
 * Performance: rendering is demand-driven. Frames are drawn when scroll,
 * pointer or tap state changes, plus a throttled (~12fps) film-grain tick
 * while the portrait is visible. Once it has fully dissolved the loop stops.
 */
export const DitheredPortraitCanvas: React.FC<DitheredPortraitCanvasProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tapNotice, setTapNotice] = useState(false);
  const [currentStage, setCurrentStage] = useState(STAGES[0].label);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const reduced = prefersReducedMotion();
    const coarse = isCoarsePointer();
    const maxPixelRatio = coarse ? 1.25 : 1.75;
    const getPixelRatio = () => Math.min(window.devicePixelRatio || 1, maxPixelRatio);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(getPixelRatio());
    renderer.setSize(container.clientWidth, container.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let disposed = false;
    const textureLoader = new THREE.TextureLoader();
    const portraitTexture = textureLoader.load('/diptanu-portrait.png', (tex) => {
      if (disposed) return;
      portraitTexture.minFilter = THREE.LinearFilter;
      portraitTexture.magFilter = THREE.LinearFilter;
      portraitTexture.generateMipmaps = false;
      if (tex.image && tex.image.width && tex.image.height) {
        uniforms.uImageResolution.value.set(tex.image.width, tex.image.height);
      }
      invalidate();
    });

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform float uScrollProgress;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      uniform vec2 uMouse;
      uniform vec2 uPointer;
      uniform float uPointerEnergy;
      uniform float uTime;
      uniform float uTapReveal;
      uniform float uIsMobile;
      uniform float uPixelRatio;

      varying vec2 vUv;

      // 8x8 Bayer Ordered Dithering Matrix (normalized to 0.0 - 1.0)
      float getBayer8(vec2 p) {
        int x = int(mod(p.x, 8.0));
        int y = int(mod(p.y, 8.0));
        int idx = y * 8 + x;

        if (idx == 0) return 0.0 / 64.0;
        if (idx == 1) return 32.0 / 64.0;
        if (idx == 2) return 8.0 / 64.0;
        if (idx == 3) return 40.0 / 64.0;
        if (idx == 4) return 2.0 / 64.0;
        if (idx == 5) return 34.0 / 64.0;
        if (idx == 6) return 10.0 / 64.0;
        if (idx == 7) return 42.0 / 64.0;

        if (idx == 8) return 48.0 / 64.0;
        if (idx == 9) return 16.0 / 64.0;
        if (idx == 10) return 56.0 / 64.0;
        if (idx == 11) return 24.0 / 64.0;
        if (idx == 12) return 50.0 / 64.0;
        if (idx == 13) return 18.0 / 64.0;
        if (idx == 14) return 58.0 / 64.0;
        if (idx == 15) return 26.0 / 64.0;

        if (idx == 16) return 12.0 / 64.0;
        if (idx == 17) return 44.0 / 64.0;
        if (idx == 18) return 4.0 / 64.0;
        if (idx == 19) return 36.0 / 64.0;
        if (idx == 20) return 14.0 / 64.0;
        if (idx == 21) return 46.0 / 64.0;
        if (idx == 22) return 6.0 / 64.0;
        if (idx == 23) return 38.0 / 64.0;

        if (idx == 24) return 60.0 / 64.0;
        if (idx == 25) return 28.0 / 64.0;
        if (idx == 26) return 52.0 / 64.0;
        if (idx == 27) return 20.0 / 64.0;
        if (idx == 28) return 62.0 / 64.0;
        if (idx == 29) return 30.0 / 64.0;
        if (idx == 30) return 54.0 / 64.0;
        if (idx == 31) return 22.0 / 64.0;

        if (idx == 32) return 3.0 / 64.0;
        if (idx == 33) return 35.0 / 64.0;
        if (idx == 34) return 11.0 / 64.0;
        if (idx == 35) return 43.0 / 64.0;
        if (idx == 36) return 1.0 / 64.0;
        if (idx == 37) return 33.0 / 64.0;
        if (idx == 38) return 9.0 / 64.0;
        if (idx == 39) return 41.0 / 64.0;

        if (idx == 40) return 51.0 / 64.0;
        if (idx == 41) return 19.0 / 64.0;
        if (idx == 42) return 59.0 / 64.0;
        if (idx == 43) return 27.0 / 64.0;
        if (idx == 44) return 49.0 / 64.0;
        if (idx == 45) return 17.0 / 64.0;
        if (idx == 46) return 57.0 / 64.0;
        if (idx == 47) return 25.0 / 64.0;

        if (idx == 48) return 15.0 / 64.0;
        if (idx == 49) return 47.0 / 64.0;
        if (idx == 50) return 7.0 / 64.0;
        if (idx == 51) return 39.0 / 64.0;
        if (idx == 52) return 13.0 / 64.0;
        if (idx == 53) return 45.0 / 64.0;
        if (idx == 54) return 5.0 / 64.0;
        if (idx == 55) return 37.0 / 64.0;

        if (idx == 56) return 63.0 / 64.0;
        if (idx == 57) return 31.0 / 64.0;
        if (idx == 58) return 55.0 / 64.0;
        if (idx == 59) return 23.0 / 64.0;
        if (idx == 60) return 61.0 / 64.0;
        if (idx == 61) return 29.0 / 64.0;
        if (idx == 62) return 53.0 / 64.0;
        return 21.0 / 64.0;
      }

      // Rotated (45 deg) halftone screen. Returns 1.0 inside an ink dot.
      float halftoneInk(vec2 fragPx, float lum, float cell) {
        float ang = 0.785398;
        mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
        vec2 g = (rot * fragPx) / cell;
        float d = length(fract(g) - 0.5);
        float r = sqrt(clamp(1.0 - lum, 0.0, 1.0)) * 0.74;
        return 1.0 - smoothstep(r - 0.1, r + 0.1, d);
      }

      void main() {
        // Cover-fit UV
        float imgAspect = uImageResolution.x / uImageResolution.y;
        float screenAspect = uResolution.x / uResolution.y;

        vec2 scale = vec2(1.0);
        vec2 offset = vec2(0.0);

        if (screenAspect > imgAspect) {
          scale = vec2(1.0, screenAspect / imgAspect);
          offset.y = (1.0 - scale.y) * 0.5;
        } else {
          scale = vec2(imgAspect / screenAspect, 1.0);
          float xAnchor = mix(0.75, 0.5, uIsMobile);
          offset.x = (1.0 - scale.x) * xAnchor;
        }

        vec2 uv = (vUv - offset) / scale;

        // Broad pointer parallax tilt
        uv += uMouse * 0.015 * (1.0 - uScrollProgress * 0.6);

        // Local pixel displacement around the pointer (soft lens ripple)
        vec2 toPointer = vUv - uPointer;
        float falloff = exp(-dot(toPointer, toPointer) * 38.0);
        uv += toPointer * falloff * 0.035 * uPointerEnergy;

        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          discard;
        }

        // Effective progress with tap-to-reveal (snaps back toward the original)
        float p = clamp(uScrollProgress * (1.0 - uTapReveal * 0.95), 0.0, 1.0);

        vec4 originalColor = texture2D(uTexture, uv);
        float luma = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));

        float contrastLuma = smoothstep(0.03, 0.97, luma);
        contrastLuma = pow(contrastLuma, 0.92);

        // Film grain (time is stepped on the CPU, ~12fps)
        float grain = (fract(sin(dot(gl_FragCoord.xy + uTime * 6.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.05;
        float noisyLuma = clamp(contrastLuma + grain, 0.0, 1.0);

        // STAGE 1 -> 2: original colour gradually desaturates
        float desat = smoothstep(0.02, 0.30, p);
        vec3 colourStage = mix(originalColor.rgb, vec3(contrastLuma), desat);

        // STAGE 3: halftone dots (cell sizes are in CSS pixels)
        float cellHT = mix(5.0, 7.0, smoothstep(0.2, 0.5, p)) * uPixelRatio;
        float htTone = 1.0 - halftoneInk(gl_FragCoord.xy, noisyLuma, cellHT);

        // STAGE 4: 8x8 Bayer dither
        float ditherScale = mix(2.2, 3.2, smoothstep(0.45, 0.75, p)) * uPixelRatio;
        float bayerThreshold = getBayer8(floor(gl_FragCoord.xy / ditherScale));
        float bayerTone = step(bayerThreshold, noisyLuma);

        float htBlend = smoothstep(0.22, 0.44, p) * (1.0 - smoothstep(0.50, 0.68, p));
        float ditherBlend = smoothstep(0.46, 0.72, p);

        float tone = noisyLuma;
        tone = mix(tone, htTone, htBlend);
        tone = mix(tone, bayerTone, ditherBlend);

        // Obsidian + warm print highlights for the monochrome stages
        vec3 darkTone = vec3(0.04, 0.04, 0.05);
        vec3 lightTone = mix(vec3(0.96, 0.96, 0.98), vec3(1.0, 0.92, 0.75), 0.12);
        vec3 monoColor = mix(darkTone, lightTone, tone);

        float monoEngage = smoothstep(0.16, 0.5, p);
        vec3 finalColor = mix(colourStage, monoColor, monoEngage);

        // STAGE 5: erosion dissolve into the page
        float erosionProgress = smoothstep(0.76, 1.0, p);
        float dissolveMask = step(erosionProgress, noisyLuma * (1.2 - bayerThreshold * 0.4));

        float leftShadow = smoothstep(0.0, 0.65, vUv.x);
        float bottomShadow = smoothstep(0.0, 0.28, vUv.y);
        float topShadow = smoothstep(1.0, 0.88, vUv.y);
        float edgeFade = leftShadow * bottomShadow * topShadow;

        float alpha = (1.0 - erosionProgress * 0.9) * dissolveMask * edgeFade;
        alpha *= mix(0.88, 0.95, ditherBlend);
        // Guarantee the portrait is completely gone at the end of its range
        alpha *= 1.0 - smoothstep(0.93, 1.0, p);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const uniforms = {
      uTexture: { value: portraitTexture },
      uScrollProgress: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uImageResolution: { value: new THREE.Vector2(768, 1024) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerEnergy: { value: 0.0 },
      uTime: { value: 0 },
      uTapReveal: { value: 0.0 },
      uIsMobile: { value: window.innerWidth < 768 ? 1.0 : 0.0 },
      uPixelRatio: { value: getPixelRatio() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ---- Demand-driven render loop --------------------------------------
    let raf = 0;
    let dirty = true;
    let lastGrain = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let lastStage = STAGES[0].label;

    const frame = (now: number) => {
      raf = 0;
      const progress = uniforms.uScrollProgress.value;
      const visible = progress < 0.985;

      // Smooth pointer follow
      const dx = targetMouseX - currentMouseX;
      const dy = targetMouseY - currentMouseY;
      const moving = Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008;
      if (moving) {
        currentMouseX += dx * 0.06;
        currentMouseY += dy * 0.06;
        uniforms.uMouse.value.set(currentMouseX, currentMouseY);
        dirty = true;
      }

      // Pointer ripple energy decays when the pointer stops
      if (uniforms.uPointerEnergy.value > 0.002) {
        uniforms.uPointerEnergy.value *= 0.92;
        dirty = true;
      } else if (uniforms.uPointerEnergy.value !== 0) {
        uniforms.uPointerEnergy.value = 0;
        dirty = true;
      }

      // Tap-reveal decay
      let tapping = false;
      if (uniforms.uTapReveal.value > 0.002) {
        uniforms.uTapReveal.value *= 0.93;
        tapping = true;
        dirty = true;
      } else if (uniforms.uTapReveal.value !== 0) {
        uniforms.uTapReveal.value = 0;
        dirty = true;
      }

      // Throttled grain tick (skipped for reduced motion)
      if (visible && !reduced && now - lastGrain > 83) {
        uniforms.uTime.value = now / 1000;
        lastGrain = now;
        dirty = true;
      }

      if (dirty) {
        renderer.render(scene, camera);
        dirty = false;
      }

      const energetic = uniforms.uPointerEnergy.value > 0.002;
      if ((visible && !reduced) || moving || tapping || energetic) {
        raf = requestAnimationFrame(frame);
      }
    };

    function invalidate() {
      dirty = true;
      if (!raf && !disposed) raf = requestAnimationFrame(frame);
    }

    // ---- Input -----------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetMouseX = (x - 0.5) * 2.0;
      targetMouseY = (0.5 - y) * 2.0;
      uniforms.uPointer.value.set(x, 1.0 - y);
      uniforms.uPointerEnergy.value = Math.min(1, uniforms.uPointerEnergy.value + 0.2);
      invalidate();
    };

    if (!coarse && !reduced) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    const handlePointerDown = () => {
      uniforms.uTapReveal.value = 1.0;
      setTapNotice(true);
      window.setTimeout(() => setTapNotice(false), 1200);
      invalidate();
    };
    canvas.addEventListener('pointerdown', handlePointerDown);

    // ---- Scroll binding --------------------------------------------------
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: '#home',
      start: 'top top',
      end: 'bottom+=800 top',
      scrub: 0.6,
      onUpdate: (self) => {
        uniforms.uScrollProgress.value = self.progress;

        // Hand the canvas back to the page once it has dissolved
        const live = self.progress < 0.9;
        canvas.style.pointerEvents = live ? 'auto' : 'none';

        const stage = stageFor(self.progress);
        if (stage !== lastStage) {
          lastStage = stage;
          setCurrentStage(stage);
        }
        invalidate();
      },
    });

    // ---- Resize ----------------------------------------------------------
    let lastW = container.clientWidth;
    let lastH = container.clientHeight;
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      // Ignore mobile URL-bar height jitter
      if (width === lastW && Math.abs(height - lastH) < 120) return;
      lastW = width;
      lastH = height;
      renderer.setPixelRatio(getPixelRatio());
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
      uniforms.uIsMobile.value = window.innerWidth < 768 ? 1.0 : 0.0;
      uniforms.uPixelRatio.value = getPixelRatio();
      invalidate();
    };
    window.addEventListener('resize', handleResize);

    invalidate();

    return () => {
      disposed = true;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      if (raf) cancelAnimationFrame(raf);
      scrollTriggerInstance.kill();
      geometry.dispose();
      material.dispose();
      portraitTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        data-cursor-label="REVEAL"
        className="w-full h-full block pointer-events-auto cursor-pointer"
        title="Tap or click to reveal the original colour photograph"
      />

      {/* Editorial Watermark & Live Stage Indicator */}
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-10 pointer-events-none flex flex-col items-end text-right">
        <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">
          ARCHIVE // 2026.DG
        </span>
        <span className="text-[9px] font-mono text-amber-400/80 tracking-wider mt-0.5">
          22°57'N 88°25'E • NAIHATI
        </span>
        <span className="text-[9px] font-mono text-white/40 tracking-widest mt-1 uppercase border border-white/10 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
          {currentStage}
        </span>
        {tapNotice && (
          <span className="text-[10px] font-mono text-emerald-400 animate-fadeIn mt-1 font-bold">
            ORIGINAL CAPTURE REVEALED
          </span>
        )}
      </div>
    </div>
  );
};
