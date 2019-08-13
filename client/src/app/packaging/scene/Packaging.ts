import {Vector3, PlaneGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshBasicMaterial, Mesh, Scene} from "three";
import {PackageSide} from "../../models/packaging";

interface PackagingProps {
  width?: number,
  height?: number,
  depth?: number,
  boxColor?: number,
  lineColor?: number
}

interface Box {
  [PackageSide.Front]: Mesh,
  [PackageSide.Back]: Mesh,
  [PackageSide.Top]: Mesh,
  [PackageSide.Bottom]: Mesh,
  [PackageSide.Left]: Mesh,
  [PackageSide.Right]: Mesh
}

type XYZ = [number, number, number]

class Packaging {
  private width;
  private height;
  private depth;
  private boxColor;
  private lineColor;

  public box: Box;

  constructor(props: PackagingProps = {}) {
    this.width = props.width || 2;
    this.height = props.height || 1;
    this.depth = props.depth || 3;

    this.boxColor = props.boxColor || 0xcccccc;
    this.lineColor = props.lineColor || 0x333333;

    //dummy consructor -- better way to do this?
    this.box = {
      Front: new Mesh(),
      Back: new Mesh(),
      Top: new Mesh(),
      Bottom: new Mesh(),
      Left: new Mesh(),
      Right: new Mesh(),
    }
  }

  initSide(scene: Scene, side: PlaneGeometry, translate: XYZ, rotate: XYZ) {
    const mesh = new Mesh(side, new MeshBasicMaterial( { color: this.boxColor } ));

    const edges = new EdgesGeometry( side);
    const outline = new LineSegments( edges, new LineBasicMaterial( { color: this.lineColor} ));

    mesh.position.copy(new Vector3(...translate));
    mesh.rotation.set(...rotate);
    mesh.add(outline);

    scene.add(mesh);

    return mesh;
  }

  init(scene: Scene) {
    const front = new PlaneGeometry(this.width, this.height);
    const top = new PlaneGeometry(this.width, this.depth);
    const side = new PlaneGeometry(this.depth, this.height);

    const ninety = Math.PI / 2;
    const oneEighty = Math.PI;

    this.box = {
      Front: this.initSide(scene, front, [0, 0, this.depth / -2.0], [oneEighty, 0, 0]),
      Back: this.initSide(scene, front, [0, 0, this.depth / 2.0], [0, 0, 0]),
      Top: this.initSide(scene, top, [0, this.height / 2.0, 0], [ninety, oneEighty, 0]),
      Bottom: this.initSide(scene, top, [0, this.height / -2.0, 0], [ninety, 0, 0]),
      Left: this.initSide(scene, side, [this.width / -2.0, 0, 0], [0, ninety + oneEighty, 0]),
      Right: this.initSide(scene, side, [this.width / 2.0, 0, 0], [0, ninety, 0])
    };
  }

  getSide(side: PackageSide): Mesh {
    return this.box[side]
  }
}

export default Packaging;