import * as types from './types';
import {PackagingActionTypes} from "./types";
import {DesignerMode, FullDieline, PackageSide} from "app/models/designer/packaging";
import {ContentHelper, ContentLayer} from "../contents/ContentLayer";
import {Packaging} from "../packaging/Packaging";
import BoxPackage from "../packaging/BoxPackage";
import {BackgroundLayer, BackgroundHelper} from "../backgrounds/BackgroundLayer";
import {BackgroundType} from "app/models/designer/background";
import {LayerType} from "app/models/designer/layer";

export type BackgroundMap = {[side: string]: BackgroundLayer}

//TODO(click): how store with coords?
export interface PackagingState {
  mode: DesignerMode,
  selectedLayer: ContentLayer | BackgroundLayer | undefined,
  selectedSide: PackageSide,
  contentLayers: ContentLayer[],
  backgroundLayers: BackgroundMap,
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
    }, FullDieline)
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
      let selected;
      if (action.layer.type === LayerType.Content) {
        selected = state.contentLayers.find((layer) => layer.id === action.layer.id)
      } else if (action.layer.type === LayerType.Background) {
        selected = state.backgroundLayers[action.layer.id]
      }
      return {
        ...state,
        selectedLayer: selected
      };

    //TODO(improve): test updating with partial json
    case types.UPDATE_LAYER: {
      if (action.layer.type === LayerType.Content) {
        const layerIdx = state.contentLayers.findIndex((layer) => layer.id === action.layer.id);
        let newLayers = [...state.contentLayers];
        const newLayer = ContentHelper.newContent(Object.assign({}, state.contentLayers[layerIdx].toJson(), action.layer.json));
        newLayers[layerIdx] = newLayer;

        return {
          ...state,
          contentLayers: newLayers,
          selectedLayer: newLayer
        };
      } else {
        const newLayers = Object.assign({}, state.backgroundLayers);
        const newLayer = BackgroundHelper.newBackground(Object.assign({}, state.backgroundLayers[action.layer.id].toJson(), action.layer.json), action.layer.id);
        newLayers[action.layer.id] = newLayer;

        return {
          ...state,
          backgroundLayers: newLayers,
          selectedLayer: newLayer
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
        backgroundLayers[FullDieline] = BackgroundHelper.newBackground(action.backgroundJson, FullDieline)
      } else if (action.mode === DesignerMode.Side) {
        backgroundLayers[action.selectedSide] = BackgroundHelper.newBackground(action.backgroundJson, action.selectedSide)
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