import * as THREE from 'three';
import { OrbitControls } from '/jsm/controls/OrbitControls.js'


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
);



const orbit = new OrbitControls(camera, renderer.domElement);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10,30,30);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x1111111);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xAAAAAA, 0.8);
scene.add(directionalLight);
directionalLight.position.set(30,30,30);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightShadowHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);

const spotlight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotlight);
spotlight.position.set(-30,50,0);
spotlight.castShadow = true;

const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlightHelper);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFF00FF , side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
plane.receiveShadow = true;

scene.add(plane);
plane.rotation.x = -0.5*Math.PI;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(3 , 30, 30);
const sphereMaterial = new THREE.MeshLambertMaterial();
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;

sphere.position.set(10,10,10);
let step = 0;


function animate(time) {
  box.rotation.y = time/100;
  box.rotation.x = time/100;


}

renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);
