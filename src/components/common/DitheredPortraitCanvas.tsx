import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DitheredPortraitCanvasProps {
  className?: string;
}

export const DitheredPortraitCanvas: React.FC<DitheredPortraitCanvasProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tapNotice, setTapNotice] = useState(false);
  const [currentStage, setCurrentStage] = useState('STAGE 1: CRISP TONAL');

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Renderer setup with high precision and max pixel ratio
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Scene & Orthographic Camera for pixel-perfect quad rendering
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Load authentic upscaled 2x portrait texture (1712 x 2048)
    const textureLoader = new THREE.TextureLoader();
    const portraitTexture = textureLoader.load('/diptanu-portrait.jpg', () => {
      portraitTexture.generateMipmaps = true;
      portraitTexture.minFilter = THREE.LinearMipmapLinearFilter;
      portraitTexture.magFilter = THREE.LinearFilter;
      portraitTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      renderFrame();
    });

    // GLSL Shaders
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
      uniform float uTime;
      uniform float uTapReveal;
      uniform float uIsMobile;

      varying vec2 vUv;

      // 8x8 Bayer Ordered Dithering Matrix
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

      void main() {
        // High-precision cover-fit UV coordinates
        float imgAspect = uImageResolution.x / uImageResolution.y;
        float screenAspect = uResolution.x / uResolution.y;

        vec2 scale = vec2(1.0);
        vec2 offset = vec2(0.0);

        if (screenAspect > imgAspect) {
          scale = vec2(1.0, screenAspect / imgAspect);
          offset.y = (1.0 - scale.y) * 0.5;
        } else {
          scale = vec2(imgAspect / screenAspect, 1.0);
          // Anchor towards the right on desktop (0.72) to allow left typography
          // Centered on mobile (0.50)
          float xAnchor = mix(0.72, 0.5, uIsMobile);
          offset.x = (1.0 - scale.x) * xAnchor;
        }

        vec2 uv = (vUv - offset) / scale;

        // Subtle pointer parallax tilt
        uv += uMouse * 0.012 * (1.0 - uScrollProgress * 0.6);

        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          discard;
        }

        // Effective progress with tap reveal decay
        float p = clamp(uScrollProgress * (1.0 - uTapReveal * 0.98), 0.0, 1.0);

        // High-fidelity texture sampling
        vec4 originalColor = texture2D(uTexture, uv);

        // Crisp perceptual luminance calculation
        float luma = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));

        // STAGE 1: Crystal-Clear, High-Contrast Original Tonal Photograph
        // Gently enhance blacks and highlights without washing out into grey haze
        float crispLuma = smoothstep(0.02, 0.98, luma);

        // STAGE 2: High Contrast Deep Monochrome (Scroll 0.25 -> 0.45)
        float deepMonoLuma = smoothstep(0.05, 0.95, pow(crispLuma, 1.05));

        // STAGE 3 & 4: Authentic 8x8 Bayer Ordered Halftone Dither Matrix (Scroll 0.45 -> 0.85)
        float ditherPixelSize = mix(2.0, 3.0, smoothstep(0.4, 0.75, p));
        vec2 ditherCoord = floor(gl_FragCoord.xy / ditherPixelSize);
        float bayerThreshold = getBayer8(ditherCoord);

        float ditherVal = step(bayerThreshold, deepMonoLuma);

        // Continuous state mixing
        vec3 colStage1 = originalColor.rgb;
        vec3 colStage2 = vec3(deepMonoLuma);
        vec3 colStage4 = mix(vec3(0.04, 0.04, 0.05), vec3(0.98, 0.98, 0.98), ditherVal);

        // Smooth transition between stages
        vec3 outputColor;
        if (p < 0.28) {
          float t = smoothstep(0.0, 0.28, p);
          outputColor = mix(colStage1, colStage2, t);
        } else if (p < 0.75) {
          float t = smoothstep(0.28, 0.75, p);
          outputColor = mix(colStage2, colStage4, t);
        } else {
          outputColor = colStage4;
        }

        // STAGE 5: Clean Spatial Dispersion Dissolve (Scroll 0.80 -> 1.0)
        float erosionProgress = smoothstep(0.78, 1.0, p);
        float dissolveMask = step(erosionProgress, deepMonoLuma * (1.25 - bayerThreshold * 0.4));

        // Sharp Edge Vignette:
        // Left fade only on the far left side where text sits
        float leftFade = smoothstep(0.0, 0.32, vUv.x);
        // Bottom fade only at the very bottom
        float bottomFade = smoothstep(0.0, 0.18, vUv.y);
        float edgeFade = leftFade * bottomFade;

        // Full solid opacity over the portrait, fading only at left and bottom borders
        float alpha = dissolveMask * edgeFade;

        gl_FragColor = vec4(outputColor, alpha);
      }
    `;

    const uniforms = {
      uTexture: { value: portraitTexture },
      uScrollProgress: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uImageResolution: { value: new THREE.Vector2(1712, 2048) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uTapReveal: { value: 0.0 },
      uIsMobile: { value: window.innerWidth < 768 ? 1.0 : 0.0 },
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

    // Mouse tracking with smooth lerp
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetMouseX = (x - 0.5) * 2.0;
      targetMouseY = (0.5 - y) * 2.0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Tap to reveal handler
    const handlePointerDown = () => {
      uniforms.uTapReveal.value = 1.0;
      setTapNotice(true);
      setTimeout(() => setTapNotice(false), 1200);
    };

    canvas.addEventListener('pointerdown', handlePointerDown);

    // GSAP ScrollTrigger to bind scroll progress
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: '#home',
      start: 'top top',
      end: 'bottom+=800 top',
      scrub: 0.5,
      onUpdate: (self) => {
        uniforms.uScrollProgress.value = self.progress;

        if (self.progress < 0.25) {
          setCurrentStage('STAGE 1: CRISP TONAL');
        } else if (self.progress < 0.48) {
          setCurrentStage('STAGE 2: MONOCHROME CONTRAST');
        } else if (self.progress < 0.72) {
          setCurrentStage('STAGE 3: HALFTONE DITHER');
        } else if (self.progress < 0.88) {
          setCurrentStage('STAGE 4: 8x8 BAYER MATRIX');
        } else {
          setCurrentStage('STAGE 5: EROSION DISSOLVE');
        }
      },
    });

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
      uniforms.uIsMobile.value = window.innerWidth < 768 ? 1.0 : 0.0;
    };

    window.addEventListener('resize', handleResize);

    // Animation render loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderFrame = () => {
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;
      uniforms.uMouse.value.set(currentMouseX, currentMouseY);

      uniforms.uTime.value = clock.getElapsedTime();

      // Smooth decay for tap reveal
      if (uniforms.uTapReveal.value > 0.002) {
        uniforms.uTapReveal.value *= 0.92;
      } else {
        uniforms.uTapReveal.value = 0.0;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
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
        title="Tap or click to reveal authentic original photograph"
      />

      {/* Editorial Watermark & Live Stage Indicator */}
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-10 pointer-events-none flex flex-col items-end text-right">
        <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">
          ARCHIVE // 2026.DG
        </span>
        <span className="text-[9px] font-mono text-amber-400/80 tracking-wider mt-0.5">
          22°57'N 88°25'E • NAIHATI
        </span>
        <span className="text-[9px] font-mono text-white/50 tracking-widest mt-1 uppercase border border-white/10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md">
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
