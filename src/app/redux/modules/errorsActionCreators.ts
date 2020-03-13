import { IErrorsState } from "./errorsModule";

export const ERRORS_SET_PAGE_ERROR = "ERRORS/SET_PAGE_ERROR";
export interface SetPageError {
  type: typeof ERRORS_SET_PAGE_ERROR;
  payload: IErrorsState["pageError"];
}

export const ERRORS_SET_GRAPHQL_ERROR = "ERRORS/SET_GRAPHQL_ERROR";
export interface SetGraphQLError {
  type: typeof ERRORS_SET_GRAPHQL_ERROR;
  payload: IErrorsState["graphQLErrors"];
}

export const ERRORS_SET_NETWORK_ERROR = "ERRORS/SET_NETWORK_ERROR";
export interface SetNetworkError {
  type: typeof ERRORS_SET_NETWORK_ERROR;
  payload: IErrorsState["networkError"];
}

export type ErrorsActionTypes =
  | SetPageError
  | SetGraphQLError
  | SetNetworkError;
