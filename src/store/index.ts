import { create } from 'zustand';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { Text } from 'troika-three-text';

interface EditorState {
  objects: THREE.Object3D[];
  selectedObject: THREE.Object3D | null;
  selectedObjects: THREE.Object3D[];
  mode: 'translate' | 'rotate' | 'scale';
  shapeMode: 'solid' | 'hole';
  showHoles: boolean;
  addObject: (object: THREE.Object3D) => void;
  removeObject: (object: THREE.Object3D) => void;
  setSelectedObject: (object: THREE.Object3D | null) => void;
  toggleObjectSelection: (object: THREE.Object3D) => void;
  clearSelection: () => void;
  setMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  setShapeMode: (mode: 'solid' | 'hole') => void;
  setShowHoles: (show: boolean) => void;
  setObjectColor: (color: string) => void;
  groupObjects: () => void;
  ungroupObjects: (group: THREE.Group) => void;
  addHoleToObject: (holeGeometry: THREE.BufferGeometry) => void;
  addShapeAsObject: (geometry: THREE.BufferGeometry, name: string) => void;
  createTextObject: (text: string, size: number, depth: number, font: string) => void;
  alignObjects: (type: string) => void;
}

// Tinkercad-style material creation
const createTinkercadMaterial = (color: number, isHole: boolean = false, showHoles: boolean = false) => {
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

export const useEditorStore = create<EditorState>((set, get) => ({
  objects: [],
  selectedObject: null,
  selectedObjects: [],
  mode: 'translate',
  shapeMode: 'solid',
  showHoles: false,
  
  addObject: (object) => {
    // Position objects on the baseplate
    if (object.position.y === 0) {
      const bbox = new THREE.Box3().setFromObject(object);
      const height = bbox.max.y - bbox.min.y;
      object.position.y = height / 2;
    }
    
    // Add slight random positioning to avoid overlap
    object.position.x += (Math.random() - 0.5) * 0.2;
    object.position.z += (Math.random() - 0.5) * 0.2;
    
    set((state) => ({ objects: [...state.objects, object] }));
  },
  
  removeObject: (object) =>
    set((state) => ({ 
      objects: state.objects.filter((obj) => obj !== object),
      selectedObject: state.selectedObject === object ? null : state.selectedObject,
      selectedObjects: state.selectedObjects.filter((obj) => obj !== object)
    })),
  
  setSelectedObject: (object) => set({ 
    selectedObject: object,
    selectedObjects: object ? [object] : []
  }),
  
  toggleObjectSelection: (object) => set((state) => {
    const isSelected = state.selectedObjects.includes(object);
    const newSelectedObjects = isSelected 
      ? state.selectedObjects.filter(obj => obj !== object)
      : [...state.selectedObjects, object];
    
    return {
      selectedObjects: newSelectedObjects,
      selectedObject: newSelectedObjects.length === 1 ? newSelectedObjects[0] : null
    };
  }),
  
  clearSelection: () => set({ selectedObject: null, selectedObjects: [] }),
  
  setMode: (mode) => set({ mode }),
  
  setShapeMode: (mode) => set((state) => {
    // Update existing objects' appearance based on mode
    const updatedObjects = state.objects.map(obj => {
      if ('material' in obj) {
        const mesh = obj as THREE.Mesh;
        const isHole = obj.userData.isHole;
        
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          if (isHole && mode === 'hole') {
            mesh.material.color.setHex(0xff4444);
            mesh.material.transparent = true;
            mesh.material.opacity = 0.6;
          } else if (isHole && mode === 'solid') {
            mesh.material.transparent = false;
            mesh.material.opacity = 1.0;
          }
          mesh.material.needsUpdate = true;
        }
      }
      return obj;
    });
    
    return { shapeMode: mode, objects: updatedObjects };
  }),
  
  setShowHoles: (show) => set((state) => {
    // Update hole visibility
    const updatedObjects = state.objects.map(obj => {
      if ('material' in obj && obj.userData.isHole) {
        const mesh = obj as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          if (show) {
            mesh.material.color.setHex(0xff4444);
            mesh.material.transparent = true;
            mesh.material.opacity = 0.6;
          } else {
            mesh.material.transparent = false;
            mesh.material.opacity = 1.0;
          }
          mesh.material.needsUpdate = true;
        }
      }
      return obj;
    });
    
    return { showHoles: show, objects: updatedObjects };
  }),
  
  setObjectColor: (color) => set((state) => {
    state.selectedObjects.forEach(obj => {
      if ('material' in obj && !obj.userData.isHole) {
        const mesh = obj as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.color.setHex(parseInt(color.replace('#', '0x')));
              mat.needsUpdate = true;
            }
          });
        } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.color.setHex(parseInt(color.replace('#', '0x')));
          mesh.material.needsUpdate = true;
        }
      }
    });
    return state;
  }),
  
  groupObjects: () => set((state) => {
    if (state.selectedObjects.length < 2) return state;
    
    const group = new THREE.Group();
    group.name = 'Group';
    group.userData.isGroup = true;
    
    // Calculate center position
    const box = new THREE.Box3();
    state.selectedObjects.forEach(obj => {
      const objBox = new THREE.Box3().setFromObject(obj);
      box.union(objBox);
    });
    const center = box.getCenter(new THREE.Vector3());
    
    // Add objects to group and adjust positions
    state.selectedObjects.forEach(obj => {
      const worldPos = new THREE.Vector3();
      obj.getWorldPosition(worldPos);
      group.add(obj);
      obj.position.copy(worldPos.sub(center));
    });
    
    group.position.copy(center);
    
    const newObjects = state.objects.filter(obj => !state.selectedObjects.includes(obj));
    newObjects.push(group);
    
    return { 
      objects: newObjects,
      selectedObject: group,
      selectedObjects: [group]
    };
  }),
  
  ungroupObjects: (group) => set((state) => {
    const children = [...group.children] as THREE.Object3D[];
    const worldPos = new THREE.Vector3();
    group.getWorldPosition(worldPos);
    
    // Remove children from group and add to scene
    children.forEach(child => {
      group.remove(child);
      const childWorldPos = new THREE.Vector3();
      child.getWorldPosition(childWorldPos);
      child.position.copy(childWorldPos);
    });
    
    const newObjects = state.objects.filter(obj => obj !== group);
    newObjects.push(...children);
    
    return {
      objects: newObjects,
      selectedObject: children[0] || null,
      selectedObjects: children.slice(0, 1)
    };
  }),

  addHoleToObject: (holeGeometry) => set((state) => {
    if (!state.selectedObject || !('geometry' in state.selectedObject)) return state;
    
    const mesh = state.selectedObject as THREE.Mesh;
    
    try {
      // Create hole mesh
      const holeMaterial = createTinkercadMaterial(0xff4444, true, state.showHoles);
      const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
      
      // Position hole at center of selected object
      holeMesh.position.set(0, 0, 0);
      
      // Convert geometries to CSG
      const originalCSG = CSG.fromMesh(mesh);
      const holeCSG = CSG.fromMesh(holeMesh);
      
      // Perform boolean subtraction
      const resultCSG = originalCSG.subtract(holeCSG);
      
      // Convert back to mesh
      const resultMesh = CSG.toMesh(resultCSG, mesh.matrix);
      
      // Preserve material properties
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        resultMesh.material = mesh.material.clone();
      } else {
        resultMesh.material = mesh.material;
      }
      
      resultMesh.position.copy(mesh.position);
      resultMesh.rotation.copy(mesh.rotation);
      resultMesh.scale.copy(mesh.scale);
      resultMesh.name = mesh.name;
      resultMesh.userData = { ...mesh.userData };
      resultMesh.castShadow = true;
      resultMesh.receiveShadow = true;
      
      // Replace original mesh with result
      const newObjects = state.objects.map(obj => obj === mesh ? resultMesh : obj);
      
      return {
        objects: newObjects,
        selectedObject: resultMesh,
        selectedObjects: [resultMesh]
      };
    } catch (error) {
      console.warn('CSG operation failed, adding visual hole:', error);
      
      // Fallback: add visual hole
      const holeMaterial = createTinkercadMaterial(0xff4444, true, state.showHoles);
      const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
      holeMesh.position.set(0, 0, 0);
      holeMesh.name = 'Hole';
      holeMesh.castShadow = true;
      holeMesh.receiveShadow = true;
      holeMesh.userData.isHole = true;
      
      mesh.add(holeMesh);
      
      return state;
    }
  }),

  addShapeAsObject: (geometry, name) => set((state) => {
    const colors = [0x4a9eff, 0xff4a4a, 0x4aff4a, 0xffaa00, 0xff00ff, 0x00ffff];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const material = createTinkercadMaterial(randomColor, state.shapeMode === 'hole', state.showHoles);
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isHole = state.shapeMode === 'hole';
    
    // Position on baseplate
    const bbox = new THREE.Box3().setFromObject(mesh);
    const height = bbox.max.y - bbox.min.y;
    mesh.position.set(
      (Math.random() - 0.5) * 4,
      height / 2,
      (Math.random() - 0.5) * 4
    );
    
    return { objects: [...state.objects, mesh] };
  }),

  createTextObject: (text, size, depth, font) => set((state) => {
    if (!text.trim()) return state;
    
    // Create 3D text using troika-three-text
    const textMesh = new Text();
    textMesh.text = text;
    textMesh.fontSize = size;
    textMesh.font = '/fonts/helvetiker_regular.typeface.json';
    textMesh.anchorX = 'center';
    textMesh.anchorY = 'middle';
    
    // Set material color based on shape mode
    const material = createTinkercadMaterial(0x4444ff, state.shapeMode === 'hole', state.showHoles);
    textMesh.material = material;
    
    // Set text properties
    textMesh.name = `Text: ${text}`;
    textMesh.castShadow = true;
    textMesh.receiveShadow = true;
    textMesh.userData.isHole = state.shapeMode === 'hole';
    textMesh.userData.isText = true;
    textMesh.userData.text = text;
    textMesh.userData.font = font;
    
    // Sync to generate geometry
    textMesh.sync();
    
    // Position on baseplate
    textMesh.position.set(0, depth / 2, 0);
    
    return { objects: [...state.objects, textMesh] };
  }),

  alignObjects: (type) => set((state) => {
    if (state.selectedObjects.length < 2) return state;
    
    const objects = state.selectedObjects;
    const boxes = objects.map(obj => new THREE.Box3().setFromObject(obj));
    
    switch (type) {
      case 'left': {
        const minX = Math.min(...boxes.map(box => box.min.x));
        objects.forEach((obj, i) => {
          const offset = minX - boxes[i].min.x;
          obj.position.x += offset;
        });
        break;
      }
      case 'center': {
        const centers = boxes.map(box => box.getCenter(new THREE.Vector3()).x);
        const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
        objects.forEach((obj, i) => {
          const offset = avgCenter - centers[i];
          obj.position.x += offset;
        });
        break;
      }
      case 'right': {
        const maxX = Math.max(...boxes.map(box => box.max.x));
        objects.forEach((obj, i) => {
          const offset = maxX - boxes[i].max.x;
          obj.position.x += offset;
        });
        break;
      }
      case 'top': {
        const maxY = Math.max(...boxes.map(box => box.max.y));
        objects.forEach((obj, i) => {
          const offset = maxY - boxes[i].max.y;
          obj.position.y += offset;
        });
        break;
      }
      case 'middle': {
        const centers = boxes.map(box => box.getCenter(new THREE.Vector3()).y);
        const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
        objects.forEach((obj, i) => {
          const offset = avgCenter - centers[i];
          obj.position.y += offset;
        });
        break;
      }
      case 'bottom': {
        const minY = Math.min(...boxes.map(box => box.min.y));
        objects.forEach((obj, i) => {
          const offset = minY - boxes[i].min.y;
          obj.position.y += offset;
        });
        break;
      }
    }
    
    return state;
  }),
}));