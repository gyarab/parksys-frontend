import React, { useState } from "react";
import { stylesheet } from "typestyle";

const dpStyles = stylesheet({
  datePicker: {
    $nest: {
      "input[type=date]": {
        float: "left",
        marginRight: "5px"
      },
      "input[type=time]": {
        float: "right"
      }
    }
  }
});

export const useDatePicker = (date: Date) => {
  const [value, setValue] = useState(date);
  const setDate = (dateValue: Date) => {
    if (dateValue === null) return;
    const newValue = new Date(value);
    newValue.setFullYear(dateValue.getUTCFullYear());
    newValue.setMonth(dateValue.getUTCMonth());
    newValue.setDate(dateValue.getUTCDate());
    setValue(newValue);
  };
  const setTime = (timeValue: Date) => {
    if (timeValue === null) return;
    const newValue = new Date(value);
    newValue.setHours(timeValue.getUTCHours());
    newValue.setMinutes(timeValue.getUTCMinutes());
    newValue.setSeconds(timeValue.getUTCSeconds());
    setValue(newValue);
  };
  const tPad = (t: number) => t.toString().padStart(2, "0");
  const render = (
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
  return [render, value, setValue];
};
