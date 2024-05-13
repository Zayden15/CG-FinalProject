import {
    Mesh,
    CylinderGeometry,
    MeshStandardMaterial,
    SphereGeometry,
    Group,
    MathUtils,
    BoxGeometry,
    MeshToonMaterial,
  } from "three";
  
export default class SnowMan extends Group {
static melt() {
    throw new Error("Method not implemented.");
}
speed = 0.5;

constructor() {
    super();
    const buttonGeometry = new BoxGeometry(5, 5, 5);

    const hatMaterial = new MeshStandardMaterial({ color: 0x333333 });
    const headMaterial = new MeshStandardMaterial({ color: 0xffffff });
    const buttonMaterial = new MeshStandardMaterial({ color: 0x228b22 });
    const eyeMaterial = new MeshToonMaterial({ color: 0x000000 });

    this.hat = new Mesh(
    new CylinderGeometry(25, 25, 40, 30),
    hatMaterial
    );
    this.hat.position.set(0, 50, 0); //(x,y,z)

    this.hat_line = new Mesh(
    new CylinderGeometry(26, 25, 12, 30),
    new MeshStandardMaterial({ color: 0xe60033 })
    );
    this.hat_line.position.set(0, 35, 0);

    this.hat_collar = new Mesh(
    new CylinderGeometry(40, 40, 5, 30),
    hatMaterial
    );
    this.hat_collar.position.set(0, 32, 0);

    this.head = new Mesh(
    new SphereGeometry(40, this.h1, this.h2),
    headMaterial
    );
    this.head.position.set(0, 0, 0);

    this.right_eye = new Mesh(new SphereGeometry(5, 25, 40), eyeMaterial);
    this.right_eye.position.set(15, 18, 30);

    this.left_eye = new Mesh(new SphereGeometry(5, 10, 40), eyeMaterial);
    this.left_eye.position.set(-16, 18, 33);

    this.nose = new Mesh(
    new SphereGeometry(5, 30, 20),
    new MeshStandardMaterial({ color: 0xed9121 })
    );
    this.nose.position.set(3, 10, 35);

    this.body = new Mesh(
    new SphereGeometry(50, this.b1, this.b2),
    headMaterial
    );
    this.body.position.set(0, -60, 0);

    this.button_first = new Mesh(buttonGeometry, buttonMaterial);
    this.button_first.position.set(0, -30, 37);

    this.button_second = new Mesh(buttonGeometry, buttonMaterial);
    this.button_second.position.set(0, -40, 43);

    const armGeometry = new CylinderGeometry(3, 3, 35, 32); //(下,上,長さ,横)
    const armMaterial = new MeshStandardMaterial({ color: 0x8b4513 }); // 茶色

    this.leftArm = new Mesh(armGeometry, armMaterial);
    this.leftArm.position.set(-55, -30, 15);
    this.leftArm.rotation.set(0, 0, MathUtils.degToRad(45));

    this.rightArm = new Mesh(armGeometry, armMaterial);
    this.rightArm.position.set(55, -30, 15);
    this.rightArm.rotation.set(0, 0, MathUtils.degToRad(-45)); // Z軸方向に-45度傾ける

    this.add(
    this.hat,
    this.hat_line,
    this.hat_collar,
    this.head,
    this.right_eye,
    this.left_eye,
    this.nose,
    this.body,
    this.button_first,
    this.button_second,
    this.leftArm,
    this.rightArm
    );
}

Hat() {
    const { hat, hat_line, hat_collar } = this;
    const delta = hat.position.y > -80 ? 0.6 : 0;
    const deltaZ = hat.position.y > -80 ? 0.4 : 0;
    const rotate = hat.position.y > -80;

    [hat, hat_line, hat_collar].forEach((obj) => {
    if (rotate) {
        obj.rotation.x -= 0.015;
    }
    obj.position.y -= delta;
    obj.position.z -= deltaZ;
    });
}

Arm() {
    if (this.leftArm.position.y > -80) {
    this.leftArm.rotation.z += 0.016;
    this.rightArm.rotation.z -= 0.013;
    this.leftArm.position.y -= 0.6;
    this.rightArm.position.y -= 0.6;
    }
}

Fall(item) {
    if (item.position.y > -90) {
    item.position.z += 0.15;
    item.position.y -= 0.6;
    }
}

update(deltaTime) {
    const updateRatio = this.speed * 0.01 * deltaTime;
    const {
    hat,
    hat_line,
    hat_collar,
    head,
    right_eye,
    left_eye,
    nose,
    body,
    button_first,
    button_second,
    leftArm,
    rightArm,
    } = this;
    head.geometry = new SphereGeometry(
    40,
    Math.max(3, (this.h1 -= updateRatio * 100)),
    Math.max(3, (this.h2 -= updateRatio * 100))
    );
    body.geometry = new SphereGeometry(
    50,
    Math.max(3, (this.b1 -= updateRatio * 100)),
    Math.max(3, (this.b2 -= updateRatio * 100))
    );
    head.scale.y = Math.max(0, this.head.scale.y - updateRatio);
    head.scale.x = Math.max(0, this.head.scale.x - updateRatio);
    head.scale.z = Math.max(0, this.head.scale.z - updateRatio);
    body.scale.x = Math.max(0, this.body.scale.x - updateRatio);
    body.scale.y = Math.max(0, this.body.scale.y - updateRatio);
    body.scale.z = Math.max(0, this.body.scale.z - updateRatio);
    head.position.y -= updateRatio * 100;
    body.position.y -= updateRatio * 30;
    if (hat.position.y > 40) {
    [hat, hat_line, hat_collar].forEach((obj) => {
        obj.position.y -= updateRatio * 70;
    });
    } else {
    this.Hat();
    }
    if (leftArm.position.y > -45) {
    leftArm.position.y -= updateRatio * 100;
    rightArm.position.y -= updateRatio * 100;
    } else {
    this.Arm();
    }
    if (head.position.y > -25) {
    [right_eye, left_eye, nose].forEach((obj) => {
        obj.position.y -= updateRatio * 100;
    });
    } else {
    this.Fall(this.right_eye);
    this.Fall(this.left_eye);
    this.Fall(this.nose);
    }
    if (button_first.position.y > -50) {
    button_first.position.y -= updateRatio * 100;
    button_second.position.y -= updateRatio * 100;
    } else {
    this.Fall(button_first);
    this.Fall(button_second);
    }
}
}
