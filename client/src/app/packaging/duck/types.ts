import {DesignerMode, PackageSide} from "app/models/packaging";
import {LayerJson} from "app/models/tools/tools";

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

export const CREATE_LAYER = "CREATE_LAYER";
interface CreateLayerAction {
  type: typeof CREATE_LAYER,
  sides: PackageSide[],
  layerJson: LayerJson
}

export type PackagingActionTypes = SetModeAction | SetSideAction | CreateLayerAction
