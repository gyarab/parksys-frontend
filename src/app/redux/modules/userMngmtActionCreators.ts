import { IRulePageStateSimulation, IRulePageState } from "./rulePageModule";
import { IUserMngmtPageState } from "./userMngmtPageModule";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const DELETE_MESSAGE = "DELETE_MESSAGE";

export const SET_SELECTED_USER = "USER_MNGMT_PAGE/SET_SELECTED_USER";
export interface SetSelectedUser {
  type: typeof SET_SELECTED_USER;
  payload: Partial<IUserMngmtPageState["selectedUser"]> | null;
}

export type UserMngmtPageActionTypes = SetSelectedUser;
