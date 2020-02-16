import { stylesheet } from "typestyle";
import React from "react";

const styles = stylesheet({
  userSections: {
    $nest: {
      "section + section": {
        marginTop: "2em"
      }
    }
  }
});

export const UserSections = ({ children }) => {
  return <div className={styles.userSections}>{children}</div>;
};
