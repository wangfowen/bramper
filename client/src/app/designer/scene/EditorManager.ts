import * as THREE from "three";

import {Packaging} from "../packaging/Packaging";
import Camera from "./Camera";
import {DesignerMode, FullDieline, PackageSide} from "app/models/designer/packaging";

class EditorManager {
  private canvas?: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: Camera;
  private renderer: THREE.Renderer;
  private frameId: number;
  private texture?: THREE.Texture;
  private meshes: {[type: string]: THREE.Object3D};

  constructor() {
    this.frameId = 0;
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.scene);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.meshes = {}
  }

  init(packaging: Packaging, canvas: HTMLDivElement, texture: HTMLCanvasElement) {
    this.canvas = canvas;

    const threeTexture = new THREE.Texture(texture);
    this.texture = threeTexture;

    packaging.getSides().forEach((side: PackageSide) => {
      this.meshes[side] = packaging.sideMesh(side, threeTexture);
    });
    this.meshes[FullDieline] = packaging.dielineMesh(threeTexture);

    this.scene.background = new THREE.Color(0xeeeeee);

    const canvasHeight = this.canvas.clientHeight;
    const canvasWidth = this.canvas.clientWidth;
    this.renderer.setSize(canvasWidth, canvasHeight);
    this.canvas.appendChild(this.renderer.domElement);

    const packageSize = packaging.dielineSize();
    const maxPackageDim = Math.max(packageSize.width, packageSize.height);
    this.camera.initCamera(canvasWidth, canvasHeight, maxPackageDim);
    this.camera.moveToFit();

    this.animate();
  }

  unmount() {
    cancelAnimationFrame(this.frameId);
    if (this.canvas) {
      this.canvas.removeChild(this.renderer.domElement);
    }
  }

  updateTexture() {
    if (this.texture) {
      this.texture.needsUpdate = true;
    }
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera.camera);
  }

  enterMode(mode: DesignerMode, side: PackageSide) {
    this.scene.remove.apply(this.scene, this.scene.children);

    switch (mode) {
      case DesignerMode.Full:
        this.scene.add(this.meshes[FullDieline]);
        break;
      case DesignerMode.Side:
        this.scene.add(this.meshes[side]);
        break;
    }

    this.camera.moveToFit();

    this.updateTexture();
  }

  translateCamera(x: number, y: number) {
    this.camera.translate(x, y);
  }

  zoomCamera(z: number) {
    this.camera.zoom(z);
  }

  getClickedPoint(event): THREE.Vector3 | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse2D = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      - ((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse2D, this.camera.camera);
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    //debug intersections:
    /*
    const arrow = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff);
    this.scene.add( arrow );
    */

    if (intersects.length > 0) {
      return intersects[0].point;
    } else {
      return null;
    }
  }
}

export default EditorManager
