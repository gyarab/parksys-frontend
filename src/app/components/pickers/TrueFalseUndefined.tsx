import { useState } from "react";

/**
 * Maps labels and true, false, undefined values.
 * @param possibleValues Array of size 3 of desired labels (distinct) for true, false, undefined in this order.
 * @param initial Either undefined or one of the passed labels. Default is undefined.
 */
export function useTrueFalseUndefined<T extends [string, string, string]>(
  possibleValues: T,
  initial = undefined
): [string, boolean | undefined, Function] {
  const [trueName, falseName, emptyName] = possibleValues;
  const mapValue = newValue => {
    if (newValue === trueName) return true;
    else if (newValue === falseName) return false;
    else if (newValue === emptyName || newValue === undefined) return undefined;
  };

  const [internalValue, setInternalValue] = useState(mapValue(initial));

  const returnValue = () => {
    if (internalValue === undefined) return emptyName;
    else if (internalValue) return trueName;
    else return falseName;
  };
  return [
    returnValue(),
    internalValue,
    newValue => setInternalValue(mapValue(newValue))
  ];
}
