import {ThunkDispatch} from "redux-thunk";
import {AnyAction, Store} from "redux";

import apiCall from "app/utils/apiCall";
import {NewUser, User, Token} from "app/models/user";
import * as types from './types'
import {AuthActionTypes} from "./types";

const authRequest = (): AuthActionTypes => {
  return {
    type: types.AUTHENTICATION_REQUEST
  }
};

const authSuccess = (user: User, token: Token) => {
  return {
    type: types.AUTHENTICATION_SUCCESS,
    user: user,
    token: token
  }
};

const authFailure = (errors: string[]) => {
  return {
    type: types.AUTHENTICATION_FAILURE,
    errors: errors
  }
};

interface UserResponse {
  token: Token,
  user: User
}

export const signup = (user: NewUser) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return apiCall({
      path: '/users',
      method: "POST",
      data: {
        user: user
      }
    }).then((response: UserResponse) => {
      const {token, user} = response;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch(authSuccess(user, token))
    }).catch((error: string[]) => {
      dispatch(authFailure(error))
    })
  };
};

export const authenticate = (credentials: NewUser) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(authRequest());

    return apiCall({
      path: '/users/login',
      method: "POST",
      data: {
        auth: credentials
      }
    }).then((response: UserResponse) => {
      const {token, user} = response;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch(authSuccess(user, token))
    }).catch((errors: string[]) => {
      dispatch(authFailure(errors));
      localStorage.clear()
    })
  }
};

export const logout = () => {
  return dispatch => {
    localStorage.clear();
    return dispatch({
      type: types.LOGOUT
    });
  }
};

export const verifyCredentials = async (store: Store) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token !== null && userStr !== null) {
    //assume this one is valid for the meantime
    const user: User = JSON.parse(userStr);
    store.dispatch(authSuccess(user, token));

    //verify this is actually the case
    await apiCall({
      path: '/users/verify',
      method: "POST",
      data: {
        user: user.id
      }
    }).catch((errors: string[]) => {
      logout()
    })
  }
};