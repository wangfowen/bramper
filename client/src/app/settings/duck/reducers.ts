import {Settings} from "app/models/settings";
import * as types from './types';
import {SettingsActionTypes} from "./types";

const initialState: Settings = {
};

const SettingsReducer = (state = initialState, action: SettingsActionTypes): Settings => {
  switch (action.type) {
    case types.SET_SETTINGS:
      return action.settings;

    default:
      return state
  }
};

export default SettingsReducer;