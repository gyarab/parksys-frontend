import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { loginUser as loginUserActionCreator } from "../redux/modules/userActionCreators";
import { getInputValue } from "../helpers/componentHelpers";
import { Button } from "../components/Button";
import { IStore } from "../redux/IStore";
import { IUserState } from "../redux/modules/userModule";
import { stylesheet } from "typestyle";
import { Input } from "../components/Input";
import { Footer } from "../components/Footer";

interface IStateToProps {
  state: IUserState;
}

interface IDispatchToProps {
  login: (user: string, password: string) => void;
}

interface IProps extends IStateToProps, IDispatchToProps {}

function mapStateToProps(state: Pick<IStore, "user">): IStateToProps {
  return {
    state: state.user
  };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchToProps {
  return {
    login: (user, password) =>
      dispatch(loginUserActionCreator.invoke({ user, password }))
  };
}

const classNames = stylesheet({
  loginPage: {
    position: "relative",
    top: "20%",
    width: "30%",
    marginLeft: "auto",
    marginRight: "auto",
    $nest: {
      "& > form": {
        width: "100%",
        margin: "auto",
        minWidth: "10em",
        maxWidth: "18em",
        paddingLeft: "0.3em",
        paddingRight: "0.3em"
      },
      "& input": {
        width: "100%"
      },
      "& label + input": {
        marginTop: "0.2em"
      },
      "& > form > div + div": {
        marginTop: "0.6em"
      }
    }
  },
  loginButton: {
    marginTop: "0.5em",
    width: "100%"
  },
  error: {
    textAlign: "center"
  }
});

const LoginPage = (props: IProps) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [compError, setCompError] = useState(props.state.error);

  const submit = e => {
    e.preventDefault();
    if (user.length > 0 && password.length > 0) {
      setCompError("");
      props.login(user, password);
    } else {
      setCompError("Please enter your username and password");
    }
  };
  return (
    <>
      <div className={classNames.loginPage}>
        <form onSubmit={submit}>
          <div>
            <label>Email/Username</label>
            <Input
              onChange={getInputValue(setUser)}
              value={user}
              name="user"
              type="text"
              disabled={props.state.pending}
            />
          </div>
          <div>
            <label>Password</label>
            <Input
              onChange={getInputValue(setPassword)}
              value={password}
              name="password"
              type="password"
              disabled={props.state.pending}
            />
          </div>
          <Button
            className={classNames.loginButton}
            name="loginButton"
            disabled={props.state.pending}
          >
            {props.state.pending ? "Loading..." : "Login"}
          </Button>
        </form>
        {compError.length > 0 ? (
          <p className={classNames.error}>{compError}</p>
        ) : null}
        {props.state.error.length > 0 ? (
          <p className={classNames.error}>{props.state.error}</p>
        ) : null}
      </div>
      <Footer />
    </>
  );
};

const connected = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export { connected as LoginPage, LoginPage as UnconnectedLoginPage };
