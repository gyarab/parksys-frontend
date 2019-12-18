import { ActionType, getType } from "typesafe-actions";
import { IBaseState } from "./baseModule";
import {
  fetchDevices,
  FetchDevicesFulfilled,
  updateDevice,
  toggleDeviceExpand
} from "./devicesActionCreators";

export interface IDevicesState
  extends IBaseState,
    Pick<FetchDevicesFulfilled, "devices"> {
  expandedDevices: {
    [id: string]: boolean;
  };
}

export const initialState: IDevicesState = {
  devices: null,
  error: "",
  loaded: false,
  pending: false,
  expandedDevices: {}
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
    case getType(updateDevice):
      const { id, update } = action.payload;
      let i = 0;
      for (; i < state.devices.length; i++) {
        if (state.devices[i].id == id) break;
      }
      return {
        ...state,
        devices: state.devices
          .slice(0, i)
          .concat([{ ...state.devices[i], ...update }])
          .concat(state.devices.slice(i + 1))
      };
    case getType(toggleDeviceExpand):
      return {
        ...state,
        expandedDevices: {
          ...state.expandedDevices,
          [action.payload.id]: action.payload.isExpanded
        }
      };
    default:
      return state;
  }
}
