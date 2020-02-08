import React, { useMemo, useEffect } from "react";
import { stylesheet, classes } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { Color } from "../constants/Color";
import { UserPicker } from "../components/pickers/UserPicker";
import { IUserMngmtPageState } from "../redux/modules/userMngmtPageModule";
import {
  SetSelectedUser,
  SET_SELECTED_USER
} from "../redux/modules/userMngmtActionCreators";

export interface IStateToProps {
  selectedUser?: IUserMngmtPageState["selectedUser"];
}

export interface IDispatchToProps {
  setSelectedUser: (payload: SetSelectedUser["payload"]) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  split: {
    height: "70%",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gridColumnGap: "1em"
  },
  pane: {
    paddingTop: "1em",
    height: "100%"
  },
  leftPane: {
    minWidth: "20em",
    maxWidth: "25em",
    paddingRight: "1em",
    borderRight: `1px solid ${Color.LIGHT_GREY}`
  },
  rightPane: {}
});

const UserManagementPage = (props: IProps): JSX.Element => {
  return (
    <div className={styles.split}>
      <div>
        <UserPicker
          identifier={!!props.selectedUser ? props.selectedUser.name : ""}
          onSelect={user => props.setSelectedUser(user)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (
  state: Pick<IStore, "userMngmtPage">
): IStateToProps => {
  return {
    selectedUser: state.userMngmtPage.selectedUser
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedUser: payload => dispatch({ type: SET_SELECTED_USER, payload })
  };
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagementPage);

export {
  connected as UserManagementPage,
  UserManagementPage as UnconnectedUserManagementPage
};
