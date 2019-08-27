import * as types from './types';
import {PackagingActionTypes} from "./types";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {Layer} from "app/models/tools/tools";
import {LayerHelper} from "../layers/LayerHelper";

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

    case types.APPLY_TOOL:
      const newLayers = Object.assign({}, state.layers);
      action.sides.forEach((side) => {
        const newLayer = LayerHelper.newLayer(action.tool);

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