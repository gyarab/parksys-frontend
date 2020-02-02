import React from "react";
import { stylesheet } from "typestyle";
import { Color } from "../constants";

interface IProps {
  day: string;
}

const styles = stylesheet({
  sections: {
    display: "flex"
  },
  section: {
    border: `1px solid ${Color.LIGHT_GREY}`,
    marginTop: "1em",
    padding: "0.5em",
    borderRadius: "3px",
    minWidth: "20em",
    minHeight: "15em",
    $nest: {
      "> h3": {
        margin: "8px 0 14px 0"
      }
    }
  }
});

const Section = ({ title, children }) => {
  return (
    <div className={styles.section}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export const DayStatsDetails = (props: IProps) => {
  return (
    <div>
      <span>
        Selected day: <b>{props.day}</b>
      </span>
      <div className={styles.sections}>
        <Section title={"Per Hour"}>...graph</Section>
      </div>
    </div>
  );
};
