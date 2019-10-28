import React from "react";
import { stylesheet } from "typestyle";

const classNames = stylesheet({
  page: {
    width: "100%",
    $nest: {
      "& > p": {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold"
      }
    }
  }
});

export class BlankPage extends React.Component {
  render(): JSX.Element {
    return (
      <div className={classNames.page}>
        <p>This page is left intentionally blank.</p>
      </div>
    );
  }
}
