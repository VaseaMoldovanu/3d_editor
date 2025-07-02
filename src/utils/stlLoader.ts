import * as THREE from 'three';

export class STLLoader {
  load(data: string | ArrayBuffer): THREE.BufferGeometry {
    if (typeof data === 'string') {
      return this.parseASCII(data);
    } else {
      return this.parseBinary(data);
    }
  }
  
  private parseASCII(data: string): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const normals: number[] = [];
    
    const lines = data.split('\n');
    let currentNormal: THREE.Vector3 | null = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('facet normal')) {
        const parts = trimmed.split(/\s+/);
        currentNormal = new THREE.Vector3(
          parseFloat(parts[2]),
          parseFloat(parts[3]),
          parseFloat(parts[4])
        );
      } else if (trimmed.startsWith('vertex')) {
        const parts = trimmed.split(/\s+/);
        vertices.push(
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        );
        
        if (currentNormal) {
          normals.push(currentNormal.x, currentNormal.y, currentNormal.z);
        }
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    if (normals.length > 0) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    } else {
      geometry.computeVertexNormals();
    }
    
    return geometry;
  }
  
  private parseBinary(data: ArrayBuffer): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const dataView = new DataView(data);
    
    // Skip 80-byte header
    let offset = 80;
    
    // Read number of triangles
    const triangleCount = dataView.getUint32(offset, true);
    offset += 4;
    
    const vertices: number[] = [];
    const normals: number[] = [];
    
    for (let i = 0; i < triangleCount; i++) {
      // Read normal
      const nx = dataView.getFloat32(offset, true);
      const ny = dataView.getFloat32(offset + 4, true);
      const nz = dataView.getFloat32(offset + 8, true);
      offset += 12;
      
      // Read vertices
      for (let j = 0; j < 3; j++) {
        const vx = dataView.getFloat32(offset, true);
        const vy = dataView.getFloat32(offset + 4, true);
        const vz = dataView.getFloat32(offset + 8, true);
        offset += 12;
        
        vertices.push(vx, vy, vz);
        normals.push(nx, ny, nz);
      }
      
      // Skip attribute byte count
      offset += 2;
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    
    return geometry;
  }
}