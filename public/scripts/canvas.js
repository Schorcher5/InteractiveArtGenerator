// Imports files using relative paths set in the express static helper function and the header
// Please always import files using relative paths set in header or express static because
// the server doesn't send the whole project to the browser, only what files are listed in static/header

import * as THREE from 'three'
import { OrbitControls } from '/jsm/controls/OrbitControls.js'
import Stats from '/jsm/libs/stats.module.js'
import { GUI } from '/jsm/libs/lil-gui.module.min.js'
import { RectAreaLight } from 'three'


//Creates a scene, where we can load shapes onto
const scene = new THREE.Scene()


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 2

//Sets up our render engine/library and adds it to the dom
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//Makes camera movable when holding the mouse button and dragging
const controls = new OrbitControls(camera, renderer.domElement)

//Sets up and adds a basic shape which is known as a mesh in three.js by passing
//a geometry and material object to the mesh constructor
// Note that geometry and material should be made in the mesh constructor and not stored as separate objects
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial({
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

//Lighting to add more realism to the scene and to use better meshes
const rectWidth = 2.0
const rectHeight = 20.0

//RectAreaLightUniformsLib.init();

const lightRect = new THREE.RectAreaLight(0xffffff, 10.0, rectWidth, rectHeight)
lightRect.position.set(0, 6, 0)
lightRect.lookAt(0,0,0)
scene.add(lightRect)

// var Light = new THREE.AmbientLight(0x404040)
// scene.add(Light)

//Sets up a control panel in the top right that allows you to change the start cube's dimensions and camera parameters
const gui = new GUI()

const ShapeAttributesFolder = gui.addFolder('Shape Attributes')
ShapeAttributesFolder.add(cube.scale, 'x', -5, 5)
ShapeAttributesFolder.add(cube.scale, 'y', -5, 5)
ShapeAttributesFolder.add(cube.scale, 'z', -5, 5)
//ShapeAttributesFolder.add(material)
ShapeAttributesFolder.open()

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

const LightFolder = gui.addFolder('Light Folder')
LightFolder.open()


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

// Function to handle events preformed by mouse clicking

document.addEventListener('click', (e) => {

  // Sets current mouse position as the vector points of the mouse object
  mouse.x = (e.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY/window.innerHeight) * 2 + 1;

  //sets up the direction of the plane
  planeNormal.copy(camera.position).normalize();
  
  //Sets up our invisible plane that will fave the camera at the scene position(its origin)
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  
  //Gets the intersection coordinates between the raycaster and the plane and passes those values to intersectionPoint
  raycaster.ray.intersectPlane(plane, intersectionPoint);

  //e.shiftKey returns true when shift is held
  if(e.shiftKey){
      
      //Sets new Mesh at the mouse cursor location
      const testSphere = new THREE.Mesh(new THREE.SphereGeometry(0.125,30,30), new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
      scene.add(testSphere);
      testSphere.position.copy(intersectionPoint);
  }
})


animate()
