import * as THREE from "three";
import Packaging from "./Packaging";
import {DesignerMode, PackageSide} from "app/models/packaging";

class SceneManager {
  private canvas;

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.Renderer;
  private frameId;

  private packaging: Packaging;
  private mode: DesignerMode;
  private side: PackageSide;

  constructor(mode: DesignerMode, side: PackageSide) {
    this.mode = mode;
    this.side = side;

    //dummy constructors
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.renderer = new THREE.WebGLRenderer({antialias: true});

    this.packaging = new Packaging();
  }

  init(canvas: HTMLDivElement) {
    this.canvas = canvas;

    this.initCanvas();
    this.packaging.init(this.scene);
    this.enterMode(this.mode, this.side);

    this.animate();
  }

  unmount() {
    cancelAnimationFrame(this.frameId);
    this.canvas.removeChild(this.renderer.domElement);
  }

  initCanvas() {
    const height = this.canvas.clientHeight;
    const width = this.canvas.clientWidth;

    this.scene.background = new THREE.Color(0xeeeeee);

    this.renderer.setSize(width, height);
    this.canvas.appendChild(this.renderer.domElement);

    this.initCamera(width, height);
  }

  enterMode(mode: DesignerMode, side: PackageSide) {
    this.mode = mode;
    this.side = side;

    switch (mode) {
      case DesignerMode.Box:
        //TODO(mode): zoom camera out to see whole thing
        //from side angle
        break;
      case DesignerMode.Side:
        //TODO(mode): zoom camera in onto side
        //depending on side
        break;
      default:
        //TODO(mode): flat mode
    }
  }

  initCamera(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 4;
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  onMouseDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse2D = new THREE.Vector3(
      ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1,
      - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse2D, this.camera);
    let intersects = raycaster.intersectObjects(this.scene.children);
    intersects.forEach((intersect) => {
      const object = intersect.object;
      if (object instanceof THREE.Mesh) {
        const material = object.material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.color.setHex(Math.random() * 0xffffff)
        }
      }
    })
  }
}

export default SceneManager