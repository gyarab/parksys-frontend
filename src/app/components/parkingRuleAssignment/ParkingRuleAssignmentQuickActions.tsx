import React, { useState, useMemo } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import {
  RULE_PAGE_COPY_RULE_ASSIGNMENTS_MUTATION,
  RULE_PAGE_DELETE_RULE_ASSIGNMENTS_MUTATION
} from "../../constants/Mutations";
import { IRulePageState } from "../../redux/modules/rulePageModule";
import { IStore } from "../../redux/IStore";
import { Button } from "../Button";
import {
  SetSelectedDay,
  SET_SELECTED_DAY
} from "../../redux/modules/rulePageActionCreators";
import { stylesheet } from "typestyle";

interface IDispatchToProps {
  duplicateRuleAssignments: () => MutationTuple<
    any,
    { start: Date; end: Date; targetStarts: Date[] }
  >;
  deleteRuleAssignments: () => MutationTuple<
    { deleteParkingRuleAssignment: any },
    { start: Date; end: Date }
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

const styles = stylesheet({
  quickActions: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    paddingRight: "1.5em"
  },
  controls: {
    display: "grid",
    width: "18em",
    marginTop: "1em",
    gridTemplateColumns: "repeat(3, auto)",
    gridColumnGap: "0.5em"
  },
  destinations: {
    display: "grid",
    justifyItems: "right",
    gridRowGap: "0.4em",
    $nest: {
      "> div > button": {
        marginLeft: "0.4em"
      }
    }
  }
});

const ParkingRuleAssignmentQuickActions = (props: IProps) => {
  const [copyEffect] = props.duplicateRuleAssignments();
  const [deleteEffect] = props.deleteRuleAssignments();

  const [targets, setTargets] = useState<Date[]>([null]);
  const addTarget = () => {
    setTargets([...targets, null]);
  };
  const deleteTarget = (index: number) => {
    targets.splice(index, 1);
    setTargets([...targets]);
  };

  const clear = () => {
    setTargets([null]);
    props.setSelectedDays(null);
    // Refetch
    props.refetch();
  };
  const copy = (): Promise<any> => {
    let min: number = Number.POSITIVE_INFINITY;
    let max: number = Number.NEGATIVE_INFINITY;
    // O(2)
    Object.keys(props.selectedDays).forEach(sStart => {
      const sEnd = props.selectedDays[sStart];
      min = Math.min(Number(sStart), min);
      max = Math.max(sEnd, max);
    });
    return copyEffect({
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
    });
  };
  const deleteAssignments = (): Promise<any> => {
    let min: number = Number.POSITIVE_INFINITY;
    let max: number = Number.NEGATIVE_INFINITY;
    // O(2)
    Object.keys(props.selectedDays).forEach(sStart => {
      const sEnd = props.selectedDays[sStart];
      min = Math.min(Number(sStart), min);
      max = Math.max(sEnd, max);
    });
    return deleteEffect({
      variables: {
        start: new Date(min),
        end: new Date(max)
      }
    });
  };
  // Could be done by offsetting
  const move = () => {
    copy()
      .then(deleteAssignments)
      .then(clear);
  };

  const copyAndClear = () => copy().then(clear);
  const deleteAssignmentsAndClear = () => deleteAssignments().then(clear);

  const dontCopy = useMemo(
    () =>
      targets.length === 0 ||
      targets.findIndex(t => t === null) !== -1 ||
      Object.keys(props.selectedDays).length === 0,
    [targets, props.selectedDays]
  );
  const dontDelete = Object.keys(props.selectedDays).length === 0;
  return (
    <div>
      <div className={styles.quickActions}>
        <p>Destinations</p>
        <div className={styles.destinations}>
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
          <Button type="positive" small={true} onClick={addTarget}>
            Add More
          </Button>
        </div>
      </div>
      <div className={styles.controls}>
        <Button type="primary" disabled={dontCopy} onClick={copyAndClear}>
          Copy
        </Button>
        <Button type="primary" disabled={dontCopy} onClick={move}>
          Move
        </Button>
        <Button
          type="primary"
          disabled={dontDelete}
          onClick={deleteAssignmentsAndClear}
        >
          Delete
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

    deleteRuleAssignments: () =>
      useMutation(RULE_PAGE_DELETE_RULE_ASSIGNMENTS_MUTATION),
    setSelectedDays: days => dispatch({ type: SET_SELECTED_DAY, payload: days })
  };
};

const connected = connect(
  mapStateToProps,

  mapDispatchToProps
)(ParkingRuleAssignmentQuickActions);

export {
  connected as ParkingRuleAssignmentQuickActions,
  ParkingRuleAssignmentQuickActions as UnconnectedParkingRuleAssignmentQuickActions
};
