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
  Scissors,
  RotateCcw,
  Undo2,
  Redo2
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
    ungroupObjects 
  } = useEditorStore();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
    link.download = `scene_${new Date().toISOString().slice(0, 10)}.obj`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectColor(e.target.value);
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

  const canGroup = selectedObjects.length > 1;
  const canUngroup = selectedObject && selectedObject.userData.isGroup;
  const hasSelection = selectedObjects.length > 0;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
      {/* Main Toolbar */}
      <div className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-4 flex gap-4 items-center mb-4">
        {/* Transform Controls */}
        <div className="flex gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-600/30">
          <button
            onClick={() => setMode('translate')}
            className={`p-3 rounded-lg transition-all duration-300 ${
              mode === 'translate' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 scale-105' 
                : 'hover:bg-slate-700/50 hover:scale-105'
            }`}
            title="Move Tool (G)"
          >
            <Move className={`w-5 h-5 ${mode === 'translate' ? 'text-white' : 'text-slate-300'}`} />
          </button>
          <button
            onClick={() => setMode('rotate')}
            className={`p-3 rounded-lg transition-all duration-300 ${
              mode === 'rotate' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 scale-105' 
                : 'hover:bg-slate-700/50 hover:scale-105'
            }`}
            title="Rotate Tool (R)"
          >
            <RotateCw className={`w-5 h-5 ${mode === 'rotate' ? 'text-white' : 'text-slate-300'}`} />
          </button>
          <button
            onClick={() => setMode('scale')}
            className={`p-3 rounded-lg transition-all duration-300 ${
              mode === 'scale' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 scale-105' 
                : 'hover:bg-slate-700/50 hover:scale-105'
            }`}
            title="Scale Tool (S)"
          >
            <Maximize2 className={`w-5 h-5 ${mode === 'scale' ? 'text-white' : 'text-slate-300'}`} />
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
        
        {/* Shape Mode Toggle */}
        <div className="flex gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-600/30">
          <button
            onClick={() => setShapeMode('solid')}
            className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              shapeMode === 'solid' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30 scale-105' 
                : 'hover:bg-slate-700/50 hover:scale-105'
            }`}
            title="Solid Mode - Create Objects"
          >
            <Layers3 className={`w-4 h-4 ${shapeMode === 'solid' ? 'text-white' : 'text-slate-300'}`} />
            <span className={`text-sm font-medium ${shapeMode === 'solid' ? 'text-white' : 'text-slate-300'}`}>
              Solid
            </span>
          </button>
          <button
            onClick={() => setShapeMode('hole')}
            className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              shapeMode === 'hole' 
                ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/30 scale-105' 
                : 'hover:bg-slate-700/50 hover:scale-105'
            }`}
            title="Hole Mode - Cut Holes"
          >
            <Minus className={`w-4 h-4 ${shapeMode === 'hole' ? 'text-white' : 'text-slate-300'}`} />
            <span className={`text-sm font-medium ${shapeMode === 'hole' ? 'text-white' : 'text-slate-300'}`}>
              Hole
            </span>
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
        
        {/* Edit Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDuplicate}
            className={`p-3 rounded-lg transition-all duration-300 ${
              hasSelection 
                ? 'hover:bg-blue-500/20 hover:text-blue-400 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20' 
                : 'opacity-40 cursor-not-allowed'
            }`}
            title="Duplicate (Shift+D)"
            disabled={!hasSelection}
          >
            <Copy className="w-5 h-5 text-slate-300" />
          </button>
          
          <button
            onClick={handleGroup}
            className={`p-3 rounded-lg transition-all duration-300 ${
              canGroup 
                ? 'hover:bg-emerald-500/20 hover:text-emerald-400 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20' 
                : 'opacity-40 cursor-not-allowed'
            }`}
            title={`Group Objects ${canGroup ? `(${selectedObjects.length})` : ''} (Ctrl+G)`}
            disabled={!canGroup}
          >
            <Group className="w-5 h-5 text-slate-300" />
          </button>
          
          <button
            onClick={handleUngroup}
            className={`p-3 rounded-lg transition-all duration-300 ${
              canUngroup 
                ? 'hover:bg-yellow-500/20 hover:text-yellow-400 hover:scale-110 hover:shadow-lg hover:shadow-yellow-500/20' 
                : 'opacity-40 cursor-not-allowed'
            }`}
            title="Ungroup Objects (Ctrl+Shift+G)"
            disabled={!canUngroup}
          >
            <Ungroup className="w-5 h-5 text-slate-300" />
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
        
        {/* Object Actions */}
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                hasSelection 
                  ? 'hover:bg-purple-500/20 hover:text-purple-400 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20' 
                  : 'opacity-40 cursor-not-allowed'
              }`}
              title="Change Color"
              disabled={!hasSelection}
            >
              <Palette className="w-5 h-5 text-slate-300" />
            </button>
            
            {showColorPicker && hasSelection && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur-xl rounded-xl p-4 border border-slate-600/50 shadow-2xl min-w-[200px]">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    '#ff4444', '#44ff44', '#4444ff', '#ffaa00', 
                    '#ff00ff', '#00ffff', '#ffffff', '#888888',
                    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
                    '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setObjectColor(color);
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded-lg border-2 border-slate-600 hover:scale-110 transition-transform shadow-lg hover:border-white"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  onChange={handleColorChange}
                  className="w-full h-10 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                />
              </div>
            )}
          </div>
          
          <button
            onClick={toggleWireframe}
            className={`p-3 rounded-lg transition-all duration-300 ${
              wireframeMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30 scale-105 text-white'
                : 'hover:bg-cyan-500/20 hover:text-cyan-400 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20 text-slate-300'
            }`}
            title="Toggle Wireframe (Z)"
          >
            {wireframeMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleDelete}
            className={`p-3 rounded-lg transition-all duration-300 ${
              hasSelection 
                ? 'hover:bg-red-500/20 hover:text-red-400 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20' 
                : 'opacity-40 cursor-not-allowed'
            }`}
            title={`Delete ${selectedObjects.length > 1 ? `(${selectedObjects.length})` : ''} (Delete)`}
            disabled={!hasSelection}
          >
            <Trash2 className="w-5 h-5 text-slate-300" />
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
        
        {/* Export & Settings */}
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="p-3 rounded-lg transition-all duration-300 hover:bg-blue-500/20 hover:text-blue-400 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
            title="Export as OBJ (Ctrl+E)"
          >
            <FileDown className="w-5 h-5 text-slate-300" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-lg transition-all duration-300 ${
              showSettings
                ? 'bg-gradient-to-r from-gray-500 to-slate-500 shadow-lg shadow-gray-500/30 scale-105 text-white'
                : 'hover:bg-gray-500/20 hover:text-gray-400 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/20 text-slate-300'
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Enhanced Status Bar */}
      {hasSelection && (
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-xl px-4 py-3 border border-slate-600/30 shadow-lg">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-300">
              Selected: <span className="text-white font-medium">{selectedObjects.length}</span>
            </span>
            <span className="text-slate-300">
              Mode: <span className={`font-medium ${
                shapeMode === 'solid' ? 'text-orange-400' : 'text-red-400'
              }`}>
                {shapeMode === 'solid' ? 'Solid Creation' : 'Hole Cutting'}
              </span>
            </span>
            <span className="text-slate-300">
              Tool: <span className="text-blue-400 font-medium capitalize">{mode}</span>
            </span>
            {selectedObject && 'userData' in selectedObject && selectedObject.userData.materialType && (
              <span className="text-slate-300">
                Material: <span className="text-purple-400 font-medium capitalize">
                  {selectedObject.userData.materialType}
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full mt-2 right-0 bg-slate-800/95 backdrop-blur-xl rounded-xl p-4 border border-slate-600/50 shadow-2xl min-w-[300px]">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Viewport Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Render Quality
              </label>
              <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white">
                <option>High Quality</option>
                <option>Medium Quality</option>
                <option>Performance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Shadow Quality
              </label>
              <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white">
                <option>Ultra</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Show Grid</span>
              <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Auto-save</span>
              <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}