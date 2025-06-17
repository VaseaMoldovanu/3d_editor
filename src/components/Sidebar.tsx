import React, { useState } from 'react';
import { 
  Cuboid as Cube, 
  Cherry as Sphere, 
  Cylinder, 
  Cone, 
  Circle, 
  Triangle,
  ChevronDown,
  ChevronRight,
  Square,
  Star,
  Heart,
  Hexagon,
  Diamond,
  Octagon,
  Plus,
  Zap,
  Moon,
  Sun,
  Flower,
  Crown,
  Shield,
  Home,
  Car,
  Plane,
  Key,
  Leaf,
  Fish,
  Smile,
  Target,
  Phone,
  Type,
  Sparkles,
  Layers3,
  Minus,
  Settings,
  Palette2,
  Wrench
} from 'lucide-react';
import { useEditorStore } from '../store';
import * as THREE from 'three';

export default function Sidebar() {
  const { 
    addObject, 
    selectedObject, 
    addHoleToObject, 
    addShapeAsObject,
    shapeMode 
  } = useEditorStore();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    primitives: true,
    shapes: true,
    materials: false
  });
  const [holeSize, setHoleSize] = useState(0.3);
  const [holeDepth, setHoleDepth] = useState(0.5);
  const [textInput, setTextInput] = useState('HELLO');
  const [selectedMaterial, setSelectedMaterial] = useState<'metal' | 'plastic' | 'ceramic' | 'wood'>('plastic');
  const [surfaceQuality, setSurfaceQuality] = useState(32);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Enhanced material creation
  const createRealisticMaterial = (color: number, materialType: 'metal' | 'plastic' | 'ceramic' | 'wood' = 'plastic') => {
    const baseColor = new THREE.Color(color);
    
    switch (materialType) {
      case 'metal':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: 0.9,
          roughness: 0.1,
          envMapIntensity: 1.5,
          clearcoat: 0.1,
          clearcoatRoughness: 0.1,
        });
      
      case 'ceramic':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: 0.0,
          roughness: 0.2,
          envMapIntensity: 0.8,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
        });
      
      case 'wood':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: 0.0,
          roughness: 0.8,
          envMapIntensity: 0.3,
        });
      
      default: // plastic
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: 0.1,
          roughness: 0.4,
          envMapIntensity: 0.6,
          clearcoat: 0.3,
          clearcoatRoughness: 0.4,
        });
    }
  };

  // Enhanced primitive creation functions with realistic materials
  const createBox = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1, surfaceQuality/8, surfaceQuality/8, surfaceQuality/8);
    const material = createRealisticMaterial(0x4a9eff, selectedMaterial);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Box';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.materialType = selectedMaterial;
    addObject(mesh);
  };

  const createSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, surfaceQuality, surfaceQuality/2);
    const material = createRealisticMaterial(0xff4a4a, selectedMaterial);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Sphere';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.materialType = selectedMaterial;
    addObject(mesh);
  };

  const createCylinder = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, surfaceQuality);
    const material = createRealisticMaterial(0x4aff4a, selectedMaterial);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Cylinder';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.materialType = selectedMaterial;
    addObject(mesh);
  };

  const createCone = () => {
    const geometry = new THREE.ConeGeometry(0.5, 1, surfaceQuality);
    const material = createRealisticMaterial(0xffaa00, selectedMaterial);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Cone';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.materialType = selectedMaterial;
    addObject(mesh);
  };

  const createTorus = () => {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, surfaceQuality/2, surfaceQuality);
    const material = createRealisticMaterial(0xff00ff, selectedMaterial);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Torus';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.materialType = selectedMaterial;
    addObject(mesh);
  };

  const createTetrahedron = () => {
    const geometry = new THREE.TetrahedronGeometry(0.7, 0);
    const material = createRealisticMaterial(0x00ffff, selectedMaterial);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Tetrahedron';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.materialType = selectedMaterial;
    addObject(mesh);
  };

  // Shape creation functions that work in both modes
  const createShape = (shapeType: string, name: string) => {
    const geometry = createShapeGeometry(shapeType);
    
    if (shapeMode === 'solid') {
      addShapeAsObject(geometry, name);
    } else if (shapeMode === 'hole' && selectedObject) {
      addHoleToObject(geometry);
    }
  };

  const createShapeGeometry = (shapeType: string): THREE.BufferGeometry => {
    const size = holeSize;
    const segments = Math.max(8, surfaceQuality / 4);
    
    switch (shapeType) {
      case 'circle':
        return new THREE.CylinderGeometry(size, size, holeDepth, segments);
        
      case 'square':
        return new THREE.BoxGeometry(size * 2, holeDepth, size * 2);
        
      case 'triangle': {
        const shape = new THREE.Shape();
        shape.moveTo(0, size);
        shape.lineTo(-size, -size);
        shape.lineTo(size, -size);
        shape.lineTo(0, size);
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: false,
          curveSegments: segments
        });
      }
      
      case 'star': {
        const shape = new THREE.Shape();
        const outerRadius = size;
        const innerRadius = size * 0.5;
        const spikes = 5;
        
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i / (spikes * 2)) * Math.PI * 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        shape.closePath();
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: false,
          curveSegments: segments
        });
      }
      
      case 'heart': {
        const shape = new THREE.Shape();
        shape.moveTo(0, -size * 0.5);
        shape.bezierCurveTo(0, -size * 0.8, -size * 0.8, -size * 0.8, -size * 0.5, -size * 0.3);
        shape.bezierCurveTo(-size * 0.8, 0, -size * 0.3, size * 0.3, 0, size * 0.8);
        shape.bezierCurveTo(size * 0.3, size * 0.3, size * 0.8, 0, size * 0.5, -size * 0.3);
        shape.bezierCurveTo(size * 0.8, -size * 0.8, 0, -size * 0.8, 0, -size * 0.5);
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 4,
          curveSegments: segments
        });
      }
      
      case 'hexagon': {
        const shape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        shape.closePath();
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: false,
          curveSegments: segments
        });
      }
      
      case 'diamond': {
        const shape = new THREE.Shape();
        shape.moveTo(0, size);
        shape.lineTo(size * 0.7, 0);
        shape.lineTo(0, -size);
        shape.lineTo(-size * 0.7, 0);
        shape.closePath();
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 4,
          curveSegments: segments
        });
      }
      
      case 'octagon': {
        const shape = new THREE.Shape();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        shape.closePath();
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: false,
          curveSegments: segments
        });
      }
      
      case 'plus': {
        const shape = new THREE.Shape();
        const thickness = size * 0.3;
        shape.moveTo(-thickness, size);
        shape.lineTo(thickness, size);
        shape.lineTo(thickness, thickness);
        shape.lineTo(size, thickness);
        shape.lineTo(size, -thickness);
        shape.lineTo(thickness, -thickness);
        shape.lineTo(thickness, -size);
        shape.lineTo(-thickness, -size);
        shape.lineTo(-thickness, -thickness);
        shape.lineTo(-size, -thickness);
        shape.lineTo(-size, thickness);
        shape.lineTo(-thickness, thickness);
        shape.closePath();
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: false,
          curveSegments: segments
        });
      }
      
      case 'lightning': {
        const shape = new THREE.Shape();
        shape.moveTo(-size * 0.2, size);
        shape.lineTo(size * 0.3, size * 0.2);
        shape.lineTo(size * 0.1, size * 0.2);
        shape.lineTo(size * 0.5, -size);
        shape.lineTo(-size * 0.1, -size * 0.3);
        shape.lineTo(size * 0.1, -size * 0.3);
        shape.lineTo(-size * 0.4, size);
        shape.closePath();
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: false,
          curveSegments: segments
        });
      }
      
      case 'crescent': {
        const shape = new THREE.Shape();
        // Outer circle
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        
        // Inner circle (hole)
        const hole = new THREE.Path();
        const offset = size * 0.3;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = Math.cos(angle) * size * 0.7 + offset;
          const y = Math.sin(angle) * size * 0.7;
          
          if (i === 0) hole.moveTo(x, y);
          else hole.lineTo(x, y);
        }
        shape.holes.push(hole);
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: false,
          curveSegments: segments
        });
      }
      
      case 'text': {
        if (!textInput.trim()) return new THREE.BoxGeometry(0.1, 0.1, 0.1);
        
        const textWidth = textInput.length * size * 0.3;
        const textHeight = size * 0.5;
        
        const shape = new THREE.Shape();
        shape.moveTo(-textWidth/2, -textHeight/2);
        shape.lineTo(textWidth/2, -textHeight/2);
        shape.lineTo(textWidth/2, textHeight/2);
        shape.lineTo(-textWidth/2, textHeight/2);
        shape.closePath();
        
        return new THREE.ExtrudeGeometry(shape, { 
          depth: holeDepth, 
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 2,
          curveSegments: segments
        });
      }
      
      default:
        return new THREE.CylinderGeometry(size, size, holeDepth, segments);
    }
  };

  const primitives = [
    { icon: Cube, name: 'Box', action: createBox, color: 'blue' },
    { icon: Sphere, name: 'Sphere', action: createSphere, color: 'red' },
    { icon: Cylinder, name: 'Cylinder', action: createCylinder, color: 'green' },
    { icon: Cone, name: 'Cone', action: createCone, color: 'orange' },
    { icon: Circle, name: 'Torus', action: createTorus, color: 'pink' },
    { icon: Triangle, name: 'Tetrahedron', action: createTetrahedron, color: 'cyan' },
  ];

  const shapes = [
    { icon: Circle, name: 'Circle', type: 'circle', color: 'blue' },
    { icon: Square, name: 'Square', type: 'square', color: 'green' },
    { icon: Triangle, name: 'Triangle', type: 'triangle', color: 'yellow' },
    { icon: Star, name: 'Star', type: 'star', color: 'purple' },
    { icon: Heart, name: 'Heart', type: 'heart', color: 'red' },
    { icon: Hexagon, name: 'Hexagon', type: 'hexagon', color: 'indigo' },
    { icon: Diamond, name: 'Diamond', type: 'diamond', color: 'pink' },
    { icon: Octagon, name: 'Octagon', type: 'octagon', color: 'teal' },
    { icon: Plus, name: 'Plus', type: 'plus', color: 'emerald' },
    { icon: Zap, name: 'Lightning', type: 'lightning', color: 'yellow' },
    { icon: Moon, name: 'Crescent', type: 'crescent', color: 'slate' },
    { icon: Sun, name: 'Sun', type: 'sun', color: 'orange' },
    { icon: Flower, name: 'Flower', type: 'flower', color: 'pink' },
    { icon: Crown, name: 'Crown', type: 'crown', color: 'yellow' },
    { icon: Shield, name: 'Shield', type: 'shield', color: 'blue' },
    { icon: Home, name: 'House', type: 'house', color: 'blue' },
    { icon: Car, name: 'Car', type: 'car', color: 'red' },
    { icon: Plane, name: 'Plane', type: 'plane', color: 'blue' },
    { icon: Key, name: 'Key', type: 'key', color: 'yellow' },
    { icon: Leaf, name: 'Leaf', type: 'leaf', color: 'green' },
    { icon: Fish, name: 'Fish', type: 'fish', color: 'blue' },
    { icon: Smile, name: 'Smiley', type: 'smiley', color: 'yellow' },
    { icon: Target, name: 'Target', type: 'target', color: 'red' },
    { icon: Phone, name: 'Phone', type: 'phone', color: 'gray' },
  ];

  const materials = [
    { name: 'Plastic', type: 'plastic' as const, icon: Palette2, color: 'blue', description: 'Smooth, colorful finish' },
    { name: 'Metal', type: 'metal' as const, icon: Wrench, color: 'gray', description: 'Reflective, industrial' },
    { name: 'Ceramic', type: 'ceramic' as const, icon: Crown, color: 'white', description: 'Glossy, premium feel' },
    { name: 'Wood', type: 'wood' as const, icon: Leaf, color: 'amber', description: 'Natural, organic texture' },
  ];

  const canUseShapes = shapeMode === 'solid' || (shapeMode === 'hole' && selectedObject);

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-5 w-80 max-h-[90vh] overflow-y-auto">
        
        {/* Mode Indicator */}
        <div className={`mb-6 p-4 rounded-xl border-2 ${
          shapeMode === 'solid' 
            ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30' 
            : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {shapeMode === 'solid' ? (
              <Layers3 className="w-6 h-6 text-orange-400" />
            ) : (
              <Minus className="w-6 h-6 text-red-400" />
            )}
            <div>
              <h3 className={`font-bold ${
                shapeMode === 'solid' ? 'text-orange-400' : 'text-red-400'
              }`}>
                {shapeMode === 'solid' ? 'Solid Mode' : 'Hole Mode'}
              </h3>
              <p className="text-xs text-slate-400">
                {shapeMode === 'solid' 
                  ? 'Create new objects' 
                  : selectedObject 
                    ? 'Cut holes in selected object' 
                    : 'Select an object first'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Material Selection */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('materials')}
            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-700/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-slate-200">Material & Quality</span>
            </div>
            {expandedSections.materials ? (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
            )}
          </button>
          
          {expandedSections.materials && (
            <div className="mt-4 space-y-4">
              {/* Material Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Material Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {materials.map((material) => (
                    <button
                      key={material.type}
                      onClick={() => setSelectedMaterial(material.type)}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        selectedMaterial === material.type
                          ? `bg-${material.color}-500/20 border-${material.color}-500/50 text-${material.color}-400`
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50'
                      }`}
                    >
                      <material.icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">{material.name}</div>
                      <div className="text-xs opacity-70">{material.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Surface Quality */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Surface Quality: {surfaceQuality} segments
                </label>
                <input
                  type="range"
                  min="8"
                  max="64"
                  step="4"
                  value={surfaceQuality}
                  onChange={(e) => setSurfaceQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primitives Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('primitives')}
            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-700/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-slate-200">3D Primitives</span>
            </div>
            {expandedSections.primitives ? (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
            )}
          </button>
          
          {expandedSections.primitives && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {primitives.map((primitive, index) => (
                <button
                  key={index}
                  onClick={primitive.action}
                  className={`p-4 rounded-xl bg-slate-800/50 hover:bg-gradient-to-br hover:from-${primitive.color}-500/20 hover:to-${primitive.color}-600/20 border border-slate-700/50 hover:border-${primitive.color}-500/30 transition-all duration-300 group flex flex-col items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-${primitive.color}-500/20`}
                  title={`Add ${primitive.name} (${selectedMaterial})`}
                >
                  <primitive.icon className={`w-6 h-6 text-slate-400 group-hover:text-${primitive.color}-400 transition-colors`} />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{primitive.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{selectedMaterial}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shapes Section */}
        <div>
          <button
            onClick={() => toggleSection('shapes')}
            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-700/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              {shapeMode === 'solid' ? (
                <Layers3 className="w-5 h-5 text-orange-400" />
              ) : (
                <Minus className="w-5 h-5 text-red-400" />
              )}
              <span className="font-bold text-slate-200">
                {shapeMode === 'solid' ? 'Shape Objects' : 'Shape Holes'}
              </span>
            </div>
            {expandedSections.shapes ? (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
            )}
          </button>
          
          {expandedSections.shapes && (
            <div className="mt-4">
              {/* Shape Controls */}
              <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Size: {holeSize.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.05"
                    value={holeSize}
                    onChange={(e) => setHoleSize(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Depth: {holeDepth.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={holeDepth}
                    onChange={(e) => setHoleDepth(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Text Content</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text..."
                      className="flex-1 px-3 py-2 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-slate-400"
                    />
                    <button
                      onClick={() => createShape('text', 'Text')}
                      className={`px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 ${
                        !canUseShapes ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!canUseShapes}
                    >
                      <Type className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Shapes Grid */}
              <div className="grid grid-cols-3 gap-2">
                {shapes.map((shape, index) => (
                  <button
                    key={index}
                    onClick={() => createShape(shape.type, shape.name)}
                    className={`p-3 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-${shape.color}-500/20 hover:to-${shape.color}-600/20 border border-slate-700/50 hover:border-${shape.color}-500/30 transition-all duration-300 group flex flex-col items-center gap-1 hover:scale-105 hover:shadow-lg hover:shadow-${shape.color}-500/20 ${
                      !canUseShapes ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title={`${shape.name} ${shapeMode === 'solid' ? 'Object' : 'Hole'} (Quality: ${surfaceQuality})`}
                    disabled={!canUseShapes}
                  >
                    <shape.icon className={`w-5 h-5 text-slate-400 group-hover:text-${shape.color}-400 transition-colors`} />
                    <span className="text-xs font-medium text-slate-400 group-hover:text-white text-center leading-tight">
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
              
              {shapeMode === 'hole' && !selectedObject && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-400 text-center">
                    Select an object first to cut holes
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}