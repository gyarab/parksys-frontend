import React from "react";
import { OptionPicker } from "../pickers/OptionPicker";

export interface IValues {
  day?: string;
  vehicleFilterMode?: string;
}

export interface IProps {
  onChange: (values: IValues) => void;
  values?: IValues;
  initialValues?: (values: IValues) => void;
}

export const ParkingRuleAssignmentFilter = (props: IProps) => {
  const onChange = e => {
    const newValues = {
      ...props.values,
      [e.target.name]: e.target.value
    };
    if (e.target.value === "<any>") {
      delete newValues[e.target.name];
    }
    props.onChange(newValues);
  };
  const onSelectorModeChange = ({ value, name }) => {
    onChange({ target: { value, name } });
  };
  console.log(props.values);
  return (
    <div>
      <label>
        Vehicle Selector Mode
        <OptionPicker
          name="vehicleFilterMode"
          options={["ALL", "NONE", "<any>"]}
          selectedOption={props.values.vehicleFilterMode || "<any>"}
          onChange={onSelectorModeChange}
        />
      </label>
      <label>
        Day
        <input
          type="date"
          name="day"
          value={props.values.day.slice(0, 10)}
          onChange={onChange}
        />
      </label>
    </div>
  );
};
