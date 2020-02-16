import { stylesheet, classes } from "typestyle";
import React from "react";
import { Flag, FlagType } from "../Flag";
import { Color } from "../../constants";

export interface SectionMessage {
  status: FlagType;
  message: string;
}

const styles = stylesheet({
  userSection: {
    padding: "0",
    $nest: {
      h2: {
        marginTop: 0,
        display: "inline-block"
      }
    }
  },
  alert: {
    paddingLeft: "1em",
    borderLeft: `5px solid ${Color.LIGHT_RED}`
  }
});

export const UserSection = (props: {
  title: string;
  children?: any;
  alert?: boolean;
  message?: SectionMessage;
}) => {
  const alert = props.alert || false;
  return (
    <section className={classes(styles.userSection, alert && styles.alert)}>
      <a href={`#${props.title.toLowerCase()}`} />
      <div>
        <h2>{props.title}</h2>
        {!!props.message ? (
          <Flag text={props.message.message} type={props.message.status} />
        ) : null}
      </div>
      {props.children}
    </section>
  );
};
