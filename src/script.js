import * as THREE from 'three'
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import ScreenShake from './ScreenShake.js';
//import CSG from 'three-csg-ts'


/**
 * Base
 */

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

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Background
const bgTexture = new THREE.TextureLoader().load("img/texture.jpg");
const bgGeometry = new THREE.PlaneGeometry(5, 5);
const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.set(0, 0, -2.5);
//scene.add(bgMesh);

const hdrEquirect = new RGBELoader().load(
    "img/empty_warehouse_01_2k.hdr",
    () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
  );

/**
 * Geometry
 */

//Texture
const textureLoader = new THREE.TextureLoader();
const normalMapTexture = textureLoader.load("img/normal.jpg");
normalMapTexture.wrapS = THREE.RepeatWrapping;
normalMapTexture.wrapT = THREE.RepeatWrapping;

const geometry = new THREE.IcosahedronGeometry(3, 20);
const glassMaterial = new THREE.MeshPhysicalMaterial({  

  transmission: options.transmission,
  thickness: options.thickness,
  roughness: options.roughness,
  envMap: hdrEquirect,
  envMapIntensity: options.envMapIntensity,
  clearcoat: options.clearcoat,
  clearcoatRoughness: options.clearcoatRoughness,
  normalScale: new THREE.Vector2(options.normalScale),
  normalMap: normalMapTexture,
  clearcoatNormalMap: normalMapTexture,
  clearcoatNormalScale: new THREE.Vector2(options.clearcoatNormalScale)

  });
const mesh = new THREE.Mesh(geometry, glassMaterial)
scene.add(mesh);

// Create a hemisphere by specifying the phi length to be half of a full sphere (PI)
const radius = 3;  // Radius of the sphere
const widthSegments = 32;  // Number of horizontal segments
const heightSegments = 32;  // Number of vertical segments
const phiStart = 0;  // Starting angle
const phiLength = Math.PI;  // Ending angle, half of the circle
const thetaStart = 0;  // Start at the top of the sphere
const thetaLength = Math.PI;  // Go down to the bottom

const semiCircleTerrain = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);

// Material
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false,
    metalness: 0.5,
    roughness: 0.5
});

// Mesh
const terrainMesh = new THREE.Mesh(semiCircleTerrain, material);

// Extra Cirle
const baseGeometry = new THREE.CircleGeometry(3, 32);
const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});
const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
baseMesh.rotation.x = -Math.PI / 2; // Rotate the circle to close the bottom of the hemisphere
baseMesh.position.y = -0.01;

// Position
const rotationAngleX = Math.PI / -2;
const rotationAngleY = Math.PI;
const rotationAngleZ = 0;

// Apply rotation
terrainMesh.rotation.x = rotationAngleX;
terrainMesh.rotation.y = rotationAngleY;
terrainMesh.rotation.z = rotationAngleZ;

// Add to scene
scene.add(baseMesh);
scene.add(terrainMesh);


//Light 
const light = new THREE.DirectionalLight(0xfff0dd, 1);
light.position.set(0, 5, 10);
scene.add(light);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 5
camera.position.z = 3
scene.add(camera)

// ScreenShake
const screenShakeInstance = ScreenShake();

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Snowflake
const snowflakeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);

//snowflake material
const snowflakeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

//snow particle system
const snowParticles = new THREE.Group();
const numParticles = 700;
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
//scene.add(snowParticles);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x1f1e1c, 1);

/**
 * Animate
 */
const clock = new THREE.Clock()



// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()
  screenShakeInstance.update(camera);
  //snowflake positions
  if (screenShakeInstance.snowEnabled) {
    scene.add(snowParticles);
    snowParticles.children.forEach(snowflake => {
        snowflake.position.y -= 0.001;
        if (snowflake.position.y < -1) {
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

/**
 * Debug UI
 */
gui.add(options, "transmission", 0, 1, 0.01).onChange((val) => {
  material.transmission = val;
});

gui.add(options, "thickness", 0, 5, 0.1).onChange((val) => {
  material.thickness = val;
});

gui.add(options, "roughness", 0, 1, 0.01).onChange((val) => {
  material.roughness = val;
});

gui.add(options, "envMapIntensity", 0, 3, 0.1).onChange((val) => {
  material.envMapIntensity = val;
});

gui.add(options, "clearcoat", 0, 1, 0.01).onChange((val) => {
  material.clearcoat = val;
});

gui.add(options, "clearcoatRoughness", 0, 1, 0.01).onChange((val) => {
  material.clearcoatRoughness = val;
});

gui.add(options, "normalScale", 0, 5, 0.01).onChange((val) => {
  material.normalScale.set(val, val);
});

gui.add(options, "clearcoatNormalScale", 0, 5, 0.01).onChange((val) => {
  material.clearcoatNormalScale.set(val, val);
});

gui.add(options, "normalRepeat", 1, 4, 1).onChange((val) => {
  normalMapTexture.repeat.set(val, val);
});
gui.add({triggerShake: function() {
  screenShakeInstance.shake(camera, new THREE.Vector3(0.5, 0.5, 0.5), 1000);
}}, 'triggerShake').name('Trigger Shake');
