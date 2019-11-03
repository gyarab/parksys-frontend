import { ActionType, getType } from "typesafe-actions";
import { IBaseState } from "./baseModule";
import { loginUser as loginUserActions } from "./userActionCreators";

export interface IUserState extends IBaseState {
  user?: {
    name: string;
    email?: string;
    permissions: string[];
  };
  refreshToken?: string;
  accessToken?: string;
}

export const initialState: IUserState = {
  user: null,
  refreshToken: null,
  accessToken: null,
  error: "",
  loaded: false,
  pending: false
};

export function userReducer(
  state: IUserState = initialState,
  action: ActionType<typeof loginUserActions>
): IUserState {
  switch (action.type) {
    case getType(loginUserActions.setPending):
      return {
        ...state,
        pending: true
      };
    case getType(loginUserActions.setFulfilled):
      const val = action.payload;
      console.log(val);
      return {
        // TODO: Update user fields
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: "",
        loaded: true,
        pending: false
      };
    case getType(loginUserActions.setRejected):
      return {
        ...state,
        error: "",
        loaded: true,
        pending: false
      };
    default:
      return state;
  }
}
