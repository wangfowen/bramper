import * as types from './types'
import {PackagingActionTypes} from "./types";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {Tool} from "app/models/tools/tools";

export const setMode = (mode: DesignerMode): PackagingActionTypes => {
  return {
    type: types.SET_MODE,
    mode
  }
};

export const setSide = (side: PackageSide): PackagingActionTypes => {
  return {
    type: types.SET_SIDE,
    side
  }
};

export const applyTool = (tool: Tool, sides: PackageSide[]): PackagingActionTypes => {
  return {
    type: types.APPLY_TOOL,
    sides,
    tool
  }
}