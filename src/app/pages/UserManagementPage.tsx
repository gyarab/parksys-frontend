import React, { useState } from "react";
import { stylesheet } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { UserPicker } from "../components/pickers/UserPicker";
import { IUserMngmtPageState } from "../redux/modules/userMngmtPageModule";
import {
  SetSelectedUser,
  SET_SELECTED_USER
} from "../redux/modules/userMngmtActionCreators";
import { UserEditor } from "../components/editors/UserEditor";
import { Flag, FlagType } from "../components/Flag";
import { IUserState } from "../redux/modules/userModule";
import { Button } from "../components/Button";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import {
  USER_UPDATE_MUTATION,
  USER_DELETE_MUTATION
} from "../constants/Mutations";

export interface IStateToProps {
  currentUser?: IUserState["user"];
  selectedUser?: IUserMngmtPageState["selectedUser"];
}

export interface IDispatchToProps {
  setSelectedUser: (payload: SetSelectedUser["payload"]) => void;
  useUpdateUser: () => MutationTuple<any, { id: string; input: any }>;
  useDeleteUser: () => MutationTuple<any, { id: string }>;
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
  const [i, setI] = useState(0);
  const [err, setErr] = useState("");
  const [updateUserEffect] = props.useUpdateUser();
  const [deleteUserEffect] = props.useDeleteUser();
  const updateUser = updates => {
    if (
      props.selectedUser.id === props.currentUser.id &&
      typeof updates.active === "boolean" &&
      !updates.active
    ) {
      setErr("Cannot deactivate yourself.");
      return;
    }
    setErr("");
    updateUserEffect({
      variables: {
        id: props.selectedUser.id,
        input: updates
      }
    });
    props.setSelectedUser(null);
  };
  const deleteUser = (id: string) => {
    if (props.selectedUser.id === props.currentUser.id) {
      setErr("Cannot delete yourself.");
      return;
    }
    setErr("");
    deleteUserEffect({
      variables: { id }
    });
    props.setSelectedUser(null);
  };
  return (
    <div className={styles.userManagementPage}>
      <div>
        {err.length > 0 ? <Flag text={err} type={FlagType.NEGATIVE} /> : null}
        {isUser ? (
          <UserEditor
            user={props.selectedUser}
            updateUser={updateUser}
            deleteUser={deleteUser}
          />
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
  state: Pick<IStore, "userMngmtPage"> & Pick<IStore, "user">
): IStateToProps => {
  return {
    currentUser: state.user.user,
    selectedUser: state.userMngmtPage.selectedUser
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedUser: payload => dispatch({ type: SET_SELECTED_USER, payload }),
    useUpdateUser: () => useMutation(USER_UPDATE_MUTATION),
    useDeleteUser: () => useMutation(USER_DELETE_MUTATION)
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
