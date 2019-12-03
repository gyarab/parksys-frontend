import { all, AllEffect } from "redux-saga/effects";
import { SettingsSaga } from "./SettingsSaga";
import { StarsSaga } from "./StarsSaga";
import { UserSaga } from "./UserSaga";
import { DevicesSaga } from "./DevicesSaga";

export default apolloClient => {
  function* rootSaga(): IterableIterator<AllEffect<any>> {
    yield all([
      new SettingsSaga().watch(),
      new StarsSaga().watch(),
      new UserSaga().watch(),
      new DevicesSaga(apolloClient).watch()
    ]);
  }
  return rootSaga;
};
