import { DatePicker } from "../pickers/DatePicker";
import React, { useState } from "react";
import { TwoPicker } from "../pickers/TwoPicker";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../../redux/modules/rulePageActionCreators";
import { IStore } from "../../redux/IStore";
import { stylesheet } from "typestyle";
import { VehiclePicker } from "../pickers/VehiclePicker";

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
  const [lp, setLp] = useState("");
  const disabled = !props.ruleAssignmentSimulation.on;
  return (
    <div className={styles.simulationOptions}>
      <div className={styles.header}>
        <h3>Simulation</h3>
        <TwoPicker
          optionLeft="OFF"
          optionRight="ON"
          leftIsSelected={disabled}
          onChange={v =>
            props.changeSimulateRuleAssignmentsOptions({ on: v === "ON" })
          }
        />
      </div>
      <div className={styles.pickers}>
        <span>Vehicle</span>
        <VehiclePicker
          licensePlate={lp}
          onInputChange={setLp}
          disabled={disabled}
          onSelect={v => {
            setLp(!!v ? v.licensePlate : "");
            props.changeSimulateRuleAssignmentsOptions({
              vehicle: !!v ? v.id : null
            });
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
