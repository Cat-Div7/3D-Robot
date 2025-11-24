// Import the THREE.js library
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
// To allow for the camera to move around the scene
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// To allow for importing the .gltf file
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// Kepp the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls

// Set wich object to render
let objToRender = 'error_robot'

// Initialize a loader from the gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    // If the file is loaded, add it to rhe scene
    object = gltf.scene
    scene.add(object)
  },
  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded/ xhr.total * 100) + '% Loaded')
  }, function (error) {
    // If there is an error, log it
    console.error(error)
  }
)

// Initialize the renderer
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.getElementById('container').appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
camera.position.z = objToRender === 'error_robot' ? 5 : 100;
camera.position.y = 10;

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === 'error_robot' ? 1 : 0.5);
scene.add(ambientLight);

// Initialize OrbitControls
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1.5, 0);
controls.autoRotate = true;

// Render the scene
function animate() {
  requestAnimationFrame(animate)
  controls.update();
  renderer.render(scene, camera);
}

// Add a listener to the window to handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Start the 3D rendering
animate()