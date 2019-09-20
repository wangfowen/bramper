import {
  Vector3, Vector2, PlaneGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshBasicMaterial, Mesh,
  Object3D, Texture
} from "three";
import {Packaging} from "./Packaging";
import {FullDieline, PackageSide} from "app/models/designer/packaging";
import {DielineCoords} from "app/models/designer/packaging";
import {BackgroundMap} from "../layers/backgrounds/BackgroundLayer";

interface BoxSide {
  name: PackageSide,
  width: number,
  height: number,
  botLeftX: number,
  botLeftY: number,
  uvs: Vector2[][]
}

type XYZ = [number, number, number];

/*
Dieline:
         ________
        |        |
        | Back   |
        |________|
        |        |
        | Top    |
        |        |
 _______|________|_______
|       |        |       | \
| Left  | Front  | Right |  height
|_______|________|_______| /
 \     /|        | \
  depth | Bottom |  depth
        |        | /
        |________|
         \      /
          width
 */

class BoxPackage implements Packaging {
  private combinedWidth: number;
  private combinedHeight: number;
  private box: {[name: string]: BoxSide};

  static mkBoxSide(name: PackageSide, width: number, height: number, botLeftX: number, botLeftY: number): BoxSide {
    //lower left, lower right, upper left, upper right
    const coords: Vector2[] = [
      new Vector2(botLeftX, botLeftY),
      new Vector2(botLeftX + width, botLeftY),
      new Vector2(botLeftX, botLeftY + height),
      new Vector2(botLeftX + width, botLeftY + height)
    ];
    const uvs = [
      [coords[2], coords[0], coords[3]],
      [coords[0], coords[1], coords[3]],
    ];
    return {name, width, height, botLeftX, botLeftY, uvs}
  }

  constructor(readonly width: number = 300, readonly height: number = 100, readonly depth: number = 200) {
    this.box = {
      Left: BoxPackage.mkBoxSide("Left", this.depth, this.height, 0, this.depth),
      Bottom: BoxPackage.mkBoxSide("Bottom", this.width, this.depth, this.depth, 0),
      Front: BoxPackage.mkBoxSide("Front", this.width, this.height, this.depth, this.depth),
      Right: BoxPackage.mkBoxSide("Right", this.depth, this.height, this.depth + this.width, this.depth),
      Top: BoxPackage.mkBoxSide("Top", this.width, this.depth, this.depth, this.depth + this.height),
      Back: BoxPackage.mkBoxSide("Back", this.width, this.height, this.depth, 2 * this.depth + this.height)
    };

    this.combinedWidth = this.box.Left.width + this.box.Right.width + this.box.Front.width;
    this.combinedHeight = this.box.Back.height + this.box.Top.height + this.box.Front.height + this.box.Bottom.height;
  }

  normalizeUvs(side: BoxSide): Vector2[][] {
    return side.uvs.map((i: Vector2[]) =>
      i.map((j: Vector2) =>
        new Vector2(
          j.x / this.combinedWidth,
          j.y / this.combinedHeight
        )
      )
    );
  }

  getSides(): PackageSide[] {
    return Object.values(this.box).map((side) => side.name);
  }

  dielineSize() {
    return {
      width: this.combinedWidth,
      height: this.combinedHeight
    }
  }

  dielineCoordsFromCenter(relativeCoords: DielineCoords, relativeSide?: PackageSide) {
    if (relativeSide !== undefined) {
      const boxSide = this.box[relativeSide];
      return {
        x: boxSide.botLeftX + boxSide.width / 2.0 + relativeCoords.x,
        y: boxSide.botLeftY + boxSide.height / 2.0 + relativeCoords.y
      }
    } else {
      //center for full dieline is middle of Front
      return {
        x: this.combinedWidth / 2.0 + relativeCoords.x,
        y: this.box.Bottom.height + (this.box.Front.height / 2.0) + relativeCoords.y
      }
    }
  }

  sideAtCoords(coords: DielineCoords): PackageSide | undefined {
    return Object.values(this.box).filter((boxSide) => {
      return coords.x <= boxSide.botLeftX + boxSide.width &&
        coords.x >= boxSide.botLeftX &&
        coords.y <= boxSide.botLeftY + boxSide.height &&
        coords.y >= boxSide.botLeftY
    }).map((boxSide) => boxSide.name)[0]
  }

  drawDieline(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, backgroundLayers: BackgroundMap) {
    Object.values(this.box).forEach((side: BoxSide) => {
      //x and y for fillRect defined from top left
      let background = backgroundLayers[side.name];
      if (background === undefined) {
        background = backgroundLayers[FullDieline]
      }
      if (background === undefined) {
        console.log(`No background defined for ${side.name}`);
      } else {
        background.draw(context, canvas);
      }
      const y = this.combinedHeight - side.botLeftY - side.height;
      context.fillRect(side.botLeftX, y, side.width, side.height);

      //debug
      /*
      context.font = '20pt Arial';
      context.fillStyle = 'black';
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(side.name, side.x + side.width / 2.0, y + side.height / 2.0);
      */
    });
  }

  mkSideMesh(side: BoxSide, texture: Texture, translate: XYZ, rotate: XYZ) {
    const geometry = new PlaneGeometry(side.width, side.height);
    geometry.faceVertexUvs[0] = this.normalizeUvs(side);

    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new Mesh(geometry, material);

    const edges = new EdgesGeometry(geometry);
    const outline = new LineSegments(edges, new LineBasicMaterial( { color: 0x333333} ));

    mesh.position.copy(new Vector3(...translate));
    mesh.rotation.set(...rotate);
    mesh.add(outline);

    mesh.name = side.name;

    return mesh;
  }

  sideMesh(side: PackageSide, texture: Texture): Object3D {
    return this.mkSideMesh(this.box[side], texture, [0, 0, 0], [0, 0, 0])
  }

  dielineMesh(texture: Texture): Object3D {
    const obj = new Object3D();
    obj.add(this.mkSideMesh(this.box.Front, texture,[0, 0, 0], [0, 0, 0]));
    obj.add(this.mkSideMesh(this.box.Top, texture,[0, this.box.Top.height / 2.0 + this.box.Front.height / 2.0, 0], [0, 0, 0]));
    obj.add(this.mkSideMesh(this.box.Back, texture,[0, this.box.Top.height + this.box.Back.height / 2.0 + this.box.Front.height / 2.0, 0], [0, 0, 0]));
    obj.add(this.mkSideMesh(this.box.Bottom, texture,[0, this.box.Front.height / -2.0 + this.box.Bottom.height / -2.0, 0], [0, 0, 0]));
    obj.add(this.mkSideMesh(this.box.Left, texture,[this.box.Front.width / -2.0 + this.box.Left.width / -2.0, 0, 0], [0,0, 0]));
    obj.add(this.mkSideMesh(this.box.Right, texture,[this.box.Front.width / 2.0 + this.box.Right.width / 2.0, 0, 0], [0,0,0]));

    return obj;
  }

  mesh(texture: Texture): Object3D {
    const ninety = Math.PI / 2;
    const oneEighty = Math.PI;

    const obj = new Object3D();
    obj.add(this.mkSideMesh(this.box.Front, texture,[0, 0, this.box.Top.height / -2.0], [0, oneEighty, 0]));
    obj.add(this.mkSideMesh(this.box.Back, texture,[0, 0, this.box.Top.height / 2.0], [oneEighty, oneEighty, 0]));
    obj.add(this.mkSideMesh(this.box.Top, texture,[0, this.box.Front.height / 2.0, 0], [ninety, oneEighty, 0]));
    obj.add(this.mkSideMesh(this.box.Bottom, texture,[0, this.box.Front.height / -2.0, 0], [ninety + oneEighty, oneEighty, 0]));
    obj.add(this.mkSideMesh(this.box.Left, texture,[this.box.Front.width / 2.0, 0, 0], [0, ninety, 0]));
    obj.add(this.mkSideMesh(this.box.Right, texture,[this.box.Front.width / -2.0, 0, 0], [0, ninety + oneEighty, 0]));

    return obj;
  }
}

export default BoxPackage;