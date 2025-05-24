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
}

export const useEditorStore = create<EditorState>((set) => ({
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
      (state.selectedObject as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color });
    }
    return state;
  }),
}));