import React from "react";
import { OptionPicker } from "../pickers/OptionPicker";
import { IRulePageState } from "../../redux/modules/rulePageModule";
import { TwoPicker } from "../pickers/TwoPicker";
import { stylesheet } from "typestyle";

export interface IValues {
  day?: string;
  vehicleFilterMode?: string;
  range?: "DAY" | "MONTH";
}

export interface IProps {
  onChange: (values: IRulePageState["queryVariables"]) => void;
  values?: IRulePageState["queryVariables"];
}

const styles = stylesheet({
  praFilter: {
    display: "grid",
    gridTemplateColumns: "repeat(3, auto auto)",
    gridColumnGap: "0.4em",
    alignItems: "center"
  }
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
  return (
    <div className={styles.praFilter}>
      <span>Range</span>
      <div style={{ marginRight: "3em" }}>
        <TwoPicker
          bothPositive={true}
          optionLeft={"DAY"}
          optionRight={"MONTH"}
          rightIsSelected={props.values.range === "month"}
          onChange={value =>
            onOptionPickerChange({ name: "range", value: value.toLowerCase() })
          }
        />
      </div>
      <span>Select {capitalize(props.values.range)}</span>
      <input
        type="date"
        name="date"
        value={props.values.date}
        onChange={e => {
          if (e.target.value === "") return;
          onChange(e);
        }}
      />
    </div>
  );
};
