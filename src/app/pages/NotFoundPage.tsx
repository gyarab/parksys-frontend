import React from "react";

interface IProps {
  message: string;
}

class NotFoundPage extends React.Component<IProps> {
  render(): JSX.Element {
    return <div>404: {this.props.message}</div>;
  }
}

export {NotFoundPage};
