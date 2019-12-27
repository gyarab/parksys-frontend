import React, { useState } from "react";
import { useTwoPicker } from "../TwoPicker";
import { useDatePicker } from "../DatePicker";
import { Button } from "../Button";
import { stylesheet } from "typestyle";

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

export const ParkingRuleAssignmentDetails = ({ assignment, close: _close }) => {
  const [startPicker, , setStart] = useDatePicker(new Date(assignment.start));
  const [endPicker, , setEnd] = useDatePicker(new Date(assignment.end));
  const [filterModePicker, , setFilterMode] = useTwoPicker(
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
    setStart(new Date(assignment.start));
    setEnd(new Date(assignment.end));
    setFilterMode(assignment.vehicleFilterMode);
    setPriority(assignment.priority);
  };

  enum SaveStatus {
    NONE = "Save",
    SAVING = "Saving...",
    FAILED = "Failed, try again",
    SUCCEEDED = "Saved"
  }
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.NONE);
  const close = () => {
    if (saveStatus !== SaveStatus.SAVING) _close();
  };
  const save = () => {
    setSaveStatus(SaveStatus.SAVING);
    // Do async work, then close
    setTimeout(() => {
      setSaveStatus(SaveStatus.SUCCEEDED);
      close();
    }, 1500);
  };
  return (
    <div className="details">
      <div className={styles.controls}>
        <Button
          disabled={saveStatus === SaveStatus.SAVING}
          className="close"
          onClick={save}
        >
          {saveStatus}
        </Button>
        <Button className="close" onClick={setOriginalValues}>
          Reset
        </Button>
        <Button className="close" onClick={close}>
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
