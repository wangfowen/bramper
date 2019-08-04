import {Settings} from "app/models/settings";

export const SET_SETTINGS = "SET_SETTINGS";

interface SetSettingsAction {
  type: typeof SET_SETTINGS,
  settings: Settings
}

export type SettingsActionTypes = SetSettingsAction