import React, { useState } from "react";
import { Color } from "../constants";
import { stylesheet } from "typestyle";

const r = "5px";
const tpStyles = stylesheet({
  twoPicker: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    width: "5.5em",
    $nest: {
      ".left": {
        borderTopLeftRadius: r,
        borderBottomLeftRadius: r,
        textAlign: "left",
        borderRight: "2px solid black"
      },
      ".left.selected": {
        backgroundColor: Color.LIGHT_RED
      },
      ".right": {
        borderTopRightRadius: r,
        borderBottomRightRadius: r,
        textAlign: "right"
      },
      ".right.selected": {
        backgroundColor: Color.AQUAMARINE
      },
      ".selected": {
        color: Color.BLACK
      },
      div: {
        backgroundColor: Color.LIGHT_GREY,
        color: Color.GREY,
        padding: "0.4em 0.4em 0.3em 0.4em"
      }
    }
  }
});

export const useTwoPicker = (
  optionLeft: string,
  optionRight: string,
  leftIsInitial: boolean = true
) => {
  const [selectedValue, setSelectedValue] = useState(
    leftIsInitial ? optionLeft : optionRight
  );
  const leftIsSelected = selectedValue === optionLeft;
  const render = (
    <div className={tpStyles.twoPicker}>
      <div
        className={leftIsSelected ? "left selected" : "left"}
        onClick={() => setSelectedValue(optionLeft)}
      >
        {optionLeft}
      </div>
      <div
        className={!leftIsSelected ? "right selected" : "right"}
        onClick={() => setSelectedValue(optionRight)}
      >
        {optionRight}
      </div>
    </div>
  );
  return [render, selectedValue, setSelectedValue];
};
