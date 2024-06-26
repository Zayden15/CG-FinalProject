import * as THREE from 'three'
import Segment from "./Segment.module.js";
import Leaf from "./Leaf.module.js";
import { randomXzVector } from "./util.module.js";

const strokeSegmentLength = 0.1;

class Branch {
  constructor({
    scene,
    parentBranch = null,
    parentSegment = null,
    pos = new THREE.Vector3(),
    rot = new THREE.Matrix3(),
    thickness = 1,
  }) {
    this.scene = scene;
    this.parentBranch = parentBranch;
    this.parentSegment =
      parentSegment ?? new Segment({ scene, rot, length: 0, thickness });
    this.pos = pos;
    this.rot = rot;
    this.thickness = thickness;

    this.lastSegment = this.parentSegment;
    this.lastStrokePos = this.pos.clone();
  }

  get parentObject() {
    return this.parentSegment.parentObject;
  }

  static fromParent(branch, params) {
    const {
      pos = branch.pos.clone(),
      rot = branch.rot.clone(),
      thickness = branch.thickness,
    } = params;
    return new Branch({
      scene: branch.scene,
      parentBranch: branch,
      parentSegment: branch.lastSegment,
      pos,
      rot,
      thickness,
    });
  }

  grow(segments, leaves, dt = 1) {
    const branches = [];

    const dx = new THREE.Vector3(0, 1, 0).applyMatrix3(this.rot);
    this.pos.addScaledVector(dx, dt);

    if (Math.random() < (1.0 + (1 - this.thickness) * 0.4) * dt) {
      branches.push(this._createBranch());
    }

    this._wiggle(dt);

    const distance = Math.sqrt(
      (this.lastStrokePos.x - this.pos.x) ** 2 +
        (this.lastStrokePos.y - this.pos.y) ** 2 +
        (this.lastStrokePos.z - this.pos.z) ** 2
    );
    if (distance > strokeSegmentLength) {
      const newSegment = this._stroke(distance);
      segments.push(newSegment);
      if (this.thickness < 0.25) {
        leaves.push(...this._makeLeaves(newSegment, distance));
      }
    }

    this.thickness -= 0.2 * dt;
    if (this.thickness > 0.05) {
      branches.push(this);
    }
    return branches;
  }

  _createBranch() {
    const axis = randomXzVector();
    const angleRange = 0.5 + 0.4 * (1 - this.thickness);
    const branchRot = new THREE.Matrix3().setFromMatrix4(
      new THREE.Matrix4().makeRotationAxis(axis, Math.random() * angleRange * 2 - angleRange)
    );
    const rot = this.rot.clone().multiply(branchRot);
    return Branch.fromParent(this, {
      rot,
    });
  }

  _wiggle(dt) {
    const axis = randomXzVector();
    const angle = (Math.random() * 2 - 1) * 5 * (1 - this.thickness) * dt;
    const rot = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationAxis(axis, angle));
    this.rot.multiply(rot);
  }

  _stroke(length) {
    const parentRot = this.lastSegment?.rotWorld.clone();
    const relativeRot = parentRot.invert().multiply(this.rot);
    const segment = Segment.fromParent(this.lastSegment, {
      rot: relativeRot,
      length,
      thickness: this.thickness,
    });
    this.lastStrokePos = this.pos.clone();
    this.lastSegment = segment;
    return segment;
  }

  _makeLeaves(parentSegment, length) {
    const n = Math.round(Math.random() * 3 * (1 - this.thickness) / 0.25);
    return Array.from({length: n}).map((_, i) => new Leaf({
      height: i * length / n,
      angle: Math.random() * 2 * Math.PI,
      distance: Math.random() ** 2 * 0.3,
      parentSegment
    }));
  }
}

export default Branch;
