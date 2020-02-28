import { Dispatch } from "redux";
import React from "react";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../redux/modules/rulePageActionCreators";
import { Flag } from "./Flag";
import { connect } from "react-redux";

interface Props {
  vehicle: any;
  setVehicle: (vehicle: any) => void;
}

const UnconnectedVehicleLink = (props: Props) => {
  const { vehicle, setVehicle } = props;
  return (
    <a
      onClick={e => {
        e.stopPropagation();
        setVehicle(vehicle);
      }}
    >
      <u>
        <Flag text={vehicle.licensePlate} />
      </u>
    </a>
  );
};

const toDispatch = (dispatch: Dispatch) => ({
  setVehicle: vehicle =>
    dispatch({
      type: CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS,
      payload: { vehicle }
    })
});

export const VehicleLink = connect(null, toDispatch)(UnconnectedVehicleLink);
