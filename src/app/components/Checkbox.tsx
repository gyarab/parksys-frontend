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
    transition: "0.2s all ease-out",
    $nest: {
      "&:hover": {
        border: `3px solid ${Color.BLUE}`
      }
    }
  },
  selected: {
    borderColor: Color.BLUE,
    backgroundColor: Color.BLUE,
    $nest: {
      "&:hover": {
        border: `3px solid ${Color.LIGHT_RED}`,
        backgroundColor: "transparent"
      }
    }
  },
  onHoverUnselectable: {
    borderColor: Color.BLUE,
    backgroundColor: Color.BLUE,
    $nest: {
      "&:hover": {
        border: `3px solid ${Color.BLUE}`,
        backgroundColor: Color.BLUE
      }
    }
  },
  selectedOrange: {
    borderColor: Color.ORANGE,
    backgroundColor: Color.ORANGE,
    $nest: {
      "&:hover": {
        border: `3px solid ${Color.LIGHT_RED}`,
        backgroundColor: "transparent"
      }
    }
  }
});

export interface IProps {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  selected: boolean;
  extraClass?: "selectedOrange" | "onHoverUnselectable";
}

export const Checkbox = (props: IProps) => {
  const cls = classes(
    styles.checkbox,
    props.selected ? styles.selected : null,
    props.extraClass !== null ? styles[props.extraClass] : null
  );
  return <div className={cls} onClick={props.onClick}></div>;
};
