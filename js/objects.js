import * as THREE from 'three';

export class HeroObject {
  constructor(scene) {
    // Single calm wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(2, 1);
    this.mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: 0xbbbbcc,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    }));
    this.originalPositions = geo.attributes.position.array.slice();
    scene.add(this.mesh);
  }

  update(time, scrollProgress) {
    // Slow steady rotation
    this.mesh.rotation.x = time * 0.06;
    this.mesh.rotation.y = time * 0.08;

    // Gentle vertex breathing
    const positions = this.mesh.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const ox = this.originalPositions[i];
      const oy = this.originalPositions[i + 1];
      const oz = this.originalPositions[i + 2];
      const wave = Math.sin(time * 0.8 + ox * 2 + oy * 2) * 0.1;
      positions[i]     = ox + wave;
      positions[i + 1] = oy + Math.sin(time * 0.6 + oy * 2) * 0.1;
      positions[i + 2] = oz + Math.sin(time * 0.9 + oz * 2) * 0.08;
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;

    // Fade on scroll
    this.mesh.material.opacity = Math.max(0.02, 0.12 - scrollProgress * 0.15);
  }
}
