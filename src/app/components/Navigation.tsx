import React from "react";
import { stylesheet } from "typestyle";

const classNames = stylesheet({
  nav: {
    padding: "1em",
    width: "100%",
    height: "100%",
    backgroundColor: "#37323D",
    $nest: {
      ul: {
        listStyleType: "none",
      },
    },
  },
  activeLink: {
    textDecoration: "underline",
  },
});

class Navigation extends React.Component {
  render(): JSX.Element {
    return (
      <nav className={classNames.nav}>
        <ul>
          <li>
            Content
          </li>
        </ul>
      </nav>
    );
  }
}

export {Navigation};
