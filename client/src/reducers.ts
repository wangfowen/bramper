import {combineReducers} from 'redux';
import { reducer as FormReducer } from 'redux-form'

import AuthReducer from "./app/auth/duck/reducers";
import SettingsReducer from "./app/settings/duck/reducers";

const reducers = combineReducers({
  auth: AuthReducer,
  settings: SettingsReducer,
  form: FormReducer
});

export default reducers;
export type ReduxState = ReturnType<typeof reducers>
