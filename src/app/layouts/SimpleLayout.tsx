import React from "react";
import { ILayoutProps, LayoutComponent } from "./Layout";
import { stylesheet } from "typestyle";
import { ErrorBoundary } from "../containers/ErrorBoundary";
import { IStore } from "../redux/IStore";
import { connect } from "react-redux";
import { FlagType, Flag } from "../components/Flag";
import { IErrorsState } from "../redux/modules/errorsModule";
import { string } from "prop-types";

// Sidebar src: https://every-layout.dev/layouts/sidebar/
const classNames = stylesheet({
  layout: {
    height: "100%",
    overflow: "hidden",
    $nest: {
      "&>*": {
        display: "flex",
        margin: "-0.5rem",
        $nest: {
          "&>*": {
            margin: "0.5rem",
            marginBottom: 0
          }
        }
      }
    }
  },
  navigationContainer: {
    marginBottom: "-0.5rem",
    flexBasis: "15rem",
    flexGrow: 1,
    height: "100%"
  },
  mainContent: {
    flexBasis: 0,
    flexGrow: 999,
    minWidth: "calc(50% - 1rem)",
    overflowY: "scroll",
    $nest: {
      "& > .spacer": {
        height: "10em"
      }
    },
    paddingTop: "1em"
  },
  wrapper: {
    height: "100%"
  },
  userNavContainer: {
    position: "absolute",
    right: 0,
    top: 0
  }
});

interface IStateToProps extends IErrorsState {}

interface IProps extends IStateToProps, ILayoutProps {}

class SimpleLayout extends LayoutComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }
  render(): JSX.Element {
    const errKeys: Array<keyof IErrorsState> = [
      "networkError",
      "graphQLErrors",
      "pageError"
    ];
    return (
      <div className={classNames.layout}>
        <div className={classNames.wrapper}>
          <div className={classNames.navigationContainer}>
            {this.props.navigation}
          </div>
          <div className={classNames.mainContent}>
            <div>
              {!!this.props.title ? (
                <h2 style={{ display: "inline-block" }}>{this.props.title}</h2>
              ) : null}
              {errKeys.map(key =>
                !this.props[key] ? null : (
                  <Flag
                    text={String(this.props[key])}
                    type={FlagType.NEGATIVE}
                  />
                )
              )}
            </div>
            <ErrorBoundary>{this.props.children}</ErrorBoundary>
            <div className="spacer"></div>
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = (state: Pick<IStore, "errors">): IStateToProps => {
  return { ...state.errors };
};

const connected = connect(stateToProps, null)(SimpleLayout);

export { connected as SimpleLayout, SimpleLayout as UnconnectedSimpleLayout };
