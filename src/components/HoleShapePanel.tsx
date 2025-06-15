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
  Shield,
  Home,
  Car,
  Plane,
  Gamepad2,
  Music,
  Coffee,
  Cake,
  Gift,
  Key,
  Lock,
  Wrench,
  Gear,
  Bolt,
  Anchor,
  Flame,
  Snowflake,
  Leaf,
  Fish,
  Bug,
  Rabbit,
  Cat,
  Dog,
  Bird,
  TreePine,
  Mountain,
  Cloud,
  Umbrella,
  Glasses,
  Watch,
  Phone,
  Camera,
  Headphones,
  Gamepad,
  Puzzle,
  Target,
  Award,
  Trophy,
  Medal,
  Flag,
  Bookmark,
  Tag,
  Paperclip,
  Scissors,
  Pen,
  Brush,
  Palette,
  Image,
  Map,
  Compass,
  Clock,
  Calendar,
  Bell,
  Volume2,
  Wifi,
  Battery,
  Zap as Lightning,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Heart as Love,
  ThumbsUp,
  Peace,
  HandMetal,
  Fingerprint,
  Footprints
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
  const [activeCategory, setActiveCategory] = useState('basic');

  if (!isOpen) return null;

  // Helper function to create basic shapes
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

  const createPolygonHole = (sides: number) => {
    const shape = new THREE.Shape();
    const size = holeSize;
    
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
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

  const createCrossHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
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
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
    onClose();
  };

  const createArrowHole = () => {
    const shape = new THREE.Shape();
    const size = holeSize;
    
    shape.moveTo(0, size);
    shape.lineTo(size * 0.5, size * 0.3);
    shape.lineTo(size * 0.2, size * 0.3);
    shape.lineTo(size * 0.2, -size);
    shape.lineTo(-size * 0.2, -size);
    shape.lineTo(-size * 0.2, size * 0.3);
    shape.lineTo(-size * 0.5, size * 0.3);
    shape.closePath();
    
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: holeDepth, bevelEnabled: false });
    addHoleToObject(geometry);
    onClose();
  };

  const createGearHole = () => {
    const shape = new THREE.Shape();
    const outerRadius = holeSize;
    const innerRadius = holeSize * 0.7;
    const teeth = 8;
    
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i / (teeth * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    
    // Add center hole
    const hole = new THREE.Path();
    const centerRadius = holeSize * 0.2;
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const x = Math.cos(angle) * centerRadius;
      const y = Math.sin(angle) * centerRadius;
      
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

  const createCustomShape = (shapeType: string) => {
    let shape = new THREE.Shape();
    const size = holeSize;
    
    switch (shapeType) {
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
        
      case 'flower':
        const petals = 6;
        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2;
          const petalSize = size * 0.8;
          const x1 = Math.cos(angle) * petalSize;
          const y1 = Math.sin(angle) * petalSize;
          const x2 = Math.cos(angle + Math.PI / petals) * size * 0.3;
          const y2 = Math.sin(angle + Math.PI / petals) * size * 0.3;
          
          if (i === 0) shape.moveTo(0, 0);
          shape.lineTo(x1, y1);
          shape.lineTo(x2, y2);
        }
        shape.closePath();
        break;
        
      case 'crown':
        shape.moveTo(-size, -size * 0.5);
        shape.lineTo(-size * 0.6, size * 0.8);
        shape.lineTo(-size * 0.3, size * 0.3);
        shape.lineTo(0, size);
        shape.lineTo(size * 0.3, size * 0.3);
        shape.lineTo(size * 0.6, size * 0.8);
        shape.lineTo(size, -size * 0.5);
        shape.closePath();
        break;
        
      case 'house':
        shape.moveTo(-size, -size);
        shape.lineTo(-size, size * 0.2);
        shape.lineTo(0, size);
        shape.lineTo(size, size * 0.2);
        shape.lineTo(size, -size);
        shape.closePath();
        break;
        
      case 'car':
        shape.moveTo(-size, -size * 0.3);
        shape.lineTo(-size * 0.7, size * 0.2);
        shape.lineTo(-size * 0.3, size * 0.5);
        shape.lineTo(size * 0.3, size * 0.5);
        shape.lineTo(size * 0.7, size * 0.2);
        shape.lineTo(size, -size * 0.3);
        shape.lineTo(size, -size);
        shape.lineTo(-size, -size);
        shape.closePath();
        break;
        
      case 'plane':
        shape.moveTo(0, size);
        shape.lineTo(-size * 0.8, -size * 0.2);
        shape.lineTo(-size * 0.3, -size * 0.2);
        shape.lineTo(-size * 0.2, -size);
        shape.lineTo(size * 0.2, -size);
        shape.lineTo(size * 0.3, -size * 0.2);
        shape.lineTo(size * 0.8, -size * 0.2);
        shape.closePath();
        break;
        
      case 'key':
        shape.moveTo(-size, -size * 0.8);
        shape.lineTo(-size, size * 0.8);
        shape.lineTo(-size * 0.3, size * 0.8);
        shape.lineTo(-size * 0.3, size * 0.3);
        shape.lineTo(size * 0.5, size * 0.3);
        shape.lineTo(size * 0.5, size * 0.1);
        shape.lineTo(size * 0.8, size * 0.1);
        shape.lineTo(size * 0.8, -size * 0.1);
        shape.lineTo(size * 0.5, -size * 0.1);
        shape.lineTo(size * 0.5, -size * 0.3);
        shape.lineTo(-size * 0.3, -size * 0.3);
        shape.lineTo(-size * 0.3, -size * 0.8);
        shape.closePath();
        break;
        
      case 'leaf':
        shape.moveTo(0, size);
        shape.bezierCurveTo(-size * 0.8, size * 0.3, -size * 0.8, -size * 0.3, 0, -size);
        shape.bezierCurveTo(size * 0.8, -size * 0.3, size * 0.8, size * 0.3, 0, size);
        break;
        
      case 'fish':
        shape.moveTo(size, 0);
        shape.bezierCurveTo(size * 0.3, size * 0.5, -size * 0.3, size * 0.3, -size * 0.8, 0);
        shape.lineTo(-size, size * 0.3);
        shape.lineTo(-size, -size * 0.3);
        shape.lineTo(-size * 0.8, 0);
        shape.bezierCurveTo(-size * 0.3, -size * 0.3, size * 0.3, -size * 0.5, size, 0);
        break;
        
      case 'butterfly':
        // Left wing
        shape.moveTo(0, 0);
        shape.bezierCurveTo(-size * 0.3, size * 0.8, -size * 0.8, size * 0.5, -size * 0.5, 0);
        shape.bezierCurveTo(-size * 0.8, -size * 0.3, -size * 0.3, -size * 0.5, 0, 0);
        // Right wing
        shape.bezierCurveTo(size * 0.3, -size * 0.5, size * 0.8, -size * 0.3, size * 0.5, 0);
        shape.bezierCurveTo(size * 0.8, size * 0.5, size * 0.3, size * 0.8, 0, 0);
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
    onClose();
  };

  const shapeCategories = {
    basic: [
      { icon: Circle, name: 'Circle', action: createCircleHole, color: 'blue' },
      { icon: Square, name: 'Square', action: createSquareHole, color: 'green' },
      { icon: Triangle, name: 'Triangle', action: createTriangleHole, color: 'yellow' },
      { icon: Diamond, name: 'Diamond', action: () => createPolygonHole(4), color: 'pink' },
      { icon: Hexagon, name: 'Pentagon', action: () => createPolygonHole(5), color: 'purple' },
      { icon: Hexagon, name: 'Hexagon', action: createHexagonHole, color: 'indigo' },
      { icon: Octagon, name: 'Heptagon', action: () => createPolygonHole(7), color: 'violet' },
      { icon: Octagon, name: 'Octagon', action: () => createPolygonHole(8), color: 'teal' },
      { icon: Circle, name: 'Decagon', action: () => createPolygonHole(10), color: 'cyan' },
      { icon: Circle, name: 'Dodecagon', action: () => createPolygonHole(12), color: 'lime' },
    ],
    symbols: [
      { icon: Star, name: 'Star', action: createStarHole, color: 'yellow' },
      { icon: Heart, name: 'Heart', action: createHeartHole, color: 'red' },
      { icon: Plus, name: 'Plus', action: createCrossHole, color: 'emerald' },
      { icon: Minus, name: 'Minus', action: () => createCustomShape('minus'), color: 'gray' },
      { icon: X, name: 'X Mark', action: () => createCustomShape('x'), color: 'red' },
      { icon: Zap, name: 'Lightning', action: () => createCustomShape('lightning'), color: 'yellow' },
      { icon: Moon, name: 'Crescent', action: () => createCustomShape('crescent'), color: 'slate' },
      { icon: Sun, name: 'Sun', action: () => createCustomShape('sun'), color: 'orange' },
      { icon: Flame, name: 'Flame', action: () => createCustomShape('flame'), color: 'red' },
      { icon: Snowflake, name: 'Snowflake', action: () => createCustomShape('snowflake'), color: 'blue' },
    ],
    nature: [
      { icon: Flower, name: 'Flower', action: () => createCustomShape('flower'), color: 'pink' },
      { icon: Leaf, name: 'Leaf', action: () => createCustomShape('leaf'), color: 'green' },
      { icon: TreePine, name: 'Tree', action: () => createCustomShape('tree'), color: 'green' },
      { icon: Fish, name: 'Fish', action: () => createCustomShape('fish'), color: 'blue' },
      { icon: Bug, name: 'Butterfly', action: () => createCustomShape('butterfly'), color: 'purple' },
      { icon: Rabbit, name: 'Rabbit', action: () => createCustomShape('rabbit'), color: 'gray' },
      { icon: Cat, name: 'Cat', action: () => createCustomShape('cat'), color: 'orange' },
      { icon: Dog, name: 'Dog', action: () => createCustomShape('dog'), color: 'brown' },
      { icon: Bird, name: 'Bird', action: () => createCustomShape('bird'), color: 'blue' },
      { icon: Mountain, name: 'Mountain', action: () => createCustomShape('mountain'), color: 'gray' },
    ],
    objects: [
      { icon: Home, name: 'House', action: () => createCustomShape('house'), color: 'blue' },
      { icon: Car, name: 'Car', action: () => createCustomShape('car'), color: 'red' },
      { icon: Plane, name: 'Plane', action: () => createCustomShape('plane'), color: 'blue' },
      { icon: Key, name: 'Key', action: () => createCustomShape('key'), color: 'yellow' },
      { icon: Lock, name: 'Lock', action: () => createCustomShape('lock'), color: 'gray' },
      { icon: Crown, name: 'Crown', action: () => createCustomShape('crown'), color: 'yellow' },
      { icon: Shield, name: 'Shield', action: () => createCustomShape('shield'), color: 'blue' },
      { icon: Anchor, name: 'Anchor', action: () => createCustomShape('anchor'), color: 'gray' },
      { icon: Gear, name: 'Gear', action: createGearHole, color: 'gray' },
      { icon: Wrench, name: 'Wrench', action: () => createCustomShape('wrench'), color: 'gray' },
    ],
    tech: [
      { icon: Phone, name: 'Phone', action: () => createCustomShape('phone'), color: 'gray' },
      { icon: Camera, name: 'Camera', action: () => createCustomShape('camera'), color: 'black' },
      { icon: Headphones, name: 'Headphones', action: () => createCustomShape('headphones'), color: 'black' },
      { icon: Gamepad, name: 'Gamepad', action: () => createCustomShape('gamepad'), color: 'blue' },
      { icon: Watch, name: 'Watch', action: () => createCustomShape('watch'), color: 'silver' },
      { icon: Wifi, name: 'WiFi', action: () => createCustomShape('wifi'), color: 'blue' },
      { icon: Battery, name: 'Battery', action: () => createCustomShape('battery'), color: 'green' },
      { icon: Lightning, name: 'Bolt', action: () => createCustomShape('bolt'), color: 'yellow' },
      { icon: Glasses, name: 'Glasses', action: () => createCustomShape('glasses'), color: 'gray' },
      { icon: Puzzle, name: 'Puzzle', action: () => createCustomShape('puzzle'), color: 'blue' },
    ],
    arrows: [
      { icon: Triangle, name: 'Arrow Up', action: createArrowHole, color: 'blue' },
      { icon: Triangle, name: 'Arrow Right', action: () => createCustomShape('arrow-right'), color: 'blue' },
      { icon: Triangle, name: 'Arrow Down', action: () => createCustomShape('arrow-down'), color: 'blue' },
      { icon: Triangle, name: 'Arrow Left', action: () => createCustomShape('arrow-left'), color: 'blue' },
      { icon: Target, name: 'Target', action: () => createCustomShape('target'), color: 'red' },
      { icon: Compass, name: 'Compass', action: () => createCustomShape('compass'), color: 'blue' },
      { icon: Map, name: 'Location', action: () => createCustomShape('location'), color: 'red' },
      { icon: Flag, name: 'Flag', action: () => createCustomShape('flag'), color: 'red' },
      { icon: Bookmark, name: 'Bookmark', action: () => createCustomShape('bookmark'), color: 'blue' },
      { icon: Tag, name: 'Tag', action: () => createCustomShape('tag'), color: 'orange' },
    ],
    faces: [
      { icon: Smile, name: 'Happy', action: () => createCustomShape('happy'), color: 'yellow' },
      { icon: Frown, name: 'Sad', action: () => createCustomShape('sad'), color: 'blue' },
      { icon: Meh, name: 'Neutral', action: () => createCustomShape('neutral'), color: 'gray' },
      { icon: Angry, name: 'Angry', action: () => createCustomShape('angry'), color: 'red' },
      { icon: Laugh, name: 'Laughing', action: () => createCustomShape('laughing'), color: 'yellow' },
      { icon: Eye, name: 'Eye', action: () => createCustomShape('eye'), color: 'blue' },
      { icon: ThumbsUp, name: 'Thumbs Up', action: () => createCustomShape('thumbs-up'), color: 'green' },
      { icon: Peace, name: 'Peace', action: () => createCustomShape('peace'), color: 'blue' },
      { icon: HandMetal, name: 'Rock On', action: () => createCustomShape('rock-on'), color: 'purple' },
      { icon: Fingerprint, name: 'Fingerprint', action: () => createCustomShape('fingerprint'), color: 'gray' },
    ]
  };

  const categories = [
    { id: 'basic', name: 'Basic Shapes', icon: Square },
    { id: 'symbols', name: 'Symbols', icon: Star },
    { id: 'nature', name: 'Nature', icon: Leaf },
    { id: 'objects', name: 'Objects', icon: Home },
    { id: 'tech', name: 'Technology', icon: Phone },
    { id: 'arrows', name: 'Arrows & Nav', icon: Target },
    { id: 'faces', name: 'Faces & Hands', icon: Smile },
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shape Hole Library
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Hole</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={createTextHole}
                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
              >
                <Type className="w-3 h-3" />
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Shape Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-10 gap-3 pb-4">
            {shapeCategories[activeCategory as keyof typeof shapeCategories]?.map((shape, index) => (
              <button
                key={index}
                onClick={shape.action}
                className={`p-3 rounded-2xl border-2 border-transparent hover:border-${shape.color}-200 hover:bg-${shape.color}-50 transition-all group flex flex-col items-center gap-2 min-h-[80px]`}
                title={shape.name}
              >
                <shape.icon className={`w-6 h-6 text-gray-600 group-hover:text-${shape.color}-500 transition-colors`} />
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800 text-center leading-tight">
                  {shape.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <p className="text-sm text-gray-700">
            <strong>💡 Pro Tip:</strong> Select an object first, then choose from {Object.values(shapeCategories).flat().length}+ shapes to create holes. 
            Use the sliders to adjust size and depth, or create custom text holes!
          </p>
        </div>
      </div>
    </div>
  );
}