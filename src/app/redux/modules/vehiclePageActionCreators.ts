import { IErrorsState } from "./errorsModule";
import { IVehiclePageState } from "./vehiclePage";

export const SET_PARKING_SESSION = "VEHICLE_PAGE/SET_PARKING_SESSION";
export interface SetParkingSession {
  type: typeof SET_PARKING_SESSION;
  payload: IVehiclePageState["session"] | null;
}

export type VehiclePageActionTypes = SetParkingSession;
