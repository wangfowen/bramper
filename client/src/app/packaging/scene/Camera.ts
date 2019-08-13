import * as THREE from "three";

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

  moveToBox() {
    //TODO(mode): move back slowly to this
    this.camera.position.set(0, 0, 6);
    this.rotate(80, 30);
  }

  moveToSide(mesh: THREE.Mesh) {
    const vec = new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
    //TODO(mode): zoom to the side slowly
    //TODO(mode): zoom out to where can see whole side fitting in screen
    //TODO(mode): rotate so that it's facing "up"
    //TODO(mode): is it obvious what's up if zoom slowly? otherwise need to distinguish somehow for user
    vec.multiply(new THREE.Vector3(5, 5, 5));

    this.camera.position.set(vec.x, vec.y, vec.z);
    this.camera.lookAt(this.scene.position);
  }

  rotate(rotateX: number, rotateY: number) {
    const rotSpeed = -0.01;

    const rotateXAmount = rotateX * rotSpeed;
    const rotateYAmount = rotateY * rotSpeed;

    this.camera.position.applyQuaternion(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3( 1, 0, 0 ),
        rotateYAmount
      )
    );
    this.camera.position.applyQuaternion(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3( 0, 1, 0 ),
        rotateXAmount
      )
    );

    this.camera.lookAt(this.scene.position);
  }

  /*
  //code for tweening on the zoom

  var cameraPos0   // initial camera position
  var cameraUp0    // initial camera up
  var cameraZoom   // camera zoom
  var iniQ         // initial quaternion
  var endQ         // target quaternion
  var curQ         // temp quaternion during slerp
  var vec3         // generic vector object
  var tweenValue   // tweenable value

  // init camera
  setup() {
      cameraPos0 = this.camera.position.clone()
      cameraUp0 = this.camera.up.clone()
      cameraZoom = this.camera.position.z
  }

  moveCamera(euler, zoom) {
    // reset everything
    endQ = new THREE.Quaternion()
    iniQ = new THREE.Quaternion().copy(this.camera.quaternion)
    curQ = new THREE.Quaternion()
    vec3 = new THREE.Vector3()
    tweenValue = 0

    endQ.setFromEuler(euler)
    TweenLite.to(this, 5, { tweenValue:1, cameraZoom:zoom, onUpdate: this.onSlerpUpdate })
  }

  onSlerpUpdate() {
    // interpolate quaternions with the current tween value
    THREE.Quaternion.slerp(iniQ, endQ, curQ, tweenObj.value)

    // apply new quaternion to camera position
    vec3.x = cameraPos0.x
    vec3.y = cameraPos0.y
    vec3.z = cameraZoom
    vec3.applyQuaternion(curQ)
    this.camera.position.copy(vec3)

    // apply new quaternion to camera up
    vec3 = cameraUp0.clone()
    vec3.applyQuaternion(curQ)
    this.camera.up.copy(vec3)
  }
  */
}