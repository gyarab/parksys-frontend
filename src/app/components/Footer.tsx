import { stylesheet } from "typestyle";
import React from "react";
import {Copyright} from "../constants/Copyright";
import { Color } from "../constants";

const classNames = stylesheet({
  footer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: Color.GREY,
    width: "100%",
    padding: "0.6em",
    textAlign: "center",
    $nest: {
      "& p": {
        paddingTop: "0.3em",
        paddingBottom: "0.3em",
        fontFamily: "Arial",
        fontSize: "0.9em",
        color: Color.WHITE,
        margin: "auto",
      },
    },
  },
});

// Just renders constants from /src/app/constants/Copyright.ts
class Footer extends React.Component {
  render(): JSX.Element {
    return (
      <footer className={classNames.footer}>
        <p>
          &copy; {Copyright.NAME} &lt;{Copyright.EMAIL}&gt;
        </p>
      </footer>
    );
  }
}

export {Footer};
