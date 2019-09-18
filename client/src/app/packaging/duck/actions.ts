import * as types from './types'
import {PackagingActionTypes} from "./types";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {LayerData, LayerJson} from "app/models/layer";
import {BackgroundJson} from "app/models/background";

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

export const createLayer = (layerJson: LayerJson): PackagingActionTypes => {
  return {
    type: types.CREATE_LAYER,
    layerJson
  }
};

export const createBackground = (backgroundJson: BackgroundJson, mode: DesignerMode, selectedSide: PackageSide): PackagingActionTypes => {
  return {
    type: types.CREATE_BACKGROUND,
    backgroundJson,
    mode,
    selectedSide
  }
}

export const renderLayers = (): PackagingActionTypes => {
  return {
    type: types.RENDER_LAYERS
  }
};