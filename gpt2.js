import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
const renderer = new THREE.WebGLRenderer({ canvas: $canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

/** ---Controls--- */
const controls = new OrbitControls(camera, $canvas);

const numPoints = 1000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(numPoints * 3);
const colors = new Float32Array(numPoints * 3);

for (let i = 0; i < numPoints; i++) {
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Points 메시 생성
const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
const mesh = new THREE.Points(geometry, material);

scene.add(mesh);

// 카메라 위치 설정
camera.position.z = 5;

// 애니메이션 루프
const animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
