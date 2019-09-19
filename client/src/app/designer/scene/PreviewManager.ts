import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import {Packaging} from "../packaging/Packaging";
import Camera from "./Camera";

class PreviewManager {
  private canvas;

  private scene: THREE.Scene;
  private camera: Camera;
  private renderer: THREE.Renderer;
  private frameId;
  private texture?: THREE.Texture;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.scene);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
  }

  init(packaging: Packaging, canvas: HTMLDivElement, texture: HTMLCanvasElement) {
    this.canvas = canvas;

    this.texture = new THREE.Texture(texture);
    const mesh = packaging.mesh(this.texture);
    this.scene.add(mesh);

    this.scene.background = new THREE.Color(0xeeeeee);

    /*
    debug tools:
    this.scene.add(new THREE.AxesHelper(100));
    this.scene.add(new THREE.GridHelper(180,10));
    */

    const height = this.canvas.clientHeight;
    const width = this.canvas.clientWidth;
    this.renderer.setSize(width, height);
    this.canvas.appendChild(this.renderer.domElement);

    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(mesh);
    const boxSize = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
    this.camera.initCamera(width, height, maxDim * 3);
    this.camera.moveToFit(1.4, false, {x: 400, y: 30});

    this.animate();
  }

  unmount() {
    cancelAnimationFrame(this.frameId);
    this.canvas.removeChild(this.renderer.domElement);
  }

  updateTexture() {
    if (this.texture) {
      this.texture.needsUpdate = true;
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

  //TODO(new-render): if move to new side, rotate to view that side
}

export default PreviewManager