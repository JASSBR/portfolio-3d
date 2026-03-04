import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene, isMobile = false) {
    this.count = isMobile ? 800 : 2000;

    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    this.velocities = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      // Spread across a large sphere
      const radius = 4 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Very slow drift
      this.velocities[i3]     = (Math.random() - 0.5) * 0.001;
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.001;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.0005;

      // White/silver
      const b = 0.4 + Math.random() * 0.5;
      colors[i3]     = b * 0.9;
      colors[i3 + 1] = b * 0.92;
      colors[i3 + 2] = b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
    scene.add(this.points);
  }

  update(time) {
    const positions = this.points.geometry.attributes.position.array;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      positions[i3]     += this.velocities[i3];
      positions[i3 + 1] += this.velocities[i3 + 1];
      positions[i3 + 2] += this.velocities[i3 + 2];

      // Gentle wave
      positions[i3 + 1] += Math.sin(time * 0.2 + i * 0.01) * 0.0003;
    }

    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.rotation.y = time * 0.008;
  }
}
