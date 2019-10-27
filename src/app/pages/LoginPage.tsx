import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { loginUser as loginUserActionCreator } from "../redux/modules/userActionCreators";
import { getInputValue } from '../helpers/componentHelpers';
import { Button } from '../components/Button';

interface IDispatchToProps {
  login: (user: string, password: string) => void;
}

interface IProps extends IDispatchToProps {}

const LoginPage = (props: IProps) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    props.login(user, password);
  }
  return (
    <div>
      <div>
        <label>Email/Username</label>
        <input onChange={getInputValue(setUser)}
          value={user}
          name="user" type="text"></input>
      </div>
      <div>
        <label>Password</label>
        <input onChange={getInputValue(setPassword)}
          value={password}
          name="password" type="password"></input>
      </div>
      <Button name="loginButton" onClick={submit}>
        Login
      </Button>
    </div>
  )
};

function mapDispatchToProps(dispatch: Dispatch): IDispatchToProps {
  return {
    login: (user, password) => dispatch(loginUserActionCreator.invoke({ user, password })),
  }
}

const connected = connect(null, mapDispatchToProps)(LoginPage);

export {
  connected as LoginPage,
  LoginPage as UnconnectedLoginPage,
}
