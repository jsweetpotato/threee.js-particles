import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

const $canvas = document.querySelector(".webgl");

/** ---Scene--- */
const scene = new THREE.Scene();

/** ---Camera--- */
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 3;

/** ---Renderer--- */
const renderer = new THREE.WebGLRenderer({ canvas: $canvas, antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);

/** ---Controls--- */
const controls = new OrbitControls(camera, $canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.07;

/** ---Loader--- */
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => console.log("loaded");

const loader = new THREE.TextureLoader(loadingManager);
const alpha = loader.load("/alpha-map.jpg");

alpha.generateMipmaps = false;
alpha.minFilter = THREE.NearestFilter;
alpha.magFilter = THREE.NearestFilter;
const matcap1 = loader.load("/chrome.png");

/** ---Objects--- */

// Geometry
const count = 100;
const positionArray = new Float32Array(count * 3);

for (let i = 0; i < positionArray.length; i++) {
  positionArray[i * 3] = (Math.random() - 0.5) * 5;
  positionArray[i * 3 + 1] = (Math.random() - 0.5) * 5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 5;
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3);

const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute("position", positionAttribute);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  sizeAttenuation: true,
  alphaMap: alpha,
  side: THREE.DoubleSide,
});
particlesMaterial.transparent = true;

const particles = new THREE.Points(bufferGeometry, particlesMaterial);
scene.add(particles);

/** ---Gui--- */
// const gui = new GUI();

// gui
//   .add(particles, "geometry", {
//     BoxGeometry: boxGeometry,
//     SphereGeometry: sphereGeometry,
//     BufferGeometry: bufferGeometry,
//   })
//   .onChange(() => {
//     renderer.render(scene, camera);
//   });
// gui.add(particlesMaterial, "size", 0.01, 0.1, 0.001);
// gui.addColor(particlesMaterial, "color");

/** Animate */
const animate = () => {
  renderer.render(scene, camera);
  controls.update();

  particles.rotation.y += 0.001;
  particles.rotation.x += 0.001;
  requestAnimationFrame(animate);
};

animate();
