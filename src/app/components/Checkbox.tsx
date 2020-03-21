import React from "react";
import { classes, stylesheet } from "typestyle";
import { Color } from "../constants";

const styles = stylesheet({
  checkbox: {
    border: `2px solid ${Color.LIGHT_GREY}`,
    borderRadius: "2px",
    marginRight: "0.3em",
    float: "right",
    width: "1.2em",
    height: "1.2em",
    transition: "0.2s border-color ease-out",
    $nest: {
      "&:hover": {
        border: `3px solid ${Color.BLUE}`
      }
    }
  },
  selected: {
    width: 0,
    height: 0,
    borderWidth: "0.6em",
    borderColor: Color.BLUE,
    $nest: {
      "&:hover": {
        width: "1.2em",
        height: "1.2em",
        borderColor: Color.LIGHT_RED,
        backgroundColor: "transparent"
      }
    }
  }
});

export interface IProps {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  selected: boolean;
  extraClass?: string;
}

export const Checkbox = (props: IProps) => {
  const cls = classes(
    styles.checkbox,
    props.selected ? styles.selected : null,
    props.extraClass
  );
  return <div className={cls} onClick={props.onClick}></div>;
};
