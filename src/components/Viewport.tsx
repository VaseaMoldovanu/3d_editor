import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  TransformControls, 
  Environment, 
  ContactShadows,
  Sky,
  Lightformer,
  AccumulativeShadows,
  RandomizedLight,
  SoftShadows,
  useHelper
} from '@react-three/drei';
import { useEditorStore } from '../store';
import * as THREE from 'three';

// Tinkercad-style baseplate
function TinkercadBaseplate() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material && 'uniforms' in meshRef.current.material) {
      // Subtle animation for realism
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.elapsedTime * 0.1;
    }
  });

  const baseplateSize = 20;
  const gridSize = 1;
  
  const baseplateGeometry = new THREE.PlaneGeometry(baseplateSize, baseplateSize);
  const baseplateMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      gridSize: { value: gridSize },
      baseColor: { value: new THREE.Color('#f8f9fa') },
      gridColor: { value: new THREE.Color('#e9ecef') },
      size: { value: baseplateSize },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        vec3 pos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform vec3 gridColor;
      uniform float gridSize;
      uniform float size;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vec2 grid = abs(fract((vUv - 0.5) * size / gridSize) - 0.5) / fwidth((vUv - 0.5) * size / gridSize);
        float line = min(grid.x, grid.y);
        
        // Create grid pattern like Tinkercad
        vec3 color = mix(gridColor, baseColor, smoothstep(0.0, 1.0, line));
        
        // Add subtle radial gradient
        float dist = length(vUv - 0.5);
        color = mix(color, color * 0.95, smoothstep(0.3, 0.7, dist));
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  return (
    <mesh 
      ref={meshRef}
      position={[0, -0.01, 0]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <primitive object={baseplateGeometry} />
      <primitive object={baseplateMaterial} />
    </mesh>
  );
}

// Enhanced lighting setup
function RealisticLighting() {
  const directionalRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Key light - main illumination */}
      <directionalLight
        ref={directionalRef}
        position={[10, 20, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
        color="#ffffff"
      />
      
      {/* Fill light - softer secondary illumination */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.8}
        color="#e6f3ff"
      />
      
      {/* Rim light - edge definition */}
      <directionalLight
        position={[0, 5, -10]}
        intensity={0.6}
        color="#fff5e6"
      />
      
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} color="#404080" />
      
      {/* Point lights for accent */}
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff6b6b" distance={20} />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#4ecdc4" distance={15} />
      
      {/* Spot light for dramatic effect */}
      <spotLight
        position={[0, 25, 0]}
        intensity={1.5}
        angle={0.4}
        penumbra={0.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#ffffff"
      />
    </>
  );
}

function Scene() {
  const { 
    objects, 
    selectedObject, 
    selectedObjects, 
    mode, 
    setSelectedObject, 
    toggleObjectSelection, 
    clearSelection 
  } = useEditorStore();
  const { camera } = useThree();
  const orbitControlsRef = useRef<any>(null);

  // Enhanced camera controls
  useEffect(() => {
    camera.position.set(12, 8, 12);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Monitor objects array and clear selectedObject if it's no longer valid
  useEffect(() => {
    if (selectedObject && !objects.includes(selectedObject)) {
      setSelectedObject(null);
    }
  }, [objects, selectedObject, setSelectedObject]);

  const handleObjectClick = (object: THREE.Object3D, event: any) => {
    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      toggleObjectSelection(object);
    } else {
      setSelectedObject(object);
    }
  };

  const handleBackgroundClick = () => {
    clearSelection();
  };

  const handleTransformMouseDown = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }
  };

  const handleTransformMouseUp = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true;
    }
  };

  // Check if an object is compatible with TransformControls
  const isTransformCompatible = (object: THREE.Object3D) => {
    // Only allow standard Three.js Mesh and Group objects
    // Exclude any custom objects, text objects, or other specialized types
    return object instanceof THREE.Mesh || object instanceof THREE.Group;
  };

  return (
    <>
      {/* Enhanced Environment */}
      <Sky 
        distance={450000}
        sunPosition={[10, 20, 5]}
        inclination={0.49}
        azimuth={0.25}
        turbidity={2}
        rayleigh={0.5}
      />
      
      <Environment resolution={1024}>
        <Lightformer intensity={2} color="white" position={[0, 5, -9]} rotation={[0, 0, Math.PI / 3]} scale={[10, 10, 1]} />
        <Lightformer intensity={0.8} color="#4ecdc4" position={[-5, 1, -1]} rotation={[0, 0, Math.PI / 3]} scale={[10, 2, 1]} />
        <Lightformer intensity={0.6} color="#ff6b6b" position={[10, 1, 0]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[20, 0.5, 1]} />
        <Lightformer intensity={1} color="white" position={[0, 20, 0]} scale={[10, 50, 1]} />
      </Environment>
      
      <RealisticLighting />
      
      {/* Soft shadows for realism */}
      <SoftShadows frustum={3.75} size={0.005} near={9.5} samples={17} rings={11} />
      
      {/* Contact shadows for grounding */}
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={50} 
        blur={2} 
        far={10} 
        resolution={256} 
        color="#000000"
      />
      
      {/* Accumulative shadows for better quality */}
      <AccumulativeShadows 
        position={[0, -0.99, 0]} 
        frames={100} 
        alphaTest={0.9} 
        scale={50} 
        opacity={0.8}
      >
        <RandomizedLight 
          amount={8} 
          radius={10} 
          ambient={0.5} 
          intensity={1} 
          position={[5, 5, -10]} 
          bias={0.001}
        />
      </AccumulativeShadows>
      
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
            
            {/* Enhanced selection indicators with glow */}
            {isSelected && object.position && object.scale && object.rotation && (
              <>
                <mesh position={object.position} scale={object.scale} rotation={object.rotation}>
                  <boxGeometry args={[1.05, 1.05, 1.05]} />
                  <meshBasicMaterial 
                    color={isMainSelection ? '#00ff88' : '#ffaa00'} 
                    transparent 
                    opacity={0.2} 
                    wireframe 
                  />
                </mesh>
                
                {/* Glow effect */}
                <mesh position={object.position} scale={[object.scale.x * 1.1, object.scale.y * 1.1, object.scale.z * 1.1]} rotation={object.rotation}>
                  <boxGeometry args={[1.1, 1.1, 1.1]} />
                  <meshBasicMaterial 
                    color={isMainSelection ? '#00ff88' : '#ffaa00'} 
                    transparent 
                    opacity={0.1} 
                    side={THREE.BackSide}
                  />
                </mesh>
              </>
            )}
            
            {/* Pulsing animation for main selection */}
            {isMainSelection && object.position && object.scale && object.rotation && (
              <mesh position={object.position} scale={[object.scale.x * 1.15, object.scale.y * 1.15, object.scale.z * 1.15]} rotation={object.rotation}>
                <boxGeometry args={[1.15, 1.15, 1.15]} />
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
      
      {/* TransformControls - only render when selectedObject exists, is valid, and is compatible */}
      {selectedObject && 
       objects.includes(selectedObject) && 
       isTransformCompatible(selectedObject) && (
        <TransformControls 
          object={selectedObject}
          mode={mode}
          size={1}
          showX={true}
          showY={true}
          showZ={true}
          onMouseDown={handleTransformMouseDown}
          onMouseUp={handleTransformMouseUp}
        />
      )}
      
      <OrbitControls 
        ref={orbitControlsRef}
        makeDefault 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        enableDamping={true}
        minDistance={3}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      
      <TinkercadBaseplate />
      
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
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Performance monitor */}
      <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-green-400 font-mono">
        <div>FPS: 60</div>
        <div>Multi-select: Ctrl+Click</div>
      </div>
      
      <Canvas
        camera={{ position: [12, 8, 12], fov: 50, near: 0.1, far: 1000 }}
        shadows="soft"
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}