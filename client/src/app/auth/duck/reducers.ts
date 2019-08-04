import {User, Token} from "app/models/user";
import * as types from './types';
import {AuthActionTypes} from "./types";

export interface AuthState {
  isAuthenticated: boolean,
  isAuthenticating: boolean,
  currentUser: User | null,
  token: Token | null,
  errors: string[]
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  currentUser: null,
  token: null,
  errors: []
};

const AuthReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case types.AUTHENTICATION_REQUEST:
      return {
        ...state,
        isAuthenticating: true
      };

    case types.AUTHENTICATION_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isAuthenticating: false,
        currentUser: action.user,
        token: action.token
      };

    case types.AUTHENTICATION_FAILURE:
      return {
        isAuthenticated: false,
        isAuthenticating: false,
        currentUser: null,
        token: null,
        errors: action.errors || []
      };

    case types.LOGOUT:
      return {...state,
        isAuthenticated: false,
        isAuthenticating: false,
        currentUser: null,
        token: null
      };

    default:
      return state
  }
};

export default AuthReducer;