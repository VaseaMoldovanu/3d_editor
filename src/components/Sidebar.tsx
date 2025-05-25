import React from 'react';
import { Cuboid as Cube, Cherry as Sphere, Cylinder, Cone, Circle, Triangle } from 'lucide-react';
import { useEditorStore } from '../store';
import * as THREE from 'three';

export default function Sidebar() {
  const { addObject } = useEditorStore();

  const createBox = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x4a9eff });
    const mesh = new THREE.Mesh(geometry, material);
    addObject(mesh);
  };

  const createSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff4a4a });
    const mesh = new THREE.Mesh(geometry, material);
    addObject(mesh);
  };

  const createCylinder = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x4aff4a });
    const mesh = new THREE.Mesh(geometry, material);
    addObject(mesh);
  };

  const createCone = () => {
    const geometry = new THREE.ConeGeometry(0.5, 1, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const mesh = new THREE.Mesh(geometry, material);
    addObject(mesh);
  };

  const createTorus = () => {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const mesh = new THREE.Mesh(geometry, material);
    addObject(mesh);
  };

  const createTetrahedron = () => {
    const geometry = new THREE.TetrahedronGeometry(0.7);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const mesh = new THREE.Mesh(geometry, material);
    addObject(mesh);
  };

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-3 flex flex-col gap-3">
      <button
        onClick={createBox}
        className="p-3 rounded-xl hover:bg-gray-800 transition-all group"
        title="Add Box"
      >
        <Cube className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors" />
      </button>
      <button
        onClick={createSphere}
        className="p-3 rounded-xl hover:bg-gray-800 transition-all group"
        title="Add Sphere"
      >
        <Sphere className="w-6 h-6 text-white group-hover:text-red-400 transition-colors" />
      </button>
      <button
        onClick={createCylinder}
        className="p-3 rounded-xl hover:bg-gray-800 transition-all group"
        title="Add Cylinder"
      >
        <Cylinder className="w-6 h-6 text-white group-hover:text-green-400 transition-colors" />
      </button>
      <button
        onClick={createCone}
        className="p-3 rounded-xl hover:bg-gray-800 transition-all group"
        title="Add Cone"
      >
        <Cone className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
      </button>
      <button
        onClick={createTorus}
        className="p-3 rounded-xl hover:bg-gray-800 transition-all group"
        title="Add Torus"
      >
        <Circle className="w-6 h-6 text-white group-hover:text-pink-400 transition-colors" />
      </button>
      <button
        onClick={createTetrahedron}
        className="p-3 rounded-xl hover:bg-gray-800 transition-all group"
        title="Add Tetrahedron"
      >
        <Triangle className="w-6 h-6 text-white group-hover:text-cyan-400 transition-colors" />
      </button>
    </div>
  );
}