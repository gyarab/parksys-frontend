import autobind from "autobind-decorator";
import {
  call,
  CallEffect,
  ForkEffect,
  put,
  PutEffect,
  takeLatest
} from "redux-saga/effects";
import { getType } from "typesafe-actions";
import * as userActions from "../redux/modules/userActionCreators";
import { BaseSaga } from "./BaseSaga";
import { loginApi } from "../apis/loginApi";
import { navigate } from "../routes/routes";

export class UserSaga extends BaseSaga {
  @autobind
  public *loginUser(
    action: ReturnType<typeof userActions.loginUser.invoke>
  ): IterableIterator<CallEffect | PutEffect<any>> {
    try {
      yield put(userActions.loginUser.setPending(null));
      const { user, password } = action.payload;
      const payload: any = yield call(loginApi.loginUser(user, password));
      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem("refreshToken", payload.refreshToken);
      yield put(userActions.loginUser.setFulfilled(payload));
    } catch (e) {
      yield put(userActions.loginUser.setRejected(null, e.toString()));
    }
  }

  @autobind
  public *logoutUser(
    _: ReturnType<typeof userActions.logoutUser>
  ): IterableIterator<CallEffect | PutEffect<any>> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    yield put(navigate.loginPage());
  }

  @autobind
  public *onSuccessfulLogin(
    _: ReturnType<typeof userActions.loginUser.setFulfilled>
  ): IterableIterator<CallEffect | PutEffect<any>> {
    yield put(navigate.dashboardPage());
  }

  protected *registerListeners(): IterableIterator<ForkEffect> {
    yield takeLatest(getType(userActions.loginUser.invoke), this.loginUser);
    yield takeLatest(
      getType(userActions.loginUser.setFulfilled),
      this.onSuccessfulLogin
    );
    yield takeLatest(getType(userActions.logoutUser), this.logoutUser);
  }
}
