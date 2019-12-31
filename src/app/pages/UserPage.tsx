import React, { useState } from "react";
import { connect } from "react-redux";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { stylesheet } from "typestyle";
import { Color } from "../constants";
import { Button } from "../components/Button";

export interface IStateToProps {
  user?: {
    id: string;
    name: string;
    email: string;
    permissions: string[];
  };
}
export interface IDispatchToProps {}
export interface IProps extends IStateToProps, IDispatchToProps {}

const mapStateToProps = (state: IStore): IStateToProps => ({
  user: state.user.user
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {};
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

const us = stylesheet({
  userSection: {
    padding: "0",
    $nest: {
      h2: {
        marginTop: 0
      }
    }
  },
  alert: {
    paddingLeft: "1em",
    borderLeft: `5px solid ${Color.LIGHT_RED}`
  }
});

const UserIdentifierDisplay = ({ name, email }) => {
  return (
    <section className={uID.userDisplay}>
      <h2>{name}</h2>
      <h4>{email}</h4>
    </section>
  );
};

const UserSection = (props: {
  title: string;
  children?: any;
  alert?: boolean;
}) => {
  const alert = props.alert || false;
  return (
    <section className={[us.userSection, alert ? us.alert : ""].join(" ")}>
      <a href={`#${props.title.toLowerCase()}`} />
      <h2>{props.title}</h2>
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

const UserSecurity = () => {
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
  return (
    <div className={styles.userPage}>
      <UserIdentifierDisplay {...props.user} />
      <div className="sections">
        <UserSection title="Security">
          <UserSecurity />
        </UserSection>
      </div>
    </div>
  );
};

const connected = connect(mapStateToProps, mapDispatchToProps)(UserPage);

export { connected as UserPage, UserPage as UnconnectedUserPage };
