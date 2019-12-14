import { stylesheet } from "typestyle";
import React from "react";
import { Color } from "../constants";
import { IStore } from "../redux/IStore";
import { logoutUser as logoutUserActionCreator } from "../redux/modules/userActionCreators";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Button } from "./Button";

interface IStateToProps {
  user?: {
    name: string;
    email: string;
  };
}

interface IDispatchToProps {
  logout: () => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

function mapStateToProps(state: Pick<IStore, "user">): IStateToProps {
  if (state.user.user) {
    return {
      user: {
        name: state.user.user.name,
        email: state.user.user.email
      }
    };
  } else {
    return {
      user: null
    };
  }
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchToProps {
  return {
    logout: () => dispatch(logoutUserActionCreator())
  };
}

const classNames = stylesheet({
  userNavigation: {
    margin: "0.3em",
    padding: "0.3em",
    backgroundColor: Color.GREY,
    color: Color.WHITE,
    $nest: {
      "& p": {
        textAlign: "center"
      }
    }
  }
});

class UserNavigation extends React.Component<IProps> {
  render(): JSX.Element {
    let body: JSX.Element;
    if (this.props.user) {
      body = (
        <>
          <p>{this.props.user.name}</p>
          <Button name="logoutButton" onClick={this.props.logout}>
            Logout
          </Button>
        </>
      );
    } else {
      body = <p>Not Logged In</p>;
    }
    return <div className={classNames.userNavigation}>{body}</div>;
  }
}

const connected = connect(mapStateToProps, mapDispatchToProps)(UserNavigation);

export {
  UserNavigation as UnconnectedUserNavigation,
  connected as UserNavigation,
  mapStateToProps,
  mapDispatchToProps
};
