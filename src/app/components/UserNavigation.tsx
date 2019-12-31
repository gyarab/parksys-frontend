import { stylesheet } from "typestyle";
import React from "react";
import { Color } from "../constants";
import { IStore } from "../redux/IStore";
import { logoutUser as logoutUserActionCreator } from "../redux/modules/userActionCreators";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Button } from "./Button";
import { navigate } from "../routes/routes";

interface IStateToProps {
  user?: {
    name: string;
    email: string;
  };
}

interface IDispatchToProps {
  logout: () => void;
  navigateToProfile: () => void;
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
    logout: () => dispatch(logoutUserActionCreator()),
    navigateToProfile: () => dispatch(navigate.userPage())
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
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridColumnGap: "0.3em"
  }
});

const UserNavigation = (props: IProps) => {
  let body: JSX.Element;
  if (props.user) {
    body = (
      <>
        <p>{props.user.name}</p>
        <div className={classNames.controls}>
          <Button name="logoutButton" onClick={props.logout}>
            Logout
          </Button>

          <Button type="secondary" onClick={props.navigateToProfile}>
            Profile
          </Button>
        </div>
      </>
    );
  } else {
    body = <p>Not Logged In</p>;
  }
  return <div className={classNames.userNavigation}>{body}</div>;
};

const connected = connect(mapStateToProps, mapDispatchToProps)(UserNavigation);

export {
  UserNavigation as UnconnectedUserNavigation,
  connected as UserNavigation,
  mapStateToProps,
  mapDispatchToProps
};
