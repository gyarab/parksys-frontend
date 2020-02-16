import React, { useState } from "react";
import { connect } from "react-redux";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { stylesheet } from "typestyle";
import { Button } from "../components/Button";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import { PASSWORD_CHANGE_MUTATION } from "../constants/Mutations";
import { Flag, FlagType } from "../components/Flag";
import { UserIdentifierDisplay } from "../components/user/UserIdentifierDisplay";
import { UserSections } from "../components/user/UserSections";
import { UserSection, SectionMessage } from "../components/user/UserSection";

export interface IStateToProps {
  user?: {
    id: string;
    name: string;
    email: string;
    permissions: string[];
  };
}

export interface IDispatchToProps {
  usePasswordChange: () => MutationTuple<string, { input: any }>;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const mapStateToProps = (state: IStore): IStateToProps => ({
  user: state.user.user
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    usePasswordChange: () => useMutation(PASSWORD_CHANGE_MUTATION)
  };
};

const sec = stylesheet({
  sec: {
    // width: "clamp(15em, 15em, 100%)",
    width: "25em",
    $nest: {
      h4: { margin: "0.2em 0 0.3em 0" },
      "input + h4": {
        marginTop: "1em"
      },
      ".controls": {
        marginTop: "1em",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        $nest: {
          "*": {
            maxWidth: "49%"
          },
          "button + div": {
            marginLeft: "0.6em"
          }
        }
      }
    }
  }
});

const UserPermissions = ({ permissions }) => {
  return (
    <div>
      {permissions.map(perm => (
        <Flag text={perm} type={FlagType.NONE} />
      ))}
    </div>
  );
};

const UserSecurity = ({ changePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [error, setError] = useState("");
  const onSubmit = e => {
    e.preventDefault();
    if (newPassword !== newPasswordRepeat) {
      setError("Passwords don't match!");
      return;
    } else if (newPassword.length === 0) {
      setError("Password can't be empty!");
      return;
    }
    // Use apollo client
    changePassword(currentPassword, newPassword);
  };
  return (
    <div className={sec.sec}>
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "auto"
        }}
        onSubmit={onSubmit}
      >
        <h4>Current Password</h4>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />
        <h4>New Password</h4>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <h4>Repeat New Password</h4>
        <input
          type="password"
          value={newPasswordRepeat}
          onChange={e => setNewPasswordRepeat(e.target.value)}
        />
        <div className="controls">
          <Button onClick={onSubmit}>Change Password</Button>
          <div>{error}</div>
        </div>
      </form>
    </div>
  );
};

const UserPage = (props: IProps) => {
  const [securityMessage, setSecurityMessage] = useState<null | SectionMessage>(
    null
  );
  const [changePasswordEffect] = props.usePasswordChange();
  const changePassword = (currentPassword: string, newPassword: string) => {
    changePasswordEffect({
      variables: {
        input: {
          currentPassword,
          newPassword,
          user: props.user.id
        }
      }
    })
      .then(result => {
        console.log(result);
        setSecurityMessage({
          status: FlagType.POSITIVE,
          message: "Password changed"
        });
      })
      .catch(error => {
        console.log(error);
        setSecurityMessage({
          status: FlagType.NEGATIVE,
          message: "Error while changing password"
        });
      });
  };
  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          marginBottom: "2em"
        }}
      >
        <UserIdentifierDisplay {...props.user} />
      </div>
      <UserSections>
        <UserSection title="Permissions">
          <UserPermissions permissions={props.user.permissions} />
        </UserSection>
        <UserSection
          title="Security"
          message={securityMessage}
          alert={
            !!securityMessage && securityMessage.status === FlagType.NEGATIVE
          }
        >
          <UserSecurity changePassword={changePassword} />
        </UserSection>
      </UserSections>
    </div>
  );
};

const connected = connect(mapStateToProps, mapDispatchToProps)(UserPage);

export { connected as UserPage, UserPage as UnconnectedUserPage };
