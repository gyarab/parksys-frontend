import { createAsyncActions } from "./baseModule";
import { createAction } from "typesafe-actions";

export interface FetchDevicesInvoke {
  filter?: {
    name?: string;
    activated?: boolean;
  };
}

export interface FetchDevicesFulfilled {
  devices?: {
    id: string;
    name: string;
    activated: boolean;
    activatedAt: string;
    activationQrUrl: string;
  }[];
}

export const updateDevice = createAction(
  "DEVICE/UPDATE_ONE",
  payload => payload
);

const devicesFetch = "DEVICES/FETCH";
// tslint:disable-next-line:export-name
export const fetchDevices = createAsyncActions(
  devicesFetch,
  devicesFetch + "_PENDING",
  devicesFetch + "_FULFILLED",
  devicesFetch + "_REJECTED"
)<FetchDevicesInvoke, any, FetchDevicesFulfilled, any>();
