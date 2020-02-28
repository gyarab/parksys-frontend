import React, { useEffect } from "react";
import { stylesheet } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../redux/modules/rulePageActionCreators";
import { useParkingSessionPicker } from "../components/pickers/ParkingSessionPicker";
import { VehiclePagedPicker } from "../components/pickers/VehiclePicker";
import { IRulePageStateSimulation } from "../redux/modules/rulePageModule";
import { VehicleDisplay } from "../components/VehicleDisplay";
import { ParkingSessionDisplay } from "../components/ParkingSessionDisplay";
import { FlagType, Flag } from "../components/Flag";
import { IVehiclePageState } from "../redux/modules/vehiclePage";
import { SET_PARKING_SESSION } from "../redux/modules/vehiclePageActionCreators";

export interface IStateToProps {
  vehicle: IRulePageStateSimulation["vehicle"] | null;
  session: IVehiclePageState["session"] | null;
}

export interface IDispatchToProps {
  setSimulationVehicle: (vehicle: any) => void;
  setParkingSession: (session: IVehiclePageState["session"]) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  vehiclePage: {
    display: "grid",
    gridTemplateColumns: "1fr"
  },
  row: {
    display: "grid",
    gridTemplateColumns: "8fr 3fr",
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

const VehiclePage = (props: IProps): JSX.Element => {
  const [sessionPicker, session] = useParkingSessionPicker();
  useEffect(() => {
    if (!!session) props.setParkingSession(session);
  }, [!!session ? session.id : null]);
  console.log(props.session);
  return (
    <div className={styles.vehiclePage}>
      <PickerContainer title="Parking Session">
        <div>
          {!props.session ? (
            <Flag text="Select a Parking session" type={FlagType.NEGATIVE} />
          ) : (
            <ParkingSessionDisplay session={props.session} />
          )}
        </div>
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
          {!props.vehicle ? (
            <Flag text="Select a Vehicle" type={FlagType.NEGATIVE} />
          ) : (
            <VehicleDisplay
              vehicle={props.vehicle}
              setParkingSession={props.setParkingSession}
            />
          )}
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
    vehicle: state.rulePage.ruleAssignmentSimulation.vehicle,
    session: state.vehiclePage.session
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSimulationVehicle: vehicle =>
      dispatch({
        type: CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS,
        payload: { vehicle }
      }),
    setParkingSession: session =>
      dispatch({
        type: SET_PARKING_SESSION,
        payload: session
      })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(VehiclePage);

export { connected as VehiclePage, VehiclePage as UnconnectedVehiclePage };
