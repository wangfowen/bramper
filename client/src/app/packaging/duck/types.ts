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

export const APPLY_TOOL = "APPLY_TOOL";
interface ApplyToolAction {
  type: typeof APPLY_TOOL,
  sides: PackageSide[],
  layerJson: LayerJson
}

export type PackagingActionTypes = SetModeAction | SetSideAction | ApplyToolAction
