import {GradientBackgroundLayer} from "./GradientBackgroundLayer";
import {ColoredBackgroundLayer} from "./ColoredBackgroundLayer";
import {ColoredBackgroundType, GradientBackgroundType} from "app/models/tools/background";
import {ApplicableSurface, Layer, LayerJson, ToolJson} from "app/models/tools/tools";

export const LayerHelper = {
  toolFromJson: (json: ToolJson, surface: ApplicableSurface): LayerJson => {
    return json[surface] as LayerJson
  },

  newLayer: (layerJson: LayerJson): Layer => {
    switch (layerJson.type) {
      case ColoredBackgroundType:
        return new ColoredBackgroundLayer(layerJson);
      case GradientBackgroundType:
        return new GradientBackgroundLayer(layerJson);
    }
  }
};
