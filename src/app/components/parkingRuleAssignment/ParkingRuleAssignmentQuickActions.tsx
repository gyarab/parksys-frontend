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
import { NumberInput } from "../pickers/NumberInput";
import { ERRORS_SET_PAGE_ERROR } from "../../redux/modules/errorsActionCreators";
import { TwoPicker } from "../pickers/TwoPicker";
import moment from "moment";

interface IDispatchToProps {
  duplicateRuleAssignments: () => MutationTuple<
    any,
    {
      start: Date;
      end: Date;
      targetStarts: Date[];
      options?: { repeat?: number; mode: string };
    }
  >;
  deleteRuleAssignments: () => MutationTuple<
    { deleteParkingRuleAssignment: any },
    { start: Date; end: Date }
  >;
  setSelectedDays: (days: SetSelectedDay["payload"]) => void;
  setPageError: (err: string) => void;
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
    alignItems: "bottom",
    gridRowGap: "0.4em",
    minHeight: "6em",
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

  const [targetMode, setTargetMode] = useState("MULTI");
  const [target, setTarget] = useState<Date>(null);
  const [targets, setTargets] = useState<Date[]>([null]);

  const addTarget = () => {
    setTargets([...targets, null]);
  };
  const deleteTarget = (index: number) => {
    targets.splice(index, 1);
    setTargets([...targets]);
  };

  const [copyRepeat, setCopyRepeat] = useState(1);
  const clear = () => {
    setTarget(null);
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
    const variables = {
      start: new Date(min),
      end: new Date(max),
      targetStarts: undefined,
      options: { mode: targetMode, repeat: undefined }
    };
    if (targetMode === "MULTI") {
      variables.targetStarts = targets
        .filter(t => t !== null)
        .map(t => {
          t.setHours(0, 0, 0, 0);
          return t;
        });
    } else {
      // REPEAT
      variables.targetStarts = [target];
      variables.options.repeat = copyRepeat;
    }
    console.log(variables);
    return copyEffect({ variables }).then(result => {
      const data = result.data.duplicateParkingRuleAssignments;
      if (data.__typename === "ParkingRuleAssignmentResultError") {
        const joinedCollisions = data.collisions
          .map(coll => coll.start.slice(0, 10))
          .join(", ");
        props.setPageError(`There are collisions on ${joinedCollisions}`);
      } else {
        props.setPageError(null);
      }
      return result;
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
        start: new Date(min - 1), // Ugly yet functional fix
        end: new Date(max + 1)
      }
    }).then(v => {
      props.setPageError(null);
      return v;
    });
  };
  // Could be done by offsetting
  const move = () => {
    copy()
      .then(deleteAssignments)
      .finally(clear);
  };

  const copyAndClear = () =>
    copy()
      .then(clear)
      .finally(clear);
  const deleteAssignmentsAndClear = () => deleteAssignments().finally(clear);

  const dontCopy = useMemo(
    () =>
      (targetMode === "MULTI" &&
        (targets.every(t => t === null) || targets.length === 0)) ||
      (targetMode === "REPEAT" && (target === null || copyRepeat < 1)) ||
      Object.keys(props.selectedDays).length === 0,
    [target, targets, props.selectedDays, targetMode, copyRepeat]
  );
  const dontDelete = Object.keys(props.selectedDays).length === 0;
  return (
    <div>
      <div className={styles.quickActions}>
        <div>
          <p>Copy Destination</p>
          <TwoPicker
            optionLeft="MULTI"
            optionRight="REPEAT"
            rightIsSelected={targetMode === "REPEAT"}
            onChange={value => setTargetMode(value)}
          />
        </div>
        <div className={styles.destinations}>
          {targetMode === "MULTI" ? (
            <>
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
            </>
          ) : (
            <>
              <div
                style={{
                  marginTop: "1.1em",
                  marginBottom: "-1.1em"
                }}
              >
                <input
                  type="date"
                  value={
                    target !== null ? target.toISOString().slice(0, 10) : ""
                  }
                  onChange={e => {
                    const value = e.target.value;
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                      setTarget(null);
                    } else {
                      setTarget(
                        moment(value)
                          .startOf("day")
                          .toDate()
                      );
                    }
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridColumnGap: "0.5em",
                  alignItems: "center",
                  gridTemplateColumns: "auto 5em"
                }}
              >
                <span>Copy Repetitions</span>
                <NumberInput
                  value={copyRepeat}
                  onChange={value => setCopyRepeat(value)}
                />
              </div>
            </>
          )}
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
    setSelectedDays: days =>
      dispatch({ type: SET_SELECTED_DAY, payload: days }),
    setPageError: err => dispatch({ type: ERRORS_SET_PAGE_ERROR, payload: err })
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
