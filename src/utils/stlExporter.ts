import * as THREE from 'three';

export class STLExporter {
  parse(scene: THREE.Object3D): string {
    const output: string[] = [];
    
    output.push('solid exported');
    
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.geometry) {
        this.parseMesh(object, output);
      }
    });
    
    output.push('endsolid exported');
    
    return output.join('\n');
  }
  
  private parseMesh(mesh: THREE.Mesh, output: string[]): void {
    const geometry = mesh.geometry;
    
    if (!geometry.attributes.position) return;
    
    const vertices = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    const indices = geometry.index;
    
    // Apply mesh transformations
    const matrix = mesh.matrixWorld;
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
    
    if (indices) {
      // Indexed geometry
      for (let i = 0; i < indices.count; i += 3) {
        const a = indices.getX(i);
        const b = indices.getX(i + 1);
        const c = indices.getX(i + 2);
        
        this.writeTriangle(output, vertices, normals, matrix, normalMatrix, a, b, c);
      }
    } else {
      // Non-indexed geometry
      for (let i = 0; i < vertices.count; i += 3) {
        this.writeTriangle(output, vertices, normals, matrix, normalMatrix, i, i + 1, i + 2);
      }
    }
  }
  
  private writeTriangle(
    output: string[],
    vertices: THREE.BufferAttribute,
    normals: THREE.BufferAttribute | undefined,
    matrix: THREE.Matrix4,
    normalMatrix: THREE.Matrix3,
    a: number,
    b: number,
    c: number
  ): void {
    const vA = new THREE.Vector3().fromBufferAttribute(vertices, a).applyMatrix4(matrix);
    const vB = new THREE.Vector3().fromBufferAttribute(vertices, b).applyMatrix4(matrix);
    const vC = new THREE.Vector3().fromBufferAttribute(vertices, c).applyMatrix4(matrix);
    
    let normal: THREE.Vector3;
    
    if (normals) {
      // Use existing normal
      normal = new THREE.Vector3().fromBufferAttribute(normals, a).applyMatrix3(normalMatrix).normalize();
    } else {
      // Calculate normal from triangle
      const cb = new THREE.Vector3().subVectors(vC, vB);
      const ab = new THREE.Vector3().subVectors(vA, vB);
      normal = cb.cross(ab).normalize();
    }
    
    output.push(`  facet normal ${normal.x.toExponential()} ${normal.y.toExponential()} ${normal.z.toExponential()}`);
    output.push('    outer loop');
    output.push(`      vertex ${vA.x.toExponential()} ${vA.y.toExponential()} ${vA.z.toExponential()}`);
    output.push(`      vertex ${vB.x.toExponential()} ${vB.y.toExponential()} ${vB.z.toExponential()}`);
    output.push(`      vertex ${vC.x.toExponential()} ${vC.y.toExponential()} ${vC.z.toExponential()}`);
    output.push('    endloop');
    output.push('  endfacet');
  }
}