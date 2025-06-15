import React, { useState } from 'react';
import { 
  Circle, 
  Square, 
  Triangle, 
  Star, 
  Heart, 
  Hexagon,
  Type,
  Diamond,
  Octagon,
  Plus,
  Minus,
  X,
  Zap,
  Moon,
  Sun,
  Flower,
  Crown,
  Shield
} from 'lucide-react';
import { useEditorStore } from '../store';
import * as THREE from 'three';

interface HoleShapePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HoleShapePanel({ isOpen, onClose }: HoleShapePanelProps) {
  const { selectedObject, addHoleToObject } = useEditorStore();
  const [textInput, setTextInput] = useState('HELLO');
  const [holeDepth, setHoleDepth] = useState(0.5);
  const [holeSize, setHoleSize] = useState(0.3);

  if (!isOpen) return null;

  const createCircleHole = () => {
    const geometry = new THREE.CylinderGeometry(holeSize, holeSize, holeDepth, 32);
    addHoleToObject(geometry);
    onClose();
  };

  const createSquareHole = () => {
    const geometry = new THREE.BoxGeometry(holeSize * 2, holeDepth, holeSize * 2);
    addHoleToObject(geometry);
    onClose();
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
    onClose();
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
    onClose();
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
    onClose();
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
    onClose();
  };

  const createDiamondHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
    
    shape.moveTo(0, size);
    shape.lineTo(size * 0.7, 0);
    shape.lineTo(0, -size);
    shape.lineTo(-size * 0.7, 0);
    shape.closePath();
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
    onClose();
  };

  const createOctagonHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
    onClose();
  };

  const createPlusHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
    const thickness = size * 0.3;
    
    // Create plus shape
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
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
    onClose();
  };

  const createCrescentHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
    
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
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
    onClose();
  };

  const createTextHole = () => {
    if (!textInput.trim()) return;
    
    // Create a simple text shape using lines
    const loader = new THREE.FontLoader();
    
    // For now, create a simple rectangular approximation of text
    // In a real implementation, you'd load a font and create proper text geometry
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
    onClose();
  };

  const shapes = [
    { icon: Circle, name: 'Circle', action: createCircleHole, color: 'blue' },
    { icon: Square, name: 'Square', action: createSquareHole, color: 'green' },
    { icon: Triangle, name: 'Triangle', action: createTriangleHole, color: 'yellow' },
    { icon: Star, name: 'Star', action: createStarHole, color: 'purple' },
    { icon: Heart, name: 'Heart', action: createHeartHole, color: 'red' },
    { icon: Hexagon, name: 'Hexagon', action: createHexagonHole, color: 'indigo' },
    { icon: Diamond, name: 'Diamond', action: createDiamondHole, color: 'pink' },
    { icon: Octagon, name: 'Octagon', action: createOctagonHole, color: 'teal' },
    { icon: Plus, name: 'Plus', action: createPlusHole, color: 'emerald' },
    { icon: Moon, name: 'Crescent', action: createCrescentHole, color: 'slate' },
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Shape Hole
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hole Size</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={holeSize}
              onChange={(e) => setHoleSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500">{holeSize.toFixed(2)}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hole Depth</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={holeDepth}
              onChange={(e) => setHoleDepth(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500">{holeDepth.toFixed(1)}</span>
          </div>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Hole</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={createTextHole}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        {/* Shape Grid */}
        <div className="grid grid-cols-5 gap-3">
          {shapes.map((shape, index) => (
            <button
              key={index}
              onClick={shape.action}
              className={`p-4 rounded-2xl border-2 border-transparent hover:border-${shape.color}-200 hover:bg-${shape.color}-50 transition-all group flex flex-col items-center gap-2`}
              title={shape.name}
            >
              <shape.icon className={`w-8 h-8 text-gray-600 group-hover:text-${shape.color}-500 transition-colors`} />
              <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800">
                {shape.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Select an object first, then choose a shape to create a hole. 
            Adjust size and depth using the sliders above.
          </p>
        </div>
      </div>
    </div>
  );
}