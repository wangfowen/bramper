import {DesignerMode, PackageSide} from "app/models/designer/packaging";
import {BackgroundJson} from "app/models/designer/background";
import {ContentJson} from "app/models/designer/content";
import {SelectedLayer} from "../layers/Layer";

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
  layer: SelectedLayer
}

export const UPDATE_LAYER = "UPDATE_LAYER";
interface UpdateLayerAction {
  type: typeof UPDATE_LAYER,
  layer: SelectedLayer
}

export const CREATE_CONTENT = "CREATE_CONTENT";
interface CreateLayerAction {
  type: typeof CREATE_CONTENT,
  contentJson: ContentJson
}

export const CREATE_BACKGROUND = "CREATE_BACKGROUND";
interface CreateBackgroundAction {
  type: typeof CREATE_BACKGROUND,
  backgroundJson: BackgroundJson,
  mode: DesignerMode,
  selectedSide: PackageSide
}

export const RENDER_CONTENT = "RENDER_CONTENT";
interface RenderContentAction {
  type: typeof RENDER_CONTENT
}

export type PackagingActionTypes = SetModeAction | SetSideAction | CreateLayerAction | SelectLayerAction |
  UpdateLayerAction | RenderContentAction | CreateBackgroundAction
