import {combineReducers} from 'redux';
import { reducer as FormReducer } from 'redux-form'

import AuthReducer from "./app/auth/duck/reducers";
import SettingsReducer from "./app/settings/duck/reducers";
import DesignerReducer from "./app/designer/duck/reducers";

const reducers = combineReducers({
  auth: AuthReducer,
  settings: SettingsReducer,
  designer: DesignerReducer,
  form: FormReducer
});

export default reducers;
export type ReduxState = ReturnType<typeof reducers>
