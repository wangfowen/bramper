import * as THREE from "three";
import Packaging from "./Packaging";

const OrbitControls = require("three-orbit-controls")(THREE);

class SceneManager {
  private canvas;

  private scene;
  private camera;
  private renderer;
  private controls;
  private frameId;

  private packaging;

  init(canvas: HTMLDivElement) {
    this.canvas = canvas;

    this.initCanvas();

    this.renderPackaging();

    this.animate();
  }

  unmount() {
    cancelAnimationFrame(this.frameId);
    this.canvas.removeChild(this.renderer.domElement);
  }

  initCanvas() {
    const height = this.canvas.clientHeight;
    const width = this.canvas.clientWidth;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    this.canvas.appendChild(this.renderer.domElement);

    this.initCamera(width, height);
    this.initOrbits();
  }

  initOrbits() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 5;
  }

  initCamera(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 4;
  }

  renderPackaging() {
    //TODO: this should be different based on dimensions of box selected, scaled down
    this.packaging = new Packaging(this.scene);
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