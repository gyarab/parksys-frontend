import { ActionType, getType } from "typesafe-actions";
import { IBaseState } from "./baseModule";
import { fetchDevices } from "./devicesActionCreators";

export interface IDevicesState extends IBaseState {
  devices?: {
    id: string;
    name: string;
    activated: boolean;
    activatedAt: string;
  }[];
}

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
        loaded: true,
        pending: false,
        error: action.message
      };
    case getType(fetchDevices.setFulfilled):
      console.log(action.payload.data);
      return {
        ...state,
        pending: false,
        loaded: true,
        error: "",
        devices: action.payload.data.devices
      };
    default:
      return state;
  }
}
