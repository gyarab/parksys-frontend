import {createAction} from "typesafe-actions";

export const increment = createAction("COUNTER/INCREMENT", (resolve) => {
  return (by: number = 1) => resolve({by});
});

export const decrement = createAction("COUNTER/DECREMENT", (resolve) => {
  return () => resolve();
});
