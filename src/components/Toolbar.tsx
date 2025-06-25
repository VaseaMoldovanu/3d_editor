import React, { useState } from 'react';
import { 
  Move, 
  RotateCw, 
  Maximize2, 
  FileDown, 
  Palette, 
  Trash2, 
  Group, 
  Ungroup,
  Layers3,
  Minus,
  Settings,
  Eye,
  EyeOff,
  Copy,
  Undo2,
  Redo2,
  Home
} from 'lucide-react';
import { useEditorStore } from '../store';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import * as THREE from 'three';

export default function Toolbar() {
  const { 
    mode, 
    setMode, 
    objects, 
    selectedObject, 
    selectedObjects,
    shapeMode,
    setShapeMode,
    setObjectColor, 
    removeObject, 
    setSelectedObject, 
    groupObjects, 
    ungroupObjects,
    showHoles,
    setShowHoles
  } = useEditorStore();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);

  const handleExport = () => {
    const exporter = new OBJExporter();
    const group = new THREE.Group();
    objects.forEach(obj => group.add(obj.clone()));
    
    const result = exporter.parse(group);
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tinkercad_model_${new Date().toISOString().slice(0, 10)}.obj`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleColorChange = (color: string) => {
    setObjectColor(color);
    setShowColorPicker(false);
  };

  const handleDelete = () => {
    if (selectedObjects.length > 0) {
      selectedObjects.forEach(obj => removeObject(obj));
      setSelectedObject(null);
    }
  };

  const handleGroup = () => {
    if (selectedObjects.length > 1) {
      groupObjects();
    }
  };

  const handleUngroup = () => {
    if (selectedObject && selectedObject.userData.isGroup) {
      ungroupObjects(selectedObject as THREE.Group);
    }
  };

  const handleDuplicate = () => {
    if (selectedObjects.length > 0) {
      selectedObjects.forEach(obj => {
        const cloned = obj.clone();
        cloned.position.add(new THREE.Vector3(1, 0, 1));
        // Add to store would need to be implemented
      });
    }
  };

  const toggleWireframe = () => {
    setWireframeMode(!wireframeMode);
    objects.forEach(obj => {
      if ('material' in obj) {
        const mesh = obj as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.wireframe = !wireframeMode;
            }
          });
        } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.wireframe = !wireframeMode;
        }
      }
    });
  };

  // Tinkercad-style hole visibility toggle
  const toggleHoleVisibility = () => {
    setShowHoles(!showHoles);
  };

  const canGroup = selectedObjects.length > 1;
  const canUngroup = selectedObject && selectedObject.userData.isGroup;
  const hasSelection = selectedObjects.length > 0;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      {/* Tinkercad-style main toolbar */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 p-3 flex gap-3 items-center mb-3">
        {/* Home button */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          title="Home"
        >
          <Home className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />
        
        {/* Transform Controls */}
        <div className="flex gap-1">
          <button
            onClick={() => setMode('translate')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              mode === 'translate' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Move Tool (G)"
          >
            <Move className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMode('rotate')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              mode === 'rotate' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Rotate Tool (R)"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMode('scale')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              mode === 'scale' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Scale Tool (S)"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />
        
        {/* Shape Mode Toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setShapeMode('solid')}
            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
              shapeMode === 'solid' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Solid Mode"
          >
            <Layers3 className="w-4 h-4" />
            Solid
          </button>
          <button
            onClick={() => setShapeMode('hole')}
            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
              shapeMode === 'hole' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Hole Mode"
          >
            <Minus className="w-4 h-4" />
            Hole
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />
        
        {/* Color Picker - Tinkercad style */}
        <div className="relative">
          <button
            onClick={toggleHoleVisibility}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showHoles
                ? 'bg-red-500 text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Show/Hide Holes (like Tinkercad)"
          >
            <Palette className="w-5 h-5" />
          </button>
        </div>
        
        {/* Edit Actions */}
        <div className="flex gap-1">
          <button
            onClick={handleDuplicate}
            className={`p-2 rounded-lg transition-all duration-200 ${
              hasSelection 
                ? 'hover:bg-gray-100 text-gray-600' 
                : 'opacity-40 cursor-not-allowed text-gray-400'
            }`}
            title="Duplicate (Ctrl+D)"
            disabled={!hasSelection}
          >
            <Copy className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleGroup}
            className={`p-2 rounded-lg transition-all duration-200 ${
              canGroup 
                ? 'hover:bg-gray-100 text-gray-600' 
                : 'opacity-40 cursor-not-allowed text-gray-400'
            }`}
            title={`Group Objects ${canGroup ? `(${selectedObjects.length})` : ''}`}
            disabled={!canGroup}
          >
            <Group className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleUngroup}
            className={`p-2 rounded-lg transition-all duration-200 ${
              canUngroup 
                ? 'hover:bg-gray-100 text-gray-600' 
                : 'opacity-40 cursor-not-allowed text-gray-400'
            }`}
            title="Ungroup Objects"
            disabled={!canUngroup}
          >
            <Ungroup className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleDelete}
            className={`p-2 rounded-lg transition-all duration-200 ${
              hasSelection 
                ? 'hover:bg-red-100 text-red-600' 
                : 'opacity-40 cursor-not-allowed text-gray-400'
            }`}
            title="Delete"
            disabled={!hasSelection}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />
        
        {/* Export */}
        <button
          onClick={handleExport}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200"
          title="Export as OBJ"
        >
          <FileDown className="w-5 h-5" />
        </button>
      </div>

      {/* Tinkercad-style color palette */}
      {showHoles && (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 p-4 max-w-md">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Object Colors</h3>
          <div className="grid grid-cols-8 gap-2 mb-4">
            {[
              '#ff4444', '#ff8844', '#ffaa00', '#88ff44', 
              '#44ff88', '#44ffff', '#4488ff', '#8844ff',
              '#ff44ff', '#ffffff', '#cccccc', '#888888',
              '#444444', '#000000', '#8B4513', '#228B22'
            ].map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-all duration-200 hover:scale-110 shadow-sm"
                style={{ backgroundColor: color }}
                title={`Set color to ${color}`}
              />
            ))}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Show holes as transparent</span>
              <button 
                onClick={toggleHoleVisibility}
                className={`w-12 h-6 rounded-full transition-all duration-200 ${
                  showHoles ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${
                  showHoles ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              In hole mode, objects appear red and transparent like in Tinkercad
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      {hasSelection && (
        <div className="bg-white/90 backdrop-blur-xl rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Selected: <span className="font-medium text-gray-800">{selectedObjects.length}</span></span>
            <span>Mode: <span className={`font-medium ${
              shapeMode === 'solid' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {shapeMode === 'solid' ? 'Solid' : 'Hole'}
            </span></span>
            <span>Tool: <span className="font-medium text-blue-600 capitalize">{mode}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}