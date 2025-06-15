import React, { useState } from 'react';
import { Move, RotateCw, Maximize2, FileDown, Palette, Trash2, Circle, Group, Ungroup } from 'lucide-react';
import { useEditorStore } from '../store';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import * as THREE from 'three';
import HoleShapePanel from './HoleShapePanel';

export default function Toolbar() {
  const { 
    mode, 
    setMode, 
    objects, 
    selectedObject, 
    setObjectColor, 
    removeObject, 
    setSelectedObject, 
    groupObjects, 
    ungroupObjects 
  } = useEditorStore();
  
  const [showHolePanel, setShowHolePanel] = useState(false);

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
    if (selectedObject) {
      removeObject(selectedObject);
      setSelectedObject(null);
    }
  };

  const handleGroup = () => {
    const selectedObjects = objects.filter(obj => obj.userData.selected);
    if (selectedObjects.length > 1) {
      groupObjects(selectedObjects);
    }
  };

  const handleUngroup = () => {
    if (selectedObject && selectedObject.type === 'Group') {
      ungroupObjects(selectedObject as THREE.Group);
    }
  };

  return (
    <>
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
            onClick={() => setShowHolePanel(true)}
            className={`p-2 rounded-lg transition-all hover:bg-orange-50 ${
              !selectedObject ? 'opacity-50 cursor-not-allowed' : 'hover:text-orange-600'
            }`}
            title="Create Shape Holes"
            disabled={!selectedObject}
          >
            <Circle className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={handleGroup}
            className="p-2 rounded-lg transition-all hover:bg-green-50 hover:text-green-600"
            title="Group Objects"
          >
            <Group className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={handleUngroup}
            className={`p-2 rounded-lg transition-all hover:bg-yellow-50 ${
              selectedObject?.type === 'Group' ? 'hover:text-yellow-600' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Ungroup Objects"
            disabled={selectedObject?.type !== 'Group'}
          >
            <Ungroup className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="relative group">
            <button
              className={`p-2 rounded-lg transition-all hover:bg-purple-50 ${!selectedObject ? 'opacity-50 cursor-not-allowed' : 'hover:text-purple-600'}`}
              title="Change Color"
              disabled={!selectedObject}
            >
              <Palette className="w-5 h-5 text-gray-700" />
            </button>
            <input
              type="color"
              onChange={handleColorChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={!selectedObject}
            />
          </div>
          
          <button
            onClick={handleDelete}
            className={`p-2 rounded-lg transition-all hover:bg-red-50 ${
              !selectedObject ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500'
            }`}
            title="Delete"
            disabled={!selectedObject}
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

      <HoleShapePanel 
        isOpen={showHolePanel} 
        onClose={() => setShowHolePanel(false)} 
      />
    </>
  );
}