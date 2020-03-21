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
  SET_SELECTED_DAY,
  SetDayTypeBeingSelected,
  SET_DAY_TYPE_BEING_SELECTED,
  CLEAR_TARGET_DAYS,
  CLEAR_SELECTED_DAYS,
  SET_MAX_TARGET_DAYS
} from "../../redux/modules/rulePageActionCreators";
import { stylesheet } from "typestyle";
import { NumberInput } from "../pickers/NumberInput";
import { ERRORS_SET_PAGE_ERROR } from "../../redux/modules/errorsActionCreators";
import { TwoPicker } from "../pickers/TwoPicker";

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
  setPageError: (err: string) => void;
  setDayTypeBeingSelected: (
    t: SetDayTypeBeingSelected["payload"] | any
  ) => void;
  clearTargetDays: () => void;
  clearSelectedDays: () => void;
  setSelectedDays: (days: SetSelectedDay["payload"]) => void;
  setMaxTargetDays: (n: number) => void;
}

interface IStateToProps {
  selectedDays: IRulePageState["selectedDays"];
  daySelectorMode: IRulePageState["daySelectorMode"];
  dayTypeBeingSelected: IRulePageState["dayTypeBeingSelected"];
  targetDays: IRulePageState["targetDays"];
  maxTargetDays: IRulePageState["maxTargetDays"];
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

enum TargetMode {
  MULTI = -1,
  REPEAT = 1
}

const ParkingRuleAssignmentQuickActions = (props: IProps) => {
  const [copyEffect] = props.duplicateRuleAssignments();
  const [deleteEffect] = props.deleteRuleAssignments();

  const targetMode =
    props.maxTargetDays === -1 ? TargetMode.MULTI : TargetMode.REPEAT;
  // const [target, setTarget] = useState<Date>(null);
  // const [targets, setTargets] = useState<Date[]>([null]);

  const setTargetMode = (mode: number) => {
    props.setMaxTargetDays(mode);
    props.clearTargetDays();
  };
  const setDayType = () => {
    if (props.dayTypeBeingSelected === "source") {
      props.setDayTypeBeingSelected("target");
    } else if (props.dayTypeBeingSelected === "target") {
      props.setDayTypeBeingSelected("source");
    }
  };

  const [copyRepeat, setCopyRepeat] = useState(1);
  const clear = () => {
    props.clearSelectedDays();
    props.clearTargetDays();
    props.setDayTypeBeingSelected("source");
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
      options: {
        mode: targetMode === -1 ? "MULTI" : "REPEAT",
        repeat: undefined
      }
    };
    if (targetMode === TargetMode.MULTI) {
      variables.targetStarts = Object.keys(props.targetDays)
        .filter(key => props.targetDays[key] !== null)
        .map(key => {
          const date = new Date(Number(key));
          date.setHours(0, 0, 0, 0);
          return date;
        });
    } else {
      // REPEAT
      const date = new Date(Number(Object.keys(props.targetDays)[0]));
      date.setHours(0, 0, 0, 0);
      variables.targetStarts = [date];
      variables.options.repeat = copyRepeat;
    }
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

  const copyAndClear = () =>
    copy()
      .then(clear)
      .finally(clear);
  const deleteAssignmentsAndClear = () => deleteAssignments().finally(clear);

  // const dontCopy = useMemo(
  //   () =>
  //     (targetMode === "MULTI" &&
  //     (targetMode === "REPEAT" && (target === null || copyRepeat < 1)) ||
  //     Object.keys(props.selectedDays).length === 0,
  //   [target, targets, props.selectedDays, targetMode, copyRepeat]
  // );
  const dontDelete = Object.keys(props.selectedDays).length === 0;
  const dontCopy = dontDelete && Object.keys(props.targetDays).length === 0;
  return (
    <div>
      <div className={styles.quickActions}>
        <div>
          <p>Copy Destination</p>
          <TwoPicker
            optionLeft="MULTI"
            optionRight="REPEAT"
            rightIsSelected={targetMode === TargetMode.REPEAT}
            onChange={value =>
              setTargetMode(
                value === "MULTI" ? TargetMode.MULTI : TargetMode.REPEAT
              )
            }
          />
          <TwoPicker
            optionLeft="SOURCE"
            optionRight="TARGET"
            rightIsSelected={props.dayTypeBeingSelected === "target"}
            onChange={value =>
              props.setDayTypeBeingSelected(value.toLowerCase())
            }
          />
        </div>
        <div className={styles.destinations}>
          {Object.keys(props.targetDays)
            .map(t => new Date(Number(t)))
            .map((target, i) => (
              <div key={`${i}_${target}`}>
                {target.toISOString().slice(0, 10)}
                <Button
                  type="negative"
                  small={true}
                  onClick={() =>
                    props.setSelectedDays([
                      target,
                      new Date(props.targetDays[String(target.getTime())])
                    ])
                  }
                >
                  Delete
                </Button>
              </div>
            ))}
          {targetMode === TargetMode.REPEAT ? (
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
          ) : null}
        </div>
      </div>
      <div className={styles.controls}>
        <Button type="primary" disabled={dontCopy} onClick={copyAndClear}>
          Copy
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
    daySelectorMode: state.rulePage.daySelectorMode,
    dayTypeBeingSelected: state.rulePage.dayTypeBeingSelected,
    targetDays: state.rulePage.targetDays,
    maxTargetDays: state.rulePage.maxTargetDays
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    duplicateRuleAssignments: () =>
      useMutation(RULE_PAGE_COPY_RULE_ASSIGNMENTS_MUTATION),
    deleteRuleAssignments: () =>
      useMutation(RULE_PAGE_DELETE_RULE_ASSIGNMENTS_MUTATION),
    setPageError: payload => dispatch({ type: ERRORS_SET_PAGE_ERROR, payload }),
    setDayTypeBeingSelected: payload =>
      dispatch({ type: SET_DAY_TYPE_BEING_SELECTED, payload }),
    clearTargetDays: () => dispatch({ type: CLEAR_TARGET_DAYS, payload: null }),
    clearSelectedDays: () =>
      dispatch({ type: CLEAR_SELECTED_DAYS, payload: null }),
    setSelectedDays: days =>
      dispatch({ type: SET_SELECTED_DAY, payload: days }),
    setMaxTargetDays: n => dispatch({ type: SET_MAX_TARGET_DAYS, payload: n })
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
