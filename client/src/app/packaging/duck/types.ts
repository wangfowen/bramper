import {DesignerMode, PackageSide} from "app/models/packaging";
import {LayerData, LayerJson} from "app/models/layer";
import {BackgroundJson} from "app/models/background";

export const SET_MODE = "SET_MODE";
interface SetModeAction {
  type: typeof SET_MODE,
  mode: DesignerMode
}

export const SET_SIDE = "SET_SIDE";
interface SetSideAction {
  type: typeof SET_SIDE,
  side: PackageSide
}

export const SELECT_LAYER = "SELECT_LAYER";
interface SelectLayerAction {
  type: typeof SELECT_LAYER,
  layerData: LayerData
}

export const UPDATE_LAYER = "UPDATE_LAYER";
interface UpdateLayerAction {
  type: typeof UPDATE_LAYER,
  layerData: LayerData
}

export const CREATE_LAYER = "CREATE_LAYER";
interface CreateLayerAction {
  type: typeof CREATE_LAYER,
  layerJson: LayerJson
}

export const CREATE_BACKGROUND = "CREATE_BACKGROUND";
interface CreateBackgroundAction {
  type: typeof CREATE_BACKGROUND,
  backgroundJson: BackgroundJson,
  mode: DesignerMode,
  selectedSide: PackageSide
}

export const RENDER_LAYERS = "RENDER_LAYERS";
interface RenderLayersAction {
  type: typeof RENDER_LAYERS
}

export type PackagingActionTypes = SetModeAction | SetSideAction | CreateLayerAction | SelectLayerAction |
  UpdateLayerAction | RenderLayersAction | CreateBackgroundAction
