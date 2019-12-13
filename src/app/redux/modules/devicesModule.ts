import { ActionType, getType } from "typesafe-actions";
import { IBaseState } from "./baseModule";
import { fetchDevices, FetchDevicesFulfilled } from "./devicesActionCreators";

export interface IDevicesState
  extends IBaseState,
    Pick<FetchDevicesFulfilled, "devices"> {}

export const initialState: IDevicesState = {
  devices: null,
  error: "",
  loaded: false,
  pending: false
};

export function deviceReducer(
  state: IDevicesState = initialState,
  action: ActionType<typeof fetchDevices>
): IDevicesState {
  switch (action.type) {
    case getType(fetchDevices.setPending):
      return {
        ...state,
        pending: true
      };
    case getType(fetchDevices.setRejected):
      return {
        ...state,
        pending: false,
        loaded: true,
        error: action.message
      };
    case getType(fetchDevices.setFulfilled):
      const payload: FetchDevicesFulfilled = action.payload.data;
      return {
        ...state,
        pending: false,
        loaded: true,
        error: "",
        devices: payload.devices
      };
    default:
      return state;
  }
}
