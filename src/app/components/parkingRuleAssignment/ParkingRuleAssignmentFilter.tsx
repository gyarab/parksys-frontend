import React from "react";
import { OptionPicker, EMPTY } from "../pickers/OptionPicker";

export interface IValues {
  day?: string;
  vehicleSelectorMode?: string;
}

export interface IProps {
  onChange: (values: IValues) => void;
  onSubmit: (values: IValues) => void;
  values?: IValues;
  initialValues?: (values: IValues) => void;
}

export const ParkingRuleAssignmentFilter = (props: IProps) => {
  const onSubmit = e => {
    e.preventDefault();
    props.onSubmit({ ...props.values });
  };
  const onChange = e => {
    const newValues = {
      ...props.values,
      [e.target.name]: e.target.value
    };
    if (e.target.value === EMPTY) {
      delete newValues[e.target.name];
    }
    props.onChange(newValues);
  };
  const onSelectorModeChange = ({ value, name }) => {
    onChange({ target: { value, name } });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>
          Vehicle Selector Mode
          <OptionPicker
            name="vehicleSelectorMode"
            options={["ALL", "NONE", EMPTY]}
            selectedOption={props.values.vehicleSelectorMode}
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
        <input type="submit" value="Apply" />
      </form>
    </div>
  );
};
