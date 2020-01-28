import React, { useState } from "react";

const filterValue = newValue => {
  const numberValue = Number(newValue);
  if (Number.isInteger(numberValue) && numberValue > 0) {
    return numberValue;
  } else if (newValue.length === 0) {
    return "";
  }
};

export const NumberInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={`${value || 0}`}
      onChange={e => onChange(filterValue(e.target.value))}
    />
  );
};

export const useNumberInput = (
  initial?: number | string
): [JSX.Element, string | number, (newValue: number | string) => void] => {
  const [value, _setValue] = useState<string | number>(initial || 0);
  return [
    <NumberInput value={value} onChange={v => _setValue(v)} />,
    value,
    filterValue
  ];
};
