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
import { BackgroundChange } from "../components/BackgroundChange";

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
    gridTemplateColumns: "8fr 3fr",
    gridColumnGap: "2em"
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
  },
  pickers: {
    display: "grid",
    gridTemplateColumns: "auto",
    gridTemplateRows: "22em 25em",
    gridRowGap: "4em"
  },
  body: {
    display: "grid",
    gridTemplateColumns: "auto",
    gridTemplateRows: "25em 25em"
  }
});

const VehiclePage = (props: IProps): JSX.Element => {
  const [sessionPicker, session] = useParkingSessionPicker();
  useEffect(() => {
    if (!!session) props.setParkingSession(session);
  }, [!!session ? session.id : null]);
  return (
    <div className={styles.vehiclePage}>
      <div className={styles.body}>
        <div>
          {!props.session ? (
            <Flag text="Select a Parking session" type={FlagType.WARNING} />
          ) : (
            <ParkingSessionDisplay session={props.session} />
          )}
        </div>
        <div>
          {!props.vehicle ? (
            <Flag text="Select a Vehicle" type={FlagType.WARNING} />
          ) : (
            <>
              <VehicleDisplay
                vehicle={props.vehicle}
                setParkingSession={props.setParkingSession}
              />
            </>
          )}
        </div>
      </div>
      <div className={styles.pickers}>
        <div>
          <h3>Parking Session Picker</h3>
          {sessionPicker}
        </div>
        <div>
          <h3>Vehicle Picker</h3>
          <VehiclePagedPicker
            onSelect={props.setSimulationVehicle}
            model={props.vehicle}
          />
        </div>
      </div>
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
