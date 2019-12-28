import React, { useState, useEffect } from "react";
import { useTwoPicker } from "../pickers/TwoPicker";
import { useDatePicker } from "../pickers/DatePicker";
import { Button } from "../Button";
import { stylesheet } from "typestyle";
import { connect } from "react-redux";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import { Dispatch } from "redux";
import { RULE_PAGE_UPDATE_RULE_ASSIGNMENT_MUTATION } from "../../constants/Mutations";
import { SET_COLLIDING_RULE_ASSIGNMENTS } from "../../redux/modules/rulePageActionCreators";

const styles = stylesheet({
  options: {
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    gridGap: "0.3em 0.4em",
    alignItems: "center",
    $nest: {
      ".twoPickerContainer": {
        marginRight: "0.65em",
        $nest: {
          "> div": {
            float: "right"
          }
        }
      }
    }
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridColumnGap: "0.3em",
    marginBottom: "0.5em",
    $nest: {
      button: {
        maxHeight: "3em"
      }
    }
  }
});

enum SaveStatus {
  NONE = "Save",
  SAVING = "Saving...",
  FAILED = "Failed, try again",
  SUCCEEDED = "Saved"
}

export interface IDispatchToProps {
  useUpdateRuleAssignment: () => MutationTuple<
    { updateParkingRuleAssignment: any },
    { id: string; input: any }
  >;
  setCollidingRuleAssignments: (ids: Array<string>) => void;
}

export interface IProps extends IDispatchToProps {
  assignment: any;
  close: Function;
}

const compare = <T extends unknown>(a: T, b: T) => {
  return a === b;
};

const updatedFields = (original, update) => {
  const updatedFields = {};
  for (const key of Object.keys(update)) {
    if (original[key] !== undefined && !compare(update[key], original[key])) {
      updatedFields[key] = update[key];
    }
  }
  return updatedFields;
};

const ParkingRuleAssignmentDetails = ({
  assignment,
  close: _close,
  useUpdateRuleAssignment,
  setCollidingRuleAssignments
}: IProps) => {
  const [startPicker, start, setStart] = useDatePicker(assignment.start);
  const [endPicker, end, setEnd] = useDatePicker(assignment.end);
  const [filterModePicker, filterMode, setFilterMode] = useTwoPicker(
    "NONE",
    "ALL",
    assignment.vehicleFilterMode === "NONE"
  );
  const [priority, _setPriority] = useState<string | number>(
    assignment.priority
  );
  const setPriority = (value: string) => {
    const numberValue = Number(value);
    if (Number.isInteger(numberValue) && numberValue > 0) {
      _setPriority(numberValue);
    } else if (value.length === 0) {
      _setPriority("");
    }
  };

  const setOriginalValues = () => {
    setStart(assignment.start);
    setEnd(assignment.end);
    setFilterMode(assignment.vehicleFilterMode);
    setPriority(assignment.priority);
  };

  const getUpdatedObject = () => {
    return {
      priority,
      start,
      end,
      vehicleFilterMode: filterMode
    };
  };
  const [newAssignment, setNewAssignment] = useState(
    updatedFields(assignment, getUpdatedObject())
  );
  useEffect(() => {
    setNewAssignment(updatedFields(assignment, getUpdatedObject()));
  }, [priority, start, end, filterMode]);

  const [saveEffect] = useUpdateRuleAssignment();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.NONE);
  const close = () => {
    if (saveStatus !== SaveStatus.SAVING) _close();
  };
  const save = () => {
    // Do async work, then close
    if (Object.keys(newAssignment).length === 0) return;
    setSaveStatus(SaveStatus.SAVING);
    saveEffect({
      variables: {
        id: assignment.id,
        input: newAssignment
      }
    })
      .then(({ data }) => {
        if (data.updateParkingRuleAssignment.collisions) {
          setCollidingRuleAssignments(
            data.updateParkingRuleAssignment.collisions.map(
              collision => collision.id
            )
          );
          setSaveStatus(SaveStatus.FAILED);
        } else {
          setCollidingRuleAssignments([]);
          setSaveStatus(SaveStatus.SUCCEEDED);
          close();
        }
      })
      .catch(err => {
        console.log(err);
        setSaveStatus(SaveStatus.FAILED);
      });
  };
  return (
    <div className="details">
      <div className={styles.controls}>
        <Button
          disabled={
            saveStatus === SaveStatus.SAVING ||
            Object.keys(newAssignment).length === 0
          }
          onClick={save}
          type="positive"
        >
          {saveStatus}
        </Button>
        <Button onClick={setOriginalValues}>Reset</Button>
        <Button type="negative" onClick={close}>
          Close
        </Button>
      </div>
      <div className={styles.options}>
        <span>Start</span>
        {startPicker}
        <span>End</span>
        {endPicker}
        <span>Filter Mode</span>
        <div className="twoPickerContainer">{filterModePicker}</div>
        <span>Priority</span>
        <div>
          <input
            style={{ width: "4em", float: "right" }}
            type="text"
            value={`${priority}`}
            onChange={e => setPriority(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    useUpdateRuleAssignment: () =>
      useMutation(RULE_PAGE_UPDATE_RULE_ASSIGNMENT_MUTATION),
    setCollidingRuleAssignments: ids =>
      dispatch({
        type: SET_COLLIDING_RULE_ASSIGNMENTS,
        payload: { collidingRuleAssignments: ids }
      })
  };
};

const connected = connect(
  null,
  mapDispatchToProps
)(ParkingRuleAssignmentDetails);

export {
  ParkingRuleAssignmentDetails as UnconnectedParkingRuleAssignmentDetails,
  connected as ParkingRuleAssignmentDetails
};
