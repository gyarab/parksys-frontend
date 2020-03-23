import * as React from "react";
import { classes, stylesheet } from "typestyle";
import { Color } from "../constants/Color";

const classNames = stylesheet({
  button: {
    outline: "none",
    padding: "10px 25px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    textAlign: "center"
  },
  disabled: {
    backgroundColor: Color.LIGHT_GREY,
    color: Color.BLACK,
    cursor: "not-allowed"
  },
  primary: {
    backgroundColor: Color.BLUE,
    color: Color.BLACK,
    $nest: {
      "&:hover": {
        backgroundColor: Color.LBLUE
      }
    }
  },
  secondary: {
    backgroundColor: Color.WHITE,
    color: Color.BLACK
  },
  negative: {
    backgroundColor: Color.LIGHT_RED,
    color: Color.BLACK,
    $nest: {
      "&:hover": {
        backgroundColor: Color.LRED
      }
    }
  },
  positive: {
    backgroundColor: Color.AQUAMARINE,
    color: Color.BLACK,
    $nest: {
      "&:hover": {
        backgroundColor: Color.LIGHT_BLUE
      }
    }
  },
  small: {
    padding: "10px 12px"
  }
});

export type TButtonType = "primary" | "secondary" | "negative" | "positive";

interface IProps extends React.HTMLProps<HTMLButtonElement> {
  type?: TButtonType;
  small?: boolean;
}

export class Button extends React.Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    type: "primary"
  };

  public render(): JSX.Element {
    const { children, className, disabled, type, ...rest } = this.props;
    return (
      <button
        className={classes(
          classNames.button,
          disabled ? classNames.disabled : classNames[type],
          className,
          !!this.props.small ? classNames.small : null
        )}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
}
