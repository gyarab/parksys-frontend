import { createAction } from "typesafe-actions";
import { createAsyncActions } from "./baseModule";

export const logoutUser = createAction("USER/LOGOUT", (resolve) => {
  return () => resolve();
});

const loginLogoutPrefix = "USER/LOGIN";
// tslint:disable-next-line:export-name
export const loginUser = createAsyncActions(
  loginLogoutPrefix,
  loginLogoutPrefix + "_PENDING",
  loginLogoutPrefix + "_FULFILLED",
  loginLogoutPrefix + "_REJECTED"
)<any, any, any, any>();
