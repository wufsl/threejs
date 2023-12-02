import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer;
let controls;

const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(80, WIDTH / HEIGHT, 0.1, 1000); // 넓게 보이는거? 시야
    camera.position.set(400, 250, 0); //카메라의 시선 바꾸기

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000); //배경 컬러
    document.body.appendChild(renderer.domElement);

    //카메라 컨트롤
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 200;
    controls.maxDistance = 400; //휠 바깥으로 빼도 그 이상으로는 안 빠지기
    controls.enableDamping = true; //쓰려면 controls밖으로 빼야함(const controls가 아니라 let controls로) 

    {
        const imageLoader = new THREE.TextureLoader(); //텍스쳐로더로 이미지 로드
        imageLoader.load("./image/room.jpg", (data) => {
            // imageLoader.load("./image/bg.jpg", (data) => {
            const material = new THREE.MeshBasicMaterial({  //data를 material에 넣어주기
                map: data,
                side: THREE.BackSide, //매핑을 바깥이 아닌 안쪽에다 하기
                // side: THREE.FrontSide, -> 원래 맵핑할때 기본적으로 이렇게 됨(구 겉에다가 둘러싼 것)
            });
            const geometry = new THREE.SphereGeometry(400, 32, 32); //구만들기, 크기 조정
            const roomMesh = new THREE.Mesh(geometry, material);
            scene.add(roomMesh);
        });
    }
    renderer.render(scene, camera);
};

const animate = () => {
    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

const stageResize = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
};

init();
animate();
window.addEventListener("resize", stageResize);
