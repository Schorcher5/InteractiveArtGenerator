// Imports files using relative paths set in the express static helper function and the header
// Please always import files using relative paths set in header or express static because
// the server doesn't send the whole project to the browser, only what files are listed in static/header

import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { OrbitControls } from '/jsm/controls/OrbitControls.js'
import Stats from '/jsm/libs/stats.module.js'
import { GUI } from '/jsm/libs/lil-gui.module.min.js'
import { DragControls } from "https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/DragControls.js";



import { AmbientLight, Light, RectAreaLight } from 'three'

const meshArray = [];
const bodies = [];
let drawLine = false;
let numberOfDraws = 0;
let valGav = false
let tickGavY = 0
let tickGavX = 0

//Creates a scene, where we can load shapes onto
const scene = new THREE.Scene()


const light = new THREE.PointLight(0xfdd8fc, 1)
light.position.set(0, 0, 50)
scene.add(light)

// grid
var gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

//Sets up our render engine/library and adds it to the dom
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// new
window.addEventListener( 'mousemove', onMouseMove, false );


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 2;

//Makes camera movable when holding the mouse button and dragging
const controls = new OrbitControls(camera, renderer.domElement)

// new

const dragControls = new DragControls( meshArray, camera, renderer.domElement );
		dragControls.addEventListener( 'dragstart', function () { controls.enabled = false; } );
    dragControls.addEventListener( 'drag', onDragEvent );
		dragControls.addEventListener( 'dragend', function () { controls.enabled = true; } );
        


//Sets up and adds a basic shape which is known as a mesh in three.js by passing
//a geometry and material object to the mesh constructor
// Note that geometry and material should be made in the mesh constructor and not stored as separate objects
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshStandardMaterial({
    color: 	0xfff7e2,
    wireframe: false,
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
meshArray.push(cube);

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
var rectWidth = 2.0
var rectHeight = 20.0

const lightRect = new THREE.RectAreaLight(0xffffff, 5.0, rectWidth, rectHeight)
lightRect.position.set(0, 6, 0)
lightRect.lookAt(0,0,0)
scene.add(lightRect)

const lightAmbient = new THREE.AmbientLight(0x404040, 2.0)
scene.add(lightAmbient)

//Sets up a control panel in the top right that allows you to change the start cube's dimensions and camera parameters
const gui = new GUI()

// add a string controller for shape spawner
var shapeSelector = { 
  "shape": "box"
};

const shapeSelectorFolder = gui.addFolder("Shape?")
shapeSelectorFolder.add(shapeSelector, 'shape', {
  Box: "box",
  Cone: "cone",
  Cylinder: "cylinder",
  Torus: "torus",
  Sphere: "sphere"
})
.name("shape?")

const ShapeAttributesFolder = gui.addFolder('Shape Attributes')
ShapeAttributesFolder.add(cube.scale, 'x', -5, 5)
ShapeAttributesFolder.add(cube.scale, 'y', -5, 5)
ShapeAttributesFolder.add(cube.scale, 'z', -5, 5)
ShapeAttributesFolder.add(cube.material, 'wireframe')
ShapeAttributesFolder.open()

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', 0, 10)
cameraFolder.add(camera.position, 'y', 0, 10)
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

const LightFolder = gui.addFolder('Light Folder')
LightFolder.add(lightAmbient, 'intensity', 0, 10).name('Ambient Intensity')
LightFolder.addColor(lightAmbient, 'color').name('Ambient Color')
LightFolder.add(lightRect.position, 'x', -5, 10).name('Rect Light x')
LightFolder.add(lightRect.position, 'y', -5, 10).name('Rect Light y')
LightFolder.add(lightRect.position, 'z', -5, 10).name('Rect Light z')
LightFolder.add(lightRect, 'intensity', 0, 10).name('Rect Intensity')
LightFolder.addColor(lightRect, 'color').name('Rect Color')
LightFolder.open()

let world = new CANNON.World()
world.gravity.set(0, -7, 0)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({ mass: 0 })
floorBody.addShape(floorShape)
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
world.addBody(floorBody)

// Cube body
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
let cubeBody = new CANNON.Body({ mass: 5 })
cubeBody.addShape(cubeShape)
cubeBody.position.set(0, 5, 0)
bodies.push(cubeBody)
world.addBody(cubeBody)

// Joint body, to later constraint the cube
const jointShape = new CANNON.Sphere(0.1)
let jointBody = new CANNON.Body({ mass: 0 })
jointBody.addShape(jointShape)
jointBody.collisionFilterGroup = 0
jointBody.collisionFilterMask = 0
world.addBody(jointBody)

//This function is special as it will continually run throughout the life of the server,
//looping through all its code allowing for basic animations through changing mesh parameters
function animate() {

  requestAnimationFrame(animate)
  const rotation = document.getElementById('rotation');
  world.fixedStep()

  for(let i = 0; i != meshArray.length; i++) {
    meshArray[i].position.copy(bodies[i].position)
    meshArray[i].quaternion.copy(bodies[i].quaternion)
  }

  
  if (rotation.checked){
    console.log("X: " + mouse.x + "    Y:" + mouse.y)
    world.gravity.set(mouse.x * 100 * Math.sin(tickGavY), mouse.y * 100 * Math.sin(tickGavY), 0)
    tickGavY =+ 0.01
    console.log(world.gravity.y)
    
    meshArray.forEach((mesh) => {
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01
      controls.update()
      //make sure to always re-render and update the fps counter at the end of an animation
        
    });
  }
  else {
    tickGavY = 0
    world.gravity.set(0, -7, 0)
  }

  if(drawLine){
    for(numberOfDraws; numberOfDraws<10; numberOfDraws++){
          const waveModifier = Math.random();
          for(var i = 0; i<4; i++){
              const particle = new THREE.Points(new THREE.SphereGeometry(0.005,1,1), new THREE.PointsMaterial({size:0.005, color:0X18978F+i*100}));
             
              scene.add(particle);
              particle.position.copy(intersectionPoint);
              particle.position.z = particle.position.z + Math.cos((i%2)*Math.PI/2) * waveModifier * (i >= 2 ? -1:1) *0.09;
              particle.position.x = particle.position.x + Math.sin((i%2)*Math.PI/2) * waveModifier * (i < 2 ? -1:1) * 0.09;
      
          }console.log(drawLine);
      }
  }
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

  //e.shiftKey returns true when shift is held
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


  if(e.ctrlKey){
    valGav = true
  } else { valGav = false}

  if(e.shiftKey){ 
        
    switch (shapeSelector.shape) {
      case "box":
        const testBox = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), new THREE.MeshPhysicalMaterial(ballMaterial) );
        scene.add(testBox);
        testBox.position.copy(intersectionPoint)
        meshArray.push(testBox);

        // Cube body
        const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
        let cubeBody = new CANNON.Body({ mass: 5 })
        cubeBody.addShape(cubeShape)
        cubeBody.position.set(testBox.position.x, testBox.position.y, testBox.position.z )
        bodies.push(cubeBody)
        world.addBody(cubeBody)
        break;
      case "cone":
        const testCone = new THREE.Mesh( new THREE.ConeGeometry(.5,1.5,30), new THREE.MeshPhysicalMaterial(ballMaterial) );
        scene.add(testCone);
        testCone.position.copy(intersectionPoint);
        meshArray.push(testCone);

        // "Cone" body
        const CylinderShape = new CANNON.Cylinder(0.0, 0.5, 1.5, 30)
        let CylinderBody = new CANNON.Body({ mass: 5 })
        CylinderBody.addShape(CylinderShape)
        CylinderBody.position.set(testCone.position.x, testCone.position.y, testCone.position.z )
        bodies.push(CylinderBody)
        world.addBody(CylinderBody)
        break;
      case "cylinder":
        const testCylinder = new THREE.Mesh( new THREE.CylinderGeometry( .5, .5, 1, 32 ), new THREE.MeshPhysicalMaterial(ballMaterial) );
        scene.add(testCylinder);
        testCylinder.position.copy(intersectionPoint);
        meshArray.push(testCylinder);

        // "Cone" body
        const CylinderShapeReal = new CANNON.Cylinder(0.5, 0.5, 1.5, 32)
        let CylinderBodyReal = new CANNON.Body({ mass: 5 })
        CylinderBodyReal.addShape(CylinderShapeReal)
        CylinderBodyReal.position.set(testCylinder.position.x, testCylinder.position.y, testCylinder.position.z )
        bodies.push(CylinderBodyReal)
        world.addBody(CylinderBodyReal)
        break;
      case "torus":
        const testTorus = new THREE.Mesh(new THREE.TorusGeometry( 2, .2, 100, 100 ) , new THREE.MeshPhysicalMaterial(ballMaterial) );
        scene.add(testTorus);
        testTorus.position.copy(intersectionPoint)
        meshArray.push(testTorus);
        break;
      case "sphere":
        //Sets new Mesh at the mouse cursor location
        const testSphere = new THREE.Mesh( new THREE.SphereGeometry(0.125,30,30) , new THREE.MeshPhysicalMaterial( ballMaterial ) );
        scene.add(testSphere);
        testSphere.position.copy(intersectionPoint);    
        meshArray.push(testSphere);    

        // "Cone" body
        const sphereShape = new CANNON.Sphere(0.125)
        let sphereBody = new CANNON.Body({ mass: 5 })
        sphereBody.addShape(sphereShape)
        sphereBody.position.set(testSphere.position.x, testSphere.position.y, testSphere.position.z )
        bodies.push(sphereBody)
        world.addBody(sphereBody)
    }

  }
  
  if(e.ctrlKey && !drawLine ){
    drawLine = true;
  }else if (e.ctrlKey && drawLine){
    drawLine = false;
  
  numberOfDraws = 0;
}})

function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }


function onDragEvent(e) {
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    e.object.position.set(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);
  }


// examples
// https://jsfiddle.net/amitlzkpa/c53w8erf/
// https://jsfiddle.net/xa9uscme/1/

animate()
