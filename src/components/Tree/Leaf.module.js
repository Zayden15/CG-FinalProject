import * as THREE from 'three';

export const makeLeafGeometry = () => {
  const points = [];
  const n = 16; // Increase for more detail if needed

  // Create the leaf shape with variation in width along its length
  for (let i = 0; i <= n; i++) {
    const t = i / n; // normalized position along the leaf
    const x = Math.cos(Math.PI * t - Math.PI * 0.5) * (0.5 - t) * 2;
    const y = Math.sin(Math.PI * t - Math.PI * 0.5) * (0.5 - t) * 4;
    points.push(new THREE.Vector2(x, y));
  }

  // Add the shape to a geometry
  const shape = new THREE.Shape(points);
  const geom = new THREE.ShapeGeometry(shape);
  geom.rotateX(-Math.PI / 2); // Rotate to lay flat if necessary

  return geom;
};


class Leaf {
  constructor({ height, angle, distance, parentSegment }) {
    this.height = height;
    this.angle = angle;
    this.distance = distance;
    this.parentSegment = parentSegment;

    this.worldPos = new THREE.Vector4(0, 0, 0, 1);
    this.leafAngle = Math.random() * 2 * Math.PI;
    this.scale = (Math.random() * 0.5 + 0.5) * 0.25;
    this.meshLocalMatrix = new THREE.Matrix4();
    this.meshWorldMatrix = new THREE.Matrix4();
    this.targetPos = new THREE.Vector4();
    this._updateMeshLocalMatrix();
  }

  updateTransform(instancedMesh, i) {
    this.meshWorldMatrix.copy(this.parentSegment.worldMatrix);
    this.meshWorldMatrix.multiply(this.meshLocalMatrix);
    this.targetPos.set(0, 0, 0, 1).applyMatrix4(this.meshWorldMatrix);
    instancedMesh.setMatrixAt(i, this.meshWorldMatrix);
  }

  _updateMeshLocalMatrix() {
    this.meshLocalMatrix.makeRotationY(this.angle);
    const position = new THREE.Vector4(this.distance, this.height, 0, 1);
    position.applyMatrix4(this.meshLocalMatrix);
    this.meshLocalMatrix.setPosition(position.x, position.y, position.z);
    this.meshLocalMatrix.multiply(
      new THREE.Matrix4().makeScale(this.scale, this.scale, this.scale)
    );
    this.meshLocalMatrix.multiply(
      new THREE.Matrix4().makeRotationY(this.leafAngle)
    );
  }
}

export default Leaf;
