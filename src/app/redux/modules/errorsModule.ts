import {
  ErrorsActionTypes,
  ERRORS_SET_PAGE_ERROR,
  ERRORS_SET_GRAPHQL_ERROR,
  ERRORS_SET_NETWORK_ERROR
} from "./errorsActionCreators";

export interface IErrorsState {
  pageError: string | null;
  networkError: Error | null;
  graphQLErrors: Error[] | null;
}

const initialState: IErrorsState = {
  pageError: null,
  networkError: null,
  graphQLErrors: null
};

export const errorsReducer = (
  state: IErrorsState = initialState,
  action: ErrorsActionTypes
): IErrorsState => {
  switch (action.type) {
    case ERRORS_SET_PAGE_ERROR:
      return {
        ...state,
        pageError: action.payload
      };
    case ERRORS_SET_GRAPHQL_ERROR:
      return {
        ...state,
        graphQLErrors: action.payload
      };
    case ERRORS_SET_NETWORK_ERROR:
      return {
        ...state,
        networkError: action.payload
      };
    default:
      return state;
  }
};
