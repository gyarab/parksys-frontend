import React from "react";
import { stylesheet } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../redux/modules/rulePageActionCreators";
import { useParkingSessionPicker } from "../components/pickers/ParkingSessionPicker";

export interface IStateToProps {}

export interface IDispatchToProps {
  changeSimulateRuleAssignmentsOptions: (vehicle: any) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  vehiclePage: {}
});

const VehiclePage = (props: IProps): JSX.Element => {
  const [render, ,] = useParkingSessionPicker();
  return <div className={styles.vehiclePage}>{render}</div>;
};

const mapStateToProps = (state: IStore): IStateToProps => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    changeSimulateRuleAssignmentsOptions: vehicle =>
      dispatch({
        type: CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS,
        payload: { vehicle }
      })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(VehiclePage);

export { connected as VehiclePage, VehiclePage as UnconnectedVehiclePage };
