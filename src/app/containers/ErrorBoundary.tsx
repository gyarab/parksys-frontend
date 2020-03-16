import React from "react";
import { Color } from "../constants/Color";

interface State {
  hasError: boolean;
  error: any;
}

// https://reactjs.org/docs/error-boundaries.html
export class ErrorBoundary extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <div
        style={{
          color: "black",
          backgroundColor: Color.LIGHT_RED,
          padding: "2em",
          width: "auto"
        }}
      >
        <h3>Something went wrong.</h3>
        <span>{String(this.state.error)}</span>
      </div>
    );
  }
}
