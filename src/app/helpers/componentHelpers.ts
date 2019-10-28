import React from "react";

export function getInputValue(
  handler: (value: any) => any
): (e: React.ChangeEvent<HTMLInputElement>) => void {
  return (e: React.ChangeEvent<HTMLInputElement>) => handler(e.target.value);
}
