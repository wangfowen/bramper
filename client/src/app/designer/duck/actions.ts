import * as types from './types'
import {PackagingActionTypes} from "./types";
import {DesignerMode, PackageSide} from "app/models/designer/packaging";
import {BackgroundJson} from "app/models/designer/background";
import {ContentJson} from "app/models/designer/content";
import {SelectedLayer} from "app/models/designer/layer";

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

export const selectLayer = (layer: SelectedLayer): PackagingActionTypes => {
  return {
    type: types.SELECT_LAYER,
    layer
  }
};

export const updateLayer = (layer: SelectedLayer): PackagingActionTypes => {
  return {
    type: types.UPDATE_LAYER,
    layer
  }
};

export const createContent = (contentJson: ContentJson): PackagingActionTypes => {
  return {
    type: types.CREATE_CONTENT,
    contentJson
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

export const renderContent = (): PackagingActionTypes => {
  return {
    type: types.RENDER_CONTENT
  }
};