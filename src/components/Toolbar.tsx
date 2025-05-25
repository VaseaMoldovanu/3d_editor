import React from 'react';
import { Move, RotateCw, Maximize2, FileDown, Palette, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import * as THREE from 'three';

export default function Toolbar() {
  const { mode, setMode, objects, selectedObject, setObjectColor, removeObject, setSelectedObject } = useEditorStore();

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

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-3 flex gap-3 items-center">
      <div className="flex gap-2 p-1 bg-gray-800/50 rounded-xl">
        <button
          onClick={() => setMode('translate')}
          className={`p-2 rounded-lg transition-all ${
            mode === 'translate' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'hover:bg-gray-700'
          }`}
          title="Move"
        >
          <Move className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setMode('rotate')}
          className={`p-2 rounded-lg transition-all ${
            mode === 'rotate' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'hover:bg-gray-700'
          }`}
          title="Rotate"
        >
          <RotateCw className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setMode('scale')}
          className={`p-2 rounded-lg transition-all ${
            mode === 'scale' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'hover:bg-gray-700'
          }`}
          title="Scale"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="w-px h-6 bg-gray-700 my-auto" />
      <div className="flex gap-2">
        <div className="relative group">
          <button
            className={`p-2 rounded-lg transition-all hover:bg-gray-700 ${!selectedObject ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Change Color"
            disabled={!selectedObject}
          >
            <Palette className="w-5 h-5 text-white" />
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
          className={`p-2 rounded-lg transition-all hover:bg-red-500/20 ${
            !selectedObject ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500'
          }`}
          title="Delete"
          disabled={!selectedObject}
        >
          <Trash2 className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleExport}
          className="p-2 rounded-lg transition-all hover:bg-gray-700"
          title="Export as OBJ"
        >
          <FileDown className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}