import * as types from './types';
import {PackagingActionTypes} from "./types";
import {DesignerMode, FullDieline, PackageSide} from "app/models/packaging";
import {LayerHelper, Layer} from "../layers/Layer";
import {Packaging} from "../packaging/Packaging";
import BoxPackage from "../packaging/BoxPackage";
import {Background, BackgroundHelper} from "../backgrounds/Background";
import {BackgroundType} from "app/models/background";

export type BackgroundMap = {[side: string]: Background}

export interface PackagingState {
  mode: DesignerMode,
  selectedLayer: Layer | undefined,
  selectedSide: PackageSide,
  layers: Layer[],
  backgrounds: BackgroundMap,
  layersVersion: number,
  packaging: Packaging
}

const defaultPackaging = new BoxPackage();
const initialState: PackagingState = {
  mode: DesignerMode.Side,
  selectedLayer: undefined,
  selectedSide: defaultPackaging.getSides()[0],
  layers: [],
  backgrounds: {
    [FullDieline]: BackgroundHelper.newBackground({
      type: BackgroundType.ColoredBackground,
      color: "#ccc"
    })
  },
  layersVersion: 0,
  packaging: defaultPackaging
};

//TODO(improve): write tests that ensure layers modification is always immutable
const PackagingReducer = (state = initialState, action: PackagingActionTypes): PackagingState => {
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
        selectedLayer: state.layers.find((layer) => layer.id === action.layerData.id)
      };

    case types.UPDATE_LAYER: {
      const layerIdx = state.layers.findIndex((layer) => layer.id === action.layerData.id);
      let newLayers = [...state.layers];
      const newLayer = LayerHelper.newLayer(Object.assign({}, state.layers[layerIdx].toJson(), action.layerData.json));
      newLayers[layerIdx] = newLayer;

      return {
        ...state,
        layers: newLayers,
        selectedLayer: newLayer
      };
    }

    case types.CREATE_LAYER: {
      const newLayer = LayerHelper.newLayer(action.layerJson);
      const newLayers = [...state.layers, newLayer];

      return {
        ...state,
        selectedLayer: undefined,
        layers: newLayers
      };
    }

    case types.CREATE_BACKGROUND: {
      const backgrounds = Object.assign({}, state.backgrounds);
      if (action.mode === DesignerMode.Full) {
        backgrounds[FullDieline] = BackgroundHelper.newBackground(action.backgroundJson)
      } else if (action.mode === DesignerMode.Side) {
        backgrounds[action.selectedSide] = BackgroundHelper.newBackground(action.backgroundJson)
      }

      return {
        ...state,
        selectedLayer: undefined,
        backgrounds
      }
    }

    case types.RENDER_LAYERS: {
      return {
        ...state,
        layersVersion: state.layersVersion + 1
      }
    }

    default:
      return state
  }
};

export default PackagingReducer;