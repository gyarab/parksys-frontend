import React, { useState } from "react";

export interface IValues {
  day?: string;
  vehicleSelectorMode?: string;
}

export interface IProps {
  onChange: (values: IValues) => void;
  onSubmit: (values: IValues) => void;
  values?: IValues;
}

const undefinedStr = "```";

export const ParkingRuleAssignmentFilter = (props: IProps) => {
  const [values, setValues] = useState<IValues>(props.values || {});

  const onSubmit = e => {
    e.preventDefault();
    props.onSubmit(values);
  };
  const onChange = e => {
    const newValues = {
      ...values,
      [e.target.name]: e.target.value
    };
    if (e.target.value === undefinedStr) {
      delete newValues[e.target.name];
    }
    setValues(newValues);
    props.onChange(newValues);
    props.onSubmit(newValues);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>
          Vehicle Selector Mode
          <select
            onChange={onChange}
            name="vehicleSelectorMode"
            value={values.vehicleSelectorMode}
          >
            <option value={undefinedStr}>-</option>
            <option value="ALL">ALL</option>
            <option value="NONE">NONE</option>
          </select>
        </label>
        <label>
          Day
          <input
            type="date"
            name="day"
            value={values.day.slice(0, 10)}
            onChange={onChange}
          />
        </label>
        <input type="submit" value="Apply" />
      </form>
    </div>
  );
};
