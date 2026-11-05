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
  const [currentStage, setCurrentStage] = useState('TONAL');

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Scene & Orthographic Camera for pixel-perfect quad rendering
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Load authentic portrait texture
    const textureLoader = new THREE.TextureLoader();
    const portraitTexture = textureLoader.load('/diptanu-portrait.png', (tex) => {
      portraitTexture.minFilter = THREE.LinearFilter;
      portraitTexture.magFilter = THREE.LinearFilter;
      portraitTexture.generateMipmaps = false;
      if (tex.image && tex.image.width && tex.image.height) {
        uniforms.uImageResolution.value.set(tex.image.width, tex.image.height);
      }
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

      void main() {
        // Calculate cover-fit UV coordinates
        float imgAspect = uImageResolution.x / uImageResolution.y;
        float screenAspect = uResolution.x / uResolution.y;

        vec2 scale = vec2(1.0);
        vec2 offset = vec2(0.0);

        if (screenAspect > imgAspect) {
          scale = vec2(1.0, screenAspect / imgAspect);
          offset.y = (1.0 - scale.y) * 0.5;
        } else {
          scale = vec2(imgAspect / screenAspect, 1.0);
          // Anchor slightly to the right on desktop (0.75) leaving left for text
          // Centered on mobile (0.50)
          float xAnchor = mix(0.75, 0.5, uIsMobile);
          offset.x = (1.0 - scale.x) * xAnchor;
        }

        vec2 uv = (vUv - offset) / scale;

        // Subtle pointer parallax tilt
        uv += uMouse * 0.015 * (1.0 - uScrollProgress * 0.6);

        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          discard;
        }

        // Effective progress with tap reveal decay
        float p = clamp(uScrollProgress * (1.0 - uTapReveal * 0.95), 0.0, 1.0);

        // Sample texture
        vec4 originalColor = texture2D(uTexture, uv);

        // Perceptual luminance calculation
        float luma = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));

        // STAGE 1 -> STAGE 2: Natural Tonality into High Contrast Monochrome
        float contrastLuma = smoothstep(0.03, 0.97, luma);
        contrastLuma = pow(contrastLuma, 0.92);

        // Subtle analog film grain
        float grain = (fract(sin(dot(gl_FragCoord.xy + uTime * 6.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.05;
        float noisyLuma = clamp(contrastLuma + grain, 0.0, 1.0);

        // STAGE 3 -> STAGE 4: 8x8 Bayer Dithering Matrix
        float ditherScale = mix(2.0, 3.2, smoothstep(0.3, 0.7, p));
        vec2 ditherCoord = floor(gl_FragCoord.xy / ditherScale);
        float bayerThreshold = getBayer8(ditherCoord);

        float dithered = step(bayerThreshold, noisyLuma);

        // Continuous blend between smooth monochrome and pure dithered matrix
        float ditherBlend = smoothstep(0.30, 0.68, p);
        float finalTone = mix(noisyLuma, dithered, ditherBlend);

        // Color grading: deep dark obsidian shadows and crisp luminous print highlights
        vec3 darkTone = vec3(0.04, 0.04, 0.05);
        vec3 lightTone = mix(vec3(0.96, 0.96, 0.98), vec3(1.0, 0.92, 0.75), 0.12);
        vec3 finalColor = mix(darkTone, lightTone, finalTone);

        // STAGE 5: Artistic Dissolve / Particle Erosion into obsidian background
        float erosionProgress = smoothstep(0.76, 1.0, p);
        float dissolveMask = step(erosionProgress, noisyLuma * (1.2 - bayerThreshold * 0.4));

        // Atmospheric vignette and gradient feathering
        // Left gradient shadow to keep typography on left 100% crisp
        float leftShadow = smoothstep(0.0, 0.65, vUv.x);
        // Bottom fade to seamlessly blend into subsequent sections
        float bottomShadow = smoothstep(0.0, 0.28, vUv.y);
        // Top subtle shadow
        float topShadow = smoothstep(1.0, 0.88, vUv.y);

        float edgeFade = leftShadow * bottomShadow * topShadow;
        float alpha = (1.0 - erosionProgress * 0.9) * dissolveMask * edgeFade;

        // Base opacity
        alpha *= mix(0.85, 0.95, ditherBlend);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const uniforms = {
      uTexture: { value: portraitTexture },
      uScrollProgress: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uImageResolution: { value: new THREE.Vector2(768, 1024) },
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

    // Tap to reveal handler on canvas pointerdown
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
      scrub: 0.6,
      onUpdate: (self) => {
        uniforms.uScrollProgress.value = self.progress;

        if (self.progress < 0.25) {
          setCurrentStage('STAGE 1: TONAL');
        } else if (self.progress < 0.45) {
          setCurrentStage('STAGE 2: MONOCHROME');
        } else if (self.progress < 0.70) {
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
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;
      uniforms.uMouse.value.set(currentMouseX, currentMouseY);

      uniforms.uTime.value = clock.getElapsedTime();

      // Smooth decay for tap reveal
      if (uniforms.uTapReveal.value > 0.002) {
        uniforms.uTapReveal.value *= 0.93;
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
