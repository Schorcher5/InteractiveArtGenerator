// Imports files using relative paths set in the express static helper function and the header
// Please always import files using relative paths set in header or express static because
// the server doesn't send the whole project to the browser, only what files are listed in static/header

import * as THREE from 'three'
import { OrbitControls } from '/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/jsm/loaders/RGBELoader.js'
import { FlakesTexture } from '/jsm/textures/FlakesTexture.js'
import Stats from '/jsm/libs/stats.module.js'
import { GUI } from '/jsm/libs/lil-gui.module.min.js'
//Creates a scene, where we can load shapes onto
const scene = new THREE.Scene()


const light = new THREE.PointLight(0xfdd8fc, 1)
light.position.set(0, 0, 50)
scene.add(light)




//Sets up our render engine/library and adds it to the dom
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 2;
//Makes camera movable when holding the mouse button and dragging
const controls = new OrbitControls(camera, renderer.domElement)

//Sets up and adds a basic shape which is known as a mesh in three.js by passing
//a geometry and material object to the mesh constructor
// Note that geometry and material should be made in the mesh constructor and not stored as separate objects
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Method to handle viewport changes by automatically changing camera dimensions and re-rendering
window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
)

//Sets up an fps counter at the top left
const stats = Stats()
document.body.appendChild(stats.dom)

//Sets up a control panel in the top right that allows you to change the start cube's dimensions and camera parameters
const gui = new GUI()
const cubeFolder = gui.addFolder('Cube')
cubeFolder.add(cube.scale, 'x', -5, 5)
cubeFolder.add(cube.scale, 'y', -5, 5)
cubeFolder.add(cube.scale, 'z', -5, 5)
cubeFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()


//This function is special as it will continually run throughout the life of the server,
//looping through all its code allowing for basic animations through changing mesh parameters
function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    controls.update()
    //make sure to always re-render and update the fps counter at the end of an animation
    render()
    stats.update()
}

//Here is where our scene and camera get loaded into the browser
function render() {
    renderer.render(scene, camera)
}

// To create an object at the coordinates of the cursor,
// we set up an invisible plane at the at the coordinates of the cursor
// and then use the raycaster class to get the intersection point that we can then pass
// to another function/object as a position  

//This mouse object will contain two values, an x and a y value
const mouse = new THREE.Vector2();

//This object will contain the coordinates for the intersection between the raycaster and the  plane
const intersectionPoint = new THREE.Vector3();

//This object will set the direction our invisible plane will be facing
const planeNormal = new THREE.Vector3();

//This object will be our invisible plane
const plane = new THREE.Plane();

const raycaster = new THREE.Raycaster();

// const pointlight = new THREE.PointLight(0xffffff, 1);
// camera.position.set(200, 200, 200);
// scene.add(pointlight);


// Function to handle events preformed by mouse clicking

document.addEventListener('click', (e) => {

    // Sets current mouse position as the vector points of the mouse object
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    //sets up the direction of the plane
    planeNormal.copy(camera.position).normalize();

    //Sets up our invisible plane that will fave the camera at the scene position(its origin)
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);

    //Gets the intersection coordinates between the raycaster and the plane and passes those values to intersectionPoint
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    //e.shiftKey returns true when shift is held
    if (e.shiftKey) {

        // let envmaploader = new THREE.PMREMGenerator(renderer);

        // new RGBELoader().load('cayley_interior_4k.hdr', function (hdrmap) {
        //     let envmap = envmaploader.fromCubemap(hdrmap);
        //     let texture = new THREE.CanvasTexture(new FlakesTexture());
        //     texture.wrapS = THREE.RepeatWrapping;
        //     texture.wrapT = THREE.RepeatWrapping;
        //     texture.repeat.x = 10;
        //     texture.repeat.y = 6;

        const ballMaterial = {
            color: new THREE.Color(0xfdd8fc),
            emissive: new THREE.Color(0x000000),
            roughness: 0.466,
            metalness: 0.1,
            reflectivity: 0.288,
            clearcoat: 0.86,
            clearcoatRoughness: 0.39,
            fog: true,
            // envMap: envmap.texture
        };

        // Sets new Mesh at the mouse cursor location
        const testSphere = new THREE.Mesh(new THREE.SphereGeometry(0.100, 30, 30), new THREE.MeshPhysicalMaterial(ballMaterial));
        scene.add(testSphere);

        testSphere.position.copy(intersectionPoint);
        // });


        // ballMesh.position.copy(intersectionPoint);
        // testSphere.position.copy(intersectionPoint);
    }
})

animate()
