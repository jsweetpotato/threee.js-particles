const numPoints = 1000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(numPoints * 3);

for (let i = 0; i < numPoints; i++) {
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.morphAttributes.position = [];

// 형태 목표 정의
const morphTargets = [];
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

const targetGeometry = geometry.clone();

for (let i = 0; i < numPoints; i++) {
  const x = positions[i * 3] * 1.5;
  const y = positions[i * 3 + 1] * 1.5;
  const z = positions[i * 3 + 2] * 1.5;
  targetGeometry.attributes.position.setXYZ(i, x, y, z);
}

morphTargets.push(targetGeometry);

// Points 메시 생성
const material = new THREE.PointsMaterial({ size: 0.1, color: 0x00ff00 });
const mesh = new THREE.Points(geometry, material);
mesh.morphTargets = true;
mesh.updateMorphTargets();
mesh.frustumCulled = true;

scene.add(mesh);

// 카메라 위치 설정
camera.position.z = 5;

// 애니메이션 루프
const clock = new THREE.Clock();
let time = 0;

const animate = () => {
  const delta = clock.getDelta();
  time += delta;

  // 점 클라우드의 형태 목표를 변경
  const weight = Math.abs(Math.sin(time));
  mesh.morphTargetInfluences[0] = weight;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
