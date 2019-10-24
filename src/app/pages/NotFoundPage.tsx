import React from "react";
import { stylesheet } from "typestyle";

const classNames = stylesheet({
  page: {
    width: "100%",
    $nest: {
      "& > p": {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
      },
    },
  },
});

interface IProps {
  message?: string;
}

class NotFoundPage extends React.Component<IProps> {
  render(): JSX.Element {
    return (
      <div className={classNames.page}>
        {this.props.message ? 
          <p>404 NOT FOUND: {this.props.message}</p> :
          <p>404 NOT FOUND</p>}
      </div>
    );
  }
}

export {NotFoundPage};
