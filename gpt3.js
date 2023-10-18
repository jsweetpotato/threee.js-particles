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

// 기하 도형 생성
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 형태 목표를 정의 (크기 변화)
const morphTargets = [
  { scale: new THREE.Vector3(1, 1, 1) }, // 중립적인 상태
  { scale: new THREE.Vector3(1, 2, 1) }, // 크기를 높임
];

// 형태 목표를 메시에 적용
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.morphTargets = true;
mesh.updateMorphTargets();
mesh.frustumCulled = true;
mesh.geometry.morphTargets = morphTargets;

console.dir(mesh.geometry);

scene.add(mesh);

// 카메라 위치 설정
camera.position.z = 5;

// 애니메이션 루프
const clock = new THREE.Clock();
let time = 0;

const animate = () => {
  const delta = clock.getDelta();
  time += delta;

  // 형태 목표를 변경
  const weight = Math.abs(Math.sin(time));
  mesh.morphTargetInfluences[0] = 1 - weight;
  mesh.morphTargetInfluences[1] = weight;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// 창 크기 조정 시 카메라 비율 조정
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});
