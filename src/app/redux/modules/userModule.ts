import { ActionType, getType } from "typesafe-actions";
import { IBaseState } from "./baseModule";
import {
  loginUser as loginUserActions,
  logoutUser
} from "./userActionCreators";

export interface IUserState extends IBaseState {
  user?: {
    id: string;
    name: string;
    email: string;
    permissions: string[];
  };
  refreshToken?: string;
  accessToken?: string;
}

export const initialState: IUserState = {
  user: null,
  refreshToken: null,
  accessToken: null,
  // refreshToken: localStorage.get("refreshToken"),
  // accessToken: localStorage.get("accessToken"),
  error: "",
  loaded: false,
  pending: false
};

function fromBase64Url(payload: string): any {
  let s = payload;
  s = s.replace(/-/g, "+"); // 62nd char of encoding
  s = s.replace(/_/g, "/"); // 63rd char of encoding
  switch (
    s.length % 4 // Pad with trailing '='s
  ) {
    case 0:
      break; // No pad chars in this case
    case 2:
      s += "==";
      break; // Two pad chars
    case 3:
      s += "=";
      break; // One pad char
    default:
      throw new Error("Illegal base64url string!");
  }
  return Buffer.from(s, "base64"); // Standard base64 decoder
}

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
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: {
          ...JSON.parse(fromBase64Url(action.payload.accessToken.split(".")[1]))
            .user,
          ...action.payload.user
        },
        error: "",
        loaded: true,
        pending: false
      };
    case getType(loginUserActions.setRejected):
      return {
        ...state,
        error: action.message,
        loaded: true,
        pending: false
      };
    case getType(logoutUser):
      return {
        ...state,
        ...initialState,
        // localStorage may have not been emptied yet
        refreshToken: null,
        accessToken: null
      };
    default:
      return state;
  }
}
