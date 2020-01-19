import { DatePicker } from "../pickers/DatePicker";
import React from "react";
import { TwoPicker } from "../pickers/TwoPicker";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../../redux/modules/rulePageActionCreators";
import { IStore } from "../../redux/IStore";
import { stylesheet } from "typestyle";
import { VehiclePicker } from "../pickers/VehiclePicker";
import { IRulePageStateSimulation } from "../../redux/modules/rulePageModule";
import lodash from "lodash";

export interface IStateToProps {
  ruleAssignmentSimulation: IRulePageStateSimulation;
}

export interface IDispatchToProps {
  changeSimulateRuleAssignmentsOptions: (value: object) => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  pickers: {
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    gridGap: "0.3em 0.4em",
    alignItems: "center"
  },
  header: {
    marginBottom: "0.5em",
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    alignItems: "center",
    justifyItems: "right",
    $nest: {
      div: {
        maxHeight: "2em"
      }
    }
  }
});

const ParkingRuleAssignmentSimulationOptions = (props: IProps) => {
  const disabled = !props.ruleAssignmentSimulation.on;
  return (
    <div>
      <div className={styles.header}>
        <h3>Simulation</h3>
        <TwoPicker
          optionLeft="OFF"
          optionRight="ON"
          rightIsSelected={!disabled}
          onChange={v =>
            props.changeSimulateRuleAssignmentsOptions({ on: v === "ON" })
          }
        />
      </div>
      <div className={styles.pickers}>
        <span>Vehicle</span>
        <VehiclePicker
          identifier={lodash.get(
            props.ruleAssignmentSimulation.vehicle,
            "licensePlate",
            ""
          )}
          disabled={disabled}
          onSelect={v => {
            props.changeSimulateRuleAssignmentsOptions({ vehicle: v });
          }}
        />
        <span>Start</span>
        <DatePicker
          disabled={disabled}
          value={props.ruleAssignmentSimulation.start}
          onChange={start =>
            props.changeSimulateRuleAssignmentsOptions({ start })
          }
        />
        <span>End</span>
        <DatePicker
          disabled={disabled}
          value={props.ruleAssignmentSimulation.end}
          onChange={end => props.changeSimulateRuleAssignmentsOptions({ end })}
        />
      </div>
    </div>
  );
};

export const mapStateToProps = (
  state: Pick<IStore, "rulePage">
): IStateToProps => {
  return {
    ruleAssignmentSimulation: state.rulePage.ruleAssignmentSimulation
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    changeSimulateRuleAssignmentsOptions: payload =>
      dispatch({ type: CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS, payload })
  };
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParkingRuleAssignmentSimulationOptions);

export {
  connected as ParkingRuleAssignmentSimulationOptions,
  ParkingRuleAssignmentSimulationOptions as UnconnectedParkingRuleAssignmentSimulationOptions
};
