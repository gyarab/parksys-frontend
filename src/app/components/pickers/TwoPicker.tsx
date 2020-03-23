import React, { useState } from "react";
import { Color } from "../../constants";
import { stylesheet, classes } from "typestyle";

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
  rightIsSelected,
  onChange,
  disabled = false,
  bothPositive = false
}: {
  optionLeft: string;
  optionRight: string;
  rightIsSelected: boolean;
  onChange: (value: string) => any;
  disabled?: boolean;
  bothPositive?: boolean;
}) => {
  return (
    <div className={tpStyles.twoPicker}>
      <div
        className={!rightIsSelected && !disabled ? "left selected" : "left"}
        style={{
          backgroundColor:
            bothPositive && !rightIsSelected ? Color.AQUAMARINE : ""
        }}
        onClick={() => onChange(optionLeft)}
      >
        {optionLeft}
      </div>
      <div
        className={rightIsSelected && !disabled ? "right selected" : "right"}
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
  rightIsInitial: boolean = true
): [
  JSX.Element,
  { textValue: string; value: boolean },
  { setTextValue: (text: string) => void; setValue: (value: boolean) => void }
] => {
  const [selectedValue, setTextValue] = useState<string>(
    rightIsInitial ? optionRight : optionLeft
  );
  const setValue = (value: boolean) => {
    if (value) {
      setTextValue(optionRight);
    } else {
      setTextValue(optionLeft);
    }
  };
  const rightIsSelected = selectedValue === optionRight;
  const render = (
    <TwoPicker
      optionLeft={optionLeft}
      optionRight={optionRight}
      rightIsSelected={rightIsSelected}
      onChange={setTextValue}
    />
  );
  return [
    render,
    { textValue: selectedValue, value: selectedValue === optionRight },
    { setTextValue, setValue }
  ];
};
