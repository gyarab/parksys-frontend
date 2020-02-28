import autobind from "autobind-decorator";
import {
  CallEffect,
  ForkEffect,
  put,
  PutEffect,
  takeLatest
} from "redux-saga/effects";
import { setLanguage } from "../redux/modules/settingsActionCreators";
import { BaseSaga } from "./BaseSaga";
import { ERRORS_SET_ERROR } from "../redux/modules/errorsActionCreators";

export class PageSwitchSaga extends BaseSaga {
  @autobind
  public *clearErrors(
    action: ReturnType<typeof setLanguage.invoke>
  ): IterableIterator<CallEffect | PutEffect<any>> {
    yield put({ type: ERRORS_SET_ERROR, payload: null });
  }

  protected *registerListeners(): IterableIterator<ForkEffect> {
    yield takeLatest("@@router5/TRANSITION_START", this.clearErrors);
  }
}
