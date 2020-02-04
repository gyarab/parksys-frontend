import React from "react";
import { stylesheet, classes } from "typestyle";
import { Color } from "../constants";

const styles = stylesheet({
  status: {
    padding: "5px",
    margin: "0.2em",
    borderRadius: "3px",
    marginTop: "-0.2em",
    marginLeft: "0.5em"
  },
  negative: {
    backgroundColor: Color.LIGHT_RED
  },
  positive: {
    backgroundColor: Color.LIGHT_BLUE
  },
  none: {
    border: `1px solid ${Color.LIGHT_GREY}`
  }
});

export enum FlagType {
  POSITIVE,
  NEGATIVE,
  WARNING,
  NONE
}

interface IProps {
  type: FlagType;
  text: string;
}

const typeToClass = (status: FlagType) => {
  switch (status) {
    case FlagType.NEGATIVE:
      return styles.negative;
    case FlagType.POSITIVE:
      return styles.positive;
    default:
      return styles.none;
  }
};

export const Flag = (props: IProps) => {
  return (
    <span className={classes(typeToClass(props.type), styles.status)}>
      {props.text}
    </span>
  );
};
