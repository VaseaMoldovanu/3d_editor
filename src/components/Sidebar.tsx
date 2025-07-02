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
    showHoles,
    createTextObject
  } = useEditorStore();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    primitives: true,
    shapes: true,
    text: true,
    complex: true
  });
  const [holeSize, setHoleSize] = useState(0.5);
  const [holeDepth, setHoleDepth] = useState(0.5);
  const [textInput, setTextInput] = useState('HELLO');
  const [textSize, setTextSize] = useState(0.5);
  const [textDepth, setTextDepth] = useState(0.1);
  const [selectedFont, setSelectedFont] = useState('Arial');

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

  // Real 3D text creation
  const createText = () => {
    if (!textInput.trim()) return;
    createTextObject(textInput, textSize, textDepth, selectedFont);
  };

  // Complex shapes
  const createComplexShape = (shapeType: string) => {
    let geometry: THREE.BufferGeometry;
    let name = '';
    
    switch (shapeType) {
      case 'gear':
        geometry = createGearGeometry();
        name = 'Gear';
        break;
      case 'spring':
        geometry = createSpringGeometry();
        name = 'Spring';
        break;
      case 'screw':
        geometry = createScrewGeometry();
        name = 'Screw';
        break;
      case 'pipe':
        geometry = createPipeGeometry();
        name = 'Pipe';
        break;
      case 'washer':
        geometry = createWasherGeometry();
        name = 'Washer';
        break;
      case 'nut':
        geometry = createNutGeometry();
        name = 'Nut';
        break;
      default:
        return;
    }
    
    const material = createTinkercadMaterial(getComplexShapeColor(shapeType), shapeMode === 'hole');
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = shapeMode === 'hole';
    mesh.position.set(0, 0.5, 0);
    addObject(mesh);
  };

  // Complex geometry creators
  const createGearGeometry = (): THREE.BufferGeometry => {
    const teeth = 12;
    const innerRadius = 0.3;
    const outerRadius = 0.5;
    const thickness = 0.2;
    
    const shape = new THREE.Shape();
    
    for (let i = 0; i <= teeth * 2; i++) {
      const angle = (i / (teeth * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    
    // Add center hole
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.1, 0, Math.PI * 2, false);
    shape.holes.push(hole);
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: false
    });
  };

  const createSpringGeometry = (): THREE.BufferGeometry => {
    const curve = new THREE.CatmullRomCurve3([]);
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const angle = t * Math.PI * 8; // 4 turns
      const x = Math.cos(angle) * 0.3;
      const z = Math.sin(angle) * 0.3;
      const y = t * 2 - 1; // Height from -1 to 1
      points.push(new THREE.Vector3(x, y, z));
    }
    
    curve.points = points;
    
    return new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
  };

  const createScrewGeometry = (): THREE.BufferGeometry => {
    const headGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const shaftGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    
    // Merge geometries
    const headMesh = new THREE.Mesh(headGeometry);
    const shaftMesh = new THREE.Mesh(shaftGeometry);
    shaftMesh.position.y = -0.75;
    
    headMesh.updateMatrix();
    shaftMesh.updateMatrix();
    
    const mergedGeometry = new THREE.BufferGeometry();
    const geometries = [headGeometry, shaftGeometry];
    const matrices = [headMesh.matrix, shaftMesh.matrix];
    
    return THREE.BufferGeometryUtils.mergeGeometries(geometries);
  };

  const createPipeGeometry = (): THREE.BufferGeometry => {
    const outerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const innerGeometry = new THREE.CylinderGeometry(0.35, 0.35, 2.1, 32);
    
    // This would need CSG for proper boolean operation
    // For now, return a simple tube
    return new THREE.RingGeometry(0.35, 0.5, 32);
  };

  const createWasherGeometry = (): THREE.BufferGeometry => {
    return new THREE.RingGeometry(0.2, 0.5, 32);
  };

  const createNutGeometry = (): THREE.BufferGeometry => {
    const shape = new THREE.Shape();
    const sides = 6;
    const radius = 0.4;
    
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    
    // Add center hole
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.15, 0, Math.PI * 2, false);
    shape.holes.push(hole);
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.3,
      bevelEnabled: false
    });
  };

  const getComplexShapeColor = (shapeType: string): number => {
    const colors: Record<string, number> = {
      gear: 0x888888,
      spring: 0x4a9eff,
      screw: 0x666666,
      pipe: 0x8B4513,
      washer: 0xcccccc,
      nut: 0x444444,
    };
    return colors[shapeType] || 0x888888;
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

  const complexShapes = [
    { icon: Settings, name: 'Gear', type: 'gear' },
    { icon: Zap, name: 'Spring', type: 'spring' },
    { icon: Plus, name: 'Screw', type: 'screw' },
    { icon: Circle, name: 'Pipe', type: 'pipe' },
    { icon: Target, name: 'Washer', type: 'washer' },
    { icon: Hexagon, name: 'Nut', type: 'nut' },
  ];

  const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia'];

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
              <span className="font-medium text-gray-800">3D Text</span>
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
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Font</label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fonts.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Size: {textSize.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.2"
                    max="2"
                    step="0.1"
                    value={textSize}
                    onChange={(e) => setTextSize(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Depth: {textDepth.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={textDepth}
                    onChange={(e) => setTextDepth(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
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
                <span className="text-sm font-medium">Add 3D Text</span>
              </button>
            </div>
          )}
        </div>

        {/* Complex Shapes Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('complex')}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-gray-800">Complex Shapes</span>
            </div>
            {expandedSections.complex ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.complex && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {complexShapes.map((shape, index) => (
                <button
                  key={index}
                  onClick={() => createComplexShape(shape.type)}
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