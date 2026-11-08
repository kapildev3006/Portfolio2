'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import * as THREE from 'three';

export default function ThreeBackground() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Do not render the 3D animation on admin pages
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin || !canvasRef.current) return;

    const canvas = canvasRef.current;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 75);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // --- Particle Texture Helper ---
    const createCircleTexture = (colorStop0: string, colorStop1: string) => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const ctx = pCanvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, colorStop0);
        gradient.addColorStop(0.35, colorStop1);
        gradient.addColorStop(0.8, 'rgba(56, 189, 248, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(pCanvas);
    };

    const mainParticleTexture = createCircleTexture('rgba(56, 189, 248, 1)', 'rgba(163, 230, 53, 0.7)');
    const sparkTexture = createCircleTexture('rgba(163, 230, 53, 1)', 'rgba(56, 189, 248, 0.8)');

    // --- Particle Constellation Setup ---
    const particleCount = 140;
    const maxDistance = 24;

    const basePositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount * 3); // For mouse repulsion spring
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 170;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 90;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      currentPositions[i * 3] = x;
      currentPositions[i * 3 + 1] = y;
      currentPositions[i * 3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.08,
        y: (Math.random() - 0.5) * 0.08,
        z: (Math.random() - 0.5) * 0.05,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 3.5,
      map: mainParticleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Dynamic connecting lines
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    const lineColors = new Float32Array(particleCount * particleCount * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Interactive Mouse Follower: 3D Pulsing Energy Rings ---
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 0, 0);

    const outerRingGeo = new THREE.TorusGeometry(3.5, 0.08, 16, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    ringGroup.add(outerRing);

    const innerRingGeo = new THREE.TorusGeometry(2.2, 0.06, 16, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    ringGroup.add(innerRing);

    scene.add(ringGroup);

    // Dynamic light following mouse
    const mouseLight = new THREE.PointLight(0x38bdf8, 2.5, 55);
    mouseLight.position.set(0, 0, 15);
    scene.add(mouseLight);

    // --- Mouse Trail Particle System (Comet Tail) ---
    const maxTrailCount = 45;
    const trailPositions = new Float32Array(maxTrailCount * 3);
    const trailScales = new Float32Array(maxTrailCount);
    const trailLifes = new Float32Array(maxTrailCount);
    const trailVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < maxTrailCount; i++) {
      trailPositions[i * 3] = 9999;
      trailPositions[i * 3 + 1] = 9999;
      trailPositions[i * 3 + 2] = 9999;
      trailScales[i] = 0;
      trailLifes[i] = 0;
      trailVelocities.push({ x: 0, y: 0, z: 0 });
    }

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const trailMaterial = new THREE.PointsMaterial({
      size: 4.5,
      map: sparkTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const trailSystem = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trailSystem);

    let trailSpawnIndex = 0;

    // --- Floating Wireframe Polyhedra ---
    const icoGeometry = new THREE.IcosahedronGeometry(15, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(45, 12, -25);
    scene.add(icosahedron);

    const dodecGeometry = new THREE.DodecahedronGeometry(11, 0);
    const dodecMaterial = new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const dodecahedron = new THREE.Mesh(dodecGeometry, dodecMaterial);
    dodecahedron.position.set(-48, -15, -20);
    scene.add(dodecahedron);

    const torusGeometry = new THREE.TorusKnotGeometry(9, 1.6, 80, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    torusKnot.position.set(15, -35, -30);
    scene.add(torusKnot);

    // --- Mouse & World Coordinates Tracking ---
    const mouseScreen = { x: 0, y: 0 };
    const mouseWorld = new THREE.Vector3(0, 0, 0);
    const targetMouseWorld = new THREE.Vector3(0, 0, 0);
    const raycasterPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();

    let mouseSpeed = 0;
    let lastClientX = 0;
    let lastClientY = 0;
    let cameraTargetX = 0;
    let cameraTargetY = 0;
    let cameraCurrentX = 0;
    let cameraCurrentY = 0;
    let scrollY = 0;
    let hasMouseMoved = false;

    const handleMouseMove = (event: MouseEvent) => {
      hasMouseMoved = true;
      // Screen normalized coordinates (-1 to 1)
      mouseScreen.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseScreen.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Parallax target for camera
      cameraTargetX = mouseScreen.x * 16;
      cameraTargetY = mouseScreen.y * 14;

      // Calculate 3D intersection with Z=0 plane for cursor
      raycaster.setFromCamera(new THREE.Vector2(mouseScreen.x, mouseScreen.y), camera);
      raycaster.ray.intersectPlane(raycasterPlane, targetMouseWorld);

      // Measure mouse velocity
      const dx = event.clientX - lastClientX;
      const dy = event.clientY - lastClientY;
      mouseSpeed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.15, 3.5);
      lastClientX = event.clientX;
      lastClientY = event.clientY;

      // Spawn trail particles when moving
      if (mouseSpeed > 0.4) {
        for (let k = 0; k < 2; k++) {
          const sIdx = trailSpawnIndex % maxTrailCount;
          trailPositions[sIdx * 3] = targetMouseWorld.x + (Math.random() - 0.5) * 1.5;
          trailPositions[sIdx * 3 + 1] = targetMouseWorld.y + (Math.random() - 0.5) * 1.5;
          trailPositions[sIdx * 3 + 2] = (Math.random() - 0.5) * 2;

          trailVelocities[sIdx].x = (Math.random() - 0.5) * 0.25 - (dx * 0.01);
          trailVelocities[sIdx].y = (Math.random() - 0.5) * 0.25 - (dy * 0.01);
          trailVelocities[sIdx].z = (Math.random() - 0.5) * 0.15;

          trailLifes[sIdx] = 1.0;
          trailSpawnIndex++;
        }
      }
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    let isVisible = true;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera lerp with parallax
      cameraCurrentX += (cameraTargetX - cameraCurrentX) * 0.05;
      cameraCurrentY += (cameraTargetY - cameraCurrentY) * 0.05;

      camera.position.x = cameraCurrentX;
      camera.position.y = cameraCurrentY - (scrollY * 0.015);
      camera.lookAt(0, -(scrollY * 0.015), 0);

      // Smooth mouse in 3D space
      mouseWorld.lerp(targetMouseWorld, 0.15);

      // Mouse speed decay
      mouseSpeed *= 0.92;

      // Update interactive 3D energy rings at cursor position
      if (hasMouseMoved) {
        ringGroup.position.copy(mouseWorld);
        mouseLight.position.set(mouseWorld.x, mouseWorld.y, 10);

        // Tilt and rotate energy rings
        ringGroup.rotation.x = elapsedTime * 2.5 + mouseWorld.y * 0.05;
        ringGroup.rotation.y = elapsedTime * 3.0 + mouseWorld.x * 0.05;
        ringGroup.rotation.z += 0.02;

        // Dynamic pulse based on mouse speed & rhythm
        const pulse = 1 + Math.sin(elapsedTime * 6) * 0.12 + mouseSpeed * 0.35;
        ringGroup.scale.set(pulse, pulse, pulse);
        outerRingMat.opacity = Math.min(0.85, 0.45 + mouseSpeed * 0.2);
        innerRingMat.opacity = Math.min(0.95, 0.6 + mouseSpeed * 0.2);
      } else {
        ringGroup.scale.set(0, 0, 0);
      }

      // Update comet tail trail particles
      const tPos = trailGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < maxTrailCount; i++) {
        if (trailLifes[i] > 0) {
          trailLifes[i] -= 0.025; // Fade over time
          tPos[i * 3] += trailVelocities[i].x;
          tPos[i * 3 + 1] += trailVelocities[i].y;
          tPos[i * 3 + 2] += trailVelocities[i].z;
        } else {
          tPos[i * 3] = 9999;
          tPos[i * 3 + 1] = 9999;
        }
      }
      trailGeometry.attributes.position.needsUpdate = true;

      // Tilt floating polyhedra toward the mouse
      icosahedron.rotation.x = elapsedTime * 0.08 + mouseWorld.y * 0.02;
      icosahedron.rotation.y = elapsedTime * 0.12 + mouseWorld.x * 0.02;
      dodecahedron.rotation.x = -elapsedTime * 0.1 - mouseWorld.y * 0.02;
      dodecahedron.rotation.y = elapsedTime * 0.07 - mouseWorld.x * 0.02;
      torusKnot.rotation.x = elapsedTime * 0.05 + mouseWorld.x * 0.01;
      torusKnot.rotation.z = elapsedTime * 0.06 + mouseWorld.y * 0.01;

      // --- Interactive Particle Physics (Drift + Mouse Repulsion Wave) ---
      const repulsionRadius = 38;
      const posArray = particleGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;

        // 1. Natural gentle floating drift
        basePositions[idx] += velocities[i].x;
        basePositions[idx + 1] += velocities[i].y;
        basePositions[idx + 2] += velocities[i].z;

        // Bounce back within bounds
        if (basePositions[idx] < -85 || basePositions[idx] > 85) velocities[i].x *= -1;
        if (basePositions[idx + 1] < -60 || basePositions[idx + 1] > 60) velocities[i].y *= -1;
        if (basePositions[idx + 2] < -45 || basePositions[idx + 2] > 45) velocities[i].z *= -1;

        // 2. Mouse Repulsion Reaction
        if (hasMouseMoved) {
          const dx = (basePositions[idx] + offsets[idx]) - mouseWorld.x;
          const dy = (basePositions[idx + 1] + offsets[idx + 1]) - mouseWorld.y;
          const dist2D = Math.sqrt(dx * dx + dy * dy);

          if (dist2D < repulsionRadius && dist2D > 0.01) {
            // Push particle outward dynamically
            const force = (1.0 - dist2D / repulsionRadius) * (1.8 + mouseSpeed * 0.8);
            offsets[idx] += (dx / dist2D) * force;
            offsets[idx + 1] += (dy / dist2D) * force;
          }
        }

        // Elastic return spring (smooth decay)
        offsets[idx] *= 0.88;
        offsets[idx + 1] *= 0.88;
        offsets[idx + 2] *= 0.88;

        // Final position
        posArray[idx] = basePositions[idx] + offsets[idx];
        posArray[idx + 1] = basePositions[idx + 1] + offsets[idx + 1];
        posArray[idx + 2] = basePositions[idx + 2] + offsets[idx + 2];
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // --- Update Connecting Constellation Lines ---
      let lineVertexIndex = 0;
      let lineCount = 0;
      const lPos = lineGeometry.attributes.position.array as Float32Array;
      const lCol = lineGeometry.attributes.color.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const dx = posArray[i3] - posArray[j3];
          const dy = posArray[i3 + 1] - posArray[j3 + 1];
          const dz = posArray[i3 + 2] - posArray[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = 1.0 - dist / maxDistance;

            // Brighten lines near the mouse cursor
            const mouseDistI = Math.sqrt(
              Math.pow(posArray[i3] - mouseWorld.x, 2) + Math.pow(posArray[i3 + 1] - mouseWorld.y, 2)
            );
            const nearMouseBonus = hasMouseMoved && mouseDistI < 30 ? 1.8 : 1.0;

            // Line start
            lPos[lineVertexIndex] = posArray[i3];
            lPos[lineVertexIndex + 1] = posArray[i3 + 1];
            lPos[lineVertexIndex + 2] = posArray[i3 + 2];
            lCol[lineVertexIndex] = Math.min(1.0, 0.22 * alpha * nearMouseBonus);
            lCol[lineVertexIndex + 1] = Math.min(1.0, 0.74 * alpha * nearMouseBonus);
            lCol[lineVertexIndex + 2] = Math.min(1.0, 0.97 * alpha * nearMouseBonus);

            // Line end
            lPos[lineVertexIndex + 3] = posArray[j3];
            lPos[lineVertexIndex + 4] = posArray[j3 + 1];
            lPos[lineVertexIndex + 5] = posArray[j3 + 2];
            lCol[lineVertexIndex + 3] = Math.min(1.0, 0.64 * alpha * nearMouseBonus);
            lCol[lineVertexIndex + 4] = Math.min(1.0, 0.9 * alpha * nearMouseBonus);
            lCol[lineVertexIndex + 5] = Math.min(1.0, 0.2 * alpha * nearMouseBonus);

            lineVertexIndex += 6;
            lineCount++;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineCount * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      particleGeometry.dispose();
      particleMaterial.dispose();
      mainParticleTexture.dispose();
      sparkTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      dodecGeometry.dispose();
      dodecMaterial.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      renderer.dispose();
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
