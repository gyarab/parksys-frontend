import * as React from "react";
import { classes, stylesheet } from "typestyle";
import { Color } from "../constants/Color";

const classNames = stylesheet({
  input: {
    outline: "none",
    padding: "0.4em 0.4em",
    backgroundColor: Color.WHITE,
    color: Color.BLACK,
    borderRadius: "3px",
    borderColor: Color.LIGHT_GREY,
    fontWeight: "bold",
    fontFamily: "Arial"
  },
  disabled: {
    color: Color.WHITE,
    backgroundColor: Color.LIGHT_GREY,
    cursor: "not-allowed"
  },
  text: {},
  password: {}
});

export type TInputType = "text" | "password";

interface IProps extends React.HTMLProps<HTMLInputElement> {
  /**
   * Either primary or secondary
   */
  type?: TInputType;
}

export class Input extends React.Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    type: "text"
  };

  public render(): JSX.Element {
    const { className, disabled, type, value, ...rest } = this.props;
    return (
      <input
        className={classes(
          classNames.input,
          disabled ? classNames.disabled : classNames[type],
          className
        )}
        disabled={disabled}
        value={value}
        type={type}
        {...rest}
      />
    );
  }
}
