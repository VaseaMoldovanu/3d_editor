import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { useEditorStore } from '../store';

function Scene() {
  const { objects, selectedObject, mode, setSelectedObject } = useEditorStore();

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {objects.map((object, index) => (
        <primitive 
          key={index} 
          object={object} 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedObject(object);
          }}
        />
      ))}
      {selectedObject && (
        <TransformControls 
          object={selectedObject} 
          mode={mode}
          onMouseDown={() => {
            // Disable orbit controls while transforming
            const orbitControls = document.querySelector('.orbit-controls');
            if (orbitControls) orbitControls.setAttribute('enabled', 'false');
          }}
          onMouseUp={() => {
            // Re-enable orbit controls after transforming
            const orbitControls = document.querySelector('.orbit-controls');
            if (orbitControls) orbitControls.setAttribute('enabled', 'true');
          }}
        />
      )}
      <OrbitControls makeDefault className="orbit-controls" />
      <gridHelper args={[20, 20]} />
      {/* Click on empty space to deselect */}
      <mesh 
        position={[0, -0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        scale={[100, 100, 1]} 
        visible={false}
        onClick={() => setSelectedObject(null)}
      >
        <planeGeometry />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

export default function Viewport() {
  return (
    <div className="w-full h-full bg-gray-950">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  );
}