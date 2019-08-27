import * as THREE from "three";

import {Layer} from "app/models/tools/tools";
import {ColoredBackgroundJson, ColoredBackgroundType} from "app/models/tools/background";
import {MeshSide} from "../scene/Packaging";

export class ColoredBackgroundLayer implements Layer {
  public name: string;
  private color: number;

  constructor(json: ColoredBackgroundJson) {
    this.name = "Test";
    this.color = parseInt(json.color, 16);
  }

  render(side: MeshSide) {
    const material = new THREE.MeshBasicMaterial({color: this.color});
    side.mesh.material = material;
  }

  toJson(): ColoredBackgroundJson {
    return {
      type: ColoredBackgroundType,
      color: this.color.toString(16)
    }
  }
}
