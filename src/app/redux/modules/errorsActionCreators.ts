import { IErrorsState } from "./errorsModule";

export const ERRORS_SET_ERROR = "ERRORS/SET_ERROR";
export interface SetError {
  type: typeof ERRORS_SET_ERROR;
  payload: IErrorsState["pageError"] | null;
}

export type ErrorsActionTypes = SetError;
