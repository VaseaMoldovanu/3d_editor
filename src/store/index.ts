import { create } from 'zustand';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

interface EditorState {
  objects: THREE.Object3D[];
  selectedObject: THREE.Object3D | null;
  selectedObjects: THREE.Object3D[];
  mode: 'translate' | 'rotate' | 'scale';
  shapeMode: 'solid' | 'hole';
  addObject: (object: THREE.Object3D) => void;
  removeObject: (object: THREE.Object3D) => void;
  setSelectedObject: (object: THREE.Object3D | null) => void;
  toggleObjectSelection: (object: THREE.Object3D) => void;
  clearSelection: () => void;
  setMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  setShapeMode: (mode: 'solid' | 'hole') => void;
  setObjectColor: (color: string) => void;
  groupObjects: () => void;
  ungroupObjects: (group: THREE.Group) => void;
  addHoleToObject: (holeGeometry: THREE.BufferGeometry) => void;
  addShapeAsObject: (geometry: THREE.BufferGeometry, name: string) => void;
}

// Enhanced material creation with realistic properties
const createRealisticMaterial = (color: number, materialType: 'metal' | 'plastic' | 'ceramic' | 'wood' = 'plastic') => {
  const baseColor = new THREE.Color(color);
  
  switch (materialType) {
    case 'metal':
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5,
        clearcoat: 0.1,
        clearcoatRoughness: 0.1,
      });
    
    case 'ceramic':
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness: 0.0,
        roughness: 0.2,
        envMapIntensity: 0.8,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      });
    
    case 'wood':
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness: 0.0,
        roughness: 0.8,
        envMapIntensity: 0.3,
      });
    
    default: // plastic
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness: 0.1,
        roughness: 0.4,
        envMapIntensity: 0.6,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
      });
  }
};

export const useEditorStore = create<EditorState>((set, get) => ({
  objects: [],
  selectedObject: null,
  selectedObjects: [],
  mode: 'translate',
  shapeMode: 'solid',
  
  addObject: (object) => {
    // Enhance object with realistic properties
    if ('material' in object) {
      const mesh = object as THREE.Mesh;
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        // Add subtle variations for realism
        mesh.material.roughness += (Math.random() - 0.5) * 0.1;
        mesh.material.metalness += (Math.random() - 0.5) * 0.05;
      }
    }
    
    // Add physics-like properties
    object.userData.mass = 1.0;
    object.userData.friction = 0.5;
    object.userData.restitution = 0.3;
    
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
  
  setShapeMode: (mode) => set({ shapeMode: mode }),
  
  setObjectColor: (color) => set((state) => {
    state.selectedObjects.forEach(obj => {
      if ('material' in obj) {
        const mesh = obj as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.color.setHex(parseInt(color.replace('#', '0x')));
              // Maintain realistic material properties
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
      const holeMesh = new THREE.Mesh(holeGeometry, new THREE.MeshStandardMaterial({ color: 0x000000 }));
      
      // Position hole at center of selected object
      holeMesh.position.set(0, 0, 0);
      
      // Convert geometries to CSG
      const originalCSG = CSG.fromMesh(mesh);
      const holeCSG = CSG.fromMesh(holeMesh);
      
      // Perform boolean subtraction
      const resultCSG = originalCSG.subtract(holeCSG);
      
      // Convert back to mesh
      const resultMesh = CSG.toMesh(resultCSG, mesh.matrix);
      
      // Preserve and enhance material properties
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        resultMesh.material = mesh.material.clone();
        // Add slight wear to cut surfaces
        (resultMesh.material as THREE.MeshStandardMaterial).roughness += 0.1;
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
      console.warn('CSG operation failed, falling back to visual hole:', error);
      
      // Enhanced fallback with better visual integration
      const holeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0a0a0a, 
        transparent: true, 
        opacity: 0.6,
        roughness: 0.9,
        metalness: 0.0,
        envMapIntensity: 0.1
      });
      
      const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
      holeMesh.position.set(0, 0, 0);
      holeMesh.name = 'Hole';
      holeMesh.castShadow = true;
      holeMesh.receiveShadow = true;
      
      mesh.add(holeMesh);
      
      return state;
    }
  }),

  addShapeAsObject: (geometry, name) => set((state) => {
    // More sophisticated material selection
    const materialTypes: Array<'metal' | 'plastic' | 'ceramic' | 'wood'> = ['metal', 'plastic', 'ceramic', 'wood'];
    const colors = [0x4a9eff, 0xff4a4a, 0x4aff4a, 0xffaa00, 0xff00ff, 0x00ffff, 0xffa500, 0x9370db];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomMaterialType = materialTypes[Math.floor(Math.random() * materialTypes.length)];
    
    const material = createRealisticMaterial(randomColor, randomMaterialType);
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // More natural positioning with slight randomization
    mesh.position.set(
      (Math.random() - 0.5) * 6,
      Math.random() * 3 + 0.5,
      (Math.random() - 0.5) * 6
    );
    
    // Add slight random rotation for realism
    mesh.rotation.set(
      (Math.random() - 0.5) * 0.2,
      Math.random() * Math.PI * 2,
      (Math.random() - 0.5) * 0.2
    );
    
    // Store material type for future reference
    mesh.userData.materialType = randomMaterialType;
    mesh.userData.mass = 1.0;
    mesh.userData.friction = 0.5;
    mesh.userData.restitution = 0.3;
    
    return { objects: [...state.objects, mesh] };
  }),
}));