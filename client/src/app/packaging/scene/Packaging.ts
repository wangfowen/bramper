import {Vector3, PlaneGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshBasicMaterial, Mesh, Scene, DoubleSide} from "three";

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

  constructor(props: PackagingProps = {}) {
    this.width = props.width || 2;
    this.height = props.height || 1;
    this.depth = props.depth || 3;

    this.boxColor = props.boxColor || 0xcccccc;
    this.lineColor = props.lineColor || 0x333333;
  }

  initSide(scene: Scene, side: PlaneGeometry, translate: Vector3, rotate: Vector3) {
    const mesh = new Mesh(side, new MeshBasicMaterial( { color: this.boxColor, side: DoubleSide } ));

    const edges = new EdgesGeometry( side);
    const outline = new LineSegments( edges, new LineBasicMaterial( { color: this.lineColor} ));

    mesh.position.copy(translate);
    mesh.rotation.set(rotate.x, rotate.y, rotate.z);

    outline.position.copy(translate);
    outline.rotation.set(rotate.x, rotate.y, rotate.z);

    scene.add(mesh);
    scene.add(outline);

    return { mesh, outline }
  }

  init(scene: Scene) {
    const front = new PlaneGeometry(this.width, this.height);
    const top = new PlaneGeometry(this.width, this.depth);
    const side = new PlaneGeometry(this.depth, this.height);

    const rotation = Math.PI / 2;
    this.box = {
      front: this.initSide(scene, front, new Vector3(0, 0, this.depth / -2.0), new Vector3(0, 0, 0)),
      back: this.initSide(scene, front, new Vector3(0, 0, this.depth / 2.0), new Vector3(0, 0, 0)),
      top: this.initSide(scene, top, new Vector3(0, this.height / 2.0, 0), new Vector3(rotation, 0, 0)),
      bottom: this.initSide(scene, top, new Vector3(0, this.height / -2.0, 0), new Vector3(rotation, 0, 0)),
      left: this.initSide(scene, side, new Vector3(this.width / -2.0, 0, 0), new Vector3(0, rotation, 0)),
      right: this.initSide(scene, side, new Vector3(this.width / 2.0, 0, 0), new Vector3(0, rotation, 0))
    };
  }
}

export default Packaging;