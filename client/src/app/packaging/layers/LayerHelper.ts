import {GradientBackgroundLayer} from "./GradientBackgroundLayer";
import {ColoredBackgroundLayer} from "./ColoredBackgroundLayer";
import {ColoredBackgroundType, GradientBackgroundType} from "app/models/tools/background";
import {ApplicableSurface, Layer, LayerJson, Tool, ToolJson} from "app/models/tools/tools";

export const LayerHelper = {
  toolFromJson: (json: ToolJson, surface: ApplicableSurface): Tool => {
    return {
      id: json.id,
      layerJson: json[surface] as LayerJson
    }
  },

  newLayer: (tool: Tool): Layer => {
    switch (tool.layerJson.type) {
      case ColoredBackgroundType:
        return new ColoredBackgroundLayer(tool.layerJson);
      case GradientBackgroundType:
        return new GradientBackgroundLayer(tool.layerJson);
    }
  }
};
