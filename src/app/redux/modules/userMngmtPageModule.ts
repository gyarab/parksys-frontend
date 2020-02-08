import {
  UserMngmtPageActionTypes,
  SET_SELECTED_USER
} from "./userMngmtActionCreators";

export interface IUserMngmtPageState {
  selectedUser?: {
    id: string;
    name: string;
    email: string;
    permissions: Array<string>;
    isAdmin: boolean;
  };
}

export const initialState: IUserMngmtPageState = {
  selectedUser: null
};

export function userMngmtReducer(
  state: IUserMngmtPageState = initialState,
  action: UserMngmtPageActionTypes
): IUserMngmtPageState {
  switch (action.type) {
    case SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: !action.payload
          ? null
          : {
              ...state.selectedUser,
              ...action.payload
            }
      };
    default:
      return state;
  }
}
