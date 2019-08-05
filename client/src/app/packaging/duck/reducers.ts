import * as types from './types';
import {PackagingActionTypes} from "./types";
import {DesignerMode, Layer, PackageSide} from "app/models/packaging";

export interface PackagingState {
  mode: DesignerMode,
  selectedLayer: Layer | null,
  selectedSide: PackageSide
}

const initialState: PackagingState = {
  mode: DesignerMode.Box,
  selectedLayer: null,
  selectedSide: PackageSide.Front
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

    default:
      return state
  }
};

export default PackagingReducer;