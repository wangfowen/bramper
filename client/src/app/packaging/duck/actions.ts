import * as types from './types'
import {PackagingActionTypes} from "./types";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {LayerData, LayerJson} from "app/models/tools/tools";

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

export const selectLayer = (layerData: LayerData): PackagingActionTypes => {
  return {
    type: types.SELECT_LAYER,
    layerData
  }
};

export const updateLayer = (layerData: LayerData): PackagingActionTypes => {
  return {
    type: types.UPDATE_LAYER,
    layerData
  }
};

export const createLayer = (layerJson: LayerJson, sides: PackageSide[]): PackagingActionTypes => {
  return {
    type: types.CREATE_LAYER,
    sides,
    layerJson
  }
};