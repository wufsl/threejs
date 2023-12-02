import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer;
let boxMesh;

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

let windowHalfX = WIDTH / 2;
let windowHalfY = HEIGHT / 2;

const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
    camera.position.set(50, 50, 50);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x0e2255); //배경 컬러
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    //카메라 컨트롤

    {
        const axes = new THREE.AxesHelper(50);
        scene.add(axes);

        const gridHelper = new THREE.GridHelper(70, 20);
        scene.add(gridHelper);
    }

    {
        const HemisphereLight = new THREE.HemisphereLight(
            0xc0daf5,
            0xc0daf5,
            0.3
        );
        HemisphereLight.position.set(-50, 50, -50);
        scene.add(HemisphereLight);

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(60, 60, 60);
        scene.add(spotLight);
    }

    const geometry = new THREE.BoxBufferGeometry(10, 10, 10);
    const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    boxMesh = new THREE.Mesh(geometry, material);
    scene.add(boxMesh);

    document.addEventListener("mousemove", onDocumentMouseMove);
    //마우스 이벤트 (마우스 움직일 때마다 실행시켜줌) => 마우스에 따라서 모델링(큐브)가 돌아감
};

const onDocumentMouseMove = (event) => {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    // X와 Y의 가운데가 0이 되도록 설정 (-부터 +로 설정)
    // console.log(mouseY);
    // console.log(event.clientX, windowHalfX, mouseX);
};

const animete = () => {
    targetX = mouseX * 0.003;
    targetY = mouseY * 0.002;
    // 숫자를 제어하면 움직일 값이 변경되므로 많이 돈다

    if (boxMesh) {
        boxMesh.rotation.y += 0.1 * (targetX - boxMesh.rotation.y);
        boxMesh.rotation.x += 0.1 * (targetY - boxMesh.rotation.x);
    }// 속도를 제어하기 위함, boxMesh가 있을떄만 작동 없으면 에러뜸

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

    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    //카메라 비율을 화면 비율에 맞춘다
};

init();
animete();
window.addEventListener("resize", stageResize);
