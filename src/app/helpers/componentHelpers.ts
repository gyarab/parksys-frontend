import React from "react";

export function getInputValue(
  handler: (value: any) => any
): (e: React.ChangeEvent<HTMLInputElement>) => void {
  return (e: React.ChangeEvent<HTMLInputElement>) => handler(e.target.value);
}

export const dateDisplay = (
  start: string | null,
  end: string | null
): [string, string] => {
  console.log(start, end);

  if (start != null && end != null) {
    const sDate = new Date(start);
    const eDate = new Date(end);
    console.log(sDate, eDate);
    if (sDate.toLocaleDateString() === eDate.toLocaleDateString()) {
      return [eDate.toLocaleString(), eDate.toLocaleTimeString()];
    }
  } else if (start != null) {
    return [new Date(start).toLocaleString(), end];
  } else {
    return [start, new Date(end).toLocaleString()];
  }
};
