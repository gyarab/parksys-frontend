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
  if (start != null && end != null) {
    const startPrefix = start.slice(0, 10);
    const endPrefix = start.slice(0, 10);
    if (startPrefix === endPrefix) {
      return [start.slice(0, 16), end.slice(11, 16)];
    }
  } else if (start != null) {
    return [start.slice(0, 16), end];
  } else {
    return [start, end.slice(0, 16)];
  }
};
