import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Environment, Stars } from '@react-three/drei';
import { useEditorStore } from '../store';
import * as THREE from 'three';

function Scene() {
  const { objects, selectedObject, selectedObjects, mode, setSelectedObject, toggleObjectSelection, clearSelection } = useEditorStore();

  const handleObjectClick = (object: THREE.Object3D, event: any) => {
    event.stopPropagation();
    
    if (event.shiftKey) {
      // Multi-select with Shift key
      toggleObjectSelection(object);
    } else {
      // Single select
      setSelectedObject(object);
    }
  };

  const handleBackgroundClick = () => {
    clearSelection();
  };

  return (
    <>
      <Environment preset="night" />
      <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
      
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.4} color="#4a5568" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        castShadow 
        color="#ffffff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#667eea" />
      <spotLight 
        position={[0, 20, 0]} 
        intensity={0.8} 
        angle={0.3} 
        penumbra={0.2} 
        color="#f093fb"
        castShadow
      />
      
      {objects.map((object, index) => {
        const isSelected = selectedObjects.includes(object);
        const isMainSelection = selectedObject === object;
        
        return (
          <group key={index}>
            <primitive 
              object={object} 
              onClick={(e: any) => handleObjectClick(object, e)}
              castShadow
              receiveShadow
            />
            {/* Enhanced Selection Indicators */}
            {isSelected && (
              <mesh position={object.position} scale={object.scale} rotation={object.rotation}>
                <boxGeometry args={[1.1, 1.1, 1.1]} />
                <meshBasicMaterial 
                  color={isMainSelection ? '#00ff88' : '#ffaa00'} 
                  transparent 
                  opacity={0.15} 
                  wireframe 
                />
              </mesh>
            )}
            {/* Glow Effect for Main Selection */}
            {isMainSelection && (
              <mesh position={object.position} scale={[object.scale.x * 1.2, object.scale.y * 1.2, object.scale.z * 1.2]} rotation={object.rotation}>
                <boxGeometry args={[1.1, 1.1, 1.1]} />
                <meshBasicMaterial 
                  color="#00ff88" 
                  transparent 
                  opacity={0.05} 
                />
              </mesh>
            )}
          </group>
        );
      })}
      
      {selectedObject && (
        <TransformControls 
          object={selectedObject} 
          mode={mode}
          size={0.8}
          onMouseDown={() => {
            const orbitControls = document.querySelector('.orbit-controls') as any;
            if (orbitControls) orbitControls.enabled = false;
          }}
          onMouseUp={() => {
            const orbitControls = document.querySelector('.orbit-controls') as any;
            if (orbitControls) orbitControls.enabled = true;
          }}
        />
      )}
      
      <OrbitControls 
        makeDefault 
        className="orbit-controls"
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        enableDamping={true}
      />
      
      {/* Enhanced Grid */}
      <gridHelper 
        args={[30, 30]} 
        position={[0, 0, 0]}
      />
      
      {/* Ground Plane with Subtle Gradient */}
      <mesh 
        position={[0, -0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        scale={[100, 100, 1]} 
        receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.8}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Invisible interaction plane */}
      <mesh 
        position={[0, -0.02, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        scale={[200, 200, 1]} 
        visible={false}
        onClick={handleBackgroundClick}
      >
        <planeGeometry />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

export default function Viewport() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 60 }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          shadowMap: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}