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

// renderer.setClearColor('white')

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
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xfef6fa });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow =true
scene.add(floor);

// 도트 패턴 캔버스 생성
const size = 128; // 캔버스 크기
const canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

// 배경 (아이보리)
ctx.fillStyle = '#facbeeff';
ctx.fillRect(0, 0, size, size);

ctx.fillStyle = 'white';
const dotRadius = 2;   // 도트 크기
const spacing = 16;    // 도트 간격
for (let x = spacing / 2; x < size; x += spacing) {
    for (let y = spacing / 2; y < size; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 캔버스를 텍스처로 변환
const dotTexture = new THREE.CanvasTexture(canvas);
dotTexture.wrapS = THREE.RepeatWrapping;
dotTexture.wrapT = THREE.RepeatWrapping;
dotTexture.repeat.set(4, 2); // 반복 횟수 (가로, 세로)

// 벽 재질에 적용
const wallMaterial = new THREE.MeshStandardMaterial({
 color:0xfaa3ac,
  map: dotTexture,
  side: THREE.DoubleSide
});

// 벽 1
const wallGeometry = new THREE.PlaneGeometry(20, 10);
const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
wall1.position.set(0, 5, -10);
scene.add(wall1);

// 벽 2
const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
wall2.rotation.y = Math.PI / 2;
wall2.position.set(-10, 5, 0);
scene.add(wall2);

// 침대 몸체
const bedGeometry = new THREE.BoxGeometry(7.5, 2, 4); // 가로 , 높이 , 깊이
const bedMaterial = new THREE.MeshStandardMaterial({ color: 'white' });
const bed = new THREE.Mesh(bedGeometry, bedMaterial);
bed.position.set(-5.65, 1, -7.5); // y는 반 높이로 해서 바닥 위에 올리기
bed.castShadow =true
scene.add(bed);

// 침대 머리맡 (헤드보드)
const headboardGeometry = new THREE.BoxGeometry(0.2, 3, 4);
const headboardMaterial = new THREE.MeshStandardMaterial({ color: 'white' });
const headboard = new THREE.Mesh(headboardGeometry, headboardMaterial);
headboard.position.set(-9.5, 1.5, -7.5);
scene.add(headboard);

//창문
const WindowGeometry = new THREE.BoxGeometry(10,5,0.1)
const WindowMeterial = new THREE.MeshStandardMaterial({ color: 'white'})
const Window = new THREE.Mesh(WindowGeometry, WindowMeterial)
Window.position.set(-2,6,-9.85)
scene.add(Window)

const loader = new THREE.TextureLoader();
const bgTexture = loader.load('assets/images/landscape.jpg');
const bgGeometry = new THREE.PlaneGeometry(9, 4); // 창문 크기 맞추기
const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);

// 창문 뒤쪽 위치에 배치
bgPlane.position.set(-2, 6, -9.7); // 벽보다 살짝 뒤로
scene.add(bgPlane);
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

//포인트조명
const pointLight = new THREE.PointLight('gold',100)
pointLight.castShadow = true
dirLight.position.set(-15,15,10)
scene.add(pointLight)

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