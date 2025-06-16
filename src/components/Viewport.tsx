import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Environment } from '@react-three/drei';
import { useEditorStore } from '../store';

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
      <Environment preset="city" />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      
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
            {/* Selection indicator */}
            {isSelected && (
              <mesh position={object.position} scale={object.scale} rotation={object.rotation}>
                <boxGeometry args={[1.1, 1.1, 1.1]} />
                <meshBasicMaterial 
                  color={isMainSelection ? 0x00ff00 : 0xffff00} 
                  transparent 
                  opacity={0.2} 
                  wireframe 
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
          onMouseDown={() => {
            const orbitControls = document.querySelector('.orbit-controls');
            if (orbitControls) orbitControls.setAttribute('enabled', 'false');
          }}
          onMouseUp={() => {
            const orbitControls = document.querySelector('.orbit-controls');
            if (orbitControls) orbitControls.setAttribute('enabled', 'true');
          }}
        />
      )}
      
      <OrbitControls makeDefault className="orbit-controls" />
      <gridHelper args={[20, 20]} />
      
      {/* Invisible ground plane for background clicks */}
      <mesh 
        position={[0, -0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        scale={[100, 100, 1]} 
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
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  );
}