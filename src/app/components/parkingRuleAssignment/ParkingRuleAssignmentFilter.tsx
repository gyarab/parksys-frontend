import React from "react";

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

const undefinedStr = "```";

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
    if (e.target.value === undefinedStr) {
      delete newValues[e.target.name];
    }
    props.onChange(newValues);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>
          Vehicle Selector Mode
          <select
            onChange={onChange}
            name="vehicleSelectorMode"
            value={props.values.vehicleSelectorMode}
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
            value={props.values.day.slice(0, 10)}
            onChange={onChange}
          />
        </label>
        <input type="submit" value="Apply" />
      </form>
    </div>
  );
};
