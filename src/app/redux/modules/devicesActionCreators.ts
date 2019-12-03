import { createAsyncActions } from "./baseModule";

const devicesFetcg = "DEVICES/FETCH";
// tslint:disable-next-line:export-name
export const fetchDevices = createAsyncActions(
  devicesFetcg,
  devicesFetcg + "_PENDING",
  devicesFetcg + "_FULFILLED",
  devicesFetcg + "_REJECTED"
)<any, any, any, any>();
