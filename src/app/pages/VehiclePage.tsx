import React from "react";
import { stylesheet } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../redux/modules/rulePageActionCreators";
import { useParkingSessionPicker } from "../components/pickers/ParkingSessionPicker";
import { VehiclePagedPicker } from "../components/pickers/VehiclePicker";
import { IRulePageStateSimulation } from "../redux/modules/rulePageModule";

export interface IStateToProps {
  vehicle: IRulePageStateSimulation["vehicle"] | null;
}

export interface IDispatchToProps {
  setSimulationVehicle: (vehicle: any) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  vehiclePage: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)"
  },
  pickers: {}
});

const PickerContainer = ({ children, title }) => (
  <div style={{ height: "20em", marginBottom: "4em" }}>
    <h3>{title}</h3>
    {children}
  </div>
);

const VehiclePage = (props: IProps): JSX.Element => {
  const [sessionPicker, ,] = useParkingSessionPicker();
  return (
    <div className={styles.vehiclePage}>
      <div></div>
      <div></div>
      <div className={styles.pickers}>
        <PickerContainer title="Parking Session">
          {sessionPicker}
        </PickerContainer>
        <PickerContainer title="Vehicle">
          <VehiclePagedPicker
            onSelect={props.setSimulationVehicle}
            model={props.vehicle}
          />
        </PickerContainer>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IStore): IStateToProps => {
  return {
    vehicle: state.rulePage.ruleAssignmentSimulation.vehicle
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSimulationVehicle: vehicle =>
      dispatch({
        type: CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS,
        payload: { vehicle }
      })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(VehiclePage);

export { connected as VehiclePage, VehiclePage as UnconnectedVehiclePage };
