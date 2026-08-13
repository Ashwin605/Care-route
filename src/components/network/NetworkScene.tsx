'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================
// CARE ROUTE — 3D Network Scene
// ============================================================
// Restrained, elegant 3D healthcare network visualization.
// Not a sci-fi hologram — simple geometry, calm movement.

interface NodeData {
  position: [number, number, number];
  type: 'patient' | 'hospital' | 'selected';
  label: string;
}

const nodes: NodeData[] = [
  { position: [0, 0, 0], type: 'patient', label: 'Patient' },
  { position: [3, 1.5, -1], type: 'hospital', label: 'Hospital A' },
  { position: [2.5, -1.2, 1.5], type: 'hospital', label: 'Hospital B' },
  { position: [-2.8, 1, 1], type: 'hospital', label: 'Hospital C' },
  { position: [-1.5, -1.8, -1.5], type: 'hospital', label: 'Hospital D' },
  { position: [1, 2, 2], type: 'selected', label: 'CityCare' },
  { position: [-3, -0.5, -0.5], type: 'hospital', label: 'Hospital E' },
];

const connections: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
];

// ─── Node Sphere ──────────────────────────────────────────────

function NetworkNode({ node, index }: { node: NodeData; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => {
    if (node.type === 'patient') return '#123B4A';
    if (node.type === 'selected') return '#3F8068';
    return '#6F9690';
  }, [node.type]);

  const radius = node.type === 'patient' ? 0.22 : node.type === 'selected' ? 0.18 : 0.12;

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.position.y =
        node.position[1] + Math.sin(t * 0.5 + index) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
      <mesh
        ref={meshRef}
        position={node.position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[hovered ? radius * 1.3 : radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={node.type === 'hospital' ? 0.7 : 0.9}
        />
      </mesh>
    </Float>
  );
}

// ─── Connection Lines ─────────────────────────────────────────

function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null);

  const lineObjects = useMemo(() => {
    return connections.map(([from, to]) => {
      const start = new THREE.Vector3(...nodes[from].position);
      const end = new THREE.Vector3(...nodes[to].position);
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      const isSelected = nodes[to].type === 'selected';
      const material = new THREE.LineBasicMaterial({
        color: isSelected ? '#3F8068' : '#6F9690',
        transparent: true,
        opacity: isSelected ? 0.3 : 0.15,
      });
      return new THREE.Line(geometry, material);
    });
  }, []);

  useFrame((state) => {
    lineObjects.forEach((line, i) => {
      const material = line.material as THREE.LineBasicMaterial;
      const t = state.clock.elapsedTime;
      material.opacity = 0.12 + Math.sin(t * 0.8 + i * 1.2) * 0.06;
    });
  });

  return (
    <group ref={linesRef}>
      {lineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────

function SceneContent() {
  const { viewport } = useThree();
  const scale = Math.min(viewport.width / 10, 1);

  return (
    <group scale={scale}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <pointLight position={[-3, 2, 4]} intensity={0.2} color="#6F9690" />

      {nodes.map((node, i) => (
        <NetworkNode key={i} node={node} index={i} />
      ))}

      <ConnectionLines />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </group>
  );
}

// ─── Export ────────────────────────────────────────────────────

export default function NetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <SceneContent />
    </Canvas>
  );
}
