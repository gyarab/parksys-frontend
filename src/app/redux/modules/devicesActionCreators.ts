import { createAsyncActions } from "./baseModule";

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
  }[];
}

const devicesFetch = "DEVICES/FETCH";
// tslint:disable-next-line:export-name
export const fetchDevices = createAsyncActions(
  devicesFetch,
  devicesFetch + "_PENDING",
  devicesFetch + "_FULFILLED",
  devicesFetch + "_REJECTED"
)<FetchDevicesInvoke, any, FetchDevicesFulfilled, any>();
