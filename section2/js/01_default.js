import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
camera.position.set(50, 50, 50);
// set써서 x,y,z 한번에 설정 (카메라 위치(각도)바뀜)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x0e2255); //배경 컬러 (주석처리해버리면 -> 기본은 블랙)
document.body.appendChild(renderer.domElement);
// 요까지가 기본 설정 
{
    const axes = new THREE.AxesHelper(50);
    scene.add(axes);

    const gridHelper = new THREE.GridHelper(70, 20);
    scene.add(gridHelper);
} // 이부분 괄호 없어도 가능

const animete = () => {
    camera.lookAt(scene.position);
    //장면의 위치를 바라봄
    camera.updateProjectionMatrix();
    //변경된 값을 카메라에 적용한다

    renderer.render(scene, camera);
    requestAnimationFrame(animete);
};

const stageResize = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    //카메라 비율을 화면 비율에 맞춘다
};

animete();
window.addEventListener("resize", stageResize); // 윈도우 화면 크기에 맞게 리사이즈 (반응형)
