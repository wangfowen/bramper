import * as types from './types';
import {PackagingActionTypes} from "./types";
import {DesignerMode, FullDieline, PackageSide} from "app/models/designer/packaging";
import {ContentHelper, ContentLayer} from "../layers/contents/ContentLayer";
import {Packaging} from "../packaging/Packaging";
import BoxPackage from "../packaging/BoxPackage";
import {BackgroundHelper, BackgroundLayer, BackgroundMap} from "../layers/backgrounds/BackgroundLayer";
import {BackgroundType} from "app/models/designer/background";
import {LayerType} from "app/models/designer/layer";
import {SelectedLayer} from "../layers/Layer";

//TODO(click): how store with coords?
export interface PackagingState {
  mode: DesignerMode,
  selectedSide: PackageSide,
  contentLayers: ContentLayer[],
  backgroundLayers: BackgroundMap,
  selectedLayer: SelectedLayer | undefined,
  layersVersion: number,
  packaging: Packaging
}

const defaultPackaging = new BoxPackage();
const initialState: PackagingState = {
  mode: DesignerMode.Side,
  selectedLayer: undefined,
  selectedSide: defaultPackaging.getSides()[0],
  contentLayers: [],
  backgroundLayers: {
    [FullDieline]: BackgroundHelper.newBackground({
      type: BackgroundType.ColoredBackground,
      color: "#ccc"
    })
  },
  layersVersion: 0,
  packaging: defaultPackaging
};

//TODO(improve): write tests that ensure layers modification is always immutable
const DesignerReducer = (state = initialState, action: PackagingActionTypes): PackagingState => {
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
        selectedLayer: action.layer
      };

    case types.UPDATE_LAYER: {
      if (action.layer.type === LayerType.Content) {
        const layerIdx = state.contentLayers.findIndex((layer) => layer.id === action.layer.id);
        let newLayers = [...state.contentLayers];
        newLayers[layerIdx] = action.layer.layer as ContentLayer;

        return {
          ...state,
          contentLayers: newLayers,
          selectedLayer: action.layer
        };
      } else {
        const newLayers = Object.assign({}, state.backgroundLayers);
        const newLayer = action.layer.layer as BackgroundLayer;
        const selectedLayer = Object.assign({}, action.layer);
        //whatever you're looking at, that's what should get filled
        if (state.mode === DesignerMode.Side) {
          newLayers[state.selectedSide] = newLayer;
          selectedLayer.id = state.selectedSide;
        } else if (state.mode === DesignerMode.Full) {
          newLayers[action.layer.id] = newLayer;
        }

        return {
          ...state,
          backgroundLayers: newLayers,
          selectedLayer: selectedLayer
        };
      }
    }

    case types.CREATE_CONTENT: {
      const newLayer = ContentHelper.newContent(action.contentJson);
      const newLayers = [...state.contentLayers, newLayer];

      return {
        ...state,
        selectedLayer: undefined,
        contentLayers: newLayers
      };
    }

    case types.CREATE_BACKGROUND: {
      const backgroundLayers = Object.assign({}, state.backgroundLayers);
      if (action.mode === DesignerMode.Full) {
        backgroundLayers[FullDieline] = BackgroundHelper.newBackground(action.backgroundJson)
      } else if (action.mode === DesignerMode.Side) {
        backgroundLayers[action.selectedSide] = BackgroundHelper.newBackground(action.backgroundJson)
      }

      return {
        ...state,
        selectedLayer: undefined,
        backgroundLayers
      }
    }

    case types.RENDER_CONTENT: {
      return {
        ...state,
        layersVersion: state.layersVersion + 1
      }
    }

    default:
      return state
  }
};

export default DesignerReducer;