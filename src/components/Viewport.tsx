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

// Realistic ground with subtle imperfections
function RealisticGround() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle animation for realism
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime * 0.1;
    }
  });

  const groundMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color('#1a1a2e') },
      color2: { value: new THREE.Color('#16213e') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Add subtle height variation
        vec3 pos = position;
        pos.y += sin(pos.x * 0.5 + time) * 0.01 + cos(pos.z * 0.3 + time) * 0.01;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create subtle grid pattern
        vec2 grid = abs(fract(vPosition.xz * 2.0) - 0.5) / fwidth(vPosition.xz * 2.0);
        float line = min(grid.x, grid.y);
        
        // Mix colors based on position and grid
        vec3 color = mix(color1, color2, smoothstep(0.0, 1.0, length(vPosition.xz) * 0.1));
        color = mix(color, color1 * 1.2, 1.0 - smoothstep(0.0, 2.0, line));
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  return (
    <mesh 
      ref={meshRef}
      position={[0, -0.01, 0]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      scale={[100, 100, 1]} 
      receiveShadow
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <primitive object={groundMaterial} />
    </mesh>
  );
}

// Enhanced lighting setup
function RealisticLighting() {
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  
  // useHelper(directionalRef, THREE.DirectionalLightHelper, 1, 'red');

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

// Particle system for atmosphere
function AtmosphericParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1000;
  
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = -Math.random() * 0.01;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }
  
  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Reset particles that fall too low
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 30;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  const { objects, selectedObject, selectedObjects, mode, setSelectedObject, toggleObjectSelection, clearSelection } = useEditorStore();
  const { camera } = useThree();

  // Enhanced camera controls
  useEffect(() => {
    camera.position.set(12, 8, 12);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const handleObjectClick = (object: THREE.Object3D, event: any) => {
    event.stopPropagation();
    
    if (event.shiftKey) {
      toggleObjectSelection(object);
    } else {
      setSelectedObject(object);
    }
  };

  const handleBackgroundClick = () => {
    clearSelection();
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
      <AtmosphericParticles />
      
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
            {isSelected && (
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
            {isMainSelection && (
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
      
      {selectedObject && (
        <TransformControls 
          object={selectedObject} 
          mode={mode}
          size={1}
          showX={true}
          showY={true}
          showZ={true}
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
        minDistance={3}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      
      <RealisticGround />
      
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
        <div>Triangles: {/* Dynamic count would go here */}</div>
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