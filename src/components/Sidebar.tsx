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
  Type, 
  Sparkles, 
  Layers3, 
  Minus, 
  Settings,
  Home,
  Car,
  Plane,
  Key,
  Leaf,
  Fish,
  Smile,
  Target,
  Phone,
  Crown,
  Shield,
  Flower,
  Sun
} from 'lucide-react';
import { useEditorStore } from '../store';
import * as THREE from 'three';

export default function Sidebar() {
  const { 
    addObject, 
    selectedObject, 
    addHoleToObject, 
    addShapeAsObject,
    shapeMode,
    showHoles
  } = useEditorStore();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    primitives: true,
    shapes: true,
    text: true
  });
  const [holeSize, setHoleSize] = useState(0.5);
  const [holeDepth, setHoleDepth] = useState(0.5);
  const [textInput, setTextInput] = useState('HELLO');
  const [selectedMaterial, setSelectedMaterial] = useState<'plastic' | 'metal' | 'ceramic' | 'wood'>('plastic');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Tinkercad-style material creation
  const createTinkercadMaterial = (color: number, isHole: boolean = false) => {
    const baseColor = new THREE.Color(color);
    
    if (isHole && showHoles) {
      return new THREE.MeshStandardMaterial({
        color: 0xff4444,
        transparent: true,
        opacity: 0.6,
        roughness: 0.4,
        metalness: 0.1,
      });
    }
    
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.3,
      metalness: 0.1,
      envMapIntensity: 0.5,
    });
  };

  // Enhanced primitive creation functions
  const createBox = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = createTinkercadMaterial(0x4a9eff, shapeMode === 'hole');
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Box';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = shapeMode === 'hole';
    mesh.position.set(0, 0.5, 0);
    addObject(mesh);
  };

  const createSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = createTinkercadMaterial(0xff4a4a, shapeMode === 'hole');
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Sphere';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = shapeMode === 'hole';
    mesh.position.set(0, 0.5, 0);
    addObject(mesh);
  };

  const createCylinder = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = createTinkercadMaterial(0x4aff4a, shapeMode === 'hole');
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Cylinder';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = shapeMode === 'hole';
    mesh.position.set(0, 0.5, 0);
    addObject(mesh);
  };

  const createCone = () => {
    const geometry = new THREE.ConeGeometry(0.5, 1, 32);
    const material = createTinkercadMaterial(0xffaa00, shapeMode === 'hole');
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Cone';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = shapeMode === 'hole';
    mesh.position.set(0, 0.5, 0);
    addObject(mesh);
  };

  const createTorus = () => {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    const material = createTinkercadMaterial(0xff00ff, shapeMode === 'hole');
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Torus';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = shapeMode === 'hole';
    mesh.position.set(0, 0.5, 0);
    addObject(mesh);
  };

  // Enhanced text creation
  const createText = () => {
    if (!textInput.trim()) return;
    
    // Create a simple extruded text geometry
    const textWidth = textInput.length * 0.3;
    const textHeight = 0.5;
    const textDepth = holeDepth;
    
    const geometry = new THREE.BoxGeometry(textWidth, textHeight, textDepth);
    const material = createTinkercadMaterial(0x4444ff, shapeMode === 'hole');
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.name = `Text: ${textInput}`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = shapeMode === 'hole';
    mesh.userData.isText = true;
    mesh.userData.text = textInput;
    mesh.position.set(0, textHeight / 2, 0);
    
    addObject(mesh);
  };

  // Shape creation functions
  const createShape = (shapeType: string, name: string) => {
    const geometry = createShapeGeometry(shapeType);
    const material = createTinkercadMaterial(getShapeColor(shapeType), shapeMode === 'hole');
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = shapeMode === 'hole';
    mesh.position.set(0, holeDepth / 2, 0);
    
    addObject(mesh);
  };

  const createShapeGeometry = (shapeType: string): THREE.BufferGeometry => {
    const size = holeSize;
    const segments = 32;
    
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
      
      default:
        return new THREE.CylinderGeometry(size, size, holeDepth, segments);
    }
  };

  const getShapeColor = (shapeType: string): number => {
    const colors: Record<string, number> = {
      circle: 0x4a9eff,
      square: 0x4aff4a,
      triangle: 0xffaa00,
      star: 0xff00ff,
      heart: 0xff4a4a,
      hexagon: 0x00ffff,
      diamond: 0xffa500,
      octagon: 0x9370db,
    };
    return colors[shapeType] || 0x888888;
  };

  const primitives = [
    { icon: Cube, name: 'Box', action: createBox, color: 'blue' },
    { icon: Sphere, name: 'Sphere', action: createSphere, color: 'red' },
    { icon: Cylinder, name: 'Cylinder', action: createCylinder, color: 'green' },
    { icon: Cone, name: 'Cone', action: createCone, color: 'orange' },
    { icon: Circle, name: 'Torus', action: createTorus, color: 'pink' },
  ];

  const shapes = [
    { icon: Circle, name: 'Circle', type: 'circle' },
    { icon: Square, name: 'Square', type: 'square' },
    { icon: Triangle, name: 'Triangle', type: 'triangle' },
    { icon: Star, name: 'Star', type: 'star' },
    { icon: Heart, name: 'Heart', type: 'heart' },
    { icon: Hexagon, name: 'Hexagon', type: 'hexagon' },
    { icon: Diamond, name: 'Diamond', type: 'diamond' },
    { icon: Octagon, name: 'Octagon', type: 'octagon' },
  ];

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 p-4 w-72 max-h-[85vh] overflow-y-auto">
        
        {/* Mode Indicator - Tinkercad style */}
        <div className={`mb-4 p-3 rounded-lg border-2 ${
          shapeMode === 'solid' 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {shapeMode === 'solid' ? (
              <Layers3 className="w-5 h-5 text-orange-600" />
            ) : (
              <Minus className="w-5 h-5 text-red-600" />
            )}
            <div>
              <h3 className={`font-semibold text-sm ${
                shapeMode === 'solid' ? 'text-orange-800' : 'text-red-800'
              }`}>
                {shapeMode === 'solid' ? 'Solid Mode' : 'Hole Mode'}
              </h3>
              <p className="text-xs text-gray-600">
                {shapeMode === 'solid' 
                  ? 'Create new objects' 
                  : 'Objects will appear red and transparent'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Primitives Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('primitives')}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-800">Basic Shapes</span>
            </div>
            {expandedSections.primitives ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.primitives && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {primitives.map((primitive, index) => (
                <button
                  key={index}
                  onClick={primitive.action}
                  className={`p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center gap-2 ${
                    shapeMode === 'hole' ? 'bg-red-50 border-red-200' : 'bg-white'
                  }`}
                  title={`Add ${primitive.name}`}
                >
                  <primitive.icon className={`w-6 h-6 ${
                    shapeMode === 'hole' ? 'text-red-600' : 'text-gray-600'
                  }`} />
                  <span className="text-xs font-medium text-gray-700">{primitive.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('text')}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-gray-800">Text</span>
            </div>
            {expandedSections.text ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.text && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Text Content</label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={createText}
                className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                  shapeMode === 'hole' 
                    ? 'bg-red-50 border-red-200 hover:bg-red-100 text-red-700' 
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
                }`}
                disabled={!textInput.trim()}
              >
                <Type className="w-4 h-4" />
                <span className="text-sm font-medium">Add Text</span>
              </button>
            </div>
          )}
        </div>

        {/* Shapes Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('shapes')}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-800">2D Shapes</span>
            </div>
            {expandedSections.shapes ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.shapes && (
            <div className="mt-3">
              {/* Shape Controls */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Size: {holeSize.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.2"
                    max="2"
                    step="0.1"
                    value={holeSize}
                    onChange={(e) => setHoleSize(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Height: {holeDepth.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={holeDepth}
                    onChange={(e) => setHoleDepth(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Shapes Grid */}
              <div className="grid grid-cols-3 gap-2">
                {shapes.map((shape, index) => (
                  <button
                    key={index}
                    onClick={() => createShape(shape.type, shape.name)}
                    className={`p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center gap-1 ${
                      shapeMode === 'hole' ? 'bg-red-50 border-red-200' : 'bg-white'
                    }`}
                    title={`${shape.name} ${shapeMode === 'solid' ? 'Object' : 'Hole'}`}
                  >
                    <shape.icon className={`w-5 h-5 ${
                      shapeMode === 'hole' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                    <span className="text-xs font-medium text-gray-700 text-center">
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}