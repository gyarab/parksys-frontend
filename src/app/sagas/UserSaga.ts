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

export class UserSaga extends BaseSaga {
  @autobind
  public *loginUser(
    action: ReturnType<typeof userActions.loginUser.invoke>
  ): IterableIterator<CallEffect | PutEffect<any>> {
    try {
      yield put(userActions.loginUser.setPending(null));
      const { user, password } = action.payload;
      const payload = yield call(loginApi.loginUser(user, password));
      yield put(userActions.loginUser.setFulfilled(payload));
    } catch (e) {
      yield put(userActions.loginUser.setRejected(null, e.toString()));
    }
  }

  protected *registerListeners(): IterableIterator<ForkEffect> {
    yield takeLatest(getType(userActions.loginUser.invoke), this.loginUser);
  }
}
