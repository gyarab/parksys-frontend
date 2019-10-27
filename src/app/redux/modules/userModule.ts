import {ActionType, getType} from "typesafe-actions";
import {IBaseState} from "./baseModule";
import * as userActionCreators from "./userActionCreators";

export interface IUserState extends IBaseState {
  user?: {
    name: string;
    email: string;
    permissions: string[];
  };
}

const initialState: IUserState = {
  user: null,
  error: "",
  loaded: false,
  pending: false
};

export function userReducer(
  state: IUserState = initialState,
  action: ActionType<typeof userActionCreators>
): IUserState {
  switch (action.type) {
    case getType(userActionCreators.loginUser.setPending):
      return {
        ...state,
        pending: true,
      }
    case getType(userActionCreators.loginUser.setFulfilled):
      return {
        // TODO: Update user fields
        ...state,
        error: "",
        loaded: true,
        pending: false,
      }
    case getType(userActionCreators.loginUser.setRejected):
      return {
        ...state,
        error: "TODO MSG",
        loaded: true,
        pending: false,
      };
    case getType(userActionCreators.logoutUser):
      return {
        ...state,
        user: null,
      }
    default:
      return state;
  }
}
