import {
    BufferGeometry,
    TextureLoader,
    Group,
    PointsMaterial,
    AdditiveBlending,
    Float32BufferAttribute,
    Points,
    LoadingManager,
  } from "three";
  
  // Include star pngs
  import png1 from "/snowflake1.png";
  import png2 from "/snowflake2.png";
  import png3 from "/snowflake3.png";
  import png4 from "/snowflake4.png";
  import png5 from "/snowflake5.png";
  
  const snowpng = [png1, png2, png3, png4, png5];
  
  class Snowflakes extends Points {
    constructor(geometry, material, fallSpeed = 0.2, yLowerBound = -90) {
      super(geometry, material);
      this.fallSpeed = fallSpeed;
      this.initialSpeed = fallSpeed;
      this.yLowerBound = yLowerBound;
    }
  
    update(deltaTime) {
      const positions = this.geometry.attributes.position.array;
  
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= this.fallSpeed * deltaTime;
  
        // Reset snowflake position if it falls below yLowerBound
        if (positions[i + 1] < this.yLowerBound) {
          positions[i] = Math.random() * 600 - 300;
          positions[i + 1] = Math.random() * 600 - 300;
          positions[i + 2] = Math.random() * 600 - 300;
        }
      }
  
      this.geometry.attributes.position.needsUpdate = true;
    }
    
    setBaseSpeed(v) {
      this.fallSpeed = this.initialSpeed * v;
    }
  }
  
  class Snowfalls extends Group {
    constructor(count, loadingManager) {
      super();
      this.textureCount = snowpng.length;
      this.baseSpeed = 0.5;
  
      // Load snowflake textures
      const textureLoader = new TextureLoader(loadingManager);
      const snowflakeMaterials = [];
      const snowflakeColor = [
        "white",
        "lightcyan",
        "paleturquoise",
        "lightskyblue",
        "lightblue",
      ];
      snowpng.forEach((png, i) => {
        snowflakeMaterials.push(
          new PointsMaterial({
            size: 3,
            map: textureLoader.load(png),
            blending: AdditiveBlending,
            depthTest: false,
            opacity: 0.7,
            color: snowflakeColor[i],
          })
        );
      });
  
      for (let i = 0; i < this.textureCount; i++) {
        const positions = [];
        for (let j = 0; j < count / this.textureCount; j++) {
          positions.push(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
          );
        }
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        this.add(new Snowflakes(geometry, snowflakeMaterials[i]));
      }
    }
  
    update(deltaTime) {
      this.children.forEach(snowflakes => {
        snowflakes.update(deltaTime);
      });
    }
  
    setBaseSpeed(v) {
      this.baseSpeed = v;
      this.children.forEach(element => {
        element.setBaseSpeed(v);
      });
    }
  
    getBaseSpeed() {
      return this.baseSpeed;
    }
  }
  
  export default Snowfalls;
  