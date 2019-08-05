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

  constructor(props: PackagingProps = {}) {
    this.width = props.width || 1;
    this.height = props.height || 1;
    this.depth = props.depth || 1;

    this.boxColor = props.boxColor || 0xcccccc;
    this.lineColor = props.lineColor || 0x333333;
  }

  init(scene: THREE.Scene) {
    //TODO(mode): split it into 6 rectangles instead of a cube
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    const material = new THREE.MeshBasicMaterial( { color: this.boxColor } );

    this.box = new THREE.Mesh( geometry, material );
    const edges = new THREE.EdgesGeometry( geometry );
    this.outline = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x333333 } ) );

    scene.add(this.box);
    scene.add(this.outline);
  }
}

export default Packaging;