import * as THREE from 'three'
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'



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
const bgTexture = new THREE.TextureLoader().load("texture.jpg");
const bgGeometry = new THREE.PlaneGeometry(5, 5);
const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.set(0, 0, -2.5);
scene.add(bgMesh);

const hdrEquirect = new RGBELoader().load(
    "empty_warehouse_01_2k.hdr",
    () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
  );

/**
 * Geometry
 */

//Texture
const textureLoader = new THREE.TextureLoader();
const normalMapTexture = textureLoader.load("normal.jpg");
normalMapTexture.wrapS = THREE.RepeatWrapping;
normalMapTexture.wrapT = THREE.RepeatWrapping;

const geometry = new THREE.IcosahedronGeometry(2, 20);
const material = new THREE.MeshPhysicalMaterial({  

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
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh);

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
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


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