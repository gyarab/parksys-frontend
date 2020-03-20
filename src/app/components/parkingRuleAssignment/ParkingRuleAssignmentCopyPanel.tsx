import React, { useState, useMemo } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import { RULE_PAGE_COPY_RULE_ASSIGNMENTS_MUTATION } from "../../constants/Mutations";
import { OptionPicker } from "../pickers/OptionPicker";
import { IRulePageState } from "../../redux/modules/rulePageModule";
import { IStore } from "../../redux/IStore";
import { Button } from "../Button";
import {
  SetSelectedDay,
  SET_SELECTED_DAY
} from "../../redux/modules/rulePageActionCreators";

interface IDispatchToProps {
  duplicateRuleAssignments: () => MutationTuple<
    any,
    { start: Date; end: Date; targetStarts: Date[] }
  >;
  setSelectedDays: (days: SetSelectedDay["payload"]) => void;
}

interface IStateToProps {
  selectedDays: IRulePageState["selectedDays"];
  daySelectorMode: IRulePageState["daySelectorMode"];
}

interface IProps extends IDispatchToProps, IStateToProps {
  refetch: () => void;
}

const ParkingRuleAssignmentCopyPanel = (props: IProps) => {
  const [copyEffect] = props.duplicateRuleAssignments();
  const [targets, setTargets] = useState<Date[]>([null]);
  console.log(targets);
  const addTarget = () => {
    setTargets([...targets, null]);
  };
  const deleteTarget = (index: number) => {
    console.log(index, targets);
    targets.splice(index, 1);
    console.log(targets);
    setTargets([...targets]);
  };
  const copy = () => {
    let min: number = Number.POSITIVE_INFINITY;
    let max: number = Number.NEGATIVE_INFINITY;
    // O(2)
    Object.keys(props.selectedDays).forEach(sStart => {
      const sEnd = props.selectedDays[sStart];
      min = Math.min(Number(sStart), min);
      max = Math.max(sEnd, max);
    });
    copyEffect({
      variables: {
        start: new Date(min),
        end: new Date(max),
        targetStarts: targets
          .filter(t => t !== null)
          .map(t => {
            t.setHours(0, 0, 0, 0);
            return t;
          })
      }
    }).then(result => {
      // Reset on success
      setTargets([null]);
      props.setSelectedDays(null);
      // Refetch
      props.refetch();
    });
  };
  const dontCopy = useMemo(
    () =>
      targets.length === 0 ||
      targets.findIndex(t => t === null) !== -1 ||
      Object.keys(props.selectedDays).length === 0,
    [targets, props.selectedDays]
  );
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto"
        }}
      >
        <div>
          <span>Destinations</span>
          <Button type="positive" small={true} onClick={addTarget}>
            Add More
          </Button>
        </div>
        <div>
          {targets.map((target, i) => (
            <div key={`${i}_${target}`}>
              <input
                type="date"
                value={
                  target != null ? target.toISOString().slice(0, 10) : null
                }
                onChange={e => {
                  const value = e.target.value;
                  targets[i] = new Date(value);
                  if (isNaN(targets[i].getTime())) {
                    targets[i] = null;
                  }
                  setTargets([...targets]);
                }}
              />
              <Button
                type="negative"
                small={true}
                onClick={() => deleteTarget(i)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Button type="primary" disabled={dontCopy} onClick={copy}>
          Copy
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    selectedDays: state.rulePage.selectedDays,
    daySelectorMode: state.rulePage.daySelectorMode
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    duplicateRuleAssignments: () =>
      useMutation(RULE_PAGE_COPY_RULE_ASSIGNMENTS_MUTATION),

    setSelectedDays: days => dispatch({ type: SET_SELECTED_DAY, payload: days })
  };
};

const connected = connect(
  mapStateToProps,

  mapDispatchToProps
)(ParkingRuleAssignmentCopyPanel);

export {
  connected as ParkingRuleAssignmentCopyPanel,
  ParkingRuleAssignmentCopyPanel as UnconnectedParkingRuleAssignmentCopyPanel
};
