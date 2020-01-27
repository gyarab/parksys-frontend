import React from "react";

interface IProps {
  options: Array<string>;
  selectedOption: string;
  onChange: (arg: { value: string; name: string }) => void;
  name: string;
}

export const OptionPicker = (props: IProps) => {
  const onChange = e => {
    const value = e.target.value;
    props.onChange({
      name: props.name,
      value
    });
  };
  return (
    <select onChange={onChange} value={props.selectedOption} name={props.name}>
      {props.options.map(opt => (
        <option value={opt}>{opt}</option>
      ))}
    </select>
  );
};
