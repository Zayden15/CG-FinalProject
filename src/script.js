import * as THREE from 'three'
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import ScreenShake from './components/ScreenShake.js';
import Ground from './components/ground.js';
//import CSG from 'three-csg-ts'
import Tree from './components/Tree/index.module.js';
import snowman from './components/snowman.js';
import House from './components/house.js';
import snowFall from './components/snowfall.js';
import forest from './components/forest.js';

let snowActive = false;

///////////////
//Necessities//
///////////////

// Debug
const gui = new GUI()
const options = {
  transmission: 1,
  thickness: 0,
  roughness: 0,
  envMapIntensity: 1.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  normalScale: 1,
  clearcoatNormalScale: 0.3,
  normalRepeat: 1
};

// RGBELoader
const hdrEquirect = new RGBELoader().load(
  "img/empty_warehouse_01_2k.hdr",
  () => {
    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
  }
);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Canvas Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 5
camera.position.z = 3

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x1f1e1c, 1);
renderer.gammaFactor = 2.2;

// Window Resize
window.addEventListener('resize', () =>
  {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
  
      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
  
      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Screen Shake
const screenShakeInstance = ScreenShake();
function triggerShake() {
  screenShakeInstance.shake(camera, new THREE.Vector3(2, 2, 0), 1000);
  snowActive = true;
}


//Light 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Moderate ambient light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); // Bright directional light
directionalLight.position.set(0, 5, 10); // Ensure it's above and in front of the ground


//const light = new THREE.DirectionalLight(0xfff0dd, 1);
//light.position.set(0, 5, 10);

// Clock
const clock = new THREE.Clock()

// ===== 👨🏻‍💼 LOADING MANAGER =====
{
  const loadingManager = new THREE.LoadingManager();

  loadingManager.onStart = () => {
    console.log("loading started");
  };
  loadingManager.onProgress = (url, loaded, total) => {
    console.log("loading in progress:");
    console.log(`${url} -> ${loaded} / ${total}`);
  };
  loadingManager.onLoad = () => {
    console.log("loaded!");
    canvas.classList.remove("loading");
  };
  loadingManager.onError = () => {
    console.log("❌ error while loading");
  };
}
//TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();

//////////////////////////////
////// ENVIRONMENT MAP////////
//////////////////////////////
const environmentMap = textureLoader.load('/blockadesLabsSkybox/winter.jpg')
console.log(environmentMap)
environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace
scene.background = environmentMap

////////////////
// GEOMETRIES //
////////////////

// Globe Glass

const normalMapTexture = textureLoader.load("img/normal.jpg");
normalMapTexture.wrapS = THREE.RepeatWrapping;
normalMapTexture.wrapT = THREE.RepeatWrapping;

const geometry = new THREE.IcosahedronGeometry(3, 20);
const glassMaterial = new THREE.MeshPhysicalMaterial({  
  transmission: options.transmission,
  thickness: options.thickness,
  roughness: options.roughness,
  envMap: environmentMap,
  envMapIntensity: options.envMapIntensity,
  clearcoat: options.clearcoat,
  clearcoatRoughness: options.clearcoatRoughness,
  normalScale: new THREE.Vector2(options.normalScale),
  normalMap: normalMapTexture,
  clearcoatNormalMap: normalMapTexture,
  clearcoatNormalScale: new THREE.Vector2(options.clearcoatNormalScale)
  });
const glassMesh = new THREE.Mesh(geometry, glassMaterial)

// Create a hemisphere for the bowl
const radius = 3;  // Radius of the sphere
const widthSegments = 32;  // Number of horizontal segments
const heightSegments = 32;  // Number of vertical segments
const phiStart = 0;  // Starting angle
const phiLength = Math.PI;  // Ending angle, half of the circle
const thetaStart = 0;  // Start at the top of the sphere
const thetaLength = Math.PI;  // Go down to the bottom

const semiCircleTerrain = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false,
    metalness: 0.5,
    roughness: 0.5
});
const SemiCircleMesh = new THREE.Mesh(semiCircleTerrain, material);

// Ground
const ground = new Ground();

// Tree
const tree = new Tree();

// Snowman
const snowMan = new snowman();
snowMan.scale.set(0.005, 0.005, 0.005);
snowMan.position.y = 0.5;
snowMan.position.x = 1;
snowMan.rotation.y = 1;

// House
const house = new House();
house.scale.set(0.005, 0.005, 0.005);
house.position.y = 0.5;
house.position.z = 1;
house.rotation.y = 1;

// SnowFall
const snowfall = new snowFall();
snowfall.scale.set(0.005, 0.005, 0.005);

// forest
const Forest = new forest();
Forest.scale.set(0.003, 0.003, 0.002);
Forest.position.y = 0.5;
Forest.position.x = 0.5;
Forest.rotation.y = 3;

// Position
const rotationAngleX = Math.PI / -2;
const rotationAngleY = Math.PI;
const rotationAngleZ = 0;

// Apply rotation to the Semi Circle
SemiCircleMesh.rotation.x = rotationAngleX;
SemiCircleMesh.rotation.y = rotationAngleY;
SemiCircleMesh.rotation.z = rotationAngleZ;

// Snowflake
const snowflakeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
const snowflakeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

//Snow Particle System
const snowParticles = new THREE.Group();
const numParticles = 1000;
const globeRadius = 2.9;
for (let i = 0; i < numParticles; i++) {
    //randomise positions in sphere shape
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = Math.cbrt(Math.random()) * globeRadius; //cube root for even distribution
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);
    snowflake.position.set(x, y, z);
    snowParticles.add(snowflake);
}


////////////////
//Add To Scene//
////////////////
scene.add(glassMesh)
scene.add(SemiCircleMesh)
scene.add(camera)
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(ground)
//scene.add(tree)
scene.add(snowMan)
scene.add(house)
scene.add(snowfall)
scene.add(Forest)


/////////////
//Animation//
/////////////

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime()
  const delta = clock.getDelta()

  // Update controls
  controls.update()
  screenShakeInstance.update(camera);
  
  //snowMan.update(delta);
  snowfall.update(delta);
  // Only manage snow particles if snow is active
  if (snowActive) {
    if (!scene.children.includes(snowParticles)) {
      scene.add(snowParticles); // Add snow particles to scene if not already added
    }

    snowParticles.children.forEach(snowflake => {
      snowflake.position.y -= 0.001; // Animate snowflake falling
      if (snowflake.position.y < -1) { // Reset snowflake to top if it falls too low
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = Math.cbrt(Math.random()) * globeRadius;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        snowflake.position.set(x, y, z);
      }
    });
  }

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
animate();

///////////////
//GUI Options//
///////////////

gui.add(options, "transmission", 0, 1, 0.01).onChange((val) => {
  glassMaterial.transmission = val;
});
gui.add(options, "thickness", 0, 5, 0.1).onChange((val) => {
  glassMaterial.thickness = val;
});
gui.add(options, "roughness", 0, 1, 0.01).onChange((val) => {
  glassMaterial.roughness = val;
});
gui.add(options, "envMapIntensity", 0, 3, 0.1).onChange((val) => {
  glassMaterial.envMapIntensity = val;
});
gui.add(options, "clearcoat", 0, 1, 0.01).onChange((val) => {
  glassMaterial.clearcoat = val;
});
gui.add(options, "clearcoatRoughness", 0, 1, 0.01).onChange((val) => {
  materglassMaterialial.clearcoatRoughness = val;
});
gui.add(options, "normalScale", 0, 5, 0.01).onChange((val) => {
  glassMaterial.normalScale.set(val, val);
});
gui.add(options, "clearcoatNormalScale", 0, 5, 0.01).onChange((val) => {
  glassMaterial.clearcoatNormalScale.set(val, val);
});
gui.add(options, "normalRepeat", 1, 4, 1).onChange((val) => {
  normalMapTexture.repeat.set(val, val);
});
gui.add({ triggerShake: triggerShake }, 'triggerShake').name('Trigger Shake');

