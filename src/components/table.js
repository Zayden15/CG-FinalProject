import {
    Mesh,
    BoxGeometry,
    Group,
    MeshStandardMaterial,
    TextureLoader,
  } from "three";
  
  // Import textures if you have any
  import tableTexture from "/img/table.avif";
  
  class Table extends Group {
    constructor(loadingManager) {
      super();
  
      // Table dimensions
      const tabletopWidth = 16;
      const tabletopDepth = 8;
      const tabletopHeight = 0.2;
      const legHeight = 2;
      const legWidth = 0.2;
  
      const textureLoader = new TextureLoader(loadingManager);
      const texture = textureLoader.load(tableTexture);
  
      // Tabletop
      const tabletopGeometry = new BoxGeometry(tabletopWidth, tabletopHeight, tabletopDepth);
      const tabletopMaterial = new MeshStandardMaterial({ 
        color: 0x8B4513,
        map: texture,
      });
      const tabletop = new Mesh(tabletopGeometry, tabletopMaterial);
      tabletop.position.y = legHeight + tabletopHeight / 2;
      this.add(tabletop);
  
      // Function to create a table leg
      const createLeg = (x, z) => {
        const legGeometry = new BoxGeometry(legWidth, legHeight, legWidth);
        const legMaterial = new MeshStandardMaterial({ color: 0x8B4513 });
        const leg = new Mesh(legGeometry, legMaterial);
        leg.position.set(x, legHeight / 2, z);
        return leg;
      };
  
      // Add legs to the table
      const halfWidth = tabletopWidth / 2 - legWidth / 2;
      const halfDepth = tabletopDepth / 2 - legWidth / 2;
      this.add(createLeg(halfWidth, halfDepth));
      this.add(createLeg(-halfWidth, halfDepth));
      this.add(createLeg(halfWidth, -halfDepth));
      this.add(createLeg(-halfWidth, -halfDepth));
    }
  }
  
  export default Table;
  