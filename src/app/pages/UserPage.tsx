import React, { useState } from "react";
import { connect } from "react-redux";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { stylesheet, classes } from "typestyle";
import { Color } from "../constants";
import { Button } from "../components/Button";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import { PASSWORD_CHANGE_MUTATION } from "../constants/Mutations";

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

const styles = stylesheet({
  userPage: {
    $nest: {
      ".sections": {
        $nest: {
          "section + section": {
            marginTop: "2em"
          }
        }
      }
    }
  }
});

const uID = stylesheet({
  userDisplay: {
    margin: "1em 2em 2em auto",
    paddingBottom: "2em",
    borderBottom: "1px solid #ccc",
    $nest: {
      h2: {
        margin: 0,
        marginBottom: "0.3em"
      },
      h4: {
        margin: 0,
        marginTop: "0.3em"
      }
    }
  }
});

const UserIdentifierDisplay = props => {
  const { name, email } = props;
  return (
    <section className={uID.userDisplay}>
      <h2>{name}</h2>
      <h4>{email}</h4>
    </section>
  );
};

enum SectionMessageStatus {
  SUCCESS,
  FAILURE,
  WARNING
}

interface SectionMessage {
  status: SectionMessageStatus;
  message: string;
}

const us = stylesheet({
  userSection: {
    padding: "0",
    $nest: {
      h2: {
        marginTop: 0,
        display: "inline-block"
      }
    }
  },
  alert: {
    paddingLeft: "1em",
    borderLeft: `5px solid ${Color.LIGHT_RED}`
  },
  status: {
    padding: "5px",
    margin: "0.2em",
    borderRadius: "3px",
    marginTop: "-0.2em",
    marginLeft: "0.5em"
  },
  statusFailure: {
    backgroundColor: Color.LIGHT_RED
  },
  statusSuccess: {
    backgroundColor: Color.LIGHT_BLUE
  }
});

const statusToClass = (status: SectionMessageStatus) => {
  switch (status) {
    case SectionMessageStatus.FAILURE:
      return us.statusFailure;
    case SectionMessageStatus.SUCCESS:
      return us.statusSuccess;
    default:
      "";
  }
};

const UserSection = (props: {
  title: string;
  children?: any;
  alert?: boolean;
  message?: SectionMessage;
}) => {
  const alert = props.alert || false;
  return (
    <section className={classes(us.userSection, alert && us.alert)}>
      <a href={`#${props.title.toLowerCase()}`} />
      <div>
        <h2>{props.title}</h2>
        {!!props.message ? (
          <span
            className={classes(statusToClass(props.message.status), us.status)}
          >
            {props.message.message}
          </span>
        ) : null}
      </div>
      {props.children}
    </section>
  );
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
          status: SectionMessageStatus.SUCCESS,
          message: "Password changed"
        });
      })
      .catch(error => {
        console.log(error);
        setSecurityMessage({
          status: SectionMessageStatus.FAILURE,
          message: "Error while changing password"
        });
      });
  };
  return (
    <div className={styles.userPage}>
      <UserIdentifierDisplay {...props.user} />
      <div className="sections">
        <UserSection
          title="Security"
          message={securityMessage}
          alert={
            !!securityMessage &&
            securityMessage.status === SectionMessageStatus.FAILURE
          }
        >
          <UserSecurity changePassword={changePassword} />
        </UserSection>
      </div>
    </div>
  );
};

const connected = connect(mapStateToProps, mapDispatchToProps)(UserPage);

export { connected as UserPage, UserPage as UnconnectedUserPage };
