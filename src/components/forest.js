import {
    Mesh,
    SphereGeometry,
    ConeGeometry,
    Group,
    CylinderGeometry,
    MeshLambertMaterial,
    MeshStandardMaterial,
    TextureLoader,
    LoadingManager,
  } from "three";
  
  // trunk textures
  import trunkbase from "/Bark_Pine_003_SD/Bark_Pine_003_BaseColor.jpg";
  import trunknormal from "/Bark_Pine_003_SD/Bark_Pine_003_Normal.jpg";
  import trunkheight from "/Bark_Pine_003_SD/Bark_Pine_003_Height.png";
  import trunkrough from "/Bark_Pine_003_SD/Bark_Pine_003_Roughness.jpg";
  import trunkam from "/Bark_Pine_003_SD/Bark_Pine_003_AmbientOcclusion.jpg";
  
  // Trunk class
  class Trunk extends Mesh {
    constructor(loadingManager) {
      const trunkGeometry = new CylinderGeometry(5, 20, 500, 50);
      const textureLoader = new TextureLoader(loadingManager);
      const baseTexture = textureLoader.load(trunkbase);
      const normalMapTexture = textureLoader.load(trunknormal);
      const heightMapTexture = textureLoader.load(trunkheight);
      const roughMapTexture = textureLoader.load(trunkrough);
      const ambientMapTexture = textureLoader.load(trunkam);
      const trunkMaterial = new MeshStandardMaterial({
        map: baseTexture,
        normalMap: normalMapTexture,
        displacementMap: heightMapTexture,
        displacementScale: 10,
        roughnessMap: roughMapTexture,
        roughness: 0.5,
        aoMap: ambientMapTexture,
      });
      super(trunkGeometry, trunkMaterial);
    }
  }
  
  // Leaf class
  class Leaf extends Mesh {
    constructor(level) {
      let leafGeometry, leafMaterial;
      if (level === 1) {
        leafGeometry = new ConeGeometry(80, 350, 100);
      } else if (level === 2) {
        leafGeometry = new ConeGeometry(80, 300, 100);
      } else {
        leafGeometry = new ConeGeometry(80, 250, 100);
      }
      leafMaterial = new MeshLambertMaterial({ color: 0x2f4f4f });
      super(leafGeometry, leafMaterial);
    }
  }
  
  // Snow class
  class Snow extends Mesh {
    constructor() {
      const snowGeometry = new SphereGeometry(20, 20, 100);
      const snowMaterial = new MeshLambertMaterial({ color: 0xf0f8ff });
      super(snowGeometry, snowMaterial);
    }
  }
  
  // Trees group
  class Trees extends Group {
    constructor(loadingManager) {
      super();
      this.treeNum = 50;
      this.noTreeField = 0.25;
      const positions = [];
      let count = 0;
      for (let i = 0; i < this.treeNum; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        if (x ** 2 + y ** 2 >= this.noTreeField) {
          positions.push([x * 600, 100, y * 600]);
          count += 1;
        }
      }
  
      const trunk = new Trunk(loadingManager);
      for (let i = 0; i < count; i++) {
        const [x, y, z] = positions[i];
  
        const t = trunk.clone();
        t.position.set(x, y, z);
  
        const leaf1 = new Leaf(1);
        leaf1.position.set(x, y + 100, z);
        const leaf2 = new Leaf(2);
        leaf2.position.set(x, y + 150, z);
        const leaf3 = new Leaf(3);
        leaf3.position.set(x, y + 200, z);
  
        const snow1 = new Snow();
        snow1.position.set(x + 20, y + 200, z + 20);
        const snow2 = new Snow();
        snow2.position.set(x - 35, y + 150, z + 35);
        const snow3 = new Snow();
        snow3.position.set(x + 40, y + 50, z - 40);
  
        this.add(t, leaf1, leaf2, leaf3, snow1, snow2, snow3);
      }
    }
  }
  
  export default Trees;
  