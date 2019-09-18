import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

export default class Camera {
  public camera: THREE.Camera;
  private scene: THREE.Scene;
  private maxZ: number;

  constructor(scene: THREE.Scene) {
    //dummy constructor
    this.camera = new THREE.Camera();
    this.maxZ = 0;

    this.scene = scene;
  }

  initCamera(canvasWidth: number, canvasHeight: number, maxZ: number) {
    this.maxZ = maxZ;
    this.camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, maxZ);
  }

  moveToFit(offset: number = 1.1, slide: boolean = false, rotation: {x: number, y: number} = {x: 0, y: 0}) {
    //assumes only one object
    const obj = this.scene.children[0];
    if (obj === undefined) {
      return;
    }

    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(obj);
    const size = boundingBox.getSize(new THREE.Vector3);
    let maxDim = Math.max(size.x, size.y, size.z);
    maxDim = Math.min(maxDim * offset, this.maxZ);

    const vec = new THREE.Vector3(0, 0, maxDim);
    const rotated = this.applyRotation(vec, rotation.x, rotation.y);

    if (slide) {
      this.slideCamera(rotated);
    } else {
      this.camera.position.copy(rotated);
      this.camera.lookAt(this.scene.position);
    }
  }

  /*
  moveToSide(side: MeshSide) {
    const {mesh, width, height} = side;
    const vec = mesh.position.clone();
    //TODO(improve): rotate so that it's facing "up"
    //TODO(improve): is it obvious what's up if zoom slowly? otherwise need to distinguish somehow for user

    //TODO(improve): is there a better way to zoom to just within sight of the side?
    const current = vec.x + vec.y + vec.z;
    let toAdd = Math.max(width, height);
    if (current < 0) {
      toAdd *= -1;
    }
    if (vec.x !== 0) {
      vec.add(new THREE.Vector3(toAdd, 0, 0));
    }
    if (vec.y !== 0) {
      vec.add(new THREE.Vector3(0, toAdd, 0));
    }
    if (vec.z !== 0) {
      vec.add(new THREE.Vector3(0, 0, toAdd));
    }

    this.slideCamera(vec);
  }
  */

  //TODO(improve): X and Y are arbitrary numbers right now, since inputted from screen position change... should normalize to something
  applyRotation(origPos: THREE.Vector3, rotateX: number, rotateY: number): THREE.Vector3 {
    const rotSpeed = -0.01;

    const rotateXAmount = rotateX * rotSpeed;
    const rotateYAmount = rotateY * rotSpeed;

    const pos = origPos.clone();

    pos.applyQuaternion(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3( 1, 0, 0 ),
        rotateYAmount
      )
    );
    pos.applyQuaternion(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3( 0, 1, 0 ),
        rotateXAmount
      )
    );

    return pos;
  }

  rotate(rotateX: number, rotateY: number) {
    this.camera.position.copy(this.applyRotation(this.camera.position, rotateX, rotateY));
    this.camera.lookAt(this.scene.position);
  }

  translate(x: number, y: number) {
    this.camera.position.x -= x;
    this.camera.position.y += y;
  }

  zoom(z: number) {
    const delta = this.maxZ / 500.0;
    const newZ = this.camera.position.z + z * delta;
    if (newZ > delta && newZ < this.maxZ) {
      this.camera.position.z += z;
    }
  }

  //TODO(improve): need slide to not go inside the object...
  slideCamera(newPos: THREE.Vector3) {
    const curPos = this.camera.position;
    const curVec = {x: curPos.x, y: curPos.y, z: curPos.z};

    new TWEEN.Tween(curVec)
      .to({x: newPos.x, y: newPos.y, z: newPos.z}, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.camera.position.set(curVec.x, curVec.y, curVec.z);
        this.camera.lookAt(this.scene.position);
      })
      .start();
  }
}