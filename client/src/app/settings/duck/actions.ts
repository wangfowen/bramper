import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";

import {Settings} from "app/models/settings";
import apiCall from "app/utils/apiCall";
import {SET_SETTINGS, SettingsActionTypes} from "./types";
import {User} from "app/models/user";

const setSettings = (settings: Settings): SettingsActionTypes => {
  return {
    type: SET_SETTINGS,
    settings
  }
};

export const fetchSettings = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    apiCall({path: `/users/settings`})
      .then(json => {
        const jsonSettings = json.settings;
        const settings: Settings = {};

        dispatch(setSettings(settings));
      })
      .catch(error => console.log(error));
  }
};

export const updateSettings = (user: User, settings: Settings) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<boolean> => {
  try {
    await apiCall({
      path: `/users/${user.id}`,
      method: "PATCH",
      data: {
        //convert from settings to api settings
        user: {
        }
      }
    });
    dispatch(setSettings(settings));

    return true
  } catch (error) {
    return false
  }
};
