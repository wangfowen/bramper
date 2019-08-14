import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import Packaging from "./Packaging";
import {DesignerMode, PackageSide} from "app/models/packaging";
import Camera from "./Camera";

class SceneManager {
  private canvas;

  private scene: THREE.Scene;
  private camera: Camera;
  private renderer: THREE.Renderer;
  private frameId;

  private packaging: Packaging;
  private mode: DesignerMode;
  private side: PackageSide;

  constructor(mode: DesignerMode, side: PackageSide) {
    this.mode = mode;
    this.side = side;

    this.scene = new THREE.Scene();
    this.camera = new Camera(this.scene);
    this.renderer = new THREE.WebGLRenderer({antialias: true});

    this.packaging = new Packaging();
  }

  init(canvas: HTMLDivElement) {
    this.canvas = canvas;

    this.initCanvas();
    this.enterMode(this.mode, this.side, false);

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

    /*
    debug tools:
    this.scene.add(new THREE.AxesHelper(100));
    this.scene.add(new THREE.GridHelper(180,10));
    */

    this.renderer.setSize(width, height);
    this.canvas.appendChild(this.renderer.domElement);

    //init elements on canvas
    this.camera.initCamera(width, height);
    this.packaging.init(this.scene);
  }

  enterMode(mode: DesignerMode, side: PackageSide, slide: boolean = true) {
    this.mode = mode;
    this.side = side;

    switch (mode) {
      case DesignerMode.Box:
        this.camera.moveToBox(slide);
        //from side angle
        break;
      case DesignerMode.Side:
        this.camera.moveToSide(this.packaging.getSide(side));
        //depending on side
        break;
      default:
        //TODO(mode): flat mode
    }
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera.camera);
    TWEEN.update();
  }

  rotateCamera(rotateX: number, rotateY: number) {
    this.camera.rotate(rotateX, rotateY);
  }

  setColorAt(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse2D = new THREE.Vector3(
      ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1,
      - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse2D, this.camera.camera);
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