import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let scene, camera, renderer, controls;
let boxGroup = new THREE.Object3D();

const totalNum = 77; //전체 박스 갯수
const depthNum = 40; //박스와 박스 사이 z값. 깊이
const totalDepthNum = totalNum * depthNum; //전체 깊이

let targetZNum = 0;
let moveZ = 0;
let mouseX = 0,
    mouseY = 0,
    moveX = 0,
    moveY = 0;

const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000"); //배경 컬러 #6fbdff
    camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 1, 1500);
    camera.position.set(0, 0, 50);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    //그림자 활성화
    // document.body.appendChild(renderer.domElement);
    document.querySelector("#canvasWrap").appendChild(renderer.domElement);
    //cavasWrap 에 render 넣는다

    document.body.style.height = `${HEIGHT + totalNum * 100}px`;
    //body 스크롤 만들기

    //안개
    const near = 100;
    const far = 300;
    const color = "#000000";
    scene.fog = new THREE.Fog(color, near, far);

    // const axes = new THREE.AxesHelper(150);
    // scene.add(axes);

    // const gridHelper = new THREE.GridHelper(240, 20);
    // scene.add(gridHelper);

    //조명 넣기
    var light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
    light.position.set(100, 100, 0);
    scene.add(light);

    // controls = new OrbitControls(camera, renderer.domElement);

    for (let i = 0; i <= totalNum; i++) {
        addBox(i);
        // console.log(i);
    }
    scene.add(boxGroup);
    addLight(15, 15, 20);
};
const imageUrls = [
    "./image/c1.png",
    "./image/c2.jpeg",
    "./image/c3.jpeg",
    "./image/c4.jpeg",
    "./image/c5.jpeg",
    "./image/c5.png",
    //세종문화원
    "./image/c6.png",
    "./image/c7.jpg",
    "./image/c8.jpg",
    "./image/c9.jpg",
    "./image/c10.jpg",
    "./image/c11.jpg",
    "./image/c12.png",
    //조치원테마거리
    "./image/c13.png",
    "./image/c14.jpg",
    "./image/c15.jpg",
    "./image/c16.jpg",
    "./image/c17.jpg",
    "./image/c18.jpg",
    "./image/c19.jpg",
    "./image/c20.jpg",
    "./image/c21.jpg",
    "./image/c22.png",
    //도토리파크
    "./image/c23.png",
    "./image/c24.jpeg",
    "./image/c25.jpeg",
    "./image/c26.png",
    "./image/c27.jpeg",
    "./image/c28.png",
    "./image/c29.jpeg",
    "./image/c30.jpeg",
    "./image/c31.png",
    //세종수학체험센터
    "./image/c32.png",
    "./image/c33.jpg",
    "./image/c34.jpg",
    "./image/c35.jpg",
    "./image/c36.jpg",
    "./image/c37.jpg",
    "./image/c38.jpg",
    "./image/c39.jpg",
    "./image/c40.png",
    //조치원 1927아트센터
    "./image/c41.png",
    "./image/c42.jpg",
    "./image/c43.jpg",
    "./image/c44.jpg",
    "./image/c45.jpg",
    "./image/c46.png",
    "./image/c46-1.jpg",
    "./image/c46-2.jpg",
    "./image/c46-3.jpg",
    //조치원문화정원, 정수장
    "./image/c47.jpg",
    "./image/c48.jpg",
    "./image/c49.jpg",
    "./image/c50.png",
    //조치원 전통시장
    "./image/c51.png",
    "./image/c52.jpg",
    "./image/c53.jpg",
    "./image/c54.jpg",
    "./image/c55.jpg",
    "./image/c56.png",
    "./image/c57.jpg",
    "./image/c58.jpg",
    //조천연꽃공원
    "./image/c59.jpg",
    "./image/c60.jpg",
    "./image/c61.jpg",
    "./image/c62.jpg",
    "./image/c63.png",
    //신안저수지
    "./image/c64.jpg",
    "./image/c65.jpg",
    "./image/c66.jpg",
    "./image/c67.jpg",
    "./image/c68.jpg",
    "./image/c69.png",
    //평리문화마을
    "./image/c70.jpg",
    "./image/c71.jpg",
    "./image/c72.jpg",
    "./image/c73.jpg",
    "./image/c74.jpg",
    //세종문화예술회관 
    

];


//박스 추가
const addBox = (i) => {
    const imageUrl = imageUrls[i % imageUrls.length];
    
    //const imageMap = new THREE.TextureLoader().load(
      //  "https://source.unsplash.com/collection/" + i
    //);

    const imageMap = new THREE.TextureLoader().load(imageUrl);
    const material = new THREE.SpriteMaterial({ map: imageMap });
    const boxMesh = new THREE.Sprite(material);
    boxMesh.scale.set(32, 18, 1);

    let x = Math.random() * 100 - 100 / 2;
    let y = Math.random() * 50 - 50 / 2;
    let z = -i * depthNum;
    boxMesh.position.set(x, y, z);
    boxMesh.name = `imageBox_${i}`;
    // boxMesh.rotation.set(0, y, 0);
    boxGroup.add(boxMesh);
};

//조명 넣기
const addLight = (...pos) => {
    const color = 0xffffff;
    const intensity = 0.4;
    const light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.position.set(...pos);

    // const helper = new THREE.PointLightHelper(light);
    // scene.add(helper);

    scene.add(light);
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
//https://threejs.org/docs/#api/en/core/Raycaster.intersectObject
//https://threejs.org/examples/#webgl_interactive_cubes

const onPointerMove = (event) => {
    pointer.x = (event.clientX / WIDTH) * 2 - 1;
    pointer.y = -(event.clientY / HEIGHT) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    // 레이저 닿는 녀석 찾기
    const intersects = raycaster.intersectObjects(boxGroup.children);

    //마우스 오버가 된 녀석들은 빨간색으로
    // for (let i = 0; i < intersects.length; i++) {
    //     intersects[i].object.material.color.set(0xff0000);
    // }

    if (intersects.length > 0) {
        document.querySelector("body").style.cursor = "pointer";
    } else {
        document.querySelector("body").style.cursor = "auto";
    }
};

const onDocumentMouseDown = (event) => {
    const vector = new THREE.Vector3(pointer.x, pointer.y, 0.5);

    vector.unproject(camera);
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(boxGroup.children);

    if (intersects.length > 0) {
        const item = intersects[0].object;
        const itemName = item.name;
        console.log(itemName);
    }
};

const animate = () => {
    //controls.update();

    moveZ += (targetZNum - moveZ) * 0.07;
    boxGroup.position.z = moveZ;

    moveX += (mouseX - moveX - WIDTH / 2) * 0.05;
    moveY += (mouseY - moveY - WIDTH / 2) * 0.05;

    boxGroup.position.x = -(moveX / 50);
    boxGroup.position.y = moveY / 50;

    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

const stageResize = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
};

let scrolly = 0;
let pageNum = 0;
const progressBar = document.querySelector(".bar");
let perNum = 0;

const scrollFunc = () => {
    // console.log(event.deltaY);
    // if (event.deltaY == -150) {
    //     if (targetZNum > 0) {
    //         targetZNum -= depthNum;
    //     }
    // } else {
    //     if (targetZNum < totalDepthNum) {
    //         targetZNum += depthNum;
    //     }
    // }
    // console.log(targetZNum);

    // if (pageNum == Math.ceil(scrolly / 100)) return;
    //휠에서 스크롤로 변경 (기존 소스 주석처리함)

    scrolly = window.scrollY; //현재 스크롤 위치
    pageNum = Math.min(Math.ceil(scrolly / 100), totalNum); //스크롤 한번에 100 이동
    targetZNum = depthNum * pageNum;

    perNum = Math.ceil(
        (scrolly / (document.body.offsetHeight - window.innerHeight)) * 100
    );
    progressBar.style.width = perNum + "%";

    // console.log(targetZNum, window.scrollY, pageNum, perNum);
};

init();
animate();
window.addEventListener("resize", stageResize);
window.addEventListener("scroll", scrollFunc);
scrollFunc();

window.addEventListener("mousemove", (e) => {
    //console.log(e);
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("mousedown", onDocumentMouseDown);
