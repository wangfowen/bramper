import {DesignerMode, PackageSide} from "app/models/packaging";

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

export type PackagingActionTypes = SetModeAction | SetSideAction
