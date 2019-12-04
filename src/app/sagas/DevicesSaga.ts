import { BaseSaga } from "./BaseSaga";
import {
  ForkEffect,
  CallEffect,
  PutEffect,
  put,
  call,
  takeLatest
} from "redux-saga/effects";
import autobind from "autobind-decorator";
import {
  fetchDevices,
  FetchDevicesFulfilled
} from "../redux/modules/devicesActionCreators";
import gql from "graphql-tag";
import { getType } from "typesafe-actions";

export class DevicesSaga extends BaseSaga {
  private client: any;
  constructor(client) {
    super();
    this.client = client;
  }

  private fetchDevicesCall(
    name: string,
    activated: boolean
  ): () => Promise<{ data: FetchDevicesFulfilled }> {
    return () =>
      this.client.query({
        query: gql`
          query devices($name: String, $activated: Boolean) {
            devices(filter: { name: $name, activated: $activated }) {
              id
              name
              activated
              activatedAt
              activationQrUrl
            }
          }
        `,
        variables: {
          name,
          activated
        }
      });
  }

  @autobind
  public *fetchDevices(
    action: ReturnType<typeof fetchDevices.invoke>
  ): IterableIterator<CallEffect | PutEffect> {
    try {
      yield put(fetchDevices.setPending(null));
      const {
        filter: { name, activated }
      } = action.payload;
      const response = yield call(this.fetchDevicesCall(name, activated));
      yield put(fetchDevices.setFulfilled(response));
    } catch (e) {
      yield put(fetchDevices.setRejected(null, e.toString()));
    }
  }

  protected *registerListeners(): IterableIterator<ForkEffect> {
    yield takeLatest(getType(fetchDevices.invoke), this.fetchDevices);
  }
}
