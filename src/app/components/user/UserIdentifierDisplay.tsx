import { stylesheet } from "typestyle";
import React from "react";
import { Flag, FlagType } from "../Flag";

const styles = stylesheet({
  userDisplay: {
    margin: "1em 2em 0em auto",
    paddingBottom: "2em",
    $nest: {
      h2: {
        margin: 0,
        marginBottom: "0.3em",
        display: "inline-block"
      },
      h4: {
        margin: 0,
        marginTop: "0.3em"
      }
    }
  }
});

export const UserIdentifierDisplay = props => {
  const { name, email, isAdmin } = props;
  return (
    <section className={styles.userDisplay}>
      <div>
        <h2>{name}</h2>
        {isAdmin ? <Flag text="admin" type={FlagType.POSITIVE} /> : null}
      </div>
      <h4>{email}</h4>
    </section>
  );
};
