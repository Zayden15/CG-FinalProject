import {
    Group,
    CylinderGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    LoadingManager,
  } from "three";
  
  import baseTexture from "/img/baseStand.jpg";
  
  class SnowGlobeStand extends Group {
    constructor(loadingManager = new LoadingManager()) {
      super();
  
      const textureLoader = new TextureLoader(loadingManager);
      const baseMap = textureLoader.load(baseTexture);
  
      // Stand dimensions
      const baseRadiusTop = 2;
      const baseRadiusBottom = 3;
      const baseHeight = 1;
  
      // Base
      const baseGeometry = new CylinderGeometry(baseRadiusTop, baseRadiusBottom, baseHeight, 32);
      const baseMaterial = new MeshStandardMaterial({
        color: 0x8B4513,
        map: baseMap,
      });
      const base = new Mesh(baseGeometry, baseMaterial);
      base.position.y = baseHeight / 2;
      this.add(base);
    }
  }
  
  export default SnowGlobeStand;
  