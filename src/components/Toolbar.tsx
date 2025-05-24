import React from 'react';
import { Move, RotateCw, Maximize2, FileDown, Palette } from 'lucide-react';
import { useEditorStore } from '../store';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import * as THREE from 'three';

export default function Toolbar() {
  const { mode, setMode, objects, selectedObject, setObjectColor } = useEditorStore();

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

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 rounded-lg shadow-xl p-2 flex gap-2 items-center">
      <button
        onClick={() => setMode('translate')}
        className={`p-2 rounded ${
          mode === 'translate' ? 'bg-blue-500' : 'hover:bg-gray-800'
        }`}
        title="Move"
      >
        <Move className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => setMode('rotate')}
        className={`p-2 rounded ${
          mode === 'rotate' ? 'bg-blue-500' : 'hover:bg-gray-800'
        }`}
        title="Rotate"
      >
        <RotateCw className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => setMode('scale')}
        className={`p-2 rounded ${
          mode === 'scale' ? 'bg-blue-500' : 'hover:bg-gray-800'
        }`}
        title="Scale"
      >
        <Maximize2 className="w-5 h-5 text-white" />
      </button>
      <div className="w-px h-6 bg-gray-700 my-auto mx-1" />
      <div className="relative group">
        <button
          className={`p-2 rounded hover:bg-gray-800 ${!selectedObject ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        onClick={handleExport}
        className="p-2 rounded hover:bg-gray-800"
        title="Export as OBJ"
      >
        <FileDown className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}