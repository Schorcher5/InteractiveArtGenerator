import * as THREE from '../../node_modules/three';
import {OrbitalControls} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../node_modules/dat.gui';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitalControls(camera, renderer.domElement);
camera.position.set(0,30, 30);
orbit.update();

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);


renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);
