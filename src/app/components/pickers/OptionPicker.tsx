import React from "react";

enum _EMPTY {
  EMPTY
}
export const EMPTY = _EMPTY.EMPTY;
const emptyStr = "```";

interface IProps<T extends _EMPTY | string = _EMPTY | string> {
  options: Array<T>;
  selectedOption: T;
  onChange: (arg: { value: T; name: string }) => void;
  name: string;
  emptyLabel?: string;
}

export const OptionPicker = (props: IProps) => {
  const emptyLabel = !props.emptyLabel ? "<empty>" : props.emptyLabel;
  const onChange = e => {
    const value = e.target.value;
    props.onChange({
      name: props.name,
      value: value === emptyStr ? EMPTY : value
    });
  };
  return (
    <select onChange={onChange} value={props.selectedOption} name={props.name}>
      {props.options.map(opt => (
        <option value={opt === EMPTY ? "```" : opt}>
          {opt === EMPTY ? emptyLabel : opt}
        </option>
      ))}
    </select>
  );
};
