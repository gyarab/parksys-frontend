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
  FetchDevicesFulfilled,
  createDevice,
  CreateDeviceInvoke
} from "../redux/modules/devicesActionCreators";
import gql from "graphql-tag";
import { getType } from "typesafe-actions";

export class DevicesSaga extends BaseSaga {
  private client: any;
  private lastFetchDevicesArgs;
  constructor(client) {
    super();
    this.client = client;
    this.lastFetchDevicesArgs = undefined;
  }

  private fetchDevicesCall(
    filter
  ): () => Promise<{ data: FetchDevicesFulfilled }> {
    this.lastFetchDevicesArgs = filter;
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
              activationPasswordExpiresAt
            }
          }
        `,
        variables: filter,
        fetchPolicy: "no-cache"
      });
  }

  private addDeviceCall(input: CreateDeviceInvoke): () => Promise<any> {
    return () =>
      this.client.mutate({
        mutation: gql`
          mutation addDevice($name: String!) {
            addDevice(input: { name: $name }) {
              id
              name
              activationQrUrl
            }
          }
        `,
        variables: {
          name: input.input.name
        }
      });
  }

  @autobind
  public *fetchDevices(
    action: ReturnType<typeof fetchDevices.invoke>
  ): IterableIterator<CallEffect | PutEffect> {
    try {
      yield put(fetchDevices.setPending(null));
      const response = yield call(this.fetchDevicesCall(action.payload.filter));
      yield put(fetchDevices.setFulfilled(response));
    } catch (e) {
      yield put(fetchDevices.setRejected(null, e.toString()));
    }
  }

  @autobind
  public *createDevice(
    action: ReturnType<typeof createDevice.invoke>
  ): IterableIterator<CallEffect | PutEffect> {
    try {
      // CREATE
      yield put(createDevice.setPending(null));
      const response = yield call(this.addDeviceCall(action.payload));
      yield put(createDevice.setFulfilled(response));
      // Refetch
      if (this.lastFetchDevicesArgs) {
        yield put(fetchDevices.invoke(this.lastFetchDevicesArgs));
      }
    } catch (e) {
      yield put(createDevice.setRejected(null, e.toString()));
    }
  }

  protected *registerListeners(): IterableIterator<ForkEffect> {
    yield takeLatest(getType(fetchDevices.invoke), this.fetchDevices);
    yield takeLatest(getType(createDevice.invoke), this.createDevice);
  }
}
