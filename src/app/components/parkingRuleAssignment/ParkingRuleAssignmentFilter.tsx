import React from "react";
import { OptionPicker } from "../pickers/OptionPicker";
import { IRulePageState } from "../../redux/modules/rulePageModule";

export interface IValues {
  day?: string;
  vehicleFilterMode?: string;
  range?: "DAY" | "MONTH";
}

export interface IProps {
  onChange: (values: IRulePageState["queryVariables"]) => void;
  values?: IRulePageState["queryVariables"];
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
  const onOptionPickerChange = ({ value, name }) => {
    onChange({ target: { value, name } });
  };
  console.log(props.values);
  return (
    <div>
      <label>
        Day
        <input
          type="date"
          name="date"
          value={props.values.date}
          onChange={e => {
            if (e.target.value === "") return;
            onChange(e);
          }}
        />
      </label>
      <label>
        Day
        <OptionPicker
          name="range"
          options={["DAY", "MONTH"]}
          selectedOption={
            !!props.values.range ? props.values.range.toUpperCase() : "DAY"
          }
          onChange={({ value, name }) =>
            onOptionPickerChange({ name, value: value.toLowerCase() })
          }
        />
      </label>
    </div>
  );
};
