import uuid from 'uuid/v1';

import {TextLayer} from "./TextLayer";
import {LayerId, LayerJson, LayerType} from "app/models/layer";


export interface Layer {
  name: string,
  id: LayerId,
  draw: (context: CanvasRenderingContext2D) => void,
  toJson: () => LayerJson,
  editForm: () => React.ReactNode
}

export const LayerHelper = {
  newLayer: (layerJson: LayerJson): Layer => {
    const id = uuid();
    switch (layerJson.type) {
      case LayerType.Text:
        return TextLayer.fromJson(layerJson, id)
    }
  }
};
