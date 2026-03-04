import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ParticleSystem } from './particles.js';
import { HeroObject } from './objects.js';
import {
  initLoader,
  initHeroAnimation,
  initScrollAnimations,
  initCounters,
  initCursor,
  initThemeToggle,
  initMobileMenu,
  initProjectTilt,
  initMagneticButtons,
  initTextScramble,
  initKonamiCode,
  initContactForm,
  initGrain,
  initNavHighlight,
} from './animations.js';

// ===== Mobile Detection =====
const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent);

// ===== Scene =====
const canvas = document.getElementById('webgl');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: !isMobile,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.setClearColor(0x050510, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ===== Post-Processing (Desktop Only) =====
let composer = null;
let bloomPass = null;

if (!isMobile) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.6, 0.6, 0.2
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
}

// ===== 3D Objects (ambient only, no interaction) =====
const particles = new ParticleSystem(scene, isMobile);
const heroObject = new HeroObject(scene);

// ===== Scroll (only thing that affects 3D) =====
let scrollProgress = 0;
let scrollTarget = 0;

window.addEventListener('scroll', () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollTarget = maxScroll > 0 ? window.scrollY / maxScroll : 0;
}, { passive: true });

// ===== Resize =====
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (composer) {
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    }
  }, 100);
});

// ===== Theme =====
document.addEventListener('themechange', (e) => {
  const isLight = e.detail.theme === 'light';
  renderer.setClearColor(isLight ? 0xf0f0f5 : 0x050510, 1);
  if (bloomPass) bloomPass.strength = isLight ? 0.2 : 0.6;
});

// ===== Render Loop =====
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  // Smooth scroll
  scrollProgress += (scrollTarget - scrollProgress) * 0.05;

  // Camera — only subtle scroll parallax, no mouse
  camera.position.z = 8 - scrollProgress * 2;
  camera.lookAt(0, 0, 0);

  // Update ambient 3D
  particles.update(elapsed);
  heroObject.update(elapsed, scrollProgress);

  if (composer) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}

// ===== Init (all interaction is on page elements) =====
initGrain();
initCursor();
initThemeToggle();
initMobileMenu();
initProjectTilt();
initMagneticButtons();
initTextScramble();
initContactForm();
initNavHighlight();
initKonamiCode(() => {
  document.body.style.transition = 'filter 0.2s';
  document.body.style.filter = 'brightness(3) invert(1)';
  setTimeout(() => { document.body.style.filter = ''; }, 200);
});

initLoader(() => {
  initHeroAnimation();
  initScrollAnimations();
  initCounters();
});

animate();
