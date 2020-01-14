import React, { useState, useEffect } from "react";
import { useTwoPicker } from "../pickers/TwoPicker";
import { useDatePicker } from "../pickers/DatePicker";
import { Button } from "../Button";
import { stylesheet } from "typestyle";
import { connect } from "react-redux";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import { Dispatch } from "redux";
import {
  RULE_PAGE_UPDATE_RULE_ASSIGNMENT_MUTATION,
  RULE_PAGE_CREATE_RULE_ASSIGNMENT_MUTATION
} from "../../constants/Mutations";
import { SET_COLLIDING_RULE_ASSIGNMENTS } from "../../redux/modules/rulePageActionCreators";
import { useRuleMultiPicker } from "../pickers/RulePicker";
import { useVehicleFilterMultiPicker } from "../pickers/VehicleFilterPicker";

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
  },
  details: {
    position: "absolute",
    top: "2.5em",
    borderRadius: "3px",
    padding: "0.5em",
    minWidth: "23em",
    minHeight: "8em",
    backgroundColor: "white",
    boxShadow: "0px 0px 3px 1px #888",
    cursor: "default"
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
  useCreateRuleAssignment: () => MutationTuple<
    { createParkingRuleAssignment },
    { input: any }
  >;
  setCollidingRuleAssignments: (ids: Array<string>) => void;
}

export interface IProps extends IDispatchToProps {
  assignment: any;
  close: Function;
  onChange?: (assignment: any) => void;
  isNew?: boolean;
}

const compare = <T extends unknown>(a: T, b: T): boolean => {
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) return false;
    return a.every((aObj, i) => compare(aObj, b[i]));
  } else {
    return a === b;
  }
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

const ParkingRuleAssignmentDetails = (props: IProps) => {
  const comparisonAssignment = {
    ...props.assignment,
    rules: props.assignment.rules.map(rule => rule.id),
    vehicleFilters: props.assignment.vehicleFilters.map(filter => filter.id)
  };
  const [isNew] = useState(props.isNew || false);
  const [startPicker, start, setStart] = useDatePicker(props.assignment.start);
  const [endPicker, end, setEnd] = useDatePicker(props.assignment.end);
  const [
    filterModePicker,
    { textValue: filterMode },
    { setTextValue: setFilterMode }
  ] = useTwoPicker("NONE", "ALL", props.assignment.vehicleFilterMode === "ALL");
  const [priority, _setPriority] = useState<string | number>(
    props.assignment.priority
  );
  const setPriority = (value: string) => {
    const numberValue = Number(value);
    if (Number.isInteger(numberValue) && numberValue > 0) {
      _setPriority(numberValue);
    } else if (value.length === 0) {
      _setPriority("");
    }
  };

  const [rulesPicker, rules, setRules] = useRuleMultiPicker({
    initialModels: new Array(...props.assignment.rules)
  });
  const [filtersPicker, filters, setFilters] = useVehicleFilterMultiPicker({
    initialModels: new Array(...props.assignment.vehicleFilters)
  });
  const [
    activePicker,
    { value: active },
    { setValue: setActive }
  ] = useTwoPicker("NO", "YES", props.assignment.active);

  const setOriginalValues = () => {
    setStart(props.assignment.start);
    setEnd(props.assignment.end);
    setFilterMode(props.assignment.vehicleFilterMode);
    setPriority(props.assignment.priority);
    setRules(new Array(...props.assignment.rules));
    setFilters(new Array(...props.assignment.vehicleFilters));
    setActive(props.assignment.active);
  };

  const getUpdatedObject = () => {
    const updated = {
      priority,
      start,
      end,
      vehicleFilterMode: filterMode,
      rules: rules.map(rules => rules.id),
      vehicleFilters: filters.map(filter => filter.id),
      active
    };
    return isNew ? updated : updatedFields(comparisonAssignment, updated);
  };
  const [newAssignment, setNewAssignment] = useState(getUpdatedObject());
  useEffect(() => {
    const updatedObj = getUpdatedObject();
    setNewAssignment(updatedObj);
    if (!!props.onChange && Object.keys(updatedObj).length > 0) {
      props.onChange(updatedObj);
    }
  }, [priority, start, end, filterMode, rules, filters, active]); // ADD ANY NEW FIELDS HERE!

  const [updateEffect] = props.useUpdateRuleAssignment();
  const [createEffect] = props.useCreateRuleAssignment();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.NONE);
  const close = () => {
    if (saveStatus !== SaveStatus.SAVING) props.close();
  };

  const save = () => {
    // Do async work, then close
    if (Object.keys(newAssignment).length === 0) return;
    setSaveStatus(SaveStatus.SAVING);
    console.log(isNew, newAssignment);
    const promise: Promise<any> = isNew
      ? createEffect({
          variables: { input: newAssignment }
        })
      : updateEffect({
          variables: {
            id: props.assignment.id,
            input: newAssignment
          }
        });
    promise
      .then(({ data }) => {
        if (data.result.collisions) {
          props.setCollidingRuleAssignments(
            data.result.collisions.map(collision => collision.id)
          );
          setSaveStatus(SaveStatus.FAILED);
        } else {
          props.setCollidingRuleAssignments([]);
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
    <div className={styles.details}>
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
        <span>Active</span>
        {activePicker}
        <span>Start</span>
        {startPicker}
        <span>End</span>
        {endPicker}
        <span>Priority</span>
        <div>
          <input
            style={{ width: "4em", float: "right" }}
            type="text"
            value={`${priority}`}
            onChange={e => setPriority(e.target.value)}
          />
        </div>
        <span>Filter Mode</span>
        <div className="twoPickerContainer">{filterModePicker}</div>
        <span>Filters</span>
        {filtersPicker}
        <span>Rules</span>
        {rulesPicker}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    useUpdateRuleAssignment: () =>
      useMutation(RULE_PAGE_UPDATE_RULE_ASSIGNMENT_MUTATION),
    useCreateRuleAssignment: () =>
      useMutation(RULE_PAGE_CREATE_RULE_ASSIGNMENT_MUTATION),
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
