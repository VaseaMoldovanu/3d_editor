import { create } from 'zustand';
import * as THREE from 'three';

interface EditorState {
  objects: THREE.Object3D[];
  selectedObject: THREE.Object3D | null;
  mode: 'translate' | 'rotate' | 'scale';
  addObject: (object: THREE.Object3D) => void;
  removeObject: (object: THREE.Object3D) => void;
  setSelectedObject: (object: THREE.Object3D | null) => void;
  setMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  setObjectColor: (color: string) => void;
  groupObjects: (objects: THREE.Object3D[]) => void;
  ungroupObjects: (group: THREE.Group) => void;
  addHoleToObject: (holeGeometry: THREE.BufferGeometry) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  objects: [],
  selectedObject: null,
  mode: 'translate',
  
  addObject: (object) => set((state) => ({ objects: [...state.objects, object] })),
  
  removeObject: (object) =>
    set((state) => ({ objects: state.objects.filter((obj) => obj !== object) })),
  
  setSelectedObject: (object) => set({ selectedObject: object }),
  
  setMode: (mode) => set({ mode }),
  
  setObjectColor: (color) => set((state) => {
    if (state.selectedObject && 'material' in state.selectedObject) {
      const mesh = state.selectedObject as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.color.setHex(parseInt(color.replace('#', '0x')));
          }
        });
      } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.color.setHex(parseInt(color.replace('#', '0x')));
      }
    }
    return state;
  }),
  
  groupObjects: (objectsToGroup) => set((state) => {
    if (objectsToGroup.length < 2) return state;
    
    const group = new THREE.Group();
    group.name = 'Group';
    
    // Calculate center position
    const box = new THREE.Box3();
    objectsToGroup.forEach(obj => {
      const objBox = new THREE.Box3().setFromObject(obj);
      box.union(objBox);
    });
    const center = box.getCenter(new THREE.Vector3());
    
    // Add objects to group and adjust positions
    objectsToGroup.forEach(obj => {
      const worldPos = new THREE.Vector3();
      obj.getWorldPosition(worldPos);
      group.add(obj);
      obj.position.sub(center);
    });
    
    group.position.copy(center);
    
    const newObjects = state.objects.filter(obj => !objectsToGroup.includes(obj));
    newObjects.push(group);
    
    return { 
      objects: newObjects,
      selectedObject: group
    };
  }),
  
  ungroupObjects: (group) => set((state) => {
    const children = [...group.children];
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
      selectedObject: children[0] || null
    };
  }),

  addHoleToObject: (holeGeometry) => set((state) => {
    if (!state.selectedObject || !('geometry' in state.selectedObject)) return state;
    
    const mesh = state.selectedObject as THREE.Mesh;
    
    // Create hole mesh with dark, semi-transparent material
    const holeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      transparent: true, 
      opacity: 0.4,
      roughness: 0.8,
      metalness: 0.1
    });
    
    const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
    
    // Position hole at center of selected object
    holeMesh.position.set(0, 0, 0);
    holeMesh.name = 'Hole';
    
    // Add hole as child of the selected object
    mesh.add(holeMesh);
    
    return state;
  }),
}));