import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold our interactive 3D polytope
    const group = new THREE.Group();
    scene.add(group);

    // Core Geometry: Icosahedron Wireframe
    const geometry = new THREE.IcosahedronGeometry(1.4, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xe4a853,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    group.add(wireframeMesh);

    // Inner Glowing Polytope
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // Glowing Vertex Particles
    const pointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.9,
    });
    const pointsMesh = new THREE.Points(geometry, pointsMat);
    group.add(pointsMesh);

    // Mouse & Touch interaction tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let clickPulse = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetX = normX * 0.8;
      targetY = normY * 0.8;
    };

    const handlePointerClick = () => {
      clickPulse = 1.6;
      innerMat.color.setHex(0xe4a853);
      wireframeMat.color.setHex(0x38bdf8);

      setTimeout(() => {
        innerMat.color.setHex(0x38bdf8);
        wireframeMat.color.setHex(0xe4a853);
      }, 600);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('touchmove', handlePointerMove, { passive: true });
    container.addEventListener('click', handlePointerClick);
    container.addEventListener('touchstart', handlePointerClick, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp toward mouse/touch target
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      group.rotation.y = elapsedTime * 0.25 + currentX * 1.2;
      group.rotation.x = elapsedTime * 0.15 - currentY * 1.2;

      innerMesh.rotation.y = -elapsedTime * 0.4;
      innerMesh.rotation.z = elapsedTime * 0.2;

      // Pulse relaxation
      if (clickPulse > 1) {
        clickPulse -= 0.04;
        group.scale.set(clickPulse, clickPulse, clickPulse);
      } else {
        group.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 320;
      const newH = container.clientHeight || 320;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('click', handlePointerClick);
      container.removeEventListener('touchstart', handlePointerClick);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      innerGeo.dispose();
      wireframeMat.dispose();
      innerMat.dispose();
      pointsMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto cursor-pointer select-none touch-none"
      title="Interactive 3D Neural Lattice — Click or Drag to Interact"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-[#71717a] font-editorial-display opacity-40 hover:opacity-100 transition-opacity">
          Tap or Drag Polytope
        </span>
      </div>
    </div>
  );
};
