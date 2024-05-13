import * as THREE from 'three'
//import { EffectComposer } from "../lib/three.js/examples/jsm/postprocessing/EffectComposer.js";
//import { RenderPass } from "../lib/three.js/examples/jsm/postprocessing/RenderPass.js";
import Branch from "./Branch.module.js";
//import { monkeypatchPcss } from "./pcss.module.js";
import { makeLeafGeometry } from "./Leaf.module.js";
const maxSegments = 10000;

class Tree extends THREE.Mesh {
  constructor() {
      const treeGeometry = new THREE.SphereGeometry();
      const treeMaterial = new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          side: THREE.DoubleSide
      });

      super(treeGeometry, treeMaterial);

      this.addSegments();
      this.addLeaves();
  }

  addFloor() {
      const floorMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(2.5, 2.5, 0.1, 16).translate(0, -0.05, 0),
          new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              color: 0x999999,
              roughness: 1,
          })
      );
      floorMesh.receiveShadow = true;
      this.add(floorMesh);  // Adding the floor to the tree mesh
  }

  addSegments() {
    const segmentGeometry = new THREE.CylinderGeometry(
      0.5,
      0.5,
      1,
      7,
      1,
      true
    ).translate(0, 0.5, 0);
    segmentGeometry.computeVertexNormals();
    const segmentMaterial = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: 0xa38f67,
      roughness: 1.0,
    });
    const segmentMesh = new THREE.InstancedMesh(
      segmentGeometry,
      segmentMaterial,
      maxSegments * 2
    );
    segmentMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    segmentMesh.castShadow = true;
    segmentMesh.receiveShadow = true;
      //this.add(segmentMesh);
  }

  addLeaves() {
      const leafGeometry = makeLeafGeometry();
      leafGeometry.computeVertexNormals();

      const leafMaterial = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          color: 0x758c1f,
          roughness: 1.0,
      });

      const leafMesh = new THREE.InstancedMesh(
          leafGeometry,
          leafMaterial,
          10
      );

      leafMesh.castShadow = true;
      leafMesh.receiveShadow = true;
      leafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      //leafMesh.scale.set(0.1, 0.1, 0.1);
      //this.add(leafMesh);  // Adding leaves as a child of tree mesh
  }
}

export default Tree;