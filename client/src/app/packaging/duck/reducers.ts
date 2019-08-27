import * as types from './types';
import {PackagingActionTypes} from "./types";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {LayerHelper, Layer} from "../layers/Layer";

export interface SideLayers {
  [PackageSide.Front]?: Layer[],
  [PackageSide.Back]?: Layer[],
  [PackageSide.Left]?: Layer[],
  [PackageSide.Right]?: Layer[],
  [PackageSide.Top]?: Layer[],
  [PackageSide.Bottom]?: Layer[]
}

export interface PackagingState {
  mode: DesignerMode,
  selectedLayer: Layer | undefined,
  selectedSide: PackageSide,
  layers: SideLayers
}

const initialState: PackagingState = {
  mode: DesignerMode.ThreeD,
  selectedLayer: undefined,
  selectedSide: PackageSide.Front,
  layers: {}
};

//TODO(improve): write tests that ensure layers modification is always immutable
const PackagingReducer = (state = initialState, action: PackagingActionTypes): PackagingState => {
  const newLayers = Object.assign({}, state.layers);
  const sideLayers = newLayers[state.selectedSide] || [];

  switch (action.type) {
    case types.SET_MODE:
      return {
        ...state,
        selectedLayer: undefined,
        mode: action.mode
      };

    case types.SET_SIDE:
      return {
        ...state,
        selectedLayer: undefined,
        selectedSide: action.side
      };

    case types.SELECT_LAYER:
      return {
        ...state,
        selectedLayer: sideLayers.find((layer) => layer.id === action.layerData.id)
      };

    case types.UPDATE_LAYER:
      const layerIdx = sideLayers.findIndex((layer) => layer.id === action.layerData.id);
      const newLayer = LayerHelper.newLayer(Object.assign({}, sideLayers[layerIdx].toJson(), action.layerData.json));
      sideLayers[layerIdx] = newLayer;
      newLayers[state.selectedSide] = sideLayers;

      return {
        ...state,
        layers: newLayers,
        selectedLayer: newLayer
      };

    case types.CREATE_LAYER:
      action.sides.forEach((side) => {
        const newLayer = LayerHelper.newLayer(action.layerJson);

        const layers = newLayers[side];
        if (layers !== undefined) {
          layers.push(newLayer);
        } else {
          newLayers[side] = [newLayer];
        }
      });

      return {
        ...state,
        selectedLayer: undefined,
        layers: newLayers
      };

    default:
      return state
  }
};

export default PackagingReducer;