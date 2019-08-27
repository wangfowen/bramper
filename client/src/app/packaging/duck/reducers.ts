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
  selectedLayer: Layer | null,
  selectedSide: PackageSide,
  layers: SideLayers
}

const initialState: PackagingState = {
  mode: DesignerMode.ThreeD,
  selectedLayer: null,
  selectedSide: PackageSide.Front,
  layers: {}
};

//TODO(improve): write tests that ensure layers modification is always immutable
const PackagingReducer = (state = initialState, action: PackagingActionTypes): PackagingState => {
  switch (action.type) {
    case types.SET_MODE:
      return {
        ...state,
        mode: action.mode
      };

    case types.SET_SIDE:
      return {
        ...state,
        selectedSide: action.side
      };

    case types.CREATE_LAYER:
      const newLayers = Object.assign({}, state.layers);
      action.sides.forEach((side) => {
        const newLayer = LayerHelper.newLayer(action.layerJson);

        const layers = state.layers[side];
        if (layers !== undefined) {
          layers.push(newLayer);
        } else {
          newLayers[side] = [newLayer];
        }
      });

      return {
        ...state,
        layers: newLayers
      };

    default:
      return state
  }
};

export default PackagingReducer;