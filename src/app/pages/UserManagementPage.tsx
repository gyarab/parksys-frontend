import React, { useMemo, useEffect } from "react";
import { stylesheet, classes } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { Color } from "../constants/Color";
import { UserPicker, useUserPicker } from "../components/pickers/UserPicker";
import { IUserMngmtPageState } from "../redux/modules/userMngmtPageModule";
import {
  SetSelectedUser,
  SET_SELECTED_USER
} from "../redux/modules/userMngmtActionCreators";
import { UserEditor } from "../components/editors/UserEditor";
import { Flag, FlagType } from "../components/Flag";
import { IUserState } from "../redux/modules/userModule";
import { Button } from "../components/Button";

export interface IStateToProps {
  selectedUser?: IUserMngmtPageState["selectedUser"];
  currentUserId?: IUserState["user"]["id"];
}

export interface IDispatchToProps {
  setSelectedUser: (payload: SetSelectedUser["payload"]) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  userManagementPage: {
    height: "70%",
    display: "grid",
    marginRight: "1em",
    gridTemplateColumns: "1fr auto",
    gridColumnGap: "1em"
  },
  rightPane: {
    $nest: {
      "> button": {
        marginBottom: "0.5em"
      }
    }
  }
});

const UserManagementPage = (props: IProps): JSX.Element => {
  const isUser = !!props.selectedUser;
  return (
    <div className={styles.userManagementPage}>
      <div>
        {isUser ? (
          <UserEditor user={props.selectedUser} />
        ) : (
          <Flag text="Select user on the right" type={FlagType.NEGATIVE} />
        )}
      </div>
      <div className={styles.rightPane}>
        <Button>Add New User</Button>
        <div style={{ height: "25em" }}>
          <UserPicker
            model={props.selectedUser || null}
            onSelect={user => props.setSelectedUser(user)}
          />
        </div>
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
