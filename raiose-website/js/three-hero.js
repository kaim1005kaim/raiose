// Three.js GLB hero loader (module)
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hero-3d-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  // Lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, 0.9);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(3, 5, 5);
  scene.add(dir);
  const ambient = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambient);

  // Resize handling
  function resize() {
    const w = container.clientWidth || 560;
    const h = container.clientHeight || 420;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Load GLB
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  // Use Google-hosted Draco decoders for reliability
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);
  let model = null;
  loader.load(
    'models/LOGO.glb',
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

      // Center and scale to fit
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center); // center at origin

      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const target = 2.6; // desired size in scene units
      const scale = target / maxDim;
      model.scale.setScalar(scale);

      // Slight tilt for depth
      model.rotation.x = 0.15;
      resize();
      animate();
    },
    undefined,
    (err) => {
      console.error('Failed to load GLB:', err);
      const msg = document.createElement('div');
      msg.style.cssText = 'color:#fff;opacity:0.8;font-size:14px;text-align:center;padding:12px;';
      msg.textContent = '3Dモデルを読み込めませんでした。ネットワーク接続やGLB形式（Draco圧縮など）をご確認ください。';
      container.appendChild(msg);
    }
  );

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      model.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
  }
});
