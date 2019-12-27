import React, { useState } from "react";
import { stylesheet } from "typestyle";

const dpStyles = stylesheet({
  datePicker: {
    $nest: {
      "input[type=date]": {
        // float: "left",
        marginRight: "5px"
      },
      "input[type=time]": {
        // float: "right"
      }
    }
  }
});

const tPad = (t: number) => t.toString().padStart(2, "0");

export const DatePicker = ({
  value,
  onChange
}: {
  value: Date;
  onChange: (d: Date) => any;
}) => {
  const setDate = (dateValue: Date) => {
    if (dateValue === null) return;
    const newValue = new Date(value); // copy
    newValue.setFullYear(dateValue.getUTCFullYear());
    newValue.setMonth(dateValue.getUTCMonth());
    newValue.setDate(dateValue.getUTCDate());
    onChange(newValue);
  };
  const setTime = (timeValue: Date) => {
    if (timeValue === null) return;
    const newValue = new Date(value); // copy
    newValue.setHours(timeValue.getUTCHours());
    newValue.setMinutes(timeValue.getUTCMinutes());
    newValue.setSeconds(timeValue.getUTCSeconds());
    onChange(newValue);
  };
  return (
    <div className={dpStyles.datePicker}>
      <input
        type="date"
        value={`${value.getFullYear()}-${tPad(value.getMonth() + 1)}-${tPad(
          value.getDate()
        )}`}
        onChange={e => setDate(e.target.valueAsDate)}
      />
      <input
        type="time"
        value={`${tPad(value.getHours())}:${tPad(value.getMinutes())}`}
        onChange={e => setTime(e.target.valueAsDate)}
      />
    </div>
  );
};

export const useDatePicker = (
  date: Date
): [JSX.Element, Date, (date: Date) => void] => {
  const [value, setValue] = useState<Date>(date);
  const render = <DatePicker value={value} onChange={setValue} />;
  return [render, value, setValue];
};
