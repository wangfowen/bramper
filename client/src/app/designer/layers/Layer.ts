import {BackgroundJson} from "app/models/designer/background";
import {ContentJson} from "app/models/designer/content";
import {LayerId, LayerType} from "app/models/designer/layer";
import {PackageSide} from "app/models/designer/packaging";

export interface Layer {
  toJson: () => BackgroundJson | ContentJson,
  editForm: () => React.ReactNode
}

export type SelectedLayer = {
  id: LayerId | PackageSide,
  type: LayerType,
  layer: Layer
}
