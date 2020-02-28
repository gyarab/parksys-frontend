import { all, AllEffect } from "redux-saga/effects";
import { SettingsSaga } from "./SettingsSaga";
import { UserSaga } from "./UserSaga";
import { DevicesSaga } from "./DevicesSaga";
import { PageSwitchSaga } from "./PageSwitchSaga";

export default apolloClient => {
  function* rootSaga(): IterableIterator<AllEffect<any>> {
    yield all([
      new SettingsSaga().watch(),
      new UserSaga(apolloClient).watch(),
      new DevicesSaga(apolloClient).watch(),
      new PageSwitchSaga().watch()
    ]);
  }
  return rootSaga;
};
