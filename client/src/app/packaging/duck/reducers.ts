import * as types from './types';
import {PackagingActionTypes} from "./types";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {Layer, LayerHelper, LayerId} from "app/models/tools/tools";

export interface LayerMap {
  [id: string]: Layer
}
export interface LayersStruct {
  bottom: LayerId,
  top: LayerId,
  map: LayerMap
}

export interface SideLayers {
  [PackageSide.Front]?: LayersStruct,
  [PackageSide.Back]?: LayersStruct,
  [PackageSide.Left]?: LayersStruct,
  [PackageSide.Right]?: LayersStruct,
  [PackageSide.Top]?: LayersStruct,
  [PackageSide.Bottom]?: LayersStruct
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

        const sideMap = state.layers[side];
        if (sideMap !== undefined) {
          const newSideMap = {
            ...sideMap,
            map: Object.assign({}, sideMap.map)
          };
          newSideMap.map[newLayer.id] = newLayer;

          const top = newSideMap.map[newSideMap.top];
          top.above = newLayer.id;
          newLayer.below = top.id;
          newSideMap.top = newLayer.id;
          newLayers[side] = newSideMap;
        } else {
          newLayers[side] = {
            bottom: newLayer.id,
            top: newLayer.id,
            map: {[newLayer.id]: newLayer}
          }
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