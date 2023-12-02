import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const totalNum = 14; //전체 액자 갯수
const distance = 100; //액자와 액자 사이의 거리

let scene, camera, renderer, controls;
let galleryGroup = new THREE.Group();
let pageNum = 0; 
let targetNum = 0;
let moveX = 0;

const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000"); //배경 컬러
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
    camera.position.set(0, 0, 50); //250으로 해두면 멀리서 보는거

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; //PCFShadowMap
    //그림자 활성화

    document.body.appendChild(renderer.domElement);

    //const axes = new THREE.AxesHelper(150);
    //scene.add(axes);

    //const gridHelper = new THREE.GridHelper(240, 20);
    //scene.add(gridHelper); //좌표 보기 위한 것

    //조명 넣기
    var light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
    light.position.set(0, 50, 50);
    scene.add(light);

    // controls = new OrbitControls(camera, renderer.domElement);

    {
        //가벽 만들기
        // const imageMap = new THREE.TextureLoader().load("./image/hardwood.jpg");

        // imageMap.wrapS = THREE.RepeatWrapping;
        // imageMap.wrapT = THREE.RepeatWrapping;
        // imageMap.repeat.set(10, 4);

        const wallWidth = distance * totalNum + distance;  //자동으로 계산해서 늘어나게
        const geometry = new THREE.BoxGeometry(wallWidth, 100, 2);
        const material = new THREE.MeshPhongMaterial({
            // map: imageMap,
            color: 0x464946,
        });
        const wallMesh = new THREE.Mesh(geometry, material);

        wallMesh.position.set(wallWidth / 2 - distance, 0, -1.5); //액자 걸릴 것이고 두께 2이므로 계산해서 벽을 뒤로 밀어줌, 그리고 마이너스 계산 복잡해서 위치 0으로 setting
        wallMesh.receiveShadow = true; //원래 false, 그림자 표시할 수 있는 벽 만듦
        // wallMesh.castShadow = true; //그림자 발생시키는 것
        galleryGroup.add(wallMesh);
        scene.add(galleryGroup);
    }

    for (let i = 0; i < totalNum; i++) {
        addBox(i);
    }
};

const imageUrls = [
    { url: "./image/1.jpg", title: "봉산향나무" },
    { url: "./image/2.png", title: "봉산향나무" },
    { url: "./image/3.jpg", title: "봉산향나무" },
    { url: "./image/4.jpg", title: "봉산향나무" },
    { url: "./image/5.png", title: "최희효자문" },
    { url: "./image/6.jpg", title: "전주이씨정려" },
    { url: "./image/7.jpg", title: "전주이씨정려" },
    { url: "./image/8.jpg", title: "전주이씨정려" },
    { url: "./image/9.jpg", title: "봉산영당" },
    { url: "./image/10.jpg", title: "봉산영당" },
    { url: "./image/11.jpg", title: "봉산영당" },
    { url: "./image/12.jpg", title: "조치원복숭아축제" },
    { url: "./image/13.jpg", title: "조치원복숭아축제" },
    { url: "./image/14.jpg", title: "조치원복숭아축제" },
];

//액자 추가
const addBox = (i) => {
    const { url, title } = imageUrls[i % imageUrls.length];
    //const imageUrl = imageUrls[i % imageUrls.length];
    const imageMap = new THREE.TextureLoader().load(url);
    //const imageMap = new THREE.TextureLoader().load(
      //  "https://source.unsplash.com/collection/" + i
   // ); //이미지 랜덤하게 꾸려줌
    const geometry = new THREE.BoxGeometry(32, 18, 1);
    const material = new THREE.MeshPhongMaterial({
        map: imageMap,
    });
    const boxMesh = new THREE.Mesh(geometry, material);
    boxMesh.castShadow = true; //그림자 
    let x = i * distance;
    console.log(x);
    let y = 0; //Math.random() * 40 - 5;
    let z = 0;  //y,z 쭉 같은 위치에 걸리게
    boxMesh.position.set(x, y, z);
    galleryGroup.add(boxMesh);

    // 텍스트 추가
    const textGeometry = new THREE.TextGeometry(title, {
        font: new THREE.Font(), // 여기에 사용할 폰트를 지정합니다.
        size: 1, // 텍스트 크기
        height: 0.1, // 텍스트 높이
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(x, y - 10, z + 1); // 텍스트 위치 조절
    galleryGroup.add(textMesh);

    //조명 넣기
    const spotLight = new THREE.SpotLight(0xffffff, 1.2);
    spotLight.position.set(x, 30, 30);
    spotLight.angle = Math.PI / 6; //빛 앵글
    spotLight.penumbra = 0.1; // 빛 경계
    spotLight.decay = 1; 
    spotLight.distance = 70; //거리 -> 빛의 세기와 연관
    spotLight.target = boxMesh;
    spotLight.castShadow = true;

    galleryGroup.add(spotLight);

    // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);
    // https://threejs.org/examples/#webgl_lights_spotlight
};

const animate = () => {
    // controls.update();

    moveX += (targetNum - moveX) * 0.05;
    galleryGroup.position.x = moveX;

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

//클랙했을때 좌우로 이동 함수
const clickFunc = (event) => {
    // console.log(event.pageX);
    if (event.pageX < WIDTH / 2) {
        // console.log("좌");
        if (pageNum > 0) {
            pageNum -= 1;
        }
    } else {
        // console.log("우");
        if (pageNum < totalNum - 1) { //더이상 안넘어가게 제한
            pageNum += 1;
        }
    }
    // console.log("pageNum :" + pageNum);
    targetNum = -(pageNum * distance);
}; //화면 어디를 눌러도 콘솔이 찍히는데 그걸 이용

// 휠을 돌렸을때 반응하도록
const scrollFunc = (event) => {
    console.log(event.deltaY);
    if (event.deltaY == -150) {
        if (pageNum > 0) {
            pageNum -= 1;
        }
    } else {
        if (pageNum < totalNum) {
            pageNum += 1;
        }
    }
    targetNum = -(pageNum * distance);
};

init();
animate();
window.addEventListener("resize", stageResize);
document.addEventListener("click", clickFunc);
document.addEventListener("wheel", scrollFunc);