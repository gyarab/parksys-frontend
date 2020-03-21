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

interface IDispatchToProps {
  duplicateRuleAssignments: () => MutationTuple<
    any,
    { start: Date; end: Date; targetStart: Date; options?: { repeat: number } }
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

  const [target, setTarget] = useState<Date>(null);
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
    return copyEffect({
      variables: {
        start: new Date(min),
        end: new Date(max),
        targetStart: target,
        options: { repeat: copyRepeat }
      }
    }).then(result => {
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
      target === null ||
      Object.keys(props.selectedDays).length === 0 ||
      copyRepeat < 1,
    [target, props.selectedDays]
  );
  const dontDelete = Object.keys(props.selectedDays).length === 0;
  return (
    <div>
      <div className={styles.quickActions}>
        <p>Copy Destination</p>
        <input
          type="date"
          value={target !== null ? target.toISOString().slice(0, 10) : ""}
          onChange={e => {
            const value = e.target.value;
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              setTarget(null);
            } else {
              setTarget(date);
            }
          }}
        />
        <p>Copy Repetitions</p>
        <NumberInput
          value={copyRepeat}
          onChange={value => setCopyRepeat(value)}
        />
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
