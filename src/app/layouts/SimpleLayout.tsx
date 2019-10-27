import React from "react";
import { ILayoutProps, LayoutComponent } from "./Layout";
import { stylesheet } from "typestyle";
import { UserNavigation } from "../components/UserNavigation";

// Sidebar src: https://every-layout.dev/layouts/sidebar/
const classNames = stylesheet({
  layout: {
    height: "100%",
    overflow: "hidden",
    $nest: {
      "&>*": {
        display: "flex",
        flexWrap: "wrap",
        margin: "-0.5rem",
        $nest: {
          "&>*": {
            margin: "0.5rem",
          },
        },
      },
    },
  },
  navigationContainer: {
    marginBottom: "-0.5rem",
    flexBasis: "20rem",
    flexGrow: 1,
  },
  mainContent: {
    flexBasis: 0,
    flexGrow: 999,
    minWidth: "calc(50% - 1rem)",
  },
  wrapper: {
    height: "100%",
  },
});

class SimpleLayout extends LayoutComponent {
  constructor(props: ILayoutProps) {
    super(props);
  }
  render(): JSX.Element {
    return (
      <div className={classNames.layout}>
        <div className={classNames.wrapper}>
          <div className={classNames.navigationContainer}>
            {this.props.navigation}
          </div>
          <div className={classNames.mainContent}>
            {this.props.children}
            <UserNavigation />
          </div>
        </div>
      </div>
    );
  }
}

export { SimpleLayout };
