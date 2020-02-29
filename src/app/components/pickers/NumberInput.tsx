import React, { useState } from "react";

const filterValue = newValue => {
  const numberValue = Number(newValue);
  if (Number.isInteger(numberValue) && numberValue > 0) {
    return numberValue;
  } else if (newValue.length === 0) {
    return 0;
  }
};

export const NumberInput = props => {
  const { value, onChange } = props;
  return (
    <input
      {...props}
      type="number"
      value={`${value || 0}`}
      onChange={e => onChange(filterValue(e.target.value))}
    />
  );
};

export const useNumberInput = (
  initial?: number | string,
  min?: number,
  max?: number
): [JSX.Element, string | number, (newValue: number | string) => void] => {
  const [value, _setValue] = useState<string | number>(initial || 0);
  return [
    <NumberInput
      value={value}
      onChange={v => _setValue(v)}
      max={max}
      min={min}
    />,
    value,
    filterValue
  ];
};
