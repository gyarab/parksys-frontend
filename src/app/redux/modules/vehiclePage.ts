import {
  VehiclePageActionTypes,
  SET_PARKING_SESSION
} from "./vehiclePageActionCreators";

export interface IVehiclePageState {
  session?: {
    id: string;
    vehicle: {
      id: string;
      licensePlate: string;
    };
    checkIn: any;
    checkOut: any;
  };
}

const initialState: IVehiclePageState = {
  session: null
};

export const vehiclePageReducer = (
  state: IVehiclePageState = initialState,
  action: VehiclePageActionTypes
): IVehiclePageState => {
  switch (action.type) {
    case SET_PARKING_SESSION:
      return {
        ...state,
        session: {
          ...(!state.session ? {} : state.session),
          ...action.payload
        }
      };
    default:
      return state;
  }
};
