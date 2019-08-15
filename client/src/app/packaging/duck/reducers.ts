import * as types from './types';
import {PackagingActionTypes} from "./types";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {Layer, LayerHelper, LayerId} from "app/models/tools/tools";

export interface LayerMap {
  bottom: LayerId,
  top: LayerId,
  map: Map<LayerId, Layer>
}

export interface LayerMaps {
  [PackageSide.Front]?: LayerMap,
  [PackageSide.Back]?: LayerMap,
  [PackageSide.Left]?: LayerMap,
  [PackageSide.Right]?: LayerMap,
  [PackageSide.Top]?: LayerMap,
  [PackageSide.Bottom]?: LayerMap
}

export interface PackagingState {
  mode: DesignerMode,
  selectedLayer: Layer | null,
  selectedSide: PackageSide,
  layers: LayerMaps
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
        const sideMap = newLayers[side];

        if (sideMap !== undefined) {
          sideMap.map = new Map(sideMap.map);
          sideMap.map.set(newLayer.id, newLayer);
          const top = sideMap.map.get(sideMap.top);
          if (top !== undefined) {
            top.above = newLayer.id;
            newLayer.below = top.id;
          }
          sideMap.top = newLayer.id;
        } else {
          newLayers[side] = {
            bottom: newLayer.id,
            top: newLayer.id,
            map: new Map([[newLayer.id, newLayer]])
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