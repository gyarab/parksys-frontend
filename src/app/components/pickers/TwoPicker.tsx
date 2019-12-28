import React, { useState } from "react";
import { Color } from "../../constants";
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

export const TwoPicker = ({
  optionLeft,
  optionRight,
  leftIsSelected,
  onChange,
  disabled = false
}: {
  optionLeft: string;
  optionRight: string;
  leftIsSelected: boolean;
  onChange: (value: string) => any;
  disabled?: boolean;
}) => {
  return (
    <div className={tpStyles.twoPicker}>
      <div
        className={leftIsSelected && !disabled ? "left selected" : "left"}
        onClick={() => onChange(optionLeft)}
      >
        {optionLeft}
      </div>
      <div
        className={!leftIsSelected && !disabled ? "right selected" : "right"}
        onClick={() => onChange(optionRight)}
      >
        {optionRight}
      </div>
    </div>
  );
};

export const useTwoPicker = (
  optionLeft: string,
  optionRight: string,
  leftIsInitial: boolean = true
): [JSX.Element, string, (v: string) => void] => {
  const [selectedValue, setSelectedValue] = useState<string>(
    leftIsInitial ? optionLeft : optionRight
  );
  const leftIsSelected = selectedValue === optionLeft;
  const render = (
    <TwoPicker
      optionLeft={optionLeft}
      optionRight={optionRight}
      leftIsSelected={leftIsSelected}
      onChange={setSelectedValue}
    />
  );
  return [render, selectedValue, setSelectedValue];
};
