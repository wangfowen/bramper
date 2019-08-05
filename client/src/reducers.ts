import {combineReducers} from 'redux';
import { reducer as FormReducer } from 'redux-form'

import AuthReducer from "./app/auth/duck/reducers";
import SettingsReducer from "./app/settings/duck/reducers";
import PackagingReducer from "./app/packaging/duck/reducers";

const reducers = combineReducers({
  auth: AuthReducer,
  settings: SettingsReducer,
  packaging: PackagingReducer,
  form: FormReducer
});

export default reducers;
export type ReduxState = ReturnType<typeof reducers>
