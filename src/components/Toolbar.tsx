import React from 'react';
import { Move, RotateCw, Maximize2, FileDown, Palette, Trash2, Group, Ungroup } from 'lucide-react';
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
    setObjectColor, 
    removeObject, 
    setSelectedObject, 
    groupObjects, 
    ungroupObjects 
  } = useEditorStore();

  const handleExport = () => {
    const exporter = new OBJExporter();
    const group = new THREE.Group();
    objects.forEach(obj => group.add(obj.clone()));
    
    const result = exporter.parse(group);
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene.obj';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectColor(e.target.value);
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

  const canGroup = selectedObjects.length > 1;
  const canUngroup = selectedObject && selectedObject.userData.isGroup;
  const hasSelection = selectedObjects.length > 0;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-3 flex gap-3 items-center">
      <div className="flex gap-2 p-1 bg-gray-100/80 rounded-xl">
        <button
          onClick={() => setMode('translate')}
          className={`p-2 rounded-lg transition-all ${
            mode === 'translate' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'hover:bg-white'
          }`}
          title="Move"
        >
          <Move className={`w-5 h-5 ${mode === 'translate' ? 'text-white' : 'text-gray-700'}`} />
        </button>
        <button
          onClick={() => setMode('rotate')}
          className={`p-2 rounded-lg transition-all ${
            mode === 'rotate' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'hover:bg-white'
          }`}
          title="Rotate"
        >
          <RotateCw className={`w-5 h-5 ${mode === 'rotate' ? 'text-white' : 'text-gray-700'}`} />
        </button>
        <button
          onClick={() => setMode('scale')}
          className={`p-2 rounded-lg transition-all ${
            mode === 'scale' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'hover:bg-white'
          }`}
          title="Scale"
        >
          <Maximize2 className={`w-5 h-5 ${mode === 'scale' ? 'text-white' : 'text-gray-700'}`} />
        </button>
      </div>
      
      <div className="w-px h-6 bg-gray-200 my-auto" />
      
      <div className="flex gap-2">
        <button
          onClick={handleGroup}
          className={`p-2 rounded-lg transition-all ${
            canGroup 
              ? 'hover:bg-green-50 hover:text-green-600' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          title={`Group Objects ${canGroup ? `(${selectedObjects.length})` : ''}`}
          disabled={!canGroup}
        >
          <Group className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={handleUngroup}
          className={`p-2 rounded-lg transition-all ${
            canUngroup 
              ? 'hover:bg-yellow-50 hover:text-yellow-600' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          title="Ungroup Objects"
          disabled={!canUngroup}
        >
          <Ungroup className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="relative group">
          <button
            className={`p-2 rounded-lg transition-all ${
              hasSelection 
                ? 'hover:bg-purple-50 hover:text-purple-600' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            title="Change Color"
            disabled={!hasSelection}
          >
            <Palette className="w-5 h-5 text-gray-700" />
          </button>
          <input
            type="color"
            onChange={handleColorChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            disabled={!hasSelection}
          />
        </div>
        
        <button
          onClick={handleDelete}
          className={`p-2 rounded-lg transition-all ${
            hasSelection 
              ? 'hover:bg-red-50 hover:text-red-500' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          title={`Delete ${selectedObjects.length > 1 ? `(${selectedObjects.length})` : ''}`}
          disabled={!hasSelection}
        >
          <Trash2 className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={handleExport}
          className="p-2 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600"
          title="Export as OBJ"
        >
          <FileDown className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}