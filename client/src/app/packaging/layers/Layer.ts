import uuid from 'uuid/v1';

import {GradientBackgroundLayer} from "./GradientBackgroundLayer";
import {ColoredBackgroundLayer} from "./ColoredBackgroundLayer";
import {ColoredBackgroundType, GradientBackgroundType} from "app/models/tools/background";
import {ApplicableSurface, LayerId, LayerJson, ToolJson} from "app/models/tools/tools";
import {MeshSide} from "../scene/Packaging";

export interface Layer {
  name: string,
  id: LayerId,
  render: (side: MeshSide) => void,
  toJson: () => LayerJson,
  editForm: () => React.ReactNode
}

export const LayerHelper = {
  layerFromTool: (json: ToolJson, surface: ApplicableSurface): LayerJson => {
    return json[surface] as LayerJson
  },

  newLayer: (layerJson: LayerJson): Layer => {
    const id = uuid();
    switch (layerJson.type) {
      case ColoredBackgroundType:
        return new ColoredBackgroundLayer(layerJson, id);
      case GradientBackgroundType:
        return new GradientBackgroundLayer(layerJson, id);
    }
  }
};
