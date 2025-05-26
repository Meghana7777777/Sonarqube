import { InitialStateType } from './iam-client';
import { ActionTypes } from './action-types';

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
  ? {
    type: Key;
  }
  : {
    type: Key;
    payload: M[Key];
  }
};


export interface AuthPayLoadObject {
  isAuthenticated: boolean,
  user: any,
  defaultPlant: string,
  defaultPlantCurrency: string,
  token: any,
  menuAccessObject: any
  loading: boolean;
  errorMessage: string | null;
}

export interface AuthPayload {
  [ActionTypes.REQUEST_LOGIN]: undefined;
  [ActionTypes.LOGIN_SUCCESS]: AuthPayLoadObject;
  [ActionTypes.LOGIN_ERROR]: AuthPayLoadObject;
  [ActionTypes.LOGOUT]: undefined;
}

export type IAMClientAuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

export const authReducer = (state: InitialStateType, action: IAMClientAuthActions) => {
  switch (action.type) {
    case ActionTypes.REQUEST_LOGIN:
      return {
        ...state,
        loading: true
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        token: action.payload.token,
        defaultPlant: action.payload.defaultPlant,
        defaultPlantCurrency: action.payload.defaultPlantCurrency,
        menuAccessObject: action.payload.menuAccessObject,
      }
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        defaultPlant: '',
        defaultPlantCurrency: '',
        token: null,
        menuAccessObject: []
      };
    case ActionTypes.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.errorMessage
      };
    default:
      return state;
  }
}
