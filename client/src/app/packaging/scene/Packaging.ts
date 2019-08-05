import * as THREE from "three";

interface PackagingProps {
  width?: number,
  height?: number,
  depth?: number,
  boxColor?: number,
  lineColor?: number
}

class Packaging {
  private width;
  private height;
  private depth;
  private boxColor;
  private lineColor;

  public box;
  public outline;

  constructor(scene: THREE.Scene, props: PackagingProps = {}) {
    this.width = props.width || 1;
    this.height = props.height || 1;
    this.depth = props.depth || 1;

    this.boxColor = props.boxColor || 0xcccccc;
    this.lineColor = props.lineColor || 0x333333;

    this.init(scene)
  }

  init(scene: THREE.Scene) {
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    const material = new THREE.MeshBasicMaterial( { color: this.boxColor } );

    this.box = new THREE.Mesh( geometry, material );
    const edges = new THREE.EdgesGeometry( geometry );
    this.outline = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x333333 } ) );

    this.rotate(0.5, 0.5);

    scene.add(this.box);
    scene.add(this.outline);
  }

  rotate(x: number, y: number) {
    this.box.rotation.x += x;
    this.box.rotation.y += y;
    this.outline.rotation.x += x;
    this.outline.rotation.y += y;
  }
}

export default Packaging;