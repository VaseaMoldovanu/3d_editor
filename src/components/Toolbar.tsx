import React, { useState, useRef } from 'react';
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
  Home,
  Upload,
  Download,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter
} from 'lucide-react';
import { useEditorStore } from '../store';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import { STLExporter } from '../utils/stlExporter';
import { STLLoader } from '../utils/stlLoader';
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
    setShowHoles,
    addObject,
    alignObjects
  } = useEditorStore();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOBJExport = () => {
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
    setShowExportMenu(false);
  };

  const handleSTLExport = () => {
    const exporter = new STLExporter();
    const group = new THREE.Group();
    
    // Only export solid objects (not holes)
    objects.forEach(obj => {
      if (!obj.userData.isHole) {
        const cloned = obj.clone();
        cloned.updateMatrixWorld(true);
        group.add(cloned);
      }
    });
    
    const result = exporter.parse(group);
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tinkercad_model_${new Date().toISOString().slice(0, 10)}.stl`;
    link.click();
    
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleSTLImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const loader = new STLLoader();
        let geometry: THREE.BufferGeometry;
        
        if (file.name.toLowerCase().endsWith('.stl')) {
          // Determine if binary or ASCII
          const result = e.target?.result;
          if (result instanceof ArrayBuffer) {
            // Try binary first
            try {
              geometry = loader.load(result);
            } catch {
              // Fallback to ASCII
              const text = new TextDecoder().decode(result);
              geometry = loader.load(text);
            }
          } else if (typeof result === 'string') {
            geometry = loader.load(result);
          } else {
            throw new Error('Invalid file format');
          }
          
          // Create material
          const material = new THREE.MeshStandardMaterial({
            color: 0x4a9eff,
            roughness: 0.3,
            metalness: 0.1,
          });
          
          // Create mesh
          const mesh = new THREE.Mesh(geometry, material);
          mesh.name = file.name.replace(/\.[^/.]+$/, '');
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          // Center and scale the imported object
          const box = new THREE.Box3().setFromObject(mesh);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Move to origin
          mesh.position.sub(center);
          
          // Scale to reasonable size (max dimension = 2 units)
          const maxDimension = Math.max(size.x, size.y, size.z);
          if (maxDimension > 2) {
            const scale = 2 / maxDimension;
            mesh.scale.setScalar(scale);
          }
          
          // Position on baseplate
          const newBox = new THREE.Box3().setFromObject(mesh);
          const newSize = newBox.getSize(new THREE.Vector3());
          mesh.position.y = newSize.y / 2;
          
          addObject(mesh);
        }
      } catch (error) {
        console.error('Error importing STL file:', error);
        alert('Error importing STL file. Please check the file format.');
      }
    };
    
    // Read as ArrayBuffer for binary detection
    reader.readAsArrayBuffer(file);
    
    // Reset input
    event.target.value = '';
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
        addObject(cloned);
      });
    }
  };

  const handleAlign = (type: string) => {
    if (selectedObjects.length > 1) {
      alignObjects(type);
    }
    setShowAlignMenu(false);
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
  const canAlign = selectedObjects.length > 1;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl"
        onChange={handleFileChange}
        className="hidden"
      />

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
        
        {/* Import/Export */}
        <div className="flex gap-1">
          <button
            onClick={handleSTLImport}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200"
            title="Import STL"
          >
            <Upload className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200"
              title="Export Model"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {showExportMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[150px] z-50">
                <button
                  onClick={handleSTLExport}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Export STL
                </button>
                <button
                  onClick={handleOBJExport}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <FileDown className="w-4 h-4" />
                  Export OBJ
                </button>
              </div>
            )}
          </div>
        </div>
        
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
        
        {/* Shape Mode Toggle - Tinkercad Style */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setShapeMode('solid')}
            className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
              shapeMode === 'solid' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Solid Mode"
          >
            <Layers3 className="w-4 h-4" />
            Solid
          </button>
          <button
            onClick={() => setShapeMode('hole')}
            className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
              shapeMode === 'hole' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Hole Mode"
          >
            <Minus className="w-4 h-4" />
            Hole
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />
        
        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showColorPicker
                ? 'bg-blue-500 text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Colors & Hole Visibility"
          >
            <Palette className="w-5 h-5" />
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />
        
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
          
          {/* Alignment Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAlignMenu(!showAlignMenu)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                canAlign 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'opacity-40 cursor-not-allowed text-gray-400'
              }`}
              title="Align Objects"
              disabled={!canAlign}
            >
              <AlignCenter className="w-5 h-5" />
            </button>
            
            {showAlignMenu && canAlign && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                <button
                  onClick={() => handleAlign('left')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <AlignLeft className="w-4 h-4" />
                  Align Left
                </button>
                <button
                  onClick={() => handleAlign('center')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <AlignCenter className="w-4 h-4" />
                  Align Center
                </button>
                <button
                  onClick={() => handleAlign('right')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <AlignRight className="w-4 h-4" />
                  Align Right
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => handleAlign('top')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <AlignJustify className="w-4 h-4 rotate-90" />
                  Align Top
                </button>
                <button
                  onClick={() => handleAlign('middle')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <AlignVerticalJustifyCenter className="w-4 h-4" />
                  Align Middle
                </button>
                <button
                  onClick={() => handleAlign('bottom')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <AlignJustify className="w-4 h-4 rotate-90" />
                  Align Bottom
                </button>
              </div>
            )}
          </div>
          
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
      </div>

      {/* Tinkercad-style color palette */}
      {showColorPicker && (
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
                onClick={() => setShowHoles(!showHoles)}
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
            <span className="text-xs text-gray-500">Hold Ctrl to multi-select</span>
          </div>
        </div>
      )}
    </div>
  );
}