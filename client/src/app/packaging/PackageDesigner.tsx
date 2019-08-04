import React, {Component} from 'react';
import * as THREE from "three";

import styles from './PackageDesigner.module.css';
import Packaging from "./Packaging";

const OrbitControls = require("three-orbit-controls")(THREE);

class PackageDesigner extends Component {
  private canvas: React.RefObject<HTMLDivElement>;
  private scene;
  private camera;
  private renderer;
  private controls;
  private frameId;

  private packaging;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  initCanvas() {
    const canvas = this.canvas.current;
    if (canvas) {
      const height = canvas.clientHeight;
      const width = canvas.clientWidth;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xeeeeee);

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(width, height);
      canvas.appendChild(this.renderer.domElement);

      this.initCamera(width, height);
      this.initOrbits();
    }
  }

  initOrbits() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
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

    this.packaging.rotate(0.01, 0.01);
  }

  onMouseDown(event) {
    const canvas = this.canvas.current;
    if (canvas) {
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

  componentDidMount() {
    this.initCanvas();

    this.renderPackaging();

    this.animate();
  }

  componentWillUnmount() {
    const canvas = this.canvas.current;
    if (canvas) {
      cancelAnimationFrame(this.frameId);
      canvas.removeChild(this.renderer.domElement);
    }
  }

  render() {
    return <div
      className={styles.canvas}
      ref={this.canvas}
      onClick={e => this.onMouseDown(e)}
    >
    </div>
  }
}

export default PackageDesigner