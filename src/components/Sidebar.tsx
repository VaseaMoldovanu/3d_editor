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
  Type
} from 'lucide-react';
import { useEditorStore } from '../store';
import * as THREE from 'three';

export default function Sidebar() {
  const { addObject, selectedObject, addHoleToObject } = useEditorStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    primitives: true,
    holes: false
  });
  const [holeSize, setHoleSize] = useState(0.3);
  const [holeDepth, setHoleDepth] = useState(0.5);
  const [textInput, setTextInput] = useState('HELLO');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Primitive creation functions
  const createBox = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x4a9eff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Box';
    addObject(mesh);
  };

  const createSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff4a4a });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Sphere';
    addObject(mesh);
  };

  const createCylinder = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x4aff4a });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Cylinder';
    addObject(mesh);
  };

  const createCone = () => {
    const geometry = new THREE.ConeGeometry(0.5, 1, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Cone';
    addObject(mesh);
  };

  const createTorus = () => {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Torus';
    addObject(mesh);
  };

  const createTetrahedron = () => {
    const geometry = new THREE.TetrahedronGeometry(0.7);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Tetrahedron';
    addObject(mesh);
  };

  // Hole creation functions
  const createCircleHole = () => {
    const geometry = new THREE.CylinderGeometry(holeSize, holeSize, holeDepth, 32);
    addHoleToObject(geometry);
  };

  const createSquareHole = () => {
    const geometry = new THREE.BoxGeometry(holeSize * 2, holeDepth, holeSize * 2);
    addHoleToObject(geometry);
  };

  const createTriangleHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
    shape.moveTo(0, size);
    shape.lineTo(-size, -size);
    shape.lineTo(size, -size);
    shape.lineTo(0, size);
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
  };

  const createStarHole = () => {
    const shape = new THREE.Shape();
    const outerRadius = holeSize;
    const innerRadius = holeSize * 0.5;
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
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
  };

  const createHeartHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
    
    shape.moveTo(0, -size * 0.5);
    shape.bezierCurveTo(0, -size * 0.8, -size * 0.8, -size * 0.8, -size * 0.5, -size * 0.3);
    shape.bezierCurveTo(-size * 0.8, 0, -size * 0.3, size * 0.3, 0, size * 0.8);
    shape.bezierCurveTo(size * 0.3, size * 0.3, size * 0.8, 0, size * 0.5, -size * 0.3);
    shape.bezierCurveTo(size * 0.8, -size * 0.8, 0, -size * 0.8, 0, -size * 0.5);
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
  };

  const createHexagonHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
  };

  const createCustomHole = (shapeType: string) => {
    let shape = new THREE.Shape();
    const size = holeSize;
    
    switch (shapeType) {
      case 'diamond':
        shape.moveTo(0, size);
        shape.lineTo(size * 0.7, 0);
        shape.lineTo(0, -size);
        shape.lineTo(-size * 0.7, 0);
        shape.closePath();
        break;
        
      case 'octagon':
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        shape.closePath();
        break;
        
      case 'plus':
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
        break;
        
      case 'lightning':
        shape.moveTo(-size * 0.2, size);
        shape.lineTo(size * 0.3, size * 0.2);
        shape.lineTo(size * 0.1, size * 0.2);
        shape.lineTo(size * 0.5, -size);
        shape.lineTo(-size * 0.1, -size * 0.3);
        shape.lineTo(size * 0.1, -size * 0.3);
        shape.lineTo(-size * 0.4, size);
        shape.closePath();
        break;
        
      case 'crescent':
        // Outer circle
        for (let i = 0; i <= 32; i++) {
          const angle = (i / 32) * Math.PI * 2;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        
        // Inner circle (hole)
        const hole = new THREE.Path();
        const offset = size * 0.3;
        for (let i = 0; i <= 32; i++) {
          const angle = (i / 32) * Math.PI * 2;
          const x = Math.cos(angle) * size * 0.7 + offset;
          const y = Math.sin(angle) * size * 0.7;
          
          if (i === 0) hole.moveTo(x, y);
          else hole.lineTo(x, y);
        }
        shape.holes.push(hole);
        break;
        
      default:
        // Default to circle
        for (let i = 0; i <= 32; i++) {
          const angle = (i / 32) * Math.PI * 2;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        break;
    }
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
  };

  const createTextHole = () => {
    if (!textInput.trim()) return;
    
    const textWidth = textInput.length * holeSize * 0.3;
    const textHeight = holeSize * 0.5;
    
    const shape = new THREE.Shape();
    shape.moveTo(-textWidth/2, -textHeight/2);
    shape.lineTo(textWidth/2, -textHeight/2);
    shape.lineTo(textWidth/2, textHeight/2);
    shape.lineTo(-textWidth/2, textHeight/2);
    shape.closePath();
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
  };

  const primitives = [
    { icon: Cube, name: 'Box', action: createBox, color: 'blue' },
    { icon: Sphere, name: 'Sphere', action: createSphere, color: 'red' },
    { icon: Cylinder, name: 'Cylinder', action: createCylinder, color: 'green' },
    { icon: Cone, name: 'Cone', action: createCone, color: 'orange' },
    { icon: Circle, name: 'Torus', action: createTorus, color: 'pink' },
    { icon: Triangle, name: 'Tetrahedron', action: createTetrahedron, color: 'cyan' },
  ];

  const holeShapes = [
    { icon: Circle, name: 'Circle', action: createCircleHole, color: 'blue' },
    { icon: Square, name: 'Square', action: createSquareHole, color: 'green' },
    { icon: Triangle, name: 'Triangle', action: createTriangleHole, color: 'yellow' },
    { icon: Star, name: 'Star', action: createStarHole, color: 'purple' },
    { icon: Heart, name: 'Heart', action: createHeartHole, color: 'red' },
    { icon: Hexagon, name: 'Hexagon', action: createHexagonHole, color: 'indigo' },
    { icon: Diamond, name: 'Diamond', action: () => createCustomHole('diamond'), color: 'pink' },
    { icon: Octagon, name: 'Octagon', action: () => createCustomHole('octagon'), color: 'teal' },
    { icon: Plus, name: 'Plus', action: () => createCustomHole('plus'), color: 'emerald' },
    { icon: Zap, name: 'Lightning', action: () => createCustomHole('lightning'), color: 'yellow' },
    { icon: Moon, name: 'Crescent', action: () => createCustomHole('crescent'), color: 'slate' },
    { icon: Sun, name: 'Sun', action: () => createCustomHole('sun'), color: 'orange' },
    { icon: Flower, name: 'Flower', action: () => createCustomHole('flower'), color: 'pink' },
    { icon: Crown, name: 'Crown', action: () => createCustomHole('crown'), color: 'yellow' },
    { icon: Shield, name: 'Shield', action: () => createCustomHole('shield'), color: 'blue' },
    { icon: Home, name: 'House', action: () => createCustomHole('house'), color: 'blue' },
    { icon: Car, name: 'Car', action: () => createCustomHole('car'), color: 'red' },
    { icon: Plane, name: 'Plane', action: () => createCustomHole('plane'), color: 'blue' },
    { icon: Key, name: 'Key', action: () => createCustomHole('key'), color: 'yellow' },
    { icon: Leaf, name: 'Leaf', action: () => createCustomHole('leaf'), color: 'green' },
    { icon: Fish, name: 'Fish', action: () => createCustomHole('fish'), color: 'blue' },
    { icon: Smile, name: 'Smiley', action: () => createCustomHole('smiley'), color: 'yellow' },
    { icon: Target, name: 'Target', action: () => createCustomHole('target'), color: 'red' },
    { icon: Phone, name: 'Phone', action: () => createCustomHole('phone'), color: 'gray' },
  ];

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 w-64 max-h-[80vh] overflow-y-auto">
      {/* Primitives Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('primitives')}
          className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800">3D Primitives</span>
          {expandedSections.primitives ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.primitives && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {primitives.map((primitive, index) => (
              <button
                key={index}
                onClick={primitive.action}
                className={`p-3 rounded-xl hover:bg-${primitive.color}-50 transition-all group flex flex-col items-center gap-1`}
                title={`Add ${primitive.name}`}
              >
                <primitive.icon className={`w-5 h-5 text-gray-700 group-hover:text-${primitive.color}-500 transition-colors`} />
                <span className="text-xs font-medium text-gray-600">{primitive.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Holes Section */}
      <div>
        <button
          onClick={() => toggleSection('holes')}
          className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800">Shape Holes</span>
          {expandedSections.holes ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.holes && (
          <div className="mt-2">
            {/* Hole Controls */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={holeSize}
                  onChange={(e) => setHoleSize(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-gray-500">{holeSize.toFixed(2)}</span>
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Depth</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={holeDepth}
                  onChange={(e) => setHoleDepth(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-gray-500">{holeDepth.toFixed(1)}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Text..."
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={createTextHole}
                    className={`px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors flex items-center gap-1 ${
                      !selectedObject ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!selectedObject}
                  >
                    <Type className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Hole Shapes Grid */}
            <div className="grid grid-cols-3 gap-2">
              {holeShapes.map((shape, index) => (
                <button
                  key={index}
                  onClick={shape.action}
                  className={`p-2 rounded-lg hover:bg-${shape.color}-50 transition-all group flex flex-col items-center gap-1 ${
                    !selectedObject ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={`${shape.name} Hole`}
                  disabled={!selectedObject}
                >
                  <shape.icon className={`w-4 h-4 text-gray-700 group-hover:text-${shape.color}-500 transition-colors`} />
                  <span className="text-xs font-medium text-gray-600 text-center leading-tight">
                    {shape.name}
                  </span>
                </button>
              ))}
            </div>
            
            {!selectedObject && (
              <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-700">
                  Select an object first to create holes
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}