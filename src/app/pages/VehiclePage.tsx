import React, { useState, useMemo } from "react";
import { stylesheet } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../redux/modules/rulePageActionCreators";
import {
  useParkingSessionPicker,
  useVehicleParkingSessionPicker,
  VehicleParkingSessionPicker
} from "../components/pickers/ParkingSessionPicker";
import { VehiclePagedPicker } from "../components/pickers/VehiclePicker";
import { IRulePageStateSimulation } from "../redux/modules/rulePageModule";
import { VEHICLES_PARKING_SESSIONS_PAGED_QUERY } from "../constants/Queries";
import { useQuery } from "@apollo/react-hooks";
import lodash from "lodash";

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
    gridTemplateColumns: "1fr"
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gridColumnGap: "1em",
    height: "20em",
    $nest: {
      "&+&": {
        marginTop: "2em",
        paddingTop: "2em",
        borderTop: "1px solid red"
      }
    }
  }
});

const PickerContainer = ({ children, title }) => (
  <div>
    <h3>{title}</h3>
    <div className={styles.row}>{children}</div>
  </div>
);

const styles2 = stylesheet({
  vehicleDisplay: {
    display: "grid",
    gridTemplateColumns: "auto auto"
  }
});

const VehicleDisplay = (props: { vehicle: any }) => {
  const [model, setModel] = useState(null);
  return (
    <div className={styles2.vehicleDisplay}>
      <div>
        <table>
          <thead>
            <tr>
              <th># of Sessions</th>
              <th>Total Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{props.vehicle.numParkingSessions}</td>
              <td>{props.vehicle.totalPaidCents / 100}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h4 style={{ marginTop: 0 }}>
          Parking Sessions for {props.vehicle.licensePlate}
        </h4>
        <VehicleParkingSessionPicker
          options={{
            variables: { licensePlate: props.vehicle.licensePlate }
          }}
          model={model}
          onSelect={setModel}
        />
      </div>
    </div>
  );
};

const VehiclePage = (props: IProps): JSX.Element => {
  const [sessionPicker, ,] = useParkingSessionPicker();
  return (
    <div className={styles.vehiclePage}>
      <PickerContainer title="Parking Session">
        <div></div>
        {sessionPicker}
      </PickerContainer>
      <PickerContainer
        title={
          !props.vehicle
            ? "Vehicle"
            : `Vehicle -- ${props.vehicle.licensePlate}`
        }
      >
        <div>
          {!props.vehicle ? null : <VehicleDisplay vehicle={props.vehicle} />}
        </div>
        <VehiclePagedPicker
          onSelect={props.setSimulationVehicle}
          model={props.vehicle}
        />
      </PickerContainer>
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
