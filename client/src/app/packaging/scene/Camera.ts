import * as THREE from "three";
import {MeshSide} from "./Packaging";
import TWEEN from '@tweenjs/tween.js';

export default class Camera {
  private scene: THREE.Scene;

  public camera: THREE.Camera;

  constructor(scene: THREE.Scene) {
    //dummy constructor
    this.camera = new THREE.Camera();
    this.scene = scene;
  }

  initCamera(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  }

  moveToBox(slide: boolean) {
    const vec = new THREE.Vector3(0, 0, 5);
    const rotated = this.applyRotation(vec, 400, 30);

    if (slide) {
      this.slideCamera(rotated);
    } else {
      this.camera.position.copy(rotated);
      this.camera.lookAt(this.scene.position);
    }
  }

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