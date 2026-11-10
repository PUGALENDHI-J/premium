'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RobotState } from '@/types';

interface QuantumRobot3DProps {
  state: RobotState;
  interactive?: boolean;
  className?: string;
  onStateChange?: (state: RobotState) => void;
  audioLevel?: number; // 0 to 1 for speech reactivity
}

export const QuantumRobot3D: React.FC<QuantumRobot3DProps> = ({
  state = 'IDLE',
  interactive = true,
  className = '',
  onStateChange,
  audioLevel = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<RobotState>(state);
  const audioLevelRef = useRef<number>(audioLevel);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    let animationFrameId: number;
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060b1c, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00f0ff, 3.0, 10);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // Color Palette based on Robot State
    const getStateColors = (currentState: RobotState) => {
      switch (currentState) {
        case 'LISTENING':
          return { primary: 0x00f0ff, secondary: 0x38bdf8, core: 0x22d3ee };
        case 'THINKING':
          return { primary: 0xa855f7, secondary: 0xc084fc, core: 0x8b5cf6 };
        case 'ANALYSING':
          return { primary: 0x38bdf8, secondary: 0x00f0ff, core: 0x6366f1 };
        case 'RESPONDING':
          return { primary: 0x00f5ff, secondary: 0x8b5cf6, core: 0x00f5ff };
        case 'SUCCESS':
          return { primary: 0x10b981, secondary: 0x34d399, core: 0x059669 };
        case 'WARNING':
          return { primary: 0xf59e0b, secondary: 0xfbbf24, core: 0xd97706 };
        case 'ERROR':
          return { primary: 0xf43f5e, secondary: 0xfb7185, core: 0xe11d48 };
        case 'SLEEP':
          return { primary: 0x334155, secondary: 0x1e293b, core: 0x0f172a };
        case 'IDLE':
        default:
          return { primary: 0x00f0ff, secondary: 0xa855f7, core: 0x38bdf8 };
      }
    };

    // 3. Main Robot Assembly Group
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // 3a. Materials
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.88,
      roughness: 0.18,
      envMapIntensity: 1.5,
    });

    const darkAlloyMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.92,
      roughness: 0.25,
    });

    const glassDomeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0.55,
      reflectivity: 0.9,
    });

    const eyeGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    const coreEnergyMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.2,
      wireframe: true,
    });

    // 3b. Torso / Chassis
    const torsoGroup = new THREE.Group();
    robotRoot.add(torsoGroup);

    // Upper chest plate
    const chestGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.65, 32);
    const chestMesh = new THREE.Mesh(chestGeo, titaniumMaterial);
    chestMesh.position.set(0, -0.65, 0);
    torsoGroup.add(chestMesh);

    // Collar & Neck Joint
    const neckBaseGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.2, 32);
    const neckBaseMesh = new THREE.Mesh(neckBaseGeo, darkAlloyMaterial);
    neckBaseMesh.position.set(0, -0.25, 0);
    torsoGroup.add(neckBaseMesh);

    // Glowing chest emblem / quantum reactor ring
    const reactorRingGeo = new THREE.TorusGeometry(0.18, 0.025, 16, 48);
    const reactorRingMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const reactorRing = new THREE.Mesh(reactorRingGeo, reactorRingMat);
    reactorRing.position.set(0, -0.65, 0.43);
    torsoGroup.add(reactorRing);

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const leftShoulder = new THREE.Mesh(shoulderGeo, titaniumMaterial);
    leftShoulder.position.set(-0.68, -0.55, 0);
    torsoGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, titaniumMaterial);
    rightShoulder.position.set(0.68, -0.55, 0);
    torsoGroup.add(rightShoulder);

    // 3c. Robotic Head Assembly
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.1, 0);
    robotRoot.add(headGroup);

    // Lower Jaw / Faceplate
    const faceplateGeo = new THREE.CylinderGeometry(0.38, 0.28, 0.5, 32, 1, false, -Math.PI / 2, Math.PI);
    const faceplateMesh = new THREE.Mesh(faceplateGeo, titaniumMaterial);
    faceplateMesh.position.set(0, -0.05, 0.05);
    headGroup.add(faceplateMesh);

    // Dark Visor Substrate
    const visorGeo = new THREE.SphereGeometry(0.44, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const visorMesh = new THREE.Mesh(visorGeo, darkAlloyMaterial);
    visorMesh.position.set(0, 0.05, 0);
    headGroup.add(visorMesh);

    // Holographic Transparent Skull Dome
    const skullDomeGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const skullDomeMesh = new THREE.Mesh(skullDomeGeo, glassDomeMaterial);
    skullDomeMesh.position.set(0, 0.12, 0);
    headGroup.add(skullDomeMesh);

    // 3d. Glowing Ocular Sensors (Eyes)
    const ocularGroup = new THREE.Group();
    headGroup.add(ocularGroup);

    const eyeGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.04, 32);
    eyeGeo.rotateX(Math.PI / 2);

    const leftEye = new THREE.Mesh(eyeGeo, eyeGlowMaterial);
    leftEye.position.set(-0.16, 0.08, 0.41);
    ocularGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeGlowMaterial);
    rightEye.position.set(0.16, 0.08, 0.41);
    ocularGroup.add(rightEye);

    // Speech Light Wave / Mouth Aperture
    const mouthWaveGeo = new THREE.PlaneGeometry(0.18, 0.025);
    const mouthWaveMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
    });
    const mouthWaveMesh = new THREE.Mesh(mouthWaveGeo, mouthWaveMat);
    mouthWaveMesh.position.set(0, -0.15, 0.44);
    headGroup.add(mouthWaveMesh);

    // 3e. Visible Holographic Neural Processing Core (Inside Transparent Dome)
    const neuralCoreGroup = new THREE.Group();
    neuralCoreGroup.position.set(0, 0.15, 0);
    headGroup.add(neuralCoreGroup);

    // Crystalline Icosahedron Core
    const coreIcosaGeo = new THREE.IcosahedronGeometry(0.2, 1);
    const coreIcosaMesh = new THREE.Mesh(coreIcosaGeo, coreEnergyMaterial);
    neuralCoreGroup.add(coreIcosaMesh);

    // Inner Glowing Core Sphere
    const innerCoreGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    neuralCoreGroup.add(innerCoreMesh);

    // Orbiting Hologram Rings
    const ringGeo1 = new THREE.TorusGeometry(0.26, 0.008, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: false });
    const holoRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    holoRing1.rotation.x = Math.PI / 3;
    neuralCoreGroup.add(holoRing1);

    const ringGeo2 = new THREE.TorusGeometry(0.3, 0.008, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: false });
    const holoRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    holoRing2.rotation.y = Math.PI / 4;
    neuralCoreGroup.add(holoRing2);

    // 3f. Ambient Neural Particle Swarm
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.8 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    robotRoot.add(particleSystem);

    // 4. Interactive Mouse Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip render if tab is hidden to save battery & GPU
      if (document.hidden) return;

      const elapsedTime = clock.getElapsedTime();
      const currentState = stateRef.current;
      const currentAudio = audioLevelRef.current;
      const colors = getStateColors(currentState);

      // Smooth color transitions
      eyeGlowMaterial.color.setHex(colors.primary);
      reactorRingMat.color.setHex(colors.primary);
      coreEnergyMaterial.color.setHex(colors.core);
      ringMat1.color.setHex(colors.primary);
      ringMat2.color.setHex(colors.secondary);
      particleMat.color.setHex(colors.primary);

      // State-driven dynamics
      let floatSpeed = 1.2;
      let floatAmp = 0.06;
      let coreRotSpeed = 1.0;
      let eyePulse = 1.0;

      if (currentState === 'SLEEP') {
        floatSpeed = 0.4;
        floatAmp = 0.02;
        coreRotSpeed = 0.15;
        eyeGlowMaterial.color.setHex(0x1e293b);
      } else if (currentState === 'THINKING') {
        floatSpeed = 2.4;
        coreRotSpeed = 3.5;
        eyePulse = 0.8 + Math.sin(elapsedTime * 8) * 0.2;
      } else if (currentState === 'ANALYSING') {
        floatSpeed = 2.0;
        coreRotSpeed = 4.2;
        holoRing1.rotation.z += 0.04;
        holoRing2.rotation.z -= 0.03;
      } else if (currentState === 'RESPONDING') {
        floatSpeed = 1.8;
        // Modulate mouth scale and light wave with audio reactivity
        const audioFactor = Math.max(0.2, currentAudio || Math.sin(elapsedTime * 12) * 0.4 + 0.5);
        mouthWaveMesh.scale.x = 1 + audioFactor * 1.5;
        mouthWaveMesh.scale.y = 1 + audioFactor * 2.2;
        mouthWaveMat.opacity = 0.4 + audioFactor * 0.5;
      } else if (currentState === 'LISTENING') {
        floatSpeed = 1.5;
        eyePulse = 1.0 + Math.sin(elapsedTime * 6) * 0.3;
      }

      // Smooth floating oscillation (Breathing / Hover)
      robotRoot.position.y = Math.sin(elapsedTime * floatSpeed) * floatAmp;

      // Mouse Look / Head Track smoothing (lerp)
      headGroup.rotation.y += (targetRotationY - headGroup.rotation.y) * 0.06;
      headGroup.rotation.x += (targetRotationX - headGroup.rotation.x) * 0.06;
      torsoGroup.rotation.y += (targetRotationY * 0.35 - torsoGroup.rotation.y) * 0.04;

      // Holographic Neural Core Rotations
      coreIcosaMesh.rotation.x += 0.015 * coreRotSpeed;
      coreIcosaMesh.rotation.y += 0.02 * coreRotSpeed;
      holoRing1.rotation.x += 0.01 * coreRotSpeed;
      holoRing2.rotation.y += 0.012 * coreRotSpeed;

      // Pulse Core Scale
      const corePulse = 1 + Math.sin(elapsedTime * 3 * (currentState === 'THINKING' ? 2 : 1)) * 0.08;
      coreIcosaMesh.scale.set(corePulse, corePulse, corePulse);

      // Neural Particles Orbital Drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx] += particleVelocities[i].x;
        positions[idx + 1] += particleVelocities[i].y;
        positions[idx + 2] += particleVelocities[i].z;

        // Reset if drifted too far
        const dist = Math.sqrt(
          positions[idx] ** 2 + positions[idx + 1] ** 2 + positions[idx + 2] ** 2
        );
        if (dist > 2.0 || dist < 0.6) {
          positions[idx] *= 0.85;
          positions[idx + 1] *= 0.85;
          positions[idx + 2] *= 0.85;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleSystem.rotation.y += 0.003 * coreRotSpeed;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full min-h-[380px] flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* Fallback 2D Animated UI if WebGL is disabled or unsupported */}
      {!webglSupported && (
        <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300">
          <div className="w-32 h-32 rounded-full border-2 border-cyan-400/50 bg-slate-900/80 flex items-center justify-center shadow-quantum animate-quantum-pulse">
            <span className="material-symbols-outlined text-5xl text-cyan-400">smart_toy</span>
          </div>
          <p className="mt-3 text-sm text-cyan-300 font-semibold uppercase tracking-wider">
            NEXA Quantum Visualizer (2D Mode)
          </p>
          <span className="text-xs text-slate-400 mt-1">WebGL 3D hardware disabled</span>
        </div>
      )}

      {/* Holographic HUD HUD Telemetry Ring Overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[320px] h-[320px] rounded-full border border-cyan-500/15 animate-neural-orbit"></div>
        <div className="w-[390px] h-[390px] rounded-full border border-dashed border-violet-500/10"></div>
      </div>

      {/* State Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-cyan-500/30 backdrop-blur-md shadow-sm">
        <span
          className={`w-2 h-2 rounded-full ${
            state === 'IDLE'
              ? 'bg-cyan-400'
              : state === 'LISTENING'
              ? 'bg-sky-400 animate-ping'
              : state === 'THINKING' || state === 'ANALYSING'
              ? 'bg-violet-400 animate-pulse'
              : state === 'RESPONDING'
              ? 'bg-cyan-300 animate-bounce'
              : state === 'SUCCESS'
              ? 'bg-emerald-400'
              : state === 'WARNING'
              ? 'bg-amber-400'
              : 'bg-rose-400'
          }`}
        />
        <span className="text-xs font-mono font-medium tracking-wider uppercase text-cyan-200">
          {state}
        </span>
      </div>

      {/* Audio Wave Visualizer Indicator (during speech or listening) */}
      {(state === 'RESPONDING' || state === 'LISTENING') && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-4 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md">
          <span className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
          <span className="w-1 h-5 bg-cyan-300 rounded-full animate-pulse [animation-delay:150ms]" />
          <span className="w-1 h-2 bg-violet-400 rounded-full animate-pulse [animation-delay:300ms]" />
          <span className="w-1 h-6 bg-cyan-400 rounded-full animate-pulse [animation-delay:75ms]" />
          <span className="w-1 h-4 bg-cyan-300 rounded-full animate-pulse [animation-delay:220ms]" />
          <span className="ml-2 text-xs font-mono text-cyan-300 uppercase">
            {state === 'LISTENING' ? 'Audio Sensor Active' : 'Synthesizing Speech'}
          </span>
        </div>
      )}
    </div>
  );
};

