import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();

// 카메라
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,1000
);
camera.position.set(0, 7, 15);

// 렌더러
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor('white')

//그림자 설정
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;


//동작
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enablePan = true // 마우스 평형이동
controls.enableZoom = true //줌인 줌아웃

// 바닥
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xf0ece1 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow =true
scene.add(floor);

// 벽 1
const wallGeometry = new THREE.PlaneGeometry(20, 10);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xccd8eb, side: THREE.DoubleSide });

const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 5, -10);
scene.add(wall1);

// 벽 2
const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall2.rotation.y = Math.PI / 2;
wall2.position.set(-10, 5, 0);
scene.add(wall2);

// 침대 몸체
const bedGeometry = new THREE.BoxGeometry(7.5, 2, 4); // 가로 , 높이 , 깊이
const bedMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff });
const bed = new THREE.Mesh(bedGeometry, bedMaterial);
bed.position.set(-5.65, 1, -7.5); // y는 반 높이로 해서 바닥 위에 올리기
bed.castShadow =true
scene.add(bed);

// 침대 머리맡 (헤드보드)
const headboardGeometry = new THREE.BoxGeometry(0.2, 3, 4);
const headboardMaterial = new THREE.MeshStandardMaterial({ color: 0x4466aa });
const headboard = new THREE.Mesh(headboardGeometry, headboardMaterial);
headboard.position.set(-9.5, 1.5, -7.5);
scene.add(headboard);

//창문

const WindowGeometry = new THREE.BoxGeometry(10,5,0.1)
const WindowMeterial = new THREE.MeshStandardMaterial({ color: 'white'})
const Window = new THREE.Mesh(WindowGeometry, WindowMeterial)
Window.position.set(-2,6,-9.85)
scene.add(Window)

//조명
const ambientLight = new THREE.AmbientLight('white', 2)
scene.add(ambientLight)

// Directional light (햇빛 같은 거)
const dirLight = new THREE.DirectionalLight('white', 2)
dirLight.castShadow = true
dirLight.position.set(-15, 16, 10)
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 8
scene.add(dirLight)

//빛을 보여줌
const helper = new THREE.DirectionalLightHelper(dirLight)
scene.add(helper)


// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  controls.update()
  renderer.render(scene, camera);
}
animate();

// 리사이즈 대응
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});