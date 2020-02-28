import { ErrorsActionTypes, ERRORS_SET_ERROR } from "./errorsActionCreators";

export interface IErrorsState {
  pageError: string | null;
}

const initialState: IErrorsState = {
  pageError: null
};

export const errorsReducer = (
  state: IErrorsState = initialState,
  action: ErrorsActionTypes
): IErrorsState => {
  switch (action.type) {
    case ERRORS_SET_ERROR:
      return {
        ...state,
        pageError: action.payload
      };
    default:
      return state;
  }
};
