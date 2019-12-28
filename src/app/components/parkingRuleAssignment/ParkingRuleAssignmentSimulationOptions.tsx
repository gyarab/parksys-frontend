import { DatePicker } from "../DatePicker";
import React from "react";
import { TwoPicker } from "../TwoPicker";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../../redux/modules/rulePageActionCreators";
import { IStore } from "../../redux/IStore";
import { stylesheet } from "typestyle";

export interface IStateToProps {
  ruleAssignmentSimulation: {
    on: boolean;
    start: Date;
    end: Date;
    vehicle: string; // id
  };
}

export interface IDispatchToProps {
  changeSimulateRuleAssignmentsOptions: (value: object) => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  simulationOptions: {
    padding: "0.5em"
  },
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
  return (
    <div className={styles.simulationOptions}>
      <div className={styles.header}>
        <h3>Simulation</h3>
        <TwoPicker
          optionLeft="OFF"
          optionRight="ON"
          leftIsSelected={!props.ruleAssignmentSimulation.on}
          onChange={v =>
            props.changeSimulateRuleAssignmentsOptions({ on: v === "ON" })
          }
        />
      </div>
      <div className={styles.pickers}>
        <span>Vehicle</span>
        <input
          name="vehicle"
          value={props.ruleAssignmentSimulation.vehicle}
          disabled={!props.ruleAssignmentSimulation.on}
          onChange={e =>
            props.changeSimulateRuleAssignmentsOptions({
              vehicle: e.target.value
            })
          }
        />
        <span>Start</span>
        <DatePicker
          disabled={!props.ruleAssignmentSimulation.on}
          value={props.ruleAssignmentSimulation.start}
          onChange={start =>
            props.changeSimulateRuleAssignmentsOptions({ start })
          }
        />
        <span>End</span>
        <DatePicker
          disabled={!props.ruleAssignmentSimulation.on}
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
