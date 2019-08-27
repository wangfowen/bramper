import * as THREE from "three";
import React from 'react';

import {ColoredBackgroundJson, ColoredBackgroundType} from "app/models/tools/background";
import {MeshSide} from "../scene/Packaging";
import {Layer} from "./Layer";
import {LayerId} from "app/models/tools/tools";

export class ColoredBackgroundLayer implements Layer {
  public name: string;
  public id: LayerId;
  private color: number;

  constructor(json: ColoredBackgroundJson, id: LayerId) {
    this.name = "Colored Background Layer";
    this.color = parseInt(json.color, 16);
    this.id = id;
  }

  render(side: MeshSide) {
    const material = new THREE.MeshBasicMaterial({color: this.color});
    side.mesh.material = material;
    side.mesh.userData = {
      id: this.id,
      json: this.toJson()
    }
  }

  editForm() {
    //input should be a color switcher
    return <div>
      <label>Color
        <input type="text" defaultValue={this.color.toString(16)} />
      </label>
    </div>
  }

  toJson(): ColoredBackgroundJson {
    return {
      type: ColoredBackgroundType,
      color: this.color.toString(16)
    }
  }
}
