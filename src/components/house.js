import {
    Mesh,
    ConeGeometry,
    Group,
    CylinderGeometry,
    TextureLoader,
    MeshStandardMaterial,
    PlaneGeometry,
    BoxGeometry,
    SubtractiveBlending,
    LoadingManager,
  } from "three";
  
  //wall: https://3dtextures.me/2021/03/26/stylized-bricks-001/
  import wallbase from "/Stylized_Bricks_001_SD/Stylized_Bricks_001_basecolor.jpg";
  import wallnormal from "/Stylized_Bricks_001_SD/Stylized_Bricks_001_normal.jpg";
  import wallheight from "/Stylized_Bricks_001_SD/Stylized_Bricks_001_height.png";
  import wallrough from "/Stylized_Bricks_001_SD/Stylized_Bricks_001_roughness.jpg";
  import wallam from "/Stylized_Bricks_001_SD/Stylized_Bricks_001_ambientOcclusion.jpg";
  //poll: https://3dtextures.me/2022/02/25/bark-pine-003/
  import pollbase from "/Bark_Pine_003_SD/Bark_Pine_003_BaseColor.jpg";
  import pollnormal from "/Bark_Pine_003_SD/Bark_Pine_003_Normal.jpg";
  import pollheight from "/Bark_Pine_003_SD/Bark_Pine_003_Height.png";
  import pollrough from "/Bark_Pine_003_SD/Bark_Pine_003_Roughness.jpg";
  import pollam from "/Bark_Pine_003_SD/Bark_Pine_003_AmbientOcclusion.jpg";
  //roof: https://3dtextures.me/2019/11/06/roof-tiles-terracotta-003/
  import roofbase from "/Roof_Tiles_Terracotta_003_SD/Roof_Tiles_Terracotta_003_basecolor.jpg";
  import roofnormal from "/Roof_Tiles_Terracotta_003_SD/Roof_Tiles_Terracotta_003_normal.jpg";
  import roofheight from "/Roof_Tiles_Terracotta_003_SD/Roof_Tiles_Terracotta_003_height.png";
  import roofrough from "/Roof_Tiles_Terracotta_003_SD/Roof_Tiles_Terracotta_003_roughness.jpg";
  import roofam from "/Roof_Tiles_Terracotta_003_SD/Roof_Tiles_Terracotta_003_ambientOcclusion.jpg";
  //chimney: https://3dtextures.me/2022/04/03/wall-stone-023/
  import chbase from "/Wall_Stone_023_SD/Wall_Stone_023_BaseColor.jpg";
  import chnormal from "/Wall_Stone_023_SD/Wall_Stone_023_Normal.jpg";
  import chheight from "/Wall_Stone_023_SD/Wall_Stone_023_Height.png";
  import chrough from "/Wall_Stone_023_SD/Wall_Stone_023_Roughness.jpg";
  import cham from "/Wall_Stone_023_SD/Wall_Stone_023_AmbientOcclusion.jpg";
  //door: https://3dtextures.me/2020/05/29/wood-gate-fortified-003/
  import doorbase from "/Wood_Gate_Fortified_003_SD/Wood_Gate_Fortified_003_basecolor.jpg";
  import doornormal from "/Wood_Gate_Fortified_003_SD/Wood_Gate_Fortified_003_normal.jpg";
  import doorheight from "/Wood_Gate_Fortified_003_SD/Wood_Gate_Fortified_003_height.png";
  import doorrough from "/Wood_Gate_Fortified_003_SD/Wood_Gate_Fortified_003_roughness.jpg";
  import dooram from "/Wood_Gate_Fortified_003_SD/Wood_Gate_Fortified_003_ambientOcclusion.jpg";
  //smoke
  import smokeColor from "/smoke.jpeg";
  //Roof
  class Roof extends Mesh {
    constructor(loadingManager = new LoadingManager()) {
      const geometry = new ConeGeometry(170, 200, 100);
  
      const textureLoader = new TextureLoader(loadingManager);
      const baseTexture = textureLoader.load(roofbase);
      const normalMapTexture = textureLoader.load(roofnormal);
      const heghitMapTexture = textureLoader.load(roofheight);
      const rouphMapTexture = textureLoader.load(roofrough);
      const ambientMapTexture = textureLoader.load(roofam);
      var material = new MeshStandardMaterial({
        map: baseTexture,
        normalMap: normalMapTexture,
        displacementMap: heghitMapTexture,
        displacementScale: 5,
        roughnessMap: rouphMapTexture,
        roughness: 0.5,
        aoMap: ambientMapTexture,
      });
      super(geometry, material);
    }
  }
  //Wall
  class Wall extends Mesh {
    constructor(loadingManager = new LoadingManager()) {
      const geometry = new BoxGeometry(200, 200, 200, 512, 512, 512);
      const textureLoader = new TextureLoader(loadingManager);
      const baseTexture = textureLoader.load(wallbase);
      const normalMapTexture = textureLoader.load(wallnormal);
      const heghitMapTexture = textureLoader.load(wallheight);
      const rouphMapTexture = textureLoader.load(wallrough);
      const ambientMapTexture = textureLoader.load(wallam);
      const material = new MeshStandardMaterial({
        map: baseTexture,
        normalMap: normalMapTexture,
        displacementMap: heghitMapTexture,
        displacementScale: 10,
        roughnessMap: rouphMapTexture,
        roughness: 0.5,
        aoMap: ambientMapTexture,
      });
      super(geometry, material);
    }
  }
  
  //poll
  class Poll extends Mesh {
    constructor(loadingManager = new LoadingManager()) {
      const geometry = new CylinderGeometry(10, 10, 180, 50, 512);
      const textureLoader = new TextureLoader(loadingManager);
      const baseTexture = textureLoader.load(pollbase);
      const normalMapTexture = textureLoader.load(pollnormal);
      const heghitMapTexture = textureLoader.load(pollheight);
      const rouphMapTexture = textureLoader.load(pollrough);
      const ambientMapTexture = textureLoader.load(pollam);
      const material = new MeshStandardMaterial({
        map: baseTexture,
        normalMap: normalMapTexture,
        displacementMap: heghitMapTexture,
        displacementScale: 10,
        roughnessMap: rouphMapTexture,
        roughness: 0.5,
        aoMap: ambientMapTexture,
      });
      super(geometry, material);
    }
  }
  
  //Roof
  class Door extends Mesh {
    constructor(loadingManager = new LoadingManager()) {
      const geometry = new PlaneGeometry(60, 120, 512, 512);
      const textureLoader = new TextureLoader(loadingManager);
      const baseTexture = textureLoader.load(doorbase);
      const normalMapTexture = textureLoader.load(doornormal);
      const heghitMapTexture = textureLoader.load(doorheight);
      const rouphMapTexture = textureLoader.load(doorrough);
      const ambientMapTexture = textureLoader.load(dooram);
      const material = new MeshStandardMaterial({
        map: baseTexture,
        normalMap: normalMapTexture,
        displacementMap: heghitMapTexture,
        displacementScale: 10,
        roughnessMap: rouphMapTexture,
        roughness: 0.5,
        aoMap: ambientMapTexture,
      });
      super(geometry, material);
    }
  }
  
  //chimney
  class Chimney extends Mesh {
    constructor(loadingManager = new LoadingManager()) {
      const geometry = new CylinderGeometry(20, 20, 200, 50, 512);
      const textureLoader = new TextureLoader(loadingManager);
      const baseTexture = textureLoader.load(chbase);
      const normalMapTexture = textureLoader.load(chnormal);
      const heghitMapTexture = textureLoader.load(chheight);
      const rouphMapTexture = textureLoader.load(chrough);
      const ambientMapTexture = textureLoader.load(cham);
      const material = new MeshStandardMaterial({
        map: baseTexture,
        normalMap: normalMapTexture,
        displacementMap: heghitMapTexture,
        displacementScale: 1,
        roughnessMap: rouphMapTexture,
        roughness: 0.5,
        aoMap: ambientMapTexture,
      });
      super(geometry, material);
    }
  }
  
  class Smoke extends Mesh {
    constructor(loadingManager = new LoadingManager()) {
      const geometry = new PlaneGeometry(200, 200, 512, 512);
      const textureLoader = new TextureLoader(loadingManager);
      const baseTexture = textureLoader.load(smokeColor);
      const material = new MeshStandardMaterial({
        map: baseTexture,
        //roughness: 0.5,
        depthTest: false,
        blending: SubtractiveBlending,
        opacity: 0.7,
      });
      super(geometry, material);
    }
  }
  export default class House extends Group {
    x = 100;
    y = 0;
    z = -250;
    constructor(loadingManager = new LoadingManager()) {
      super();
      //roof
      const roof = new Roof(loadingManager);
      roof.position.set(this.x, this.y + 180, this.z);
      //wall
      const wall = new Wall(loadingManager);
      wall.position.set(this.x, this.y, this.z);
      //poll
      const poll = new Poll(loadingManager);
      const poll1 = poll.clone();
      poll1.position.set(this.x + 100, this.y, this.z + 100);
      const poll2 = poll.clone();
      poll2.position.set(this.x - 100, this.y, this.z - 100);
      const poll3 = poll.clone();
      poll3.position.set(this.x + 100, this.y, this.z - 100);
      const poll4 = poll.clone();
      poll4.position.set(this.x - 100, this.y, this.z + 100);
      //door
      const door = new Door(loadingManager);
      door.position.set(this.x + 30, this.y - 30, this.z + 105);
      //chimney
      const chimney = new Chimney(loadingManager);
      chimney.position.set(this.x + 80, this.y + 100, this.z + 80);
      //smoke
      const smoke = new Smoke(loadingManager);
      smoke.position.set(this.x + 80, this.y + 300, this.z + 80);
  
      this.add(roof, wall, poll1, poll2, poll3, poll4, door, chimney, smoke);
    }
  }
  