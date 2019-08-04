import {User, Token} from "app/models/user";

export const AUTHENTICATION_REQUEST = "AUTHENTICATION_REQUEST";
interface AuthRequestAction {
  type: typeof AUTHENTICATION_REQUEST,
}

export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
interface AuthSuccessAction {
  type: typeof AUTHENTICATION_SUCCESS,
  user: User,
  token: Token
}

export const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";
interface AuthFailureAction {
  type: typeof AUTHENTICATION_FAILURE,
  errors: string[]
}

export const LOGOUT = "LOGOUT";
interface LogoutAction {
  type: typeof LOGOUT,
}

export type AuthActionTypes = AuthRequestAction | AuthSuccessAction | AuthFailureAction | LogoutAction
